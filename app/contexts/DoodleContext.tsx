'use client'

import React, { createContext, useContext, useState, useRef, useCallback } from 'react'
import type { DoodleContextType, DrawingState, GenerationState, ModalState, GeminiTextResponse, GeminiImageResponse } from '../types'

const DoodleContext = createContext<DoodleContextType | undefined>(undefined)

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyBkgodDSBSnawhl3qKmU5pacuZeksccraw"

const COLORS = ['#FFFFFF', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#0EA5E9', '#6366F1', '#EC4899', '#8B5CF6', '#000000']

const STYLES = [
  'Classic 2D Cartoon',
  'Anime Chibi',
  'Pixel Art Sprite',
  'Modern 3D Animation Style',
  'Whimsical Storybook Illustration',
  'Cute Mascot',
  'Graffiti Art',
]

export function DoodleProvider({ children }: { children: React.ReactNode }) {
  const [drawingState, setDrawingStateInternal] = useState<DrawingState>({
    isDrawing: false,
    currentColor: '#FFFFFF',
    currentBrushSize: 5,
  })

  const [generationState, setGenerationStateInternal] = useState<GenerationState>({
    isGenerating: false,
    statusMessage: '',
    statusType: 'info',
    generatedImageUrl: null,
  })

  const [modalState, setModalStateInternal] = useState<ModalState>({
    isOpen: false,
    message: '',
  })

  const [selectedStyle, setSelectedStyle] = useState<string>(STYLES[0])
  const [canvasRef, setCanvasRef] = useState<React.RefObject<HTMLCanvasElement> | null>(null)

  const setDrawingState = useCallback((newState: Partial<DrawingState>) => {
    setDrawingStateInternal(prev => ({ ...prev, ...newState }))
  }, [])

  const setGenerationState = useCallback((newState: Partial<GenerationState>) => {
    setGenerationStateInternal(prev => ({ ...prev, ...newState }))
  }, [])

  const setModalState = useCallback((newState: Partial<ModalState>) => {
    setModalStateInternal(prev => ({ ...prev, ...newState }))
  }, [])

  const clearCanvas = useCallback(() => {
    if (!canvasRef?.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#374151' // bg-gray-700
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    setGenerationState({
      generatedImageUrl: null,
      statusMessage: '',
    })
  }, [canvasRef, setGenerationState])

  const fetchWithRetry = async (
    apiUrl: string,
    payload: any,
    maxRetries: number = 5,
    initialDelay: number = 2000
  ): Promise<any> => {
    let attempt = 0
    let currentDelay = initialDelay

    setGenerationState({
      statusMessage: 'Initializing AI process...',
      statusType: 'info',
    })

    while (attempt < maxRetries) {
      attempt++
      if (attempt > 1) {
        setGenerationState({
          statusMessage: `Retrying API call (attempt ${attempt}/${maxRetries}, delay ${currentDelay/1000}s)...`,
          statusType: 'warning',
        })
      }

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error structure" }))
          const errorMessage = errorData.error?.message || response.statusText || `HTTP error ${response.status}`

          if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, currentDelay))
            currentDelay *= 2
            continue
          }
          throw new Error(`API request failed with status: ${response.status}. Message: ${errorMessage}`)
        }

        setGenerationState({
          statusMessage: 'API call successful!',
          statusType: 'success',
        })
        return await response.json()
      } catch (error) {
        console.error(`Fetch attempt ${attempt} failed:`, error)
        if (attempt >= maxRetries) {
          const errorMsg = `Error: API call failed after ${maxRetries} attempts. ${(error as Error).message}`
          setGenerationState({
            statusMessage: errorMsg,
            statusType: 'error',
          })
          setModalState({
            isOpen: true,
            message: `Failed to communicate with AI services after several retries: ${(error as Error).message}. Please try again later.`,
          })
          throw error
        }

        if (!((error as Error).message.includes("429") || (error as Error).message.includes("500"))) {
          const errorMsg = `Error: ${(error as Error).message}`
          setGenerationState({
            statusMessage: errorMsg,
            statusType: 'error',
          })
          setModalState({
            isOpen: true,
            message: `An unexpected error occurred: ${(error as Error).message}.`,
          })
          throw error
        }

        await new Promise(resolve => setTimeout(resolve, currentDelay))
        currentDelay *= 2
      }
    }

    throw new Error(`API request failed after ${maxRetries} attempts.`)
  }

  const generateCharacter = useCallback(async () => {
    if (!canvasRef?.current) return

    setGenerationState({
      isGenerating: true,
      statusMessage: 'Preparing your doodle for AI...',
      statusType: 'info',
    })

    try {
      const canvas = canvasRef.current
      
      // Check if canvas is empty
      const doodleDataUrl = canvas.toDataURL('image/png')
      const base64ImageData = doodleDataUrl.split(',')[1]

      if (!base64ImageData) {
        setModalState({
          isOpen: true,
          message: 'The doodle area is empty. Please draw something first!',
        })
        return
      }

      // Check if canvas is truly empty by comparing with blank canvas
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext('2d')
      if (tempCtx) {
        tempCtx.fillStyle = '#374151' // Match background
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
        
        if (canvas.toDataURL() === tempCanvas.toDataURL()) {
          setModalState({
            isOpen: true,
            message: 'The doodle area is empty. Please draw something first!',
          })
          return
        }
      }

      // Get description from Gemini
      setGenerationState({
        statusMessage: 'AI is analyzing your doodle...',
        statusType: 'info',
      })

      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
      const geminiPayload = {
        contents: [{
          role: "user",
          parts: [
            { 
              text: "Describe this doodle. Focus on the main subject, key shapes, and any distinct features. The description will be used to generate a cartoon character. For example, 'A simple drawing of a round character with spiky hair and big eyes'. Be concise, aim for 1-2 sentences."
            },
            { 
              inlineData: { 
                mimeType: "image/png", 
                data: base64ImageData 
              } 
            }
          ]
        }],
      }

      const geminiResult: GeminiTextResponse = await fetchWithRetry(geminiApiUrl, geminiPayload)
      let doodleDescription = "A doodle of a character" // Fallback

      if (geminiResult.candidates?.[0]?.content?.parts?.[0]?.text) {
        doodleDescription = geminiResult.candidates[0].content.parts[0].text.trim()
      } else {
        console.warn("Could not get a good description from Gemini, using fallback.")
      }

      setGenerationState({
        statusMessage: `Doodle described as: "${doodleDescription.substring(0, 50)}..."`,
        statusType: 'info',
      })

      // Generate image with Gemini Image Generation
      setGenerationState({
        statusMessage: 'AI is rendering your character...',
        statusType: 'info',
      })

      const imagenPrompt = `Generate a single, well-defined ${selectedStyle} style cartoon character. The character is based on this description: "${doodleDescription}". The character should be the main focus, clear, vibrant, and artistically rendered in the chosen style. No text, no multiple characters, just one central character.`

      const imagenApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${API_KEY}`
      const imagenPayload = {
        contents: [{
          role: "user",
          parts: [{ text: imagenPrompt }]
        }],
      }

      const imagenResult: GeminiImageResponse = await fetchWithRetry(imagenApiUrl, imagenPayload)

      if (imagenResult.candidates?.[0]?.content?.parts) {
        for (const part of imagenResult.candidates[0].content.parts) {
          if (part.image) {
            const generatedImageUrl = `data:image/png;base64,${part.image.data.bytesBase64Encoded}`
            setGenerationState({
              generatedImageUrl,
              statusMessage: 'Character generated successfully!',
              statusType: 'success',
            })
            return
          }
        }
      }

      throw new Error("Image generation failed: No image data in response.")

    } catch (error) {
      console.error('Error in generation pipeline:', error)
      setGenerationState({
        statusMessage: `Error: ${(error as Error).message}`,
        statusType: 'error',
      })
      setModalState({
        isOpen: true,
        message: `An error occurred: ${(error as Error).message}`,
      })
    } finally {
      setGenerationState({ isGenerating: false })
    }
  }, [canvasRef, selectedStyle, setGenerationState, setModalState])

  const downloadCharacter = useCallback(() => {
    if (generationState.generatedImageUrl) {
      const link = document.createElement('a')
      link.href = generationState.generatedImageUrl
      link.download = 'my-ai-character.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      setModalState({
        isOpen: true,
        message: 'No character has been generated yet to download.',
      })
    }
  }, [generationState.generatedImageUrl, setModalState])

  const value: DoodleContextType = {
    drawingState,
    setDrawingState,
    generationState,
    setGenerationState,
    modalState,
    setModalState,
    selectedStyle,
    setSelectedStyle,
    canvasRef,
    setCanvasRef,
    clearCanvas,
    generateCharacter,
    downloadCharacter,
  }

  return (
    <DoodleContext.Provider value={value}>
      {children}
    </DoodleContext.Provider>
  )
}

export function useDoodle() {
  const context = useContext(DoodleContext)
  if (context === undefined) {
    throw new Error('useDoodle must be used within a DoodleProvider')
  }
  return context
}

export { COLORS, STYLES } 
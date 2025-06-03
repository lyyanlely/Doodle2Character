import React from 'react'

export interface DrawingState {
  isDrawing: boolean
  currentColor: string
  currentBrushSize: number
}

export interface GenerationState {
  isGenerating: boolean
  statusMessage: string
  statusType: 'info' | 'success' | 'error' | 'warning'
  generatedImageUrl: string | null
}

export interface ModalState {
  isOpen: boolean
  message: string
}

export interface DoodleContextType {
  // Drawing state
  drawingState: DrawingState
  setDrawingState: (state: Partial<DrawingState>) => void
  
  // Generation state
  generationState: GenerationState
  setGenerationState: (state: Partial<GenerationState>) => void
  
  // Modal state
  modalState: ModalState
  setModalState: (state: Partial<ModalState>) => void
  
  // Style selection
  selectedStyle: string
  setSelectedStyle: (style: string) => void
  
  // Canvas reference
  canvasRef: React.RefObject<HTMLCanvasElement> | null
  setCanvasRef: (ref: React.RefObject<HTMLCanvasElement>) => void
  
  // Actions
  clearCanvas: () => void
  generateCharacter: () => Promise<void>
  downloadCharacter: () => void
}

export interface GeminiTextResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

export interface GeminiImageResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        image?: {
          data: {
            bytesBase64Encoded: string
          }
        }
        text?: string
      }>
    }
  }>
} 
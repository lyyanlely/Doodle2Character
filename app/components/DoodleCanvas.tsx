'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { useDoodle } from '../contexts/DoodleContext'

export default function DoodleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { drawingState, setDrawingState, setCanvasRef } = useDoodle()

  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const container = canvas.parentElement
    if (!container) return

    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    
    // For a 4:3 aspect ratio
    let canvasWidth = containerWidth
    let canvasHeight = (containerWidth * 3) / 4

    if (canvasHeight > containerHeight) {
      canvasHeight = containerHeight
      canvasWidth = (containerHeight * 4) / 3
    }
    
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Redraw background
    ctx.fillStyle = '#374151' // bg-gray-700
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Reset drawing properties
    ctx.strokeStyle = drawingState.currentColor
    ctx.lineWidth = drawingState.currentBrushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [drawingState.currentColor, drawingState.currentBrushSize])

  const getMousePos = useCallback((evt: MouseEvent | TouchEvent): { x: number; y: number } => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    
    const rect = canvasRef.current.getBoundingClientRect()
    
    // For touch events, use changedTouches
    if ('changedTouches' in evt && evt.changedTouches && evt.changedTouches.length > 0) {
      return {
        x: evt.changedTouches[0].clientX - rect.left,
        y: evt.changedTouches[0].clientY - rect.top
      }
    }
    
    if ('clientX' in evt) {
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      }
    }
    
    return { x: 0, y: 0 }
  }, [])

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!canvasRef.current) return
    
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    setDrawingState({ isDrawing: true })
    const { x, y } = getMousePos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }, [getMousePos, setDrawingState])

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!drawingState.isDrawing || !canvasRef.current) return
    
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const { x, y } = getMousePos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }, [drawingState.isDrawing, getMousePos])

  const stopDrawing = useCallback(() => {
    if (!canvasRef.current) return
    
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    if (drawingState.isDrawing) {
      ctx.closePath()
      setDrawingState({ isDrawing: false })
    }
  }, [drawingState.isDrawing, setDrawingState])

  useEffect(() => {
    setCanvasRef(canvasRef)
  }, [setCanvasRef])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize canvas
    resizeCanvas()
    
    // Update drawing properties when they change
    ctx.strokeStyle = drawingState.currentColor
    ctx.lineWidth = drawingState.currentBrushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Add event listeners
    const handleMouseDown = (e: MouseEvent) => startDrawing(e)
    const handleMouseMove = (e: MouseEvent) => draw(e)
    const handleMouseUp = () => stopDrawing()
    const handleMouseOut = () => stopDrawing()
    
    const handleTouchStart = (e: TouchEvent) => startDrawing(e)
    const handleTouchMove = (e: TouchEvent) => draw(e)
    const handleTouchEnd = () => stopDrawing()
    const handleTouchCancel = () => stopDrawing()

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseout', handleMouseOut)
    
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)
    canvas.addEventListener('touchcancel', handleTouchCancel)

    // Add resize listener
    window.addEventListener('resize', resizeCanvas)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseout', handleMouseOut)
      
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('touchcancel', handleTouchCancel)

      window.removeEventListener('resize', resizeCanvas)
    }
  }, [drawingState.currentColor, drawingState.currentBrushSize, resizeCanvas, startDrawing, draw, stopDrawing])

  return (
    <div className="canvas-container bg-gray-700 rounded-lg shadow-md aspect-[4/3] relative">
      <canvas 
        ref={canvasRef}
        id="doodle-canvas"
        className="w-full h-full"
      />
    </div>
  )
} 
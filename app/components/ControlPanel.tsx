'use client'

import React from 'react'
import { useDoodle } from '../contexts/DoodleContext'
import { COLORS, STYLES } from '../contexts/DoodleContext'

export default function ControlPanel() {
  const {
    drawingState,
    setDrawingState,
    selectedStyle,
    setSelectedStyle,
    generationState,
    clearCanvas,
    generateCharacter,
    downloadCharacter
  } = useDoodle()

  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value)
    setDrawingState({ currentBrushSize: newSize })
  }

  const handleColorChange = (color: string) => {
    setDrawingState({ currentColor: color })
  }

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStyle(e.target.value)
  }

  return (
    <section className="md:col-span-1 space-y-6 bg-gray-900 p-4 rounded-lg">
      {/* Color Palette */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Brush Color:
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <div
              key={color}
              className={`color-swatch ${
                drawingState.currentColor === color ? 'active' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      </div>

      {/* Style Selector */}
      <div>
        <label htmlFor="style-selector" className="block text-sm font-medium text-gray-300 mb-1">
          Character Style:
        </label>
        <select
          id="style-selector"
          value={selectedStyle}
          onChange={handleStyleChange}
          className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white"
        >
          {STYLES.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      {/* Brush Size */}
      <div>
        <label htmlFor="brush-size" className="block text-sm font-medium text-gray-300 mb-1">
          Brush Size:
        </label>
        <input
          type="range"
          id="brush-size"
          min="1"
          max="50"
          value={drawingState.currentBrushSize}
          onChange={handleBrushSizeChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <span className="text-xs text-gray-400">
          {drawingState.currentBrushSize}px
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={generateCharacter}
          disabled={generationState.isGenerating}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generationState.isGenerating ? '⏳ Generating...' : '✨ Generate Character'}
        </button>
        
        <button
          onClick={clearCanvas}
          className="btn btn-secondary w-full"
        >
          Clear Doodle
        </button>
        
        <button
          onClick={downloadCharacter}
          disabled={!generationState.generatedImageUrl}
          className="btn btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download Character
        </button>
      </div>
    </section>
  )
} 
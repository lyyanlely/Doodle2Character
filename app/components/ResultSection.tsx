'use client'

import React from 'react'
import { useDoodle } from '../contexts/DoodleContext'

export default function ResultSection() {
  const { generationState } = useDoodle()

  const getStatusStyle = () => {
    switch (generationState.statusType) {
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-400'
      default:
        return 'text-yellow-400'
    }
  }

  return (
    <>
      {/* Status Container */}
      <div className="h-10">
        {generationState.statusMessage && (
          <div className={`text-center text-sm p-2 rounded-md bg-gray-700 ${getStatusStyle()}`}>
            {generationState.statusMessage}
          </div>
        )}
      </div>

      {/* Result Section */}
      <div className="bg-gray-700 p-4 rounded-lg shadow-md min-h-[200px] flex justify-center items-center">
        {generationState.generatedImageUrl ? (
          <img
            src={generationState.generatedImageUrl}
            alt="Generated Character"
            className="max-w-full max-h-96 rounded-md"
          />
        ) : (
          <p className="text-gray-500">
            Your generated character will appear here.
          </p>
        )}
      </div>
    </>
  )
} 
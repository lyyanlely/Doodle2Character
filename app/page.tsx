'use client'

import React from 'react'
import DoodleCanvas from './components/DoodleCanvas'
import ControlPanel from './components/ControlPanel'
import ResultSection from './components/ResultSection'
import CustomModal from './components/CustomModal'
import { DoodleProvider } from './contexts/DoodleContext'

export default function Home() {
  return (
    <DoodleProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-2xl space-y-6">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-indigo-400">Doodle to Character AI</h1>
            <p className="text-gray-400">Draw something, pick a style, and let AI bring it to life!</p>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ControlPanel />
            <div className="md:col-span-2 space-y-6">
              <DoodleCanvas />
              <ResultSection />
            </div>
          </main>
        </div>
        <CustomModal />
      </div>
    </DoodleProvider>
  )
} 
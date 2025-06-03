'use client'

import React from 'react'
import { useDoodle } from '../contexts/DoodleContext'

export default function CustomModal() {
  const { modalState, setModalState } = useDoodle()

  const closeModal = () => {
    setModalState({ isOpen: false, message: '' })
  }

  if (!modalState.isOpen) {
    return null
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{modalState.message}</p>
        <button
          onClick={closeModal}
          className="btn btn-primary modal-close-btn mt-4"
        >
          OK
        </button>
      </div>
    </div>
  )
} 
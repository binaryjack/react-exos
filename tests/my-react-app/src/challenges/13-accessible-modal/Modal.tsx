import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Implement the Modal component using createPortal.
 * 2. Implement focus trapping (user can't tab out).
 * 3. Close on Escape key and backdrop click.
 */

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="modal-content" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
};

export default function AccessibleModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>A11y Modal</h1>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test Modal">
        <p>Try to tab out of this modal or press ESC to close.</p>
        <input placeholder="Focusable input 1" />
        <input placeholder="Focusable input 2" />
      </Modal>
    </div>
  );
}

// Challenge: Accessible Modal
//
// Build a fully accessible modal dialog component.
//
// REQUIREMENTS:
// - role="dialog", aria-modal="true", aria-labelledby pointing to the modal title
// - Focus moves INTO the modal when it opens (first focusable element)
// - Focus is TRAPPED inside (Tab / Shift+Tab cycles within modal only)
// - Pressing Escape closes the modal
// - When modal closes, focus returns to the element that opened it
// - Backdrop click closes the modal (but clicking inside the modal doesn't)
//
// TASKS:
// TODO 1: Add role="dialog", aria-modal, aria-labelledby to the modal container
// TODO 2: useRef for modal container AND for the trigger button
// TODO 3: useEffect — on open, move focus to first focusable element inside modal
// TODO 4: useEffect — on open, trap Tab/Shift+Tab inside modal
// TODO 5: useEffect — listen for Escape key to close modal
// TODO 6: useEffect — on close, return focus to trigger button
// TODO 7: Stop propagation on modal inner click to prevent backdrop close

import { useCallback, useEffect, useRef, useState } from 'react';

// Utility: get all focusable elements within a container
const FOCUSABLE_SELECTORS =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
}

// --- Modal component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement | null>;
}

function Modal({ isOpen, onClose, title, children, triggerRef }: ModalProps) {
  // TODO 2: Create a ref for the modal container
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = 'modal-title';

  // TODO 3: Focus first focusable element when modal opens

  // TODO 4: Focus trap (Tab / Shift+Tab)

  // TODO 5: Escape key closes modal

  // TODO 6: Restore focus to trigger on close

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      {/* Modal box */}
      <div
        ref={modalRef}
        // TODO 1: Add role, aria-modal, aria-labelledby
        onClick={(e) => e.stopPropagation()} // TODO 7: stop backdrop close
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '360px',
          maxWidth: '90vw',
          boxShadow: '0 4px 32px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 id={titleId} style={{ margin: 0 }}>{title}</h2>
          <button onClick={onClose} aria-label="Close dialog">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// --- Demo page ---
export default function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '32px' }}>
      <h1>Modal Accessibility Demo</h1>
      <p>Test with keyboard only — no mouse allowed!</p>

      <button ref={triggerRef} onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        triggerRef={triggerRef}
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsOpen(false); }}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="modal-name">Name</label>
            <br />
            <input id="modal-name" type="text" defaultValue="Alice" style={{ marginTop: '4px' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="modal-email">Email</label>
            <br />
            <input id="modal-email" type="email" defaultValue="alice@example.com" style={{ marginTop: '4px' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      <p style={{ marginTop: '32px', color: '#555' }}>
        Checklist:
        <br />☐ Tab moves focus within modal only
        <br />☐ Shift+Tab also stays inside modal
        <br />☐ Escape closes modal and returns focus to "Open Modal" button
        <br />☐ Clicking backdrop closes modal
        <br />☐ Screen reader announces "Edit Profile dialog" on open
      </p>
    </div>
  );
}

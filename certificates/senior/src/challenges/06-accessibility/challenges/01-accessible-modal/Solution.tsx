// Solution: Accessible Modal
//
// Key points:
// - All 4 useEffects are independent — each handles one a11y concern
// - getFocusable() queries the modal for all keyboard-reachable elements
// - Roving focus trap: wrap around at boundaries (Tab on last → go to first)
// - Escape: only call onClose (not e.preventDefault) — don't block browser behavior
// - Focus return: triggerRef.current?.focus() in a cleanup or isOpen=false effect
// - aria-modal="true" tells screen readers to ignore content outside the dialog
// - e.stopPropagation() on the modal box prevents backdrop click from firing

import { useEffect, useRef, useState } from 'react';

const FOCUSABLE_SELECTORS =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement | null>;
}

function Modal({ isOpen, onClose, title, children, triggerRef }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = 'modal-title';

  // TODO 3: Focus first focusable element on open
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusable = getFocusable(modalRef.current);
    focusable[0]?.focus();
  }, [isOpen]);

  // TODO 4: Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusable = getFocusable(modalRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // TODO 5: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // TODO 6: Restore focus to trigger when modal closes
  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
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

export default function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '32px' }}>
      <h1>Modal Accessibility Demo</h1>
      <p>Test with keyboard only — Tab, Shift+Tab, Enter, Escape.</p>

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
        <br />✓ Tab moves focus within modal only
        <br />✓ Shift+Tab also stays inside modal
        <br />✓ Escape closes modal and returns focus to "Open Modal" button
        <br />✓ Clicking backdrop closes modal
        <br />✓ Screen reader announces "Edit Profile dialog"
      </p>
    </div>
  );
}

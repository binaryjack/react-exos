import React, { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { toastStore, Toast } from './toastStore';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Use useSyncExternalStore to subscribe to toastStore in the ToastContainer.
 * 2. Implement the ToastContainer to render toasts using createPortal.
 * 3. Style the toasts so they appear in the top-right corner.
 * 4. Add a "Trigger Toast" component with buttons to test the system.
 */

const ToastItem = ({ toast }: { toast: Toast }) => {
  const styles: Record<string, React.CSSProperties> = {
    success: { backgroundColor: '#4caf50', color: 'white' },
    error: { backgroundColor: '#f44336', color: 'white' },
    info: { backgroundColor: '#2196f3', color: 'white' },
  };

  return (
    <div style={{
      padding: '12px 20px',
      marginBottom: '10px',
      borderRadius: '4px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      ...styles[toast.type]
    }}>
      {toast.message}
    </div>
  );
};

export const ToastContainer = () => {
  // TODO: Use useSyncExternalStore to get current toasts
  const toasts: Toast[] = []; // Replace with hook call

  // TODO: Use createPortal to render in a dedicated container
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default function ToastDemo() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Global Toast System</h1>
      <p>Click the buttons below to trigger notifications.</p>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => toastStore.addToast('Action successful!', 'success')}>
          Show Success
        </button>
        <button onClick={() => toastStore.addToast('An error occurred.', 'error')}>
          Show Error
        </button>
        <button onClick={() => toastStore.addToast('Here is some info.', 'info')}>
          Show Info
        </button>
      </div>

      {/* Render the container here (it will portal out) */}
      <ToastContainer />
    </div>
  );
}

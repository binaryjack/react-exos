export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// TODO: Implement the external store logic
// Hint: You need a way to subscribe to changes and get the current snapshot
// The store should have methods like addToast(message, type) and removeToast(id)

let toasts: Toast[] = [];
let listeners: Array<() => void> = [];

export const toastStore = {
  addToast(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substr(2, 9);
    toasts = [...toasts, { id, message, type }];
    this.emitChange();

    // Auto-remove after 3 seconds
    setTimeout(() => this.removeToast(id), 3000);
  },

  removeToast(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    this.emitChange();
  },

  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  getSnapshot() {
    return toasts;
  },

  emitChange() {
    for (let listener of listeners) {
      listener();
    }
  },
};

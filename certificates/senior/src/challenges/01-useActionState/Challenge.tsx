/**
 * CHALLENGE 01 — useActionState: Async Form Submission
 *
 * Build a "Create Post" form using useActionState that:
 * 1. Has title (required) and body (required, min 10 chars) fields
 * 2. Validates the data — returns validation errors as state (not thrown)
 * 3. On success: calls a simulated API and shows success message
 * 4. Shows isPending state (disabled button + loading text)
 * 5. The form resets after successful submission
 *
 * API simulation:
 *   createPost(data) — resolves after 1 second, rejects 30% of the time
 *
 * Key concepts tested:
 * - useActionState signature: action receives (prevState, ...args)
 * - Returning expected errors as state vs throwing unexpected errors
 * - isPending for loading UI
 * - Form reset (use key to remount or clear state)
 */

import { useActionState } from 'react';

interface Post {
  title: string;
  body: string;
}

interface FormState {
  status: 'idle' | 'success' | 'error';
  errors: { title?: string; body?: string };
  message: string;
}

// Simulated API
async function createPost(data: Post): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (Math.random() < 0.3) throw new Error('Server error: please try again');
}

// TODO 1: Implement the action function
// Signature: async (prevState: FormState, formData: FormData) => FormState
// - Validate title and body from formData
// - Return error state if invalid (don't throw)
// - Call createPost — if it throws, return an error state for unexpected errors
// - Return success state on success
async function submitPostAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // TODO
  return prevState;
}

const INITIAL_STATE: FormState = {
  status: 'idle',
  errors: {},
  message: '',
};

export default function CreatePostForm() {
  // TODO 2: Use useActionState with submitPostAction and INITIAL_STATE
  // const [state, formAction, isPending] = useActionState(...)

  // TODO 3: Show success message when state.status === 'success'
  // TODO 4: Use state.errors to show field-level errors
  // TODO 5: Show state.message for unexpected server errors

  return (
    <div>
      <h2>Create Post</h2>
      {/* TODO: show success/error message */}
      <form /* TODO: action={formAction} */>
        <div>
          <label htmlFor="title">Title *</label>
          <input id="title" name="title" type="text" disabled={/* TODO: isPending */ false} />
          {/* TODO: show state.errors.title */}
        </div>

        <div>
          <label htmlFor="body">Body *</label>
          <textarea
            id="body"
            name="body"
            rows={4}
            disabled={/* TODO: isPending */ false}
          />
          {/* TODO: show state.errors.body */}
        </div>

        <button type="submit" disabled={/* TODO: isPending */ false}>
          {/* TODO: change text based on isPending */}
          Create Post
        </button>
      </form>
    </div>
  );
}

/**
 * SOLUTION 01 — useActionState: Async Form Submission
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

async function createPost(data: Post): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (Math.random() < 0.3) throw new Error('Server error: please try again');
}

async function submitPostAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = (formData.get('title') as string | null)?.trim() ?? '';
  const body = (formData.get('body') as string | null)?.trim() ?? '';

  // Validate — return errors as state (expected errors)
  const errors: { title?: string; body?: string } = {};
  if (!title) errors.title = 'Title is required';
  if (body.length < 10) errors.body = 'Body must be at least 10 characters';

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, message: '' };
  }

  // Call API — handle unexpected errors by returning state (not throwing)
  try {
    await createPost({ title, body });
    return { status: 'success', errors: {}, message: `Post "${title}" created!` };
  } catch (err) {
    // Unexpected server error — return as state so UI can show it
    return {
      status: 'error',
      errors: {},
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

const INITIAL_STATE: FormState = {
  status: 'idle',
  errors: {},
  message: '',
};

export default function CreatePostForm() {
  const [state, formAction, isPending] = useActionState(
    submitPostAction,
    INITIAL_STATE
  );

  return (
    <div>
      <h2>Create Post</h2>

      {state.status === 'success' && (
        <p style={{ color: 'green' }}>{state.message}</p>
      )}
      {state.status === 'error' && state.message && (
        <p style={{ color: 'red' }}>{state.message}</p>
      )}

      <form action={formAction}>
        <div>
          <label htmlFor="title">Title *</label>
          <input id="title" name="title" type="text" disabled={isPending} />
          {state.errors.title && (
            <small style={{ color: 'red' }}>{state.errors.title}</small>
          )}
        </div>

        <div>
          <label htmlFor="body">Body *</label>
          <textarea id="body" name="body" rows={4} disabled={isPending} />
          {state.errors.body && (
            <small style={{ color: 'red' }}>{state.errors.body}</small>
          )}
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

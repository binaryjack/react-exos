import React, { useState, useOptimistic, useTransition } from 'react';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Implement useOptimistic to manage the comments list.
 * 2. Use useTransition to wrap the async comment submission.
 * 3. Update the UI instantly while waiting for the mock API.
 * 4. Add a "status" to comments to show if they are pending.
 */

interface Comment {
  id: number;
  text: string;
  sending?: boolean;
}

// Mock API
async function addCommentApi(text: string): Promise<Comment> {
  await new Promise(res => setTimeout(res, 2000));
  // Randomly fail 20% of the time
  if (Math.random() < 0.2) throw new Error("Server failed");
  return { id: Date.now(), text };
}

export default function CommentsList() {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, text: "First comment!" }
  ]);
  const [isPending, startTransition] = useTransition();

  // TODO: Implement useOptimistic
  // const [optimisticComments, addOptimisticComment] = useOptimistic(...)

  const handleAddComment = async (formData: FormData) => {
    const text = formData.get('comment') as string;
    if (!text) return;

    // TODO: Wrap in startTransition and use addOptimisticComment
    try {
      const newComment = await addCommentApi(text);
      setComments(prev => [...prev, newComment]);
    } catch (e) {
      alert("Failed to add comment");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h1>Optimistic Comments</h1>
      
      <div style={{ marginBottom: '20px' }}>
        {/* TODO: Map over optimisticComments instead */}
        {comments.map(c => (
          <div key={c.id} style={{ padding: '10px', borderBottom: '1px solid #eee', opacity: c.sending ? 0.5 : 1 }}>
            {c.text} {c.sending && <small>(Sending...)</small>}
          </div>
        ))}
      </div>

      <form action={handleAddComment}>
        <input name="comment" placeholder="Add a comment..." style={{ width: '70%' }} />
        <button type="submit" disabled={isPending}>
          Post
        </button>
      </form>
    </div>
  );
}

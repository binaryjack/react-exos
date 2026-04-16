/**
 * CHALLENGE 02 — useOptimistic: Like Button with Rollback
 *
 * Build a post list where each post has a Like button:
 * 1. Clicking Like updates the count IMMEDIATELY (optimistic)
 * 2. An API call runs in the background (1 second delay)
 * 3. If the API fails (30% chance), the count ROLLS BACK automatically
 * 4. Show a "saving..." indicator while the action is pending
 * 5. The like state should toggle (like/unlike)
 *
 * Key concepts tested:
 * - useOptimistic with a reducer function
 * - startTransition wrapping (required for useOptimistic)
 * - Automatic rollback on failure
 * - The difference between optimistic state and real state
 */

import { useOptimistic, useState, useTransition } from 'react';

interface Post {
  id: number;
  title: string;
  likes: number;
  liked: boolean;
}

const INITIAL_POSTS: Post[] = [
  { id: 1, title: 'React 19 is Amazing', likes: 42, liked: false },
  { id: 2, title: 'Understanding useOptimistic', likes: 17, liked: false },
  { id: 3, title: 'Server Components Deep Dive', likes: 93, liked: true },
];

// Simulated API
async function toggleLikeApi(postId: number, liked: boolean): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (Math.random() < 0.3) throw new Error('Network error');
}

// TODO 1: Implement PostList component
// - Use useState for the real `posts` state
// - Use useOptimistic to manage the displayed (possibly optimistic) state
//   The reducer should toggle the liked status and adjust likes count
// - The "like" action should:
//   a. Start a transition
//   b. Apply optimistic update immediately
//   c. Call toggleLikeApi
//   d. On success: update real posts state (setRealPosts)
//   e. On failure: do nothing — useOptimistic reverts automatically

export default function PostList() {
  // TODO: implement
  return (
    <ul>
      {INITIAL_POSTS.map(post => (
        <li key={post.id}>
          {post.title} — {post.likes} likes
          <button>♥ Like</button>
        </li>
      ))}
    </ul>
  );
}

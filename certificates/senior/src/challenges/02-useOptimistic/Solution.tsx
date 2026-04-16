/**
 * SOLUTION 02 — useOptimistic: Like Button with Rollback
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

async function toggleLikeApi(postId: number, liked: boolean): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (Math.random() < 0.3) throw new Error('Network error');
}

export default function PostList() {
  // Real state — reflects what the server confirmed
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isPending, startTransition] = useTransition();

  // Optimistic state — shown immediately; reverts to `posts` if transition fails
  const [optimisticPosts, setOptimisticPost] = useOptimistic(
    posts,
    // Reducer: given current state + the toggled post id, return updated list
    (currentPosts, toggledId: number) =>
      currentPosts.map(post =>
        post.id === toggledId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
  );

  function handleToggleLike(postId: number, currentLiked: boolean) {
    startTransition(async () => {
      // Apply optimistic update immediately
      setOptimisticPost(postId);

      try {
        await toggleLikeApi(postId, !currentLiked);
        // On success: update real state to match the optimistic change
        setPosts(prev =>
          prev.map(post =>
            post.id === postId
              ? {
                  ...post,
                  liked: !post.liked,
                  likes: post.liked ? post.likes - 1 : post.likes + 1,
                }
              : post
          )
        );
      } catch {
        // On failure: DO NOTHING — useOptimistic automatically reverts
        // `optimisticPosts` settles back to `posts` when transition ends
        console.error('Like failed — reverting');
      }
    });
  }

  return (
    <ul>
      {optimisticPosts.map(post => (
        <li key={post.id} style={{ marginBottom: 12 }}>
          <strong>{post.title}</strong>
          <span style={{ marginLeft: 12 }}>
            {post.liked ? '❤️' : '🤍'} {post.likes}
          </span>
          <button
            onClick={() => handleToggleLike(post.id, post.liked)}
            disabled={isPending}
            style={{ marginLeft: 8 }}
          >
            {post.liked ? 'Unlike' : 'Like'}
          </button>
          {isPending && <small style={{ marginLeft: 8, color: 'gray' }}>saving...</small>}
        </li>
      ))}
    </ul>
  );
}

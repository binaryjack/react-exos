/// EXO 2
import { useCallback, useEffect, useState } from 'react';

interface IPost {
  id: number;
  title: string;
}

export function PostsList() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadingStatus = isLoading ? 'Loading...' : '';

  const fetchPost = useCallback(async (signal: AbortSignal) => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          signal: signal,
        }
      );
      if (!response.ok) {
        setError('unable to fetch posts');
        return;
      }

      const data = await response.json();
      setPosts(data);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        console.log('ABORT ERROR, this is normal ! ');
        return;
      }
      setError(`Network call error ${e} `);
      return;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    console.log('fetching');
    const controller = new AbortController();
    const { signal } = controller;
    fetchPost(signal);
    return () => {
      controller.abort();
    };
  }, [fetchPost]);

  return (
    <div>
      <div>{loadingStatus}</div>
      <div>{error}</div>
      <div>
        {posts.map((post: IPost) => {
          return <div key={post.id}>{post.title}</div>;
        })}
      </div>
    </div>
  );
}

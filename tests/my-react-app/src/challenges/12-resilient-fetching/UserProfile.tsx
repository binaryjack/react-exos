// Mock API
const fetchUserProfile = (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 'error') reject(new Error('User not found'));
      else resolve({ id, name: `User ${id}`, bio: 'React 19 Enthusiast' });
    }, 2000);
  });
};

function ProfileCard({ userId }: { userId: string }) {
  // TODO: Use the 'use' hook to resolve the promise
  // const user = use(fetchUserProfile(userId));

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>{/* user.name */}</h2>
      <p>{/* user.bio */}</p>
    </div>
  );
}

export default function ResilientApp() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Resilient Fetching</h1>
      {/* TODO: Wrap in ErrorBoundary and Suspense */}
      <ProfileCard userId="123" />
    </div>
  );
}

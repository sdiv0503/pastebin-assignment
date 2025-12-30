'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState<string>('');
  const [maxViews, setMaxViews] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Prepare the payload
      const payload: any = { content };
      
      // Only add constraints if the user typed them
      if (ttl) payload.ttl_seconds = parseInt(ttl);
      if (maxViews) payload.max_views = parseInt(maxViews);

      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
      // Clear form on success
      setContent('');
      setTtl('');
      setMaxViews('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Pastebin Lite</h1>
        <p className="text-center text-gray-500 mb-8">Share text securely with limits.</p>

        {/* Success Message */}
        {result && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium mb-2">Paste created successfully!</p>
            <div className="flex items-center gap-2">
              <input 
                readOnly 
                value={result.url} 
                className="flex-1 p-2 bg-white border rounded text-sm text-gray-600"
              />
              <button
                onClick={() => navigator.clipboard.writeText(result.url)}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
              >
                Copy
              </button>
            </div>
            <a href={result.url} target="_blank" className="block mt-2 text-sm text-green-700 underline">
              Visit Paste &rarr;
            </a>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Content Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Paste your text here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* TTL Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires In (Seconds)
              </label>
              <input
                type="number"
                min="1"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Optional"
              />
            </div>

            {/* Max Views Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Views
              </label>
              <input
                type="number"
                min="1"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Optional"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Paste'}
          </button>
        </form>
      </div>
    </div>
  );
}
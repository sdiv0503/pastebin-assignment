'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState<string>('');
  const [maxViews, setMaxViews] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const payload: any = { content };
      if (ttl) payload.ttl_seconds = parseInt(ttl);
      if (maxViews) payload.max_views = parseInt(maxViews);

      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setResult(data);
      setContent('');
      setTtl('');
      setMaxViews('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-100 to-transparent pointer-events-none" />

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 z-10 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pastebin Lite</h1>
          <p className="text-gray-500 mt-2">Share code and text securely with ephemeral links.</p>
        </div>

        <div className="p-8">
          {/* Success Card */}
          {result && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 animate-fade-in-down">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3 w-full">
                  <h3 className="text-sm font-medium text-green-800">Paste Created!</h3>
                  <div className="mt-4 flex items-center gap-2">
                    <input 
                      readOnly 
                      value={result.url} 
                      className="flex-1 block w-full rounded-md border-green-200 bg-white p-2.5 text-sm text-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <a 
                      href={result.url}
                      target="_blank"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
                    >
                      Open ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 font-mono text-sm p-4 bg-gray-50/50"
                placeholder="Paste your code or text here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expires In (Seconds)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={ttl}
                    onChange={(e) => setTtl(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
                    placeholder="e.g. 60"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Leave empty for no time limit</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max View Count
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
                    placeholder="e.g. 5"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Leave empty for unlimited views</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Create Secure Paste'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <p className="mt-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Pastebin Lite. Simple. Fast. Secure.
      </p>
    </main>
  );
}
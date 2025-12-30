import { getPaste } from '@/lib/paste-service';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Create New Paste
          </a>
          <span className="text-sm text-gray-400 font-mono">ID: {id}</span>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Metadata Banner */}
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Created: <span className="font-medium text-gray-900">{new Date(paste.created_at).toLocaleString()}</span></span>
            </div>

            <div className="flex gap-2">
              {paste.expires_at && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                  <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Expires: {new Date(paste.expires_at).toLocaleString()}
                </span>
              )}
              {paste.max_views !== null && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                  (paste.remaining_views || 0) <= 1 
                    ? 'bg-amber-50 text-amber-700 border-amber-100' 
                    : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {paste.remaining_views} view(s) left
                </span>
              )}
            </div>
          </div>

          {/* Code Editor View */}
          <div className="relative group">
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Note: This is a client-side interaction in a server component. 
                  For a true copy button here, we'd need a small client component wrapper.
                  For now, we keep it simple. */}
            </div>
            
            <div className="bg-[#1e1e1e] p-6 overflow-x-auto min-h-[300px]">
              <pre className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                {paste.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer Warning */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            This content is hosted securely. It will disappear automatically when limits are reached.
          </p>
        </div>
      </div>
    </div>
  );
}
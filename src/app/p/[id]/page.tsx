import { getPaste } from '@/lib/paste-service';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;
  const paste = await getPaste(id);

  // If the paste is null (expired, views exceeded, or missing), show 404
  if (!paste) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-8 shadow rounded-lg">
        
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Paste: {id}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Created: {new Date(paste.created_at).toLocaleString()}
          </p>
          
          {/* Metadata Badges */}
          <div className="flex gap-2 mt-2">
            {paste.expires_at && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Expires: {new Date(paste.expires_at).toLocaleString()}
              </span>
            )}
            {paste.max_views !== null && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Views Left: {paste.remaining_views}
              </span>
            )}
          </div>
        </div>

        {/* Content - Rendered safely as pre-formatted text */}
        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
          <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap break-words">
            {paste.content}
          </pre>
        </div>

        {/* Footer Action */}
        <div className="mt-6">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            &larr; Create another paste
          </a>
        </div>
      </div>
    </div>
  );
}
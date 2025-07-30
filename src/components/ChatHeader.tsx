import { MessageCircle } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-lg">
          <MessageCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Makers Tech Assistant</h1>
          <p className="text-blue-100 text-sm">How can I help you today?</p>
        </div>
      </div>
    </div>
  );
}
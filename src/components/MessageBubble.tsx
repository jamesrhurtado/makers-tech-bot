import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
        isUser 
          ? "bg-blue-600 text-white rounded-br-md" 
          : "bg-gray-100 text-gray-900 rounded-bl-md"
      )}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={cn(
          "text-xs mt-1 opacity-70",
          isUser ? "text-blue-100" : "text-gray-500"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}
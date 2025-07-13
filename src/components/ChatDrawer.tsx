import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: "message" | "system";
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "system",
    senderName: "System",
    content: "Sarah Johnson joined the meeting",
    timestamp: new Date(Date.now() - 300000),
    type: "system"
  },
  {
    id: "2",
    senderId: "2",
    senderName: "Sarah Johnson",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "Hey everyone! Great to see you all today 👋",
    timestamp: new Date(Date.now() - 240000),
    type: "message"
  },
  {
    id: "3",
    senderId: "system",
    senderName: "System",
    content: "Mike Chen joined the meeting",
    timestamp: new Date(Date.now() - 180000),
    type: "system"
  },
  {
    id: "4",
    senderId: "3",
    senderName: "Mike Chen",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    content: "Sorry I'm a bit late! Can someone catch me up on what we've covered so far?",
    timestamp: new Date(Date.now() - 120000),
    type: "message"
  },
  {
    id: "5",
    senderId: "4",
    senderName: "Emily Davis",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    content: "No worries Mike! We just started with introductions",
    timestamp: new Date(Date.now() - 60000),
    type: "message"
  }
];

const ChatDrawer = ({ isOpen, onClose }: ChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUserId = "1";
  const currentUserName = localStorage.getItem("userName") || "You";

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "message"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn(
      "h-full bg-chat-bg border-l border-border shadow-xl flex flex-col",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-background flex-shrink-0">
        <h3 className="font-semibold text-foreground">Meeting Chat</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 h-[calc(100vh-120px)]">
        <div className="p-4 space-y-4">
          {messages.map((message) => {
            if (message.type === "system") {
              return (
                <div key={message.id} className="text-center">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {message.content}
                  </span>
                </div>
              );
            }

            const isOwnMessage = message.senderId === currentUserId;

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  isOwnMessage && "flex-row-reverse"
                )}
              >
                {!isOwnMessage && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(message.senderName)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={cn(
                  "flex-1 space-y-1",
                  isOwnMessage && "text-right"
                )}>
                  <div className="flex items-center gap-2">
                    {!isOwnMessage && (
                      <span className="text-xs font-medium text-foreground">
                        {message.senderName}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <div className={cn(
                    "inline-block max-w-[85%] p-3 rounded-lg text-sm",
                    isOwnMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}>
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            size="sm"
            disabled={!newMessage.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;
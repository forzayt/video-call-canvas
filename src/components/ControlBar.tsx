import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  MessageSquare, 
  Phone,
  Settings,
  Users,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlBarProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  onMuteToggle: () => void;
  onVideoToggle: () => void;
  onScreenShare: () => void;
  onChatToggle: () => void;
  onLeaveMeeting: () => void;
}

const ControlBar = ({
  isMuted,
  isVideoOn,
  isScreenSharing,
  isChatOpen,
  onMuteToggle,
  onVideoToggle,
  onScreenShare,
  onChatToggle,
  onLeaveMeeting,
}: ControlBarProps) => {
  return (
    <div className="bg-control-bar border-t border-white/10 p-4">
      <div className="flex items-center justify-center gap-4">
        {/* Microphone Toggle */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onMuteToggle}
          className={cn(
            "w-12 h-12 rounded-full transition-all duration-200",
            isMuted 
              ? "bg-destructive hover:bg-destructive/80 text-white" 
              : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          )}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        {/* Video Toggle */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onVideoToggle}
          className={cn(
            "w-12 h-12 rounded-full transition-all duration-200",
            !isVideoOn 
              ? "bg-destructive hover:bg-destructive/80 text-white" 
              : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          )}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>

        {/* Screen Share Toggle */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onScreenShare}
          className={cn(
            "w-12 h-12 rounded-full transition-all duration-200",
            isScreenSharing 
              ? "bg-success hover:bg-success/80 text-white" 
              : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          )}
        >
          {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
        </Button>

        {/* Chat Toggle */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onChatToggle}
          className={cn(
            "w-12 h-12 rounded-full transition-all duration-200 relative",
            isChatOpen 
              ? "bg-primary hover:bg-primary/80 text-white" 
              : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          )}
        >
          <MessageSquare className="h-5 w-5" />
          {/* New message indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full border-2 border-control-bar" />
        </Button>

        {/* Participants */}
        <Button
          variant="secondary"
          size="lg"
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-200"
        >
          <Users className="h-5 w-5" />
        </Button>

        {/* Settings */}
        <Button
          variant="secondary"
          size="lg"
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* More Options */}
        <Button
          variant="secondary"
          size="lg"
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-200"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>

        {/* Leave Meeting */}
        <Button
          variant="destructive"
          size="lg"
          onClick={onLeaveMeeting}
          className="w-12 h-12 rounded-full bg-destructive hover:bg-destructive/80 text-white ml-4 transition-all duration-200"
        >
          <Phone className="h-5 w-5 rotate-[135deg]" />
        </Button>
      </div>

      {/* Status Text */}
      <div className="flex justify-center mt-3">
        <div className="flex items-center gap-4 text-xs text-white/60">
          {isScreenSharing && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              Screen sharing
            </span>
          )}
          {isMuted && (
            <span className="flex items-center gap-1">
              <MicOff className="h-3 w-3" />
              Muted
            </span>
          )}
          {!isVideoOn && (
            <span className="flex items-center gap-1">
              <VideoOff className="h-3 w-3" />
              Camera off
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Pin,
  PinOff,
  MoreVertical,
  UserMinus,
  Volume2,
  VolumeX
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  avatar: string | null;
}

interface ParticipantTileProps {
  participant: Participant;
  isPinned?: boolean;
  onPin?: () => void;
  className?: string;
}

const ParticipantTile = ({ 
  participant, 
  isPinned = false, 
  onPin,
  className 
}: ParticipantTileProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden shadow-video group",
        "bg-video-tile border border-white/10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video/Avatar Container */}
      <div className="w-full h-full relative bg-gradient-to-br from-video-tile to-video-tile/80">
        {participant.isVideoOn ? (
          /* Simulated video feed with avatar overlay */
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <Avatar className="w-16 h-16 md:w-24 md:h-24">
              <AvatarImage src={participant.avatar || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg md:text-xl font-semibold">
                {getInitials(participant.name)}
              </AvatarFallback>
            </Avatar>
            {/* Video simulation overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          /* Video off - show avatar */
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <Avatar className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3">
                <AvatarImage src={participant.avatar || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg md:text-xl font-semibold">
                  {getInitials(participant.name)}
                </AvatarFallback>
              </Avatar>
              <VideoOff className="w-6 h-6 text-gray-400 mx-auto" />
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        {(isHovered || isPinned) && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onPin && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
                onClick={onPin}
              >
                {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </Button>
            )}
            
            {participant.id !== "1" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem className="text-foreground hover:bg-accent">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Adjust Volume
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-foreground hover:bg-accent">
                    <VolumeX className="h-4 w-4 mr-2" />
                    Mute for You
                  </DropdownMenuItem>
                  {participant.isHost && (
                    <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                      <UserMinus className="h-4 w-4 mr-2" />
                      Remove Participant
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {/* Name and Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm truncate">
                {participant.name}
                {participant.isHost && (
                  <span className="ml-2 text-xs bg-primary px-2 py-0.5 rounded-full">
                    Host
                  </span>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Mic Status */}
              <div className={cn(
                "p-1 rounded-full",
                participant.isMuted 
                  ? "bg-destructive" 
                  : "bg-success"
              )}>
                {participant.isMuted ? (
                  <MicOff className="h-3 w-3 text-white" />
                ) : (
                  <Mic className="h-3 w-3 text-white" />
                )}
              </div>
              
              {/* Video Status */}
              <div className={cn(
                "p-1 rounded-full",
                !participant.isVideoOn 
                  ? "bg-destructive" 
                  : "bg-success"
              )}>
                {participant.isVideoOn ? (
                  <VideoIcon className="h-3 w-3 text-white" />
                ) : (
                  <VideoOff className="h-3 w-3 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pinned indicator */}
        {isPinned && (
          <div className="absolute top-3 left-3 bg-primary px-2 py-1 rounded-full">
            <Pin className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantTile;
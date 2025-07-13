import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Crown,
  MoreVertical,
  UserMinus,
  Volume2,
  VolumeX,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  avatar: string | null;
}

interface ParticipantsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  currentUserId: string;
  onMuteParticipant?: (participantId: string) => void;
  onRemoveParticipant?: (participantId: string) => void;
}

const ParticipantsDrawer = ({ 
  isOpen, 
  onClose, 
  participants,
  currentUserId,
  onMuteParticipant,
  onRemoveParticipant
}: ParticipantsDrawerProps) => {
  const { toast } = useToast();
  const currentUser = participants.find(p => p.id === currentUserId);
  const isCurrentUserHost = currentUser?.isHost || false;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMuteParticipant = (participantId: string, participantName: string) => {
    onMuteParticipant?.(participantId);
    toast({
      title: "Participant muted",
      description: `${participantName} has been muted`,
    });
  };

  const handleRemoveParticipant = (participantId: string, participantName: string) => {
    onRemoveParticipant?.(participantId);
    toast({
      title: "Participant removed",
      description: `${participantName} has been removed from the meeting`,
    });
  };

  const sortedParticipants = [...participants].sort((a, b) => {
    // Host first, then alphabetical
    if (a.isHost && !b.isHost) return -1;
    if (!a.isHost && b.isHost) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className={cn(
      "h-full bg-chat-bg border-l border-border shadow-xl flex flex-col",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-background flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Participants</h3>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
            {participants.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Host Controls */}
      {isCurrentUserHost && (
        <div className="border-b border-border p-4 bg-muted/30">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                toast({
                  title: "All participants muted",
                  description: "All participants have been muted",
                });
              }}
            >
              <MicOff className="h-3 w-3 mr-1" />
              Mute All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                toast({
                  title: "Meeting locked",
                  description: "No new participants can join",
                });
              }}
            >
              <Shield className="h-3 w-3 mr-1" />
              Lock Meeting
            </Button>
          </div>
        </div>
      )}

      {/* Participants List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {sortedParticipants.map((participant) => {
            const isCurrentUser = participant.id === currentUserId;
            
            return (
              <div
                key={participant.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                {/* Avatar */}
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={participant.avatar || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(participant.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Name and Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {participant.name}
                      {isCurrentUser && " (You)"}
                    </span>
                    {participant.isHost && (
                      <Crown className="h-3 w-3 text-warning flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    {/* Mic Status */}
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                      participant.isMuted 
                        ? "bg-destructive/20 text-destructive" 
                        : "bg-success/20 text-success"
                    )}>
                      {participant.isMuted ? (
                        <MicOff className="h-3 w-3" />
                      ) : (
                        <Mic className="h-3 w-3" />
                      )}
                      <span>{participant.isMuted ? "Muted" : "Active"}</span>
                    </div>
                    
                    {/* Video Status */}
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                      !participant.isVideoOn 
                        ? "bg-warning/20 text-warning" 
                        : "bg-success/20 text-success"
                    )}>
                      {participant.isVideoOn ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <VideoOff className="h-3 w-3" />
                      )}
                      <span>{participant.isVideoOn ? "Video" : "No Video"}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!isCurrentUser && isCurrentUserHost && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 hover:bg-accent"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem 
                        className="text-foreground hover:bg-accent"
                        onClick={() => handleMuteParticipant(participant.id, participant.name)}
                      >
                        <MicOff className="h-4 w-4 mr-2" />
                        {participant.isMuted ? "Unmute" : "Mute"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-foreground hover:bg-accent">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Adjust Volume
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-foreground hover:bg-accent">
                        <Crown className="h-4 w-4 mr-2" />
                        Make Host
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveParticipant(participant.id, participant.name)}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {!isCurrentUser && !isCurrentUserHost && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 hover:bg-accent"
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4 bg-background">
        <div className="text-xs text-muted-foreground text-center">
          {participants.length} participant{participants.length !== 1 ? 's' : ''} in this meeting
        </div>
      </div>
    </div>
  );
};

export default ParticipantsDrawer;
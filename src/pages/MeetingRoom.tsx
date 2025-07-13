import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MessageSquare, 
  Phone,
  Copy,
  Settings,
  Users,
  Pin,
  MoreVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ParticipantTile from "@/components/ParticipantTile";
import ChatDrawer from "@/components/ChatDrawer";
import ControlBar from "@/components/ControlBar";

// Mock data for participants
const mockParticipants = [
  { id: "1", name: "You", isHost: true, isMuted: false, isVideoOn: true, avatar: null },
  { id: "2", name: "Sarah Johnson", isHost: false, isMuted: false, isVideoOn: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: "3", name: "Mike Chen", isHost: false, isMuted: true, isVideoOn: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
  { id: "4", name: "Emily Davis", isHost: false, isMuted: false, isVideoOn: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" },
];

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  avatar: string | null;
}

const MeetingRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  const [userName] = useState(() => localStorage.getItem("userName") || "You");

  useEffect(() => {
    // Update current user's name
    setParticipants(prev => 
      prev.map(p => p.id === "1" ? { ...p, name: userName } : p)
    );
  }, [userName]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    setParticipants(prev => 
      prev.map(p => p.id === "1" ? { ...p, isMuted: !isMuted } : p)
    );
    toast({
      title: isMuted ? "Microphone unmuted" : "Microphone muted",
    });
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
    setParticipants(prev => 
      prev.map(p => p.id === "1" ? { ...p, isVideoOn: !isVideoOn } : p)
    );
    toast({
      title: isVideoOn ? "Camera turned off" : "Camera turned on",
    });
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
    });
  };

  const handleLeaveMeeting = () => {
    toast({
      title: "Left meeting",
      description: "You have left the meeting room",
    });
    navigate("/");
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/meeting/${roomId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Meeting link copied to clipboard",
    });
  };

  const handlePinParticipant = (participantId: string) => {
    setPinnedParticipant(pinnedParticipant === participantId ? null : participantId);
  };

  const mainParticipants = pinnedParticipant 
    ? participants.filter(p => p.id !== pinnedParticipant)
    : participants;
  
  const pinnedUser = pinnedParticipant 
    ? participants.find(p => p.id === pinnedParticipant)
    : null;

  return (
    <div className="h-screen bg-meeting-bg flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-control-bar border-b border-border/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">Room: {roomId}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyRoomLink}
            className="text-white hover:bg-white/10"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-white/80">
            <Users className="h-4 w-4" />
            <span className="text-sm">{participants.length}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 overflow-hidden">
        {pinnedUser ? (
          /* Layout with pinned participant */
          <div className="h-full flex gap-4">
            {/* Pinned participant - larger */}
            <div className="flex-1">
              <ParticipantTile
                participant={pinnedUser}
                isPinned={true}
                onPin={() => handlePinParticipant(pinnedUser.id)}
                className="h-full"
              />
            </div>
            
            {/* Other participants - sidebar */}
            <div className="w-80 space-y-4 overflow-y-auto">
              {mainParticipants.map((participant) => (
                <ParticipantTile
                  key={participant.id}
                  participant={participant}
                  onPin={() => handlePinParticipant(participant.id)}
                  className="h-48"
                />
              ))}
            </div>
          </div>
        ) : (
          /* Grid layout */
          <div className={`h-full grid gap-4 ${
            participants.length <= 2 
              ? "grid-cols-1 md:grid-cols-2" 
              : participants.length <= 4
              ? "grid-cols-2" 
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}>
            {participants.map((participant) => (
              <ParticipantTile
                key={participant.id}
                participant={participant}
                onPin={() => handlePinParticipant(participant.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <ControlBar
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        isScreenSharing={isScreenSharing}
        onMuteToggle={handleMuteToggle}
        onVideoToggle={handleVideoToggle}
        onScreenShare={handleScreenShare}
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
        onLeaveMeeting={handleLeaveMeeting}
        isChatOpen={isChatOpen}
      />

      {/* Chat Drawer */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default MeetingRoom;

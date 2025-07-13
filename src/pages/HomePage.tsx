import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Users, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroBackground from "@/assets/hero-bg.jpg";

const HomePage = () => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateMeeting = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    if (userName) {
      localStorage.setItem("userName", userName);
    }
    toast({
      title: "Meeting Created",
      description: `Room ID: ${newRoomId}`,
    });
    navigate(`/meeting/${newRoomId}`);
  };

  const handleJoinMeeting = () => {
    if (!roomName.trim()) {
      toast({
        title: "Room name required",
        description: "Please enter a room name to join",
        variant: "destructive",
      });
      return;
    }
    if (userName) {
      localStorage.setItem("userName", userName);
    }
    navigate(`/meeting/${roomName}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/90 dark:bg-background/95" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 shadow-elegant">
            <Video className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Connect
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Anywhere</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional video conferencing made simple. Create or join meetings with crystal-clear quality.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Create Meeting Card */}
          <Card className="shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-success rounded-xl mb-4 mx-auto">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Create Meeting</CardTitle>
              <CardDescription>
                Start an instant meeting and invite others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Name (Optional)
                </label>
                <Input
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border-muted"
                />
              </div>
              <Button 
                onClick={handleCreateMeeting}
                className="w-full bg-gradient-success hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Video className="mr-2 h-5 w-5" />
                Start Meeting
              </Button>
            </CardContent>
          </Card>

          {/* Join Meeting Card */}
          <Card className="shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4 mx-auto">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Join Meeting</CardTitle>
              <CardDescription>
                Enter a room ID to join an existing meeting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Name (Optional)
                </label>
                <Input
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border-muted"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Room ID
                </label>
                <Input
                  placeholder="Enter room ID"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="border-muted"
                  onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
                />
              </div>
              <Button 
                onClick={handleJoinMeeting}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                size="lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Meeting
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">HD Video</h3>
            <p className="text-sm text-muted-foreground">Crystal clear video quality for all participants</p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Team Chat</h3>
            <p className="text-sm text-muted-foreground">Real-time messaging during meetings</p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Instant Start</h3>
            <p className="text-sm text-muted-foreground">No downloads or installations required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
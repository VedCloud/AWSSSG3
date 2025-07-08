
import { useState } from "react";
import { Brain, Send, Lightbulb, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AiCoachProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

interface CoachMessage {
  id: string;
  type: "user" | "coach";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AiCoach({ isOpen, onClose, currentPath }: AiCoachProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: "welcome",
      type: "coach",
      content: currentPath 
        ? `I see you're working on the ${currentPath} path! How can I help you today?`
        : "Hi! I'm your AWS Learning Coach. Ask me anything about your learning journey!",
      timestamp: new Date(),
      suggestions: [
        "What should I learn next?",
        "Explain AWS Lambda",
        "Best practices for security",
        "How to prepare for certification?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const commonResponses: Record<string, string> = {
    "what should i learn next": "Based on your current progress, I recommend focusing on IAM (Identity and Access Management) next. It's fundamental to AWS security and used across all services.",
    "explain aws lambda": "AWS Lambda is a serverless compute service that runs code without managing servers. You pay only for compute time used. Perfect for event-driven applications!",
    "best practices for security": "Key AWS security practices: 1) Use IAM roles instead of access keys, 2) Enable MFA, 3) Follow least privilege principle, 4) Use VPC for network isolation, 5) Enable CloudTrail for auditing.",
    "how to prepare for certification": "For certification prep: 1) Complete hands-on labs, 2) Take practice exams, 3) Review AWS whitepapers, 4) Build real projects, 5) Join study groups or forums.",
    "devops pro": "For DevOps Professional certification, focus on: CodePipeline, CodeBuild, CodeDeploy, CloudFormation, ECS/EKS, monitoring with CloudWatch, and infrastructure as code patterns.",
    "solutions architect": "For Solutions Architect, master: EC2, VPC, RDS, ELB, Auto Scaling, S3, CloudFront, Route 53, and architectural patterns like 3-tier applications and microservices."
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: CoachMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const lowerContent = content.toLowerCase();
      let response = "That's a great question! ";
      
      // Find matching response
      const matchingKey = Object.keys(commonResponses).find(key => 
        lowerContent.includes(key)
      );
      
      if (matchingKey) {
        response = commonResponses[matchingKey];
      } else if (lowerContent.includes("lambda")) {
        response = "AWS Lambda is perfect for serverless applications. Start with simple functions that respond to S3 events or API Gateway requests.";
      } else if (lowerContent.includes("ec2")) {
        response = "EC2 is the foundation of AWS compute. Learn about instance types, security groups, and key pairs first.";
      } else if (lowerContent.includes("s3")) {
        response = "S3 is great for storage. Focus on bucket policies, versioning, and lifecycle management for the certification.";
      } else {
        response += "For detailed guidance on specific topics, I recommend checking the official AWS documentation or completing hands-on labs.";
      }

      const coachMessage: CoachMessage = {
        id: Date.now().toString(),
        type: "coach",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, coachMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            AI Learning Coach
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 dark:bg-gray-800"
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs opacity-75">Try asking:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 bg-white/20 border-white/30 hover:bg-white/30"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about your AWS learning journey..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer" onClick={() => handleSendMessage("What should I learn next?")}>
              <Lightbulb className="w-3 h-3 mr-1" />
              Next Steps
            </Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => handleSendMessage("Best practices for security")}>
              <MessageCircle className="w-3 h-3 mr-1" />
              Security Tips
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

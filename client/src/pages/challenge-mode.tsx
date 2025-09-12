
import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Trophy, 
  Star, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  RotateCcw, 
  Send,
  Target,
  DollarSign,
  Shield,
  Zap,
  Eye,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/components/theme-provider";
import { type AwsService } from "@shared/schema";
import { Link } from "wouter";

interface CanvasService {
  id: string;
  service: AwsService;
  x: number;
  y: number;
}

interface Connection {
  id: string;
  fromServiceId: string;
  toServiceId: string;
}

interface ChallengeScenario {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeLimit: number; // in minutes
  targetServices: string[];
  bonusServices: string[];
}

interface ScoreBreakdown {
  resilience: number;
  costEfficiency: number;
  performance: number;
  security: number;
  total: number;
}

interface ChallengeResult {
  score: ScoreBreakdown;
  feedback: string[];
  badges: string[];
  recommendations: string[];
  modelSolution?: CanvasService[];
}

const CHALLENGE_SCENARIOS: ChallengeScenario[] = [
  {
    id: "global-web-app",
    title: "Global Web Application",
    description: "Design a fault-tolerant web application that serves 100,000 users globally with low latency and minimal downtime. The application should handle traffic spikes and provide consistent performance worldwide.",
    requirements: [
      "Support 100,000+ concurrent users",
      "Global low latency (< 200ms)",
      "99.9% uptime requirement",
      "Handle traffic spikes (10x normal load)",
      "Secure user authentication"
    ],
    difficulty: "Intermediate",
    timeLimit: 15,
    targetServices: ["CloudFront", "S3", "Lambda", "DynamoDB", "Cognito"],
    bonusServices: ["WAF", "Route 53", "API Gateway"]
  },
  {
    id: "data-analytics-pipeline",
    title: "Real-time Data Analytics",
    description: "Build a scalable data pipeline that ingests, processes, and analyzes real-time streaming data from IoT devices. The solution should handle millions of events per hour and provide real-time dashboards.",
    requirements: [
      "Process 1M+ events per hour",
      "Real-time processing (< 1 second latency)",
      "Cost-effective storage for historical data",
      "Interactive dashboards and alerts",
      "Data backup and disaster recovery"
    ],
    difficulty: "Advanced",
    timeLimit: 20,
    targetServices: ["Kinesis", "Lambda", "S3", "Redshift", "QuickSight"],
    bonusServices: ["CloudWatch", "SNS", "Glue", "Athena"]
  },
  {
    id: "serverless-api",
    title: "Serverless API Backend",
    description: "Create a serverless REST API that handles user management, authentication, and data storage. The API should auto-scale and be cost-effective for variable workloads.",
    requirements: [
      "RESTful API endpoints",
      "User authentication and authorization",
      "Auto-scaling based on demand",
      "Pay-per-use pricing model",
      "API rate limiting and monitoring"
    ],
    difficulty: "Beginner",
    timeLimit: 10,
    targetServices: ["API Gateway", "Lambda", "DynamoDB", "Cognito"],
    bonusServices: ["CloudWatch", "X-Ray", "WAF"]
  }
];

export default function ChallengeMode() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedScenario, setSelectedScenario] = useState<ChallengeScenario | null>(null);
  const [canvasServices, setCanvasServices] = useState<CanvasService[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedService, setDraggedService] = useState<AwsService | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [challengeResult, setChallengeResult] = useState<ChallengeResult | null>(null);
  const [showModelSolution, setShowModelSolution] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: services } = useQuery<AwsService[]>({
    queryKey: ["/api/services"],
  });

  // Timer effect
  useEffect(() => {
    if (selectedScenario && timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitSolution();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedScenario, timeRemaining, isSubmitted]);

  const startChallenge = (scenario: ChallengeScenario) => {
    setSelectedScenario(scenario);
    setTimeRemaining(scenario.timeLimit * 60);
    setCanvasServices([]);
    setConnections([]);
    setChallengeResult(null);
    setIsSubmitted(false);
    setShowModelSolution(false);
  };

  const resetChallenge = () => {
    setSelectedScenario(null);
    setCanvasServices([]);
    setConnections([]);
    setChallengeResult(null);
    setIsSubmitted(false);
    setShowModelSolution(false);
  };

  const handleDragStart = (e: React.DragEvent, service: AwsService) => {
    setDraggedService(service);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedService || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const snappedX = Math.round(x / 20) * 20;
    const snappedY = Math.round(y / 20) * 20;

    const newCanvasService: CanvasService = {
      id: `${draggedService.name}-${Date.now()}`,
      service: draggedService,
      x: snappedX,
      y: snappedY,
    };

    setCanvasServices(prev => [...prev, newCanvasService]);
    setDraggedService(null);
  };

  const handleServiceClick = (serviceId: string) => {
    if (isConnecting) {
      if (connectingFrom && connectingFrom !== serviceId) {
        const newConnection: Connection = {
          id: `${connectingFrom}-${serviceId}-${Date.now()}`,
          fromServiceId: connectingFrom,
          toServiceId: serviceId,
        };
        setConnections(prev => [...prev, newConnection]);
        setIsConnecting(false);
        setConnectingFrom(null);
      } else {
        setConnectingFrom(serviceId);
      }
    } else {
      setSelectedService(selectedService === serviceId ? null : serviceId);
    }
  };

  const removeService = (serviceId: string) => {
    setCanvasServices(prev => prev.filter(cs => cs.id !== serviceId));
    setConnections(prev => prev.filter(conn => 
      conn.fromServiceId !== serviceId && conn.toServiceId !== serviceId
    ));
    setSelectedService(null);
  };

  const calculateScore = useCallback((): ChallengeResult => {
    if (!selectedScenario) {
      return {
        score: { resilience: 0, costEfficiency: 0, performance: 0, security: 0, total: 0 },
        feedback: [],
        badges: [],
        recommendations: []
      };
    }

    const serviceNames = canvasServices.map(cs => cs.service.name);
    let resilience = 0;
    let costEfficiency = 0;
    let performance = 0;
    let security = 0;
    const feedback: string[] = [];
    const badges: string[] = [];
    const recommendations: string[] = [];

    // Resilience scoring
    if (serviceNames.includes("Auto Scaling")) resilience += 20;
    if (serviceNames.includes("ELB") || serviceNames.includes("ALB")) resilience += 15;
    if (serviceNames.includes("Route 53")) resilience += 10;
    if (connections.length >= 3) resilience += 15; // Well-connected architecture
    if (serviceNames.filter(name => ["S3", "DynamoDB", "RDS"].includes(name)).length >= 1) resilience += 20;
    if (serviceNames.includes("Lambda") && serviceNames.includes("DynamoDB")) resilience += 20;

    // Cost efficiency scoring
    if (serviceNames.includes("Lambda")) costEfficiency += 25;
    if (serviceNames.includes("S3")) costEfficiency += 20;
    if (serviceNames.includes("CloudFront")) costEfficiency += 15;
    if (serviceNames.includes("DynamoDB")) costEfficiency += 15;
    if (!serviceNames.includes("EC2") && serviceNames.includes("Lambda")) costEfficiency += 25;

    // Performance scoring
    if (serviceNames.includes("CloudFront")) performance += 30;
    if (serviceNames.includes("ElastiCache")) performance += 25;
    if (serviceNames.includes("Lambda")) performance += 20;
    if (serviceNames.includes("API Gateway")) performance += 15;
    if (serviceNames.includes("Route 53")) performance += 10;

    // Security scoring
    if (serviceNames.includes("IAM")) security += 20;
    if (serviceNames.includes("Cognito")) security += 20;
    if (serviceNames.includes("WAF")) security += 20;
    if (serviceNames.includes("VPC")) security += 15;
    if (serviceNames.includes("KMS")) security += 15;
    if (serviceNames.includes("CloudTrail")) security += 10;

    // Cap scores at 100
    resilience = Math.min(resilience, 100);
    costEfficiency = Math.min(costEfficiency, 100);
    performance = Math.min(performance, 100);
    security = Math.min(security, 100);

    const total = Math.round((resilience + costEfficiency + performance + security) / 4);

    // Generate feedback
    if (resilience < 50) {
      feedback.push("Consider adding redundancy with Auto Scaling, Load Balancers, or multi-AZ deployments");
      recommendations.push("Add Auto Scaling and Load Balancer for better fault tolerance");
    }
    if (costEfficiency < 50) {
      feedback.push("Look for serverless alternatives to reduce costs");
      recommendations.push("Consider Lambda instead of EC2 for variable workloads");
    }
    if (performance < 50) {
      feedback.push("Add CloudFront and caching layers to improve response times");
      recommendations.push("Implement CloudFront for global content delivery");
    }
    if (security < 50) {
      feedback.push("Strengthen security with IAM, VPC, and authentication services");
      recommendations.push("Add IAM and Cognito for proper access control");
    }

    // Award badges
    if (total >= 90) badges.push("Architecture Master");
    if (total >= 80) badges.push("Cloud Expert");
    if (resilience >= 80) badges.push("Highly Available Hero");
    if (costEfficiency >= 80) badges.push("Cost-Saving Champion");
    if (performance >= 80) badges.push("Speed Demon");
    if (security >= 80) badges.push("Security Specialist");

    // Check if target services are used
    const usedTargetServices = selectedScenario.targetServices.filter(target => 
      serviceNames.includes(target)
    );
    if (usedTargetServices.length === selectedScenario.targetServices.length) {
      badges.push("Requirements Master");
    }

    return {
      score: { resilience, costEfficiency, performance, security, total },
      feedback,
      badges,
      recommendations
    };
  }, [canvasServices, connections, selectedScenario]);

  const submitSolution = () => {
    const result = calculateScore();
    setChallengeResult(result);
    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Services
                  </Button>
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Architecture Challenge Mode
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Test Your AWS Architecture Skills
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Solve real-world scenarios and get scored on resilience, cost, performance, and security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHALLENGE_SCENARIOS.map((scenario) => (
              <Card key={scenario.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    <Badge className={`${getDifficultyColor(scenario.difficulty)} text-white`}>
                      {scenario.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Target className="w-4 h-4 mr-1" />
                    {scenario.timeLimit} minutes
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {scenario.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {scenario.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    onClick={() => startChallenge(scenario)}
                    className="w-full"
                  >
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button onClick={resetChallenge} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Challenges
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedScenario.title}
                </h1>
                <Badge className={`${getDifficultyColor(selectedScenario.difficulty)} text-white text-xs`}>
                  {selectedScenario.difficulty}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isSubmitted && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Time:</span>
                  <Badge variant={timeRemaining < 300 ? "destructive" : "default"}>
                    {formatTime(timeRemaining)}
                  </Badge>
                </div>
              )}
              
              {!isSubmitted ? (
                <Button onClick={submitSolution} size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Solution
                </Button>
              ) : (
                <Button onClick={resetChallenge} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Another
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Services Sidebar */}
        <div className="w-80 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
          {/* Challenge Description */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Challenge
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {selectedScenario.description}
            </p>
            
            <h4 className="font-semibold text-sm mb-2">Key Requirements:</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              {selectedScenario.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Services Grid */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              AWS Services
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {services?.map((service) => {
                const isTarget = selectedScenario.targetServices.includes(service.name);
                const isBonus = selectedScenario.bonusServices.includes(service.name);
                const isUsed = canvasServices.some(cs => cs.service.name === service.name);
                
                return (
                  <div
                    key={service.id}
                    draggable={!isSubmitted}
                    onDragStart={(e) => handleDragStart(e, service)}
                    className={`p-3 rounded-lg border-2 cursor-grab hover:shadow-md transition-all duration-200 active:cursor-grabbing ${
                      isTarget ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" :
                      isBonus ? "border-green-500 bg-green-50 dark:bg-green-900/20" :
                      "border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700"
                    } ${isUsed ? "opacity-50" : ""}`}
                  >
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 mx-auto mb-2 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: service.color }}
                      >
                        {service.name.substring(0, 2)}
                      </div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </div>
                      {isTarget && <Star className="w-3 h-3 mx-auto mt-1 text-blue-500" />}
                      {isBonus && <Trophy className="w-3 h-3 mx-auto mt-1 text-green-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Panel */}
          {challengeResult && (
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                Challenge Results
              </h3>
              
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {challengeResult.score.total}/100
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Overall Score
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">Resilience</span>
                    </div>
                    <span className="text-sm font-medium">{challengeResult.score.resilience}</span>
                  </div>
                  <Progress value={challengeResult.score.resilience} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm">Cost Efficiency</span>
                    </div>
                    <span className="text-sm font-medium">{challengeResult.score.costEfficiency}</span>
                  </div>
                  <Progress value={challengeResult.score.costEfficiency} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="text-sm">Performance</span>
                    </div>
                    <span className="text-sm font-medium">{challengeResult.score.performance}</span>
                  </div>
                  <Progress value={challengeResult.score.performance} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm">Security</span>
                    </div>
                    <span className="text-sm font-medium">{challengeResult.score.security}</span>
                  </div>
                  <Progress value={challengeResult.score.security} className="h-2" />
                </div>

                {/* Badges */}
                {challengeResult.badges.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Badges Earned:</h4>
                    <div className="flex flex-wrap gap-1">
                      {challengeResult.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {challengeResult.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center">
                      <Lightbulb className="w-3 h-3 mr-1 text-yellow-500" />
                      Recommendations:
                    </h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      {challengeResult.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`w-full h-full relative ${
              theme === "dark" ? "bg-slate-900" : "bg-gray-50"
            }`}
            style={{
              backgroundImage: `radial-gradient(circle, ${
                theme === "dark" ? "#374151" : "#9CA3AF"
              } 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          >
            {/* Drop Zone Hint */}
            {canvasServices.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Start Building Your Solution
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500">
                    Drag AWS services to design your architecture
                  </p>
                </div>
              </div>
            )}

            {/* Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((connection) => {
                const fromService = canvasServices.find(cs => cs.id === connection.fromServiceId);
                const toService = canvasServices.find(cs => cs.id === connection.toServiceId);
                
                if (!fromService || !toService) return null;

                const fromX = fromService.x + 40;
                const fromY = fromService.y + 40;
                const toX = toService.x + 40;
                const toY = toService.y + 40;

                return (
                  <g key={connection.id}>
                    <defs>
                      <marker
                        id={`arrowhead-${connection.id}`}
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill={theme === "dark" ? "#60A5FA" : "#3B82F6"}
                        />
                      </marker>
                    </defs>
                    <line
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      stroke={theme === "dark" ? "#60A5FA" : "#3B82F6"}
                      strokeWidth="2"
                      markerEnd={`url(#arrowhead-${connection.id})`}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Canvas Services */}
            {canvasServices.map((canvasService) => (
              <div
                key={canvasService.id}
                className={`absolute w-20 h-20 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedService === canvasService.id
                    ? "border-blue-500 shadow-lg scale-110"
                    : isConnecting && connectingFrom === canvasService.id
                    ? "border-green-500 shadow-lg"
                    : "border-gray-300 dark:border-slate-600 hover:shadow-md hover:scale-105"
                } ${
                  isConnecting ? "hover:border-blue-400" : ""
                }`}
                style={{
                  left: canvasService.x,
                  top: canvasService.y,
                  backgroundColor: canvasService.service.color,
                }}
                onClick={() => !isSubmitted && handleServiceClick(canvasService.id)}
              >
                <div className="flex flex-col items-center justify-center h-full text-white p-2">
                  <div className="text-xs font-bold mb-1 text-center leading-tight">
                    {canvasService.service.name}
                  </div>
                </div>
                
                {/* Remove button */}
                {selectedService === canvasService.id && !isSubmitted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeService(canvasService.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* Connection Instructions */}
            {isConnecting && !isSubmitted && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
                <div className="text-sm font-medium">
                  {connectingFrom ? "Click another service to connect" : "Click a service to start connecting"}
                </div>
              </div>
            )}

            {/* Connection Toggle Button */}
            {!isSubmitted && (
              <div className="absolute top-4 right-4">
                <Button
                  onClick={() => setIsConnecting(!isConnecting)}
                  variant={isConnecting ? "default" : "outline"}
                  size="sm"
                >
                  {isConnecting ? "Cancel Connect" : "Connect Services"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

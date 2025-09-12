import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Save, Trash2, Grid, Lightbulb, Award, ArrowLeft, Share, Trophy, Upload, Copy, Palette, Layers, Zap, Settings, Eye, EyeOff, Brain, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/theme-provider";
import { type AwsService } from "@shared/schema";
import { Link } from "wouter";

interface CanvasService {
  id: string;
  service: AwsService;
  x: number;
  y: number;
  label?: string;
}

interface Connection {
  id: string;
  fromServiceId: string;
  toServiceId: string;
  label?: string;
  type: 'sync' | 'async' | 'data' | 'network';
}

interface ArchitectureSuggestion {
  message: string;
  suggestedServices: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'security' | 'performance' | 'cost' | 'reliability' | 'best-practice';
  impact: number; // 1-10 scale
  reasoning: string;
}

interface ArchitectureScore {
  security: number;
  performance: number;
  costEfficiency: number;
  reliability: number;
  scalability: number;
  bestPractices: number;
  total: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
}

interface DetailedFeedback {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  certificationAlignment: string[];
}

interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  services: Array<{
    serviceName: string;
    x: number;
    y: number;
    label?: string;
  }>;
  connections: Array<{
    from: string;
    to: string;
    type: Connection['type'];
    label?: string;
    }>;
}

const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: 'enterprise-serverless',
    name: 'Enterprise-Grade Serverless Application',
    description: 'Production-ready serverless architecture with comprehensive security, monitoring, and scalability features. Includes WAF, IAM, VPC, CloudTrail, and full observability.',
    category: 'Web Applications',
    services: [
      { serviceName: 'Route 53', x: 50, y: 100, label: 'DNS' },
      { serviceName: 'WAF', x: 200, y: 50, label: 'Security' },
      { serviceName: 'CloudFront', x: 200, y: 150, label: 'CDN' },
      { serviceName: 'S3', x: 350, y: 150, label: 'Static Site' },
      { serviceName: 'API Gateway', x: 350, y: 250, label: 'REST API' },
      { serviceName: 'Lambda', x: 500, y: 250, label: 'Functions' },
      { serviceName: 'VPC', x: 650, y: 200, label: 'Network' },
      { serviceName: 'DynamoDB', x: 500, y: 350, label: 'NoSQL DB' },
      { serviceName: 'ElastiCache', x: 650, y: 350, label: 'Cache' },
      { serviceName: 'IAM', x: 800, y: 100, label: 'Auth' },
      { serviceName: 'KMS', x: 800, y: 200, label: 'Encryption' },
      { serviceName: 'CloudWatch', x: 800, y: 300, label: 'Monitoring' },
      { serviceName: 'CloudTrail', x: 950, y: 200, label: 'Audit' },
      { serviceName: 'Cognito', x: 950, y: 100, label: 'User Auth' },
      { serviceName: 'GuardDuty', x: 950, y: 300, label: 'Threat Detection' },
      { serviceName: 'ALB', x: 200, y: 350, label: 'API Load Balancer' },
      { serviceName: 'Auto Scaling', x: 650, y: 100, label: 'Lambda Scaling' },
      { serviceName: 'RDS', x: 500, y: 450, label: 'User Data' },
    ],
    connections: [
      { from: 'Route 53', to: 'WAF', type: 'network', label: 'Routes' },
      { from: 'WAF', to: 'CloudFront', type: 'network', label: 'Protects' },
      { from: 'CloudFront', to: 'S3', type: 'network', label: 'Serves' },
      { from: 'CloudFront', to: 'API Gateway', type: 'network', label: 'API Traffic' },
      { from: 'API Gateway', to: 'Lambda', type: 'sync', label: 'Invokes' },
      { from: 'Lambda', to: 'VPC', type: 'network', label: 'Executes In' },
      { from: 'Lambda', to: 'DynamoDB', type: 'data', label: 'Queries' },
      { from: 'Lambda', to: 'ElastiCache', type: 'data', label: 'Caches' },
      { from: 'IAM', to: 'Lambda', type: 'data', label: 'Authorizes' },
      { from: 'KMS', to: 'DynamoDB', type: 'data', label: 'Encrypts' },
      { from: 'CloudWatch', to: 'Lambda', type: 'data', label: 'Monitors' },
      { from: 'CloudTrail', to: 'API Gateway', type: 'data', label: 'Logs' },
      { from: 'CloudTrail', to: 'Lambda', type: 'data', label: 'Logs' },
      { from: 'CloudWatch', to: 'DynamoDB', type: 'data', label: 'Monitors' },
      { from: 'CloudWatch', to: 'API Gateway', type: 'data', label: 'Monitors' },
      { from: 'ALB', to: 'API Gateway', type: 'network', label: 'Load Balances' },
      { from: 'Auto Scaling', to: 'Lambda', type: 'data', label: 'Scales' },
      { from: 'Lambda', to: 'RDS', type: 'data', label: 'User Data' },
      { from: 'Cognito', to: 'API Gateway', type: 'data', label: 'Authenticates' },
      { from: 'GuardDuty', to: 'VPC', type: 'data', label: 'Monitors' },
      { from: 'KMS', to: 'RDS', type: 'data', label: 'Encrypts' },
    ]
  },
  {
    id: 'enterprise-microservices',
    name: 'Enterprise Microservices Platform',
    description: 'Production-ready microservices architecture with comprehensive security, auto-scaling, multi-AZ deployment, and full observability stack.',
    category: 'Enterprise',
    services: [
      { serviceName: 'Route 53', x: 50, y: 200, label: 'DNS' },
      { serviceName: 'WAF', x: 200, y: 100, label: 'Web Firewall' },
      { serviceName: 'CloudFront', x: 200, y: 200, label: 'CDN' },
      { serviceName: 'ALB', x: 350, y: 200, label: 'Load Balancer' },
      { serviceName: 'VPC', x: 500, y: 50, label: 'Virtual Network' },
      { serviceName: 'ECS', x: 500, y: 150, label: 'User Service' },
      { serviceName: 'ECS', x: 500, y: 250, label: 'Order Service' },
      { serviceName: 'ECS', x: 500, y: 350, label: 'Payment Service' },
      { serviceName: 'Auto Scaling', x: 650, y: 150, label: 'Auto Scaling' },
      { serviceName: 'RDS', x: 800, y: 150, label: 'Primary DB' },
      { serviceName: 'RDS', x: 800, y: 250, label: 'Read Replica' },
      { serviceName: 'ElastiCache', x: 650, y: 350, label: 'Redis Cache' },
      { serviceName: 'IAM', x: 950, y: 100, label: 'IAM Roles' },
      { serviceName: 'KMS', x: 950, y: 200, label: 'Key Management' },
      { serviceName: 'CloudWatch', x: 950, y: 300, label: 'Monitoring' },
      { serviceName: 'CloudTrail', x: 950, y: 400, label: 'Audit Logs' },
      { serviceName: 'Cognito', x: 1100, y: 100, label: 'User Auth' },
      { serviceName: 'GuardDuty', x: 1100, y: 200, label: 'Threat Detection' },
      { serviceName: 'Lambda', x: 650, y: 250, label: 'Background Tasks' },
      { serviceName: 'API Gateway', x: 350, y: 300, label: 'Admin API' },
      { serviceName: 'DynamoDB', x: 800, y: 350, label: 'Session Store' },
      { serviceName: 'S3', x: 350, y: 100, label: 'Asset Storage' },
    ],
    connections: [
      { from: 'Route 53', to: 'WAF', type: 'network', label: 'DNS Resolution' },
      { from: 'WAF', to: 'CloudFront', type: 'network', label: 'Protects' },
      { from: 'CloudFront', to: 'ALB', type: 'network', label: 'Routes' },
      { from: 'ALB', to: 'ECS', type: 'network', label: 'Load Balances' },
      { from: 'VPC', to: 'ECS', type: 'network', label: 'Contains' },
      { from: 'Auto Scaling', to: 'ECS', type: 'data', label: 'Scales' },
      { from: 'ECS', to: 'RDS', type: 'data', label: 'Queries' },
      { from: 'ECS', to: 'ElastiCache', type: 'data', label: 'Caches' },
      { from: 'IAM', to: 'ECS', type: 'data', label: 'Authorizes' },
      { from: 'KMS', to: 'RDS', type: 'data', label: 'Encrypts' },
      { from: 'CloudWatch', to: 'ECS', type: 'data', label: 'Monitors' },
      { from: 'CloudTrail', to: 'ALB', type: 'data', label: 'Logs' },
      { from: 'CloudWatch', to: 'ALB', type: 'data', label: 'Monitors' },
      { from: 'CloudWatch', to: 'RDS', type: 'data', label: 'Monitors' },
      { from: 'Cognito', to: 'ALB', type: 'data', label: 'Authenticates' },
      { from: 'GuardDuty', to: 'VPC', type: 'data', label: 'Monitors' },
      { from: 'Lambda', to: 'RDS', type: 'data', label: 'Background Jobs' },
      { from: 'API Gateway', to: 'Lambda', type: 'sync', label: 'Invokes' },
    ]
  },
  {
    id: 'enterprise-data-platform',
    name: 'Enterprise Data Analytics Platform',
    description: 'Advanced data processing platform with real-time streaming, machine learning, comprehensive security, and multi-layer data lake architecture.',
    category: 'Analytics',
    services: [
      { serviceName: 'Route 53', x: 50, y: 150, label: 'DNS' },
      { serviceName: 'CloudFront', x: 150, y: 150, label: 'CDN' },
      { serviceName: 'API Gateway', x: 250, y: 150, label: 'Data API' },
      { serviceName: 'Kinesis', x: 350, y: 100, label: 'Data Stream' },
      { serviceName: 'S3', x: 500, y: 50, label: 'Raw Data Lake' },
      { serviceName: 'S3', x: 500, y: 150, label: 'Processed Data' },
      { serviceName: 'S3', x: 500, y: 250, label: 'Archive' },
      { serviceName: 'Lambda', x: 350, y: 200, label: 'ETL Functions' },
      { serviceName: 'Glue', x: 650, y: 200, label: 'Data Catalog' },
      { serviceName: 'EMR', x: 650, y: 100, label: 'Big Data Processing' },
      { serviceName: 'Redshift', x: 800, y: 100, label: 'Data Warehouse' },
      { serviceName: 'QuickSight', x: 950, y: 100, label: 'Analytics' },
      { serviceName: 'SageMaker', x: 800, y: 250, label: 'ML Platform' },
      { serviceName: 'IAM', x: 50, y: 50, label: 'Access Control' },
      { serviceName: 'KMS', x: 50, y: 250, label: 'Encryption' },
      { serviceName: 'VPC', x: 650, y: 50, label: 'Network Security' },
      { serviceName: 'CloudWatch', x: 950, y: 200, label: 'Monitoring' },
      { serviceName: 'CloudTrail', x: 950, y: 300, label: 'Audit Trail' },
      { serviceName: 'Auto Scaling', x: 800, y: 150, label: 'EMR Scaling' },
      { serviceName: 'Cognito', x: 150, y: 50, label: 'User Auth' },
      { serviceName: 'GuardDuty', x: 150, y: 250, label: 'Threat Detection' },
      { serviceName: 'DynamoDB', x: 350, y: 300, label: 'Job Metadata' },
      { serviceName: 'ElastiCache', x: 500, y: 350, label: 'Query Cache' },
      { serviceName: 'WAF', x: 50, y: 100, label: 'Web Security' },
      { serviceName: 'ALB', x: 200, y: 200, label: 'API Load Balancer' },
      { serviceName: 'RDS', x: 800, y: 350, label: 'Metadata Store' },
    ],
    connections: [
      { from: 'Kinesis', to: 'S3', type: 'data', label: 'Streams Data' },
      { from: 'Kinesis', to: 'Lambda', type: 'async', label: 'Triggers' },
      { from: 'Lambda', to: 'S3', type: 'data', label: 'Transforms' },
      { from: 'Glue', to: 'S3', type: 'data', label: 'Catalogs' },
      { from: 'EMR', to: 'S3', type: 'data', label: 'Processes' },
      { from: 'S3', to: 'Redshift', type: 'data', label: 'Loads' },
      { from: 'Redshift', to: 'QuickSight', type: 'data', label: 'Visualizes' },
      { from: 'S3', to: 'SageMaker', type: 'data', label: 'Training Data' },
      { from: 'IAM', to: 'Lambda', type: 'data', label: 'Authorizes' },
      { from: 'KMS', to: 'S3', type: 'data', label: 'Encrypts' },
      { from: 'VPC', to: 'EMR', type: 'network', label: 'Secures' },
      { from: 'CloudWatch', to: 'Lambda', type: 'data', label: 'Monitors' },
      { from: 'CloudTrail', to: 'S3', type: 'data', label: 'Logs Access' },
      { from: 'Route 53', to: 'CloudFront', type: 'network', label: 'DNS' },
      { from: 'CloudFront', to: 'API Gateway', type: 'network', label: 'Routes' },
      { from: 'API Gateway', to: 'Lambda', type: 'sync', label: 'Invokes' },
      { from: 'Auto Scaling', to: 'EMR', type: 'data', label: 'Scales' },
      { from: 'Cognito', to: 'API Gateway', type: 'data', label: 'Authenticates' },
      { from: 'GuardDuty', to: 'VPC', type: 'data', label: 'Monitors' },
      { from: 'DynamoDB', to: 'Lambda', type: 'data', label: 'Metadata' },
      { from: 'WAF', to: 'Route 53', type: 'network', label: 'Protects' },
      { from: 'ALB', to: 'API Gateway', type: 'network', label: 'Load Balances' },
      { from: 'RDS', to: 'Lambda', type: 'data', label: 'Job Metadata' },
      { from: 'ElastiCache', to: 'Redshift', type: 'data', label: 'Caches' },
      { from: 'KMS', to: 'RDS', type: 'data', label: 'Encrypts' },
      { from: 'CloudWatch', to: 'RDS', type: 'data', label: 'Monitors' },
      { from: 'CloudWatch', to: 'Redshift', type: 'data', label: 'Monitors' },
    ]
  }
];

export default function ArchitectureBuilder() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasServices, setCanvasServices] = useState<CanvasService[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedService, setDraggedService] = useState<AwsService | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [connectionType, setConnectionType] = useState<Connection['type']>('sync');
  const [suggestions, setSuggestions] = useState<ArchitectureSuggestion[]>([]);
  const [architectureScore, setArchitectureScore] = useState<ArchitectureScore | null>(null);
  const [detailedFeedback, setDetailedFeedback] = useState<DetailedFeedback | null>(null);
  const [showCertPaths, setShowCertPaths] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [architectureName, setArchitectureName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showScoring, setShowScoring] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDraggingService, setIsDraggingService] = useState(false);

  const { data: services } = useQuery<AwsService[]>({
    queryKey: ["/api/services"],
  });

  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(services?.map(s => s.category) || [])];

  // Advanced AI-powered suggestion system
  const generateSuggestions = useCallback(() => {
    if (canvasServices.length === 0) {
      setSuggestions([]);
      setArchitectureScore(null);
      setDetailedFeedback(null);
      return;
    }

    const serviceNames = canvasServices.map(cs => cs.service.name);
    const serviceCategories = canvasServices.map(cs => cs.service.category);
    const newSuggestions: ArchitectureSuggestion[] = [];

    // Critical Security Issues
    if (serviceNames.some(name => ["RDS", "DynamoDB", "Redshift"].includes(name)) && 
        serviceNames.some(name => ["EC2", "Lambda", "ECS"].includes(name)) &&
        !serviceNames.includes("IAM")) {
      newSuggestions.push({
        message: "Critical security gap: No IAM service detected with compute and database services",
        suggestedServices: ["IAM"],
        priority: 'critical',
        category: 'security',
        impact: 10,
        reasoning: "IAM is essential for secure access control between services. Without it, your architecture has major security vulnerabilities."
      });
    }

    if (serviceNames.includes("EC2") && !serviceNames.includes("VPC")) {
      newSuggestions.push({
        message: "EC2 instances should run in isolated VPC networks",
        suggestedServices: ["VPC"],
        priority: 'critical',
        category: 'security',
        impact: 9,
        reasoning: "VPC provides network isolation and security controls essential for production workloads."
      });
    }

    if (serviceNames.some(name => ["API Gateway", "ALB", "CloudFront"].includes(name)) && !serviceNames.includes("WAF")) {
      newSuggestions.push({
        message: "Web applications need WAF protection against common attacks",
        suggestedServices: ["WAF"],
        priority: 'high',
        category: 'security',
        impact: 8,
        reasoning: "WAF protects against OWASP Top 10 vulnerabilities and DDoS attacks."
      });
    }

    // Performance Optimizations
    if (serviceNames.includes("S3") && !serviceNames.includes("CloudFront")) {
      newSuggestions.push({
        message: "Add CloudFront CDN for global content delivery and reduced latency",
        suggestedServices: ["CloudFront"],
        priority: 'medium',
        category: 'performance',
        impact: 7,
        reasoning: "CloudFront reduces latency by caching content at edge locations worldwide."
      });
    }

    if (serviceNames.some(name => ["RDS", "Aurora"].includes(name)) && !serviceNames.includes("ElastiCache")) {
      newSuggestions.push({
        message: "Consider ElastiCache to reduce database load and improve response times",
        suggestedServices: ["ElastiCache"],
        priority: 'medium',
        category: 'performance',
        impact: 6,
        reasoning: "In-memory caching significantly reduces database queries and improves application performance."
      });
    }

    // Cost Optimization
    if (serviceNames.includes("EC2") && !serviceNames.includes("Auto Scaling")) {
      newSuggestions.push({
        message: "Auto Scaling optimizes costs by adjusting capacity based on demand",
        suggestedServices: ["Auto Scaling"],
        priority: 'medium',
        category: 'cost',
        impact: 7,
        reasoning: "Auto Scaling prevents over-provisioning and reduces costs during low-demand periods."
      });
    }

    if (serviceNames.includes("EC2") && serviceNames.some(name => ["API Gateway", "S3"].includes(name))) {
      newSuggestions.push({
        message: "Consider serverless alternatives (Lambda) to reduce infrastructure costs",
        suggestedServices: ["Lambda"],
        priority: 'low',
        category: 'cost',
        impact: 6,
        reasoning: "Lambda eliminates idle time costs and scales automatically with usage."
      });
    }

    // Reliability & High Availability
    if (serviceNames.includes("RDS") && !serviceNames.includes("RDS")) {
      newSuggestions.push({
        message: "Enable Multi-AZ deployment for database high availability",
        suggestedServices: [],
        priority: 'high',
        category: 'reliability',
        impact: 8,
        reasoning: "Multi-AZ provides automatic failover and data durability across availability zones."
      });
    }

    if (serviceNames.includes("EC2") && !serviceNames.some(name => ["ELB", "ALB", "NLB"].includes(name))) {
      newSuggestions.push({
        message: "Add load balancing for high availability and traffic distribution",
        suggestedServices: ["ALB"],
        priority: 'high',
        category: 'reliability',
        impact: 8,
        reasoning: "Load balancers distribute traffic and provide failover capabilities."
      });
    }

    // Best Practices
    if (serviceNames.length > 2 && !serviceNames.includes("CloudWatch")) {
      newSuggestions.push({
        message: "CloudWatch is essential for monitoring and observability",
        suggestedServices: ["CloudWatch"],
        priority: 'medium',
        category: 'best-practice',
        impact: 6,
        reasoning: "Monitoring is crucial for maintaining system health and troubleshooting issues."
      });
    }

    if (serviceNames.length > 3 && !serviceNames.includes("CloudTrail")) {
      newSuggestions.push({
        message: "Enable CloudTrail for audit logging and compliance",
        suggestedServices: ["CloudTrail"],
        priority: 'medium',
        category: 'best-practice',
        impact: 5,
        reasoning: "CloudTrail provides audit logs for security and compliance requirements."
      });
    }

    if (serviceNames.includes("Lambda") && !serviceNames.includes("API Gateway")) {
      newSuggestions.push({
        message: "API Gateway provides managed HTTP endpoints for Lambda functions",
        suggestedServices: ["API Gateway"],
        priority: 'medium',
        category: 'best-practice',
        impact: 7,
        reasoning: "API Gateway handles authentication, throttling, and request/response transformation."
      });
    }

    // Advanced patterns
    if (serviceNames.includes("DynamoDB") && serviceNames.includes("Lambda") && !serviceNames.includes("EventBridge")) {
      newSuggestions.push({
        message: "Consider EventBridge for event-driven architecture patterns",
        suggestedServices: ["EventBridge"],
        priority: 'low',
        category: 'best-practice',
        impact: 5,
        reasoning: "EventBridge enables loose coupling and event-driven microservices architecture."
      });
    }

    setSuggestions(newSuggestions);
    calculateArchitectureScore(serviceNames, serviceCategories, connections);
  }, [canvasServices, connections]);

  const placedServices = canvasServices.map(cs => cs.service);

  // Comprehensive scoring system
  const calculateArchitectureScore = (serviceNames: string[], serviceCategories: string[], connections: Connection[]) => {
    let security = 0, performance = 0, costEfficiency = 0;
    let reliability = 0, scalability = 0, bestPractices = 0;

    // Security scoring (0-100)
    if (serviceNames.includes("IAM")) security += 25;
    if (serviceNames.includes("VPC")) security += 20;
    if (serviceNames.includes("WAF")) security += 15;
    if (serviceNames.includes("Cognito")) security += 15;
    if (serviceNames.includes("KMS")) security += 10;
    if (serviceNames.includes("CloudTrail")) security += 10;
    if (serviceNames.includes("GuardDuty")) security += 5;

    // Performance scoring
    if (serviceNames.includes("CloudFront")) performance += 25;
    if (serviceNames.includes("ElastiCache")) performance += 20;
    if (serviceNames.includes("Route 53")) performance += 15;
    if (serviceNames.includes("API Gateway")) performance += 15;
    if (serviceNames.includes("Lambda")) performance += 20;
    if (connections.length >= serviceNames.length) performance += 5; // Well-connected

    // Cost efficiency scoring
    if (serviceNames.includes("Lambda")) costEfficiency += 25;
    if (serviceNames.includes("S3")) costEfficiency += 15;
    if (serviceNames.includes("DynamoDB")) costEfficiency += 15;
    if (serviceNames.includes("Auto Scaling")) costEfficiency += 20;
    if (serviceNames.includes("CloudFront")) costEfficiency += 10;
    if (!serviceNames.includes("EC2") && serviceNames.includes("Lambda")) costEfficiency += 15;

    // Reliability scoring
    if (serviceNames.some(name => ["ELB", "ALB", "NLB"].includes(name))) reliability += 25;
    if (serviceNames.includes("Auto Scaling")) reliability += 20;
    if (serviceNames.includes("Route 53")) reliability += 15;
    if (serviceNames.some(name => ["RDS", "Aurora"].includes(name))) reliability += 15;
    if (serviceNames.includes("S3")) reliability += 15;
    if (connections.length >= 2) reliability += 10; // Redundant connections

    // Scalability scoring
    if (serviceNames.includes("Auto Scaling")) scalability += 30;
    if (serviceNames.includes("Lambda")) scalability += 25;
    if (serviceNames.includes("DynamoDB")) scalability += 20;
    if (serviceNames.includes("CloudFront")) scalability += 15;
    if (serviceNames.some(name => ["ELB", "ALB"].includes(name))) scalability += 10;

    // Best practices scoring
    if (serviceNames.includes("CloudWatch")) bestPractices += 20;
    if (serviceNames.includes("CloudTrail")) bestPractices += 15;
    if (serviceNames.includes("IAM")) bestPractices += 20;
    if (serviceCategories.length >= 3) bestPractices += 15; // Multi-category architecture
    if (connections.length >= serviceNames.length) bestPractices += 15; // Well-connected
    if (serviceNames.length >= 5) bestPractices += 15; // Comprehensive architecture

    // Cap all scores at 100
    security = Math.min(security, 100);
    performance = Math.min(performance, 100);
    costEfficiency = Math.min(costEfficiency, 100);
    reliability = Math.min(reliability, 100);
    scalability = Math.min(scalability, 100);
    bestPractices = Math.min(bestPractices, 100);

    const total = Math.round((security + performance + costEfficiency + reliability + scalability + bestPractices) / 6);

    // Calculate grade
    let grade: ArchitectureScore['grade'];
    if (total >= 95) grade = 'A+';
    else if (total >= 90) grade = 'A';
    else if (total >= 85) grade = 'B+';
    else if (total >= 80) grade = 'B';
    else if (total >= 75) grade = 'C+';
    else if (total >= 70) grade = 'C';
    else if (total >= 60) grade = 'D';
    else grade = 'F';

    setArchitectureScore({
      security,
      performance,
      costEfficiency,
      reliability,
      scalability,
      bestPractices,
      total,
      grade
    });

    generateDetailedFeedback(serviceNames, total, grade);
  };

  const generateDetailedFeedback = (serviceNames: string[], total: number, grade: ArchitectureScore['grade']) => {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];
    const certificationAlignment: string[] = [];

    // Identify strengths
    if (serviceNames.includes("Lambda")) strengths.push("Serverless architecture for cost optimization");
    if (serviceNames.includes("CloudFront")) strengths.push("Global content delivery for performance");
    if (serviceNames.includes("IAM")) strengths.push("Proper identity and access management");
    if (serviceNames.includes("Auto Scaling")) strengths.push("Dynamic scaling capabilities");
    if (serviceNames.includes("VPC")) strengths.push("Network isolation and security");

    // Identify weaknesses
    if (!serviceNames.includes("CloudWatch")) weaknesses.push("No monitoring and observability solution");
    if (!serviceNames.includes("IAM")) weaknesses.push("Missing identity and access management");
    if (!serviceNames.includes("VPC") && serviceNames.includes("EC2")) weaknesses.push("EC2 instances not in isolated network");
    if (serviceNames.includes("RDS") && !serviceNames.includes("ElastiCache")) weaknesses.push("Database performance could be improved with caching");

    // Generate recommendations based on grade
    if (grade === 'F' || grade === 'D') {
      recommendations.push("Start with fundamental AWS security services like IAM and VPC");
      recommendations.push("Add monitoring with CloudWatch for basic observability");
      recommendations.push("Consider managed services to reduce operational overhead");
    } else if (grade === 'C' || grade === 'C+') {
      recommendations.push("Implement caching strategies with ElastiCache or CloudFront");
      recommendations.push("Add load balancing for improved availability");
      recommendations.push("Enable auto scaling for cost optimization");
    } else if (grade === 'B' || grade === 'B+') {
      recommendations.push("Implement advanced security with WAF and GuardDuty");
      recommendations.push("Add disaster recovery and backup strategies");
      recommendations.push("Optimize costs with Reserved Instances or Savings Plans");
    } else {
      recommendations.push("Consider advanced patterns like event-driven architecture");
      recommendations.push("Implement infrastructure as code with CloudFormation");
      recommendations.push("Add advanced monitoring with X-Ray and custom metrics");
    }

    // Certification alignment
    if (serviceNames.some(name => ["Lambda", "API Gateway", "DynamoDB"].includes(name))) {
      certificationAlignment.push("AWS Certified Developer - Associate");
    }
    if (serviceNames.some(name => ["VPC", "EC2", "ELB", "Auto Scaling"].includes(name))) {
      certificationAlignment.push("AWS Certified Solutions Architect - Associate");
    }
    if (serviceNames.some(name => ["IAM", "KMS", "CloudTrail", "WAF"].includes(name))) {
      certificationAlignment.push("AWS Certified Security - Specialty");
    }
    if (serviceNames.some(name => ["CloudWatch", "CloudFormation", "Systems Manager"].includes(name))) {
      certificationAlignment.push("AWS Certified SysOps Administrator - Associate");
    }

    setDetailedFeedback({
      strengths,
      weaknesses,
      recommendations,
      certificationAlignment
    });
  };

  useEffect(() => {
    generateSuggestions();
  }, [generateSuggestions]);

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

    const snappedX = showGrid ? Math.round(x / gridSize) * gridSize : x;
    const snappedY = showGrid ? Math.round(y / gridSize) * gridSize : y;

    const newCanvasService: CanvasService = {
      id: `${draggedService.name}-${Date.now()}`,
      service: draggedService,
      x: snappedX,
      y: snappedY,
      label: draggedService.name,
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
          type: connectionType,
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

  const clearCanvas = () => {
    setCanvasServices([]);
    setConnections([]);
    setSelectedService(null);
    setSuggestions([]);
    setArchitectureName('');
  };

  const loadTemplate = (template: ArchitectureTemplate) => {
    if (!services) return;

    const newServices: CanvasService[] = [];
    const newConnections: Connection[] = [];

    // Add services from template
    template.services.forEach(templateService => {
      const service = services.find(s => s.name === templateService.serviceName);
      if (service) {
        newServices.push({
          id: `${service.name}-${Date.now()}-${Math.random()}`,
          service,
          x: templateService.x,
          y: templateService.y,
          label: templateService.label || service.name,
        });
      }
    });

    // Add connections from template
    template.connections.forEach(templateConn => {
      const fromService = newServices.find(s => 
        s.service.name === templateConn.from || s.label === templateConn.from
      );
      const toService = newServices.find(s => 
        s.service.name === templateConn.to || s.label === templateConn.to
      );

      if (fromService && toService) {
        newConnections.push({
          id: `${fromService.id}-${toService.id}-${Date.now()}`,
          fromServiceId: fromService.id,
          toServiceId: toService.id,
          type: templateConn.type,
          label: templateConn.label,
        });
      }
    });

    setCanvasServices(newServices);
    setConnections(newConnections);
    setArchitectureName(template.name);
  };

  const exportAsJSON = () => {
    const architecture = {
      name: architectureName || 'Untitled Architecture',
      services: canvasServices,
      connections: connections,
      metadata: {
        created: new Date().toISOString(),
        serviceCount: canvasServices.length,
        connectionCount: connections.length,
        gridSize,
      }
    };

    const blob = new Blob([JSON.stringify(architecture, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${architectureName || 'aws-architecture'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyArchitecture = () => {
    const architecture = {
      name: architectureName || 'Untitled Architecture',
      services: canvasServices,
      connections: connections,
    };
    navigator.clipboard.writeText(JSON.stringify(architecture, null, 2));
  };

  const addSuggestedService = (serviceName: string) => {
    const service = services?.find(s => s.name === serviceName);
    if (!service || !canvasRef.current) return;

    const newCanvasService: CanvasService = {
      id: `${service.name}-${Date.now()}`,
      service,
      x: 100 + (canvasServices.length % 5) * 120,
      y: 100 + Math.floor(canvasServices.length / 5) * 120,
      label: service.name,
    };

    setCanvasServices(prev => [...prev, newCanvasService]);
  };

  const getConnectionColor = (type: Connection['type']) => {
    switch (type) {
      case 'sync': return '#3B82F6';
      case 'async': return '#10B981';
      case 'data': return '#8B5CF6';
      case 'network': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getHighlightedCerts = () => {
    if (!showCertPaths) return new Set();

    const allCerts = new Set<string>();
    canvasServices.forEach(cs => {
      cs.service.certificationTracks?.forEach(cert => allCerts.add(cert));
    });
    return allCerts;
  };

  const getSuggestionBadgeColor = (priority: ArchitectureSuggestion['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white border-red-600 animate-pulse';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryIcon = (category: ArchitectureSuggestion['category']) => {
    switch (category) {
      case 'security': return <Shield className="w-3 h-3" />;
      case 'performance': return <Zap className="w-3 h-3" />;
      case 'cost': return <Target className="w-3 h-3" />;
      case 'reliability': return <Award className="w-3 h-3" />;
      case 'best-practice': return <Lightbulb className="w-3 h-3" />;
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!isDraggingService && e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleServiceMouseDown = (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
    setIsDraggingService(true);
    setSelectedService(serviceId);
  };

  const moveService = (serviceId: string, deltaX: number, deltaY: number) => {
    setCanvasServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, x: service.x + deltaX, y: service.y + deltaY }
          : service
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Enhanced Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 relative z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Services
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Architecture Builder
              </h1>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Architecture name..."
                  value={architectureName}
                  onChange={(e) => setArchitectureName(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowGrid(!showGrid)}
                variant={showGrid ? "default" : "outline"}
                size="sm"
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                onClick={() => setShowCertPaths(!showCertPaths)}
                variant={showCertPaths ? "default" : "outline"}
                size="sm"
              >
                <Award className="w-4 h-4 mr-2" />
                Cert Paths
              </Button>
              <Button
                onClick={() => setShowScoring(!showScoring)}
                variant={showScoring ? "default" : "outline"}
                size="sm"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Scoring
              </Button>
              <Select value={connectionType} onValueChange={(value: Connection['type']) => setConnectionType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sync">Sync</SelectItem>
                  <SelectItem value="async">Async</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setIsConnecting(!isConnecting)}
                variant={isConnecting ? "default" : "outline"}
                size="sm"
              >
                <Share className="w-4 h-4 mr-2" />
                {isConnecting ? "Cancel" : "Connect"}
              </Button>
              <Button onClick={copyArchitecture} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={exportAsJSON} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="flex items-center space-x-1 border-r pr-2">
                <Button onClick={handleZoomOut} variant="outline" size="sm">
                  -
                </Button>
                <span className="text-xs w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                <Button onClick={handleZoomIn} variant="outline" size="sm">
                  +
                </Button>
                <Button onClick={handleResetView} variant="outline" size="sm">
                  Reset
                </Button>
              </div>
              <Button onClick={clearCanvas} variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Enhanced Sidebar */}
        <div className="w-80 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 overflow-hidden relative z-10 flex flex-col">
          <Tabs defaultValue="services" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-3">
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={`grid ${(showCertPaths && showScoring) ? 'grid-cols-1 gap-1' : 'grid-cols-2 gap-2'}`}>
                {filteredServices?.map((service) => (
                  <div
                    key={service.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, service)}
                    className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 cursor-grab hover:shadow-md transition-all duration-200 active:cursor-grabbing"
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced AI Suggestions */}
              {suggestions.length > 0 && (
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-purple-500" />
                    AI Suggestions
                  </h4>
                  <div className="space-y-3">
                    {suggestions
                      .sort((a, b) => {
                        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                      })
                      .map((suggestion, index) => (
                      <Card key={index} className="p-3 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-xs flex items-center space-x-1 ${getSuggestionBadgeColor(suggestion.priority)}`}>
                              {getCategoryIcon(suggestion.category)}
                              <span>{suggestion.priority.toUpperCase()}</span>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Impact: {suggestion.impact}/10
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                          {suggestion.message}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                          {suggestion.reasoning}
                        </p>
                        {suggestion.suggestedServices.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {suggestion.suggestedServices.map((serviceName) => (
                              <Button
                                key={serviceName}
                                onClick={() => addSuggestedService(serviceName)}
                                size="sm"
                                variant="outline"
                                className="text-xs h-6"
                              >
                                + {serviceName}
                              </Button>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="p-4 overflow-y-auto flex-1">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Architecture Templates
                </h3>
                {ARCHITECTURE_TEMPLATES.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs w-fit">
                        {template.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                        {template.description}
                      </p>
                      <Button 
                        onClick={() => loadTemplate(template)}
                        size="sm" 
                        className="w-full"
                      >
                        <Layers className="w-3 h-3 mr-1" />
                        Load Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Canvas Settings</h3>

                <div className="space-y-2">
                  <Label htmlFor="grid-size">Grid Size</Label>
                  <Select value={gridSize.toString()} onValueChange={(value) => setGridSize(Number(value))}>
                    <SelectTrigger id="grid-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10px</SelectItem>
                      <SelectItem value="20">20px</SelectItem>
                      <SelectItem value="30">30px</SelectItem>
                      <SelectItem value="40">40px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-grid">Show Grid</Label>
                  <Button
                    id="show-grid"
                    onClick={() => setShowGrid(!showGrid)}
                    variant={showGrid ? "default" : "outline"}
                    size="sm"
                  >
                    {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Connection Types</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-blue-500"></div>
                      <span>Sync - Real-time calls</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-green-500"></div>
                      <span>Async - Event-driven</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-purple-500"></div>
                      <span>Data - Data flow</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-yellow-500"></div>
                      <span>Network - Network connection</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>



          {/* Certification Paths */}
          {showCertPaths && (
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 space-y-4 max-h-96 overflow-y-auto">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                🎯 Recommended Certification Path
              </h4>

              {/* Primary Certification Recommendation */}
              {Array.from(getHighlightedCerts()).length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200">Primary Track</h5>
                    <Badge variant="default" className="bg-blue-600">Recommended</Badge>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    {Array.from(getHighlightedCerts())[0]}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="flex-1 bg-blue-200 dark:bg-blue-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400">33% match</span>
                  </div>
                </div>
              )}

              {/* All Relevant Certifications */}
              <div>
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">All Relevant Paths</h5>
                <div className="space-y-2">
                  {Array.from(getHighlightedCerts()).map((cert, index) => {
                    const matchPercentage = Math.max(20, 80 - (index * 15));
                    const isHighPriority = matchPercentage >= 60;

                    return (
                      <div key={cert} className={`p-2 rounded border ${isHighPriority ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {cert.replace("AWS Certified ", "").replace(" – ", " ")}
                          </span>
                          <div className="flex items-center space-x-1">
                            {isHighPriority && <span className="text-xs text-green-600 dark:text-green-400">🎯</span>}
                            <span className={`text-xs ${isHighPriority ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                              {matchPercentage}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${isHighPriority ? 'bg-green-500' : 'bg-gray-400'}`}
                              style={{ width: `${matchPercentage}%` }}
                            ></div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              // Could open learning resources or detailed path
                              console.log(`Opening resources for ${cert}`);
                            }}
                          >
                            Learn
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Learning Recommendations */}
              {Array.from(getHighlightedCerts()).length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">💡 Next Steps</h5>
                  <div className="space-y-1 text-xs text-yellow-700 dark:text-yellow-300">
                    <p>• Focus on services you've already selected</p>
                    <p>• Consider {Array.from(getHighlightedCerts())[0]?.replace("AWS Certified ", "")} path</p>
                    <p>• Practice with hands-on labs for your architecture</p>
                  </div>
                </div>
              )}

              {/* Learning Resources */}
              <div className="mt-6">
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">📚 Recommended Learning</h5>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Solutions Architect Track</div>
                    <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">3-4 months • Associate Level</div>
                    <div className="flex items-center mt-2 space-x-2">
                      <div className="flex-1 bg-blue-200 dark:bg-blue-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
                      </div>
                      <span className="text-xs text-blue-600 dark:text-blue-400">25% complete</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <div className="text-sm font-medium text-green-800 dark:text-green-200">Developer Track</div>
                    <div className="text-xs text-green-600 dark:text-green-300 mt-1">2-3 months • Associate Level</div>
                    <div className="flex items-center mt-2 space-x-2">
                      <div className="flex-1 bg-green-200 dark:bg-green-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-1/3"></div>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400">33% complete</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 mt-6">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // Navigate to learning paths
                    window.location.href = '/learning-paths';
                  }}
                >
                  🚀 Start Learning Path
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // Export certification roadmap
                    const certs = Array.from(getHighlightedCerts());
                    const roadmap = {
                      architecture: placedServices.map(s => s.name),
                      recommendedCertifications: certs,
                      primaryTrack: certs[0],
                      createdAt: new Date().toISOString()
                    };

                    const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'certification-roadmap.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  📄 Export Roadmap
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // Schedule study plan
                    alert('Study plan scheduled! Check your email for weekly milestones.');
                  }}
                >
                  📅 Schedule Study Plan
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Canvas */}
        <div className="flex-1 relative overflow-hidden z-0 flex">
          <div
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            className={`${showScoring ? 'flex-1' : 'w-full'} h-full relative overflow-hidden ${
              theme === "dark" ? "bg-slate-900" : "bg-gray-50"
            } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              backgroundImage: showGrid ? `radial-gradient(circle, ${
                theme === "dark" ? "#374151" : "#9CA3AF"
              } 1px, transparent 1px)` : 'none',
              backgroundSize: `${gridSize * zoomLevel}px ${gridSize * zoomLevel}px`,
              backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
            }}
          >
            <div
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: '0 0',
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            >
            {/* Enhanced Drop Zone */}
            {canvasServices.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Zap className="w-16 h-16 mx-auto text-aws-orange mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Build Amazing Architectures
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Drag services from the sidebar or load a template to get started
                  </p>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <Layers className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Connections with Labels */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((connection) => {
                const fromService = canvasServices.find(cs => cs.id === connection.fromServiceId);
                const toService = canvasServices.find(cs => cs.id === connection.toServiceId);

                if (!fromService || !toService) return null;

                const fromX = fromService.x + 40;
                const fromY = fromService.y + 40;
                const toX = toService.x + 40;
                const toY = toService.y + 40;
                const midX = (fromX + toX) / 2;
                const midY = (fromY + toY) / 2;

                const connectionColor = getConnectionColor(connection.type);

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
                          fill={connectionColor}
                        />
                      </marker>
                    </defs>
                    <line
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      stroke={connectionColor}
                      strokeWidth="3"
                      markerEnd={`url(#arrowhead-${connection.id})`}
                      strokeDasharray={connection.type === 'async' ? '5,5' : 'none'}
                    />
                    {connection.label && (
                      <text
                        x={midX}
                        y={midY - 5}
                        textAnchor="middle"
                        className="text-xs fill-current text-gray-700 dark:text-gray-300"
                        style={{ fontSize: '10px' }}
                      >
                        {connection.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Enhanced Service Nodes */}
            {canvasServices.map((canvasService) => (
              <div
                key={canvasService.id}
                className={`absolute w-20 h-20 rounded-lg border-2 cursor-move transition-all duration-200 ${
                  selectedService === canvasService.id
                    ? "border-aws-orange shadow-lg scale-110"
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
                onMouseDown={(e) => handleServiceMouseDown(e, canvasService.id)}
                onClick={() => handleServiceClick(canvasService.id)}
              >
                <div className="flex flex-col items-center justify-center h-full text-white p-1">
                  <div className="text-xs font-bold text-center leading-tight">
                    {canvasService.service.name}
                  </div>
                </div>

                {/* Service Label */}
                {canvasService.label && canvasService.label !== canvasService.service.name && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {canvasService.label}
                  </div>
                )}

                {/* Enhanced Remove Button */}
                {selectedService === canvasService.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeService(canvasService.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* Enhanced Connection Instructions */}
            {isConnecting && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg z-20">
                <div className="text-sm font-medium mb-2">
                  {connectingFrom ? "Click another service to connect" : "Click a service to start connecting"}
                </div>
                <div className="text-xs opacity-90">
                  Connection type: <span className="font-semibold">{connectionType}</span>
                </div>
              </div>
            )}

            {/* Enhanced Architecture Stats */}
            {canvasServices.length > 0 && (
              <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border min-w-48 z-20">
                <div className="text-xs space-y-2">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Trophy className="w-3 h-3 mr-1" />
                    Architecture Overview
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600 dark:text-gray-300">Services:</div>
                    <div className="font-medium">{canvasServices.length}</div>
                    <div className="text-gray-600 dark:text-gray-300">Connections:</div>
                    <div className="font-medium">{connections.length}</div>
                    <div className="text-gray-600 dark:text-gray-300">Categories:</div>
                    <div className="font-medium">{new Set(canvasServices.map(cs => cs.service.category)).size}</div>
                    {architectureScore && (
                      <>
                        <div className="text-gray-600 dark:text-gray-300">Score:</div>
                        <div className={`font-bold ${
                          architectureScore.grade === 'A+' || architectureScore.grade === 'A' ? 'text-green-500' :
                          architectureScore.grade === 'B+' || architectureScore.grade === 'B' ? 'text-blue-500' :
                          architectureScore.grade === 'C+' || architectureScore.grade === 'C' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {architectureScore.grade} ({architectureScore.total}/100)
                        </div>
                      </>
                    )}
                  </div>
                  {suggestions.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 dark:border-slate-600">
                      <div className="text-gray-600 dark:text-gray-300">
                        {suggestions.filter(s => s.priority === 'critical').length > 0 && (
                          <div className="text-red-500 font-medium">⚠ {suggestions.filter(s => s.priority === 'critical').length} Critical Issues</div>
                        )}
                        <div>💡 {suggestions.length} Suggestions Available</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Right Scoring Panel */}
          {showScoring && architectureScore && (
            <div className="w-80 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Architecture Score</h4>
                  <div className={`text-4xl font-bold mb-2 ${
                    architectureScore.grade === 'A+' || architectureScore.grade === 'A' ? 'text-green-500' :
                    architectureScore.grade === 'B+' || architectureScore.grade === 'B' ? 'text-blue-500' :
                    architectureScore.grade === 'C+' || architectureScore.grade === 'C' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {architectureScore.grade}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {architectureScore.total}/100 points
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Security</span>
                      <span>{architectureScore.security}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{width: `${architectureScore.security}%`}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Performance</span>
                      <span>{architectureScore.performance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${architectureScore.performance}%`}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Cost Efficiency</span>
                      <span>{architectureScore.costEfficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: `${architectureScore.costEfficiency}%`}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Reliability</span>
                      <span>{architectureScore.reliability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: `${architectureScore.reliability}%`}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Scalability</span>
                      <span>{architectureScore.scalability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${architectureScore.scalability}%`}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Best Practices</span>
                      <span>{architectureScore.bestPractices}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{width: `${architectureScore.bestPractices}%`}}></div>
                    </div>
                  </div>
                </div>

                {detailedFeedback && (
                  <div className="space-y-3 text-xs">
                    {detailedFeedback.strengths.length > 0 && (
                      <div>
                        <h5 className="font-medium text-green-600 dark:text-green-400 mb-1">✓ Strengths</h5>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                          {detailedFeedback.strengths.slice(0, 2).map((strength, i) => (
                            <li key={i}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {detailedFeedback.weaknesses.length > 0 && (
                      <div>
                        <h5 className="font-medium text-red-600 dark:text-red-400 mb-1">⚠ Areas to Improve</h5>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                          {detailedFeedback.weaknesses.slice(0, 2).map((weakness, i) => (
                            <li key={i}>• {weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {detailedFeedback.certificationAlignment.length > 0 && (
                      <div>
                        <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-1">📜 Certification Alignment</h5>
                        <div className="space-y-1">
                          {detailedFeedback.certificationAlignment.slice(0, 2).map((cert, i) => (
                            <Badge key={i} variant="outline" className="text-xs block w-full">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
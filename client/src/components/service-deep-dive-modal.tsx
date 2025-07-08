
import { type AwsService } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, BookOpen, Youtube, Award, Zap, Brain, Link2, ArrowRight, PlayCircle } from "lucide-react";
import { useState } from "react";

interface ServiceDeepDiveModalProps {
  service: AwsService | null;
  isOpen: boolean;
  onClose: () => void;
}

// Comprehensive service details for all major AWS services
const getServiceDetails = (serviceName: string) => {
  const serviceDetails: Record<string, any> = {
    // COMPUTE SERVICES
    "EC2": {
      description: "Virtual servers in the cloud that you can launch in minutes. Think of EC2 as renting a computer in Amazon's data center that you can configure and control remotely.",
      useCases: ["Web application hosting", "Development and testing environments", "High-performance computing", "Backup and disaster recovery"],
      relatedServices: ["VPC", "EBS", "CloudWatch", "IAM"],
      learningResources: [
        { type: "tutorial", title: "EC2 Getting Started Guide", url: "https://docs.aws.amazon.com/ec2/latest/userguide/EC2_GetStarted.html" },
        { type: "video", title: "EC2 Fundamentals", url: "https://www.youtube.com/results?search_query=aws+ec2+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "Lambda": {
      description: "Run code without thinking about servers. Upload your code and Lambda takes care of everything required to run and scale your code with high availability.",
      useCases: ["Serverless web applications", "Real-time file processing", "API backends", "Automated tasks and workflows"],
      relatedServices: ["API Gateway", "S3", "DynamoDB", "CloudWatch"],
      learningResources: [
        { type: "tutorial", title: "Lambda Getting Started", url: "https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html" },
        { type: "video", title: "Serverless with Lambda", url: "https://www.youtube.com/results?search_query=aws+lambda+serverless+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "ECS": {
      description: "Fully managed container orchestration service. Run and scale containerized applications without managing servers or clusters.",
      useCases: ["Microservices architecture", "Batch processing", "Web applications", "Machine learning workloads"],
      relatedServices: ["EC2", "Fargate", "ECR", "CloudWatch"],
      learningResources: [
        { type: "tutorial", title: "ECS Getting Started", url: "https://docs.aws.amazon.com/ecs/latest/developerguide/getting-started.html" },
        { type: "video", title: "ECS Tutorial", url: "https://www.youtube.com/results?search_query=aws+ecs+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "EKS": {
      description: "Managed Kubernetes service that makes it easy to run Kubernetes on AWS without needing to install and operate your own Kubernetes control plane.",
      useCases: ["Container orchestration", "Cloud-native applications", "Hybrid deployments", "CI/CD pipelines"],
      relatedServices: ["EC2", "Fargate", "ECR", "IAM"],
      learningResources: [
        { type: "tutorial", title: "EKS Getting Started", url: "https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html" },
        { type: "video", title: "EKS Workshop", url: "https://www.youtube.com/results?search_query=aws+eks+kubernetes+tutorial" },
        { type: "certification", title: "Solutions Architect Professional", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" }
      ]
    },
    "Fargate": {
      description: "Serverless compute engine for containers. Run containers without managing servers or clusters.",
      useCases: ["Serverless containers", "Microservices", "Batch jobs", "Event-driven applications"],
      relatedServices: ["ECS", "EKS", "CloudWatch", "IAM"],
      learningResources: [
        { type: "tutorial", title: "Fargate Getting Started", url: "https://docs.aws.amazon.com/AmazonECS/latest/userguide/getting-started-fargate.html" },
        { type: "video", title: "Serverless Containers", url: "https://www.youtube.com/results?search_query=aws+fargate+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "Batch": {
      description: "Fully managed service for running batch computing workloads at any scale. Efficiently provision optimal compute resources.",
      useCases: ["High-performance computing", "Data processing", "Machine learning training", "Financial modeling"],
      relatedServices: ["EC2", "ECS", "Lambda", "S3"],
      learningResources: [
        { type: "tutorial", title: "Batch Getting Started", url: "https://docs.aws.amazon.com/batch/latest/userguide/getting-started.html" },
        { type: "video", title: "AWS Batch Tutorial", url: "https://www.youtube.com/results?search_query=aws+batch+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "Lightsail": {
      description: "Simple virtual private servers with everything you need to build an application or website, plus a cost-effective monthly plan.",
      useCases: ["Simple websites", "WordPress hosting", "Development environments", "Small applications"],
      relatedServices: ["Route 53", "CloudFront", "RDS", "S3"],
      learningResources: [
        { type: "tutorial", title: "Lightsail Getting Started", url: "https://docs.aws.amazon.com/lightsail/latest/userguide/getting-started-with-amazon-lightsail.html" },
        { type: "video", title: "Lightsail Tutorial", url: "https://www.youtube.com/results?search_query=aws+lightsail+tutorial" },
        { type: "certification", title: "Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" }
      ]
    },

    // STORAGE SERVICES
    "S3": {
      description: "Secure, durable, and scalable object storage. Store and retrieve any amount of data from anywhere on the web. Perfect for websites, mobile apps, backup, and data archiving.",
      useCases: ["Static website hosting", "Data backup and archiving", "Content distribution", "Data lakes for analytics"],
      relatedServices: ["CloudFront", "IAM", "Lambda", "Athena"],
      learningResources: [
        { type: "tutorial", title: "S3 Getting Started", url: "https://docs.aws.amazon.com/s3/latest/userguide/GetStartedWithS3.html" },
        { type: "video", title: "S3 Deep Dive", url: "https://www.youtube.com/results?search_query=aws+s3+tutorial" },
        { type: "certification", title: "Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" }
      ]
    },
    "EBS": {
      description: "High-performance block storage service designed for use with Amazon EC2 instances. Provides persistent storage that persists independently from EC2 instances.",
      useCases: ["Database storage", "File systems", "Boot volumes", "Enterprise applications"],
      relatedServices: ["EC2", "CloudWatch", "Data Lifecycle Manager", "Backup"],
      learningResources: [
        { type: "tutorial", title: "EBS Getting Started", url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-getting-started.html" },
        { type: "video", title: "EBS Deep Dive", url: "https://www.youtube.com/results?search_query=aws+ebs+tutorial" },
        { type: "certification", title: "SysOps Administrator", url: "https://aws.amazon.com/certification/certified-sysops-admin-associate/" }
      ]
    },
    "EFS": {
      description: "Fully managed NFS file system for use with AWS services and on-premises resources. Scales automatically to petabytes without disrupting applications.",
      useCases: ["Content management", "Web serving", "Data analytics", "Media processing"],
      relatedServices: ["EC2", "Lambda", "ECS", "EKS"],
      learningResources: [
        { type: "tutorial", title: "EFS Getting Started", url: "https://docs.aws.amazon.com/efs/latest/ug/getting-started.html" },
        { type: "video", title: "EFS Tutorial", url: "https://www.youtube.com/results?search_query=aws+efs+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "FSx": {
      description: "Fully managed file systems optimized for compute-intensive workloads. Provides high-performance file systems for HPC, machine learning, and media processing.",
      useCases: ["High-performance computing", "Machine learning", "Media processing", "Electronic design automation"],
      relatedServices: ["EC2", "S3", "DataSync", "Direct Connect"],
      learningResources: [
        { type: "tutorial", title: "FSx Getting Started", url: "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/getting-started.html" },
        { type: "video", title: "FSx Tutorial", url: "https://www.youtube.com/results?search_query=aws+fsx+tutorial" },
        { type: "certification", title: "Solutions Architect Professional", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" }
      ]
    },
    "Storage Gateway": {
      description: "Hybrid cloud storage service that connects on-premises software appliances with cloud-based storage to provide seamless integration.",
      useCases: ["Hybrid cloud storage", "Backup to cloud", "Archive to cloud", "Disaster recovery"],
      relatedServices: ["S3", "EC2", "VPC", "Direct Connect"],
      learningResources: [
        { type: "tutorial", title: "Storage Gateway Getting Started", url: "https://docs.aws.amazon.com/storagegateway/latest/userguide/getting-started.html" },
        { type: "video", title: "Storage Gateway Tutorial", url: "https://www.youtube.com/results?search_query=aws+storage+gateway+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },

    // DATABASE SERVICES
    "RDS": {
      description: "Managed relational database service that makes it easy to set up, operate, and scale databases in the cloud. Supports MySQL, PostgreSQL, Oracle, SQL Server, and more.",
      useCases: ["Web application databases", "E-commerce platforms", "CRM systems", "Data warehousing"],
      relatedServices: ["VPC", "IAM", "CloudWatch", "EC2"],
      learningResources: [
        { type: "tutorial", title: "RDS Getting Started", url: "https://docs.aws.amazon.com/rds/latest/userguide/CHAP_GettingStarted.html" },
        { type: "video", title: "RDS Tutorial", url: "https://www.youtube.com/results?search_query=aws+rds+tutorial" },
        { type: "certification", title: "Database Specialty", url: "https://aws.amazon.com/certification/certified-database-specialty/" }
      ]
    },
    "DynamoDB": {
      description: "Fast and flexible NoSQL database service for applications that need consistent, single-digit millisecond latency at any scale.",
      useCases: ["Mobile applications", "Gaming", "IoT applications", "Real-time analytics"],
      relatedServices: ["Lambda", "API Gateway", "CloudWatch", "IAM"],
      learningResources: [
        { type: "tutorial", title: "DynamoDB Getting Started", url: "https://docs.aws.amazon.com/dynamodb/latest/developerguide/GettingStartedDynamoDB.html" },
        { type: "video", title: "DynamoDB Deep Dive", url: "https://www.youtube.com/results?search_query=aws+dynamodb+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "ElastiCache": {
      description: "Fully managed in-memory data store service. Improve application performance by retrieving data from fast, managed, in-memory caches.",
      useCases: ["Application caching", "Session storage", "Real-time analytics", "Gaming leaderboards"],
      relatedServices: ["EC2", "RDS", "VPC", "CloudWatch"],
      learningResources: [
        { type: "tutorial", title: "ElastiCache Getting Started", url: "https://docs.aws.amazon.com/elasticache/latest/userguide/GettingStarted.html" },
        { type: "video", title: "ElastiCache Tutorial", url: "https://www.youtube.com/results?search_query=aws+elasticache+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "Neptune": {
      description: "Fully managed graph database service. Build and run applications that work with highly connected datasets using popular graph query languages.",
      useCases: ["Social networks", "Recommendation engines", "Fraud detection", "Knowledge graphs"],
      relatedServices: ["IAM", "VPC", "CloudWatch", "Lambda"],
      learningResources: [
        { type: "tutorial", title: "Neptune Getting Started", url: "https://docs.aws.amazon.com/neptune/latest/userguide/get-started.html" },
        { type: "video", title: "Neptune Tutorial", url: "https://www.youtube.com/results?search_query=aws+neptune+graph+database" },
        { type: "certification", title: "Database Specialty", url: "https://aws.amazon.com/certification/certified-database-specialty/" }
      ]
    },
    "DocumentDB": {
      description: "Fully managed MongoDB-compatible database service. Operate critical document workloads at virtually any scale without managing infrastructure.",
      useCases: ["Content management", "Catalogs", "User profiles", "Real-time analytics"],
      relatedServices: ["VPC", "IAM", "CloudWatch", "Lambda"],
      learningResources: [
        { type: "tutorial", title: "DocumentDB Getting Started", url: "https://docs.aws.amazon.com/documentdb/latest/developerguide/getting-started.html" },
        { type: "video", title: "DocumentDB Tutorial", url: "https://www.youtube.com/results?search_query=aws+documentdb+tutorial" },
        { type: "certification", title: "Database Specialty", url: "https://aws.amazon.com/certification/certified-database-specialty/" }
      ]
    },
    "Timestream": {
      description: "Fast, scalable, and serverless time series database service for IoT and operational applications that makes it easy to store and analyze trillions of events per day.",
      useCases: ["IoT applications", "Industrial telemetry", "Application monitoring", "DevOps monitoring"],
      relatedServices: ["IoT Core", "Kinesis", "Lambda", "CloudWatch"],
      learningResources: [
        { type: "tutorial", title: "Timestream Getting Started", url: "https://docs.aws.amazon.com/timestream/latest/developerguide/getting-started.html" },
        { type: "video", title: "Timestream Tutorial", url: "https://www.youtube.com/results?search_query=aws+timestream+tutorial" },
        { type: "certification", title: "Database Specialty", url: "https://aws.amazon.com/certification/certified-database-specialty/" }
      ]
    },

    // NETWORKING SERVICES
    "VPC": {
      description: "Virtual private cloud that provides a logically isolated section of AWS where you can launch resources in a virtual network that you define.",
      useCases: ["Secure network isolation", "Multi-tier applications", "Hybrid cloud connectivity", "Network segmentation"],
      relatedServices: ["EC2", "RDS", "NAT Gateway", "Internet Gateway"],
      learningResources: [
        { type: "tutorial", title: "VPC Getting Started", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-getting-started.html" },
        { type: "video", title: "VPC Deep Dive", url: "https://www.youtube.com/results?search_query=aws+vpc+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "CloudFront": {
      description: "Global content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency.",
      useCases: ["Website acceleration", "Video streaming", "API acceleration", "Static content delivery"],
      relatedServices: ["S3", "EC2", "Route 53", "WAF"],
      learningResources: [
        { type: "tutorial", title: "CloudFront Getting Started", url: "https://docs.aws.amazon.com/cloudfront/latest/developerguide/GettingStarted.html" },
        { type: "video", title: "CloudFront Tutorial", url: "https://www.youtube.com/results?search_query=aws+cloudfront+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "Route 53": {
      description: "Highly available and scalable cloud Domain Name System (DNS) web service designed to route end users to internet applications.",
      useCases: ["Domain registration", "DNS routing", "Health checking", "Traffic management"],
      relatedServices: ["CloudFront", "ELB", "EC2", "S3"],
      learningResources: [
        { type: "tutorial", title: "Route 53 Getting Started", url: "https://docs.aws.amazon.com/route53/latest/developerguide/getting-started.html" },
        { type: "video", title: "Route 53 Tutorial", url: "https://www.youtube.com/results?search_query=aws+route53+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "API Gateway": {
      description: "Fully managed service for creating, publishing, maintaining, monitoring, and securing REST, HTTP, and WebSocket APIs at any scale.",
      useCases: ["RESTful APIs", "WebSocket APIs", "Microservices", "Mobile backends"],
      relatedServices: ["Lambda", "DynamoDB", "Cognito", "CloudWatch"],
      learningResources: [
        { type: "tutorial", title: "API Gateway Getting Started", url: "https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html" },
        { type: "video", title: "API Gateway Tutorial", url: "https://www.youtube.com/results?search_query=aws+api+gateway+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "Direct Connect": {
      description: "Network service that provides an alternative to using the internet to connect to AWS. Create a dedicated network connection from your premises to AWS.",
      useCases: ["Hybrid cloud connectivity", "Data transfer cost reduction", "Consistent network performance", "Private connectivity"],
      relatedServices: ["VPC", "VPN", "Transit Gateway", "Route 53"],
      learningResources: [
        { type: "tutorial", title: "Direct Connect Getting Started", url: "https://docs.aws.amazon.com/directconnect/latest/userguide/getting_started.html" },
        { type: "video", title: "Direct Connect Tutorial", url: "https://www.youtube.com/results?search_query=aws+direct+connect+tutorial" },
        { type: "certification", title: "Advanced Networking Specialty", url: "https://aws.amazon.com/certification/certified-advanced-networking-specialty/" }
      ]
    },
    "ELB": {
      description: "Automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, IP addresses, and Lambda functions.",
      useCases: ["High availability", "Auto scaling", "Health checking", "SSL termination"],
      relatedServices: ["EC2", "Auto Scaling", "Route 53", "CloudWatch"],
      learningResources: [
        { type: "tutorial", title: "ELB Getting Started", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/getting-started.html" },
        { type: "video", title: "Load Balancer Tutorial", url: "https://www.youtube.com/results?search_query=aws+elastic+load+balancer+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },

    // SECURITY SERVICES
    "IAM": {
      description: "Identity and Access Management service that helps you securely control access to AWS services and resources for your users.",
      useCases: ["User management", "Access control", "Role-based permissions", "Multi-factor authentication"],
      relatedServices: ["Organizations", "SSO", "CloudTrail", "GuardDuty"],
      learningResources: [
        { type: "tutorial", title: "IAM Getting Started", url: "https://docs.aws.amazon.com/iam/latest/userguide/getting-started.html" },
        { type: "video", title: "IAM Tutorial", url: "https://www.youtube.com/results?search_query=aws+iam+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "GuardDuty": {
      description: "Threat detection service that uses machine learning, anomaly detection, and integrated threat intelligence to identify threats in your AWS environment.",
      useCases: ["Threat detection", "Security monitoring", "Incident response", "Compliance"],
      relatedServices: ["CloudTrail", "VPC Flow Logs", "DNS logs", "Security Hub"],
      learningResources: [
        { type: "tutorial", title: "GuardDuty Getting Started", url: "https://docs.aws.amazon.com/guardduty/latest/ug/getting-started.html" },
        { type: "video", title: "GuardDuty Tutorial", url: "https://www.youtube.com/results?search_query=aws+guardduty+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "KMS": {
      description: "Key Management Service that makes it easy to create and manage cryptographic keys and control their use across a wide range of AWS services.",
      useCases: ["Data encryption", "Key management", "Digital signing", "Certificate management"],
      relatedServices: ["S3", "EBS", "RDS", "Lambda"],
      learningResources: [
        { type: "tutorial", title: "KMS Getting Started", url: "https://docs.aws.amazon.com/kms/latest/developerguide/getting-started.html" },
        { type: "video", title: "KMS Tutorial", url: "https://www.youtube.com/results?search_query=aws+kms+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "WAF": {
      description: "Web application firewall that helps protect your web applications or APIs against common web exploits that may affect availability, compromise security, or consume excessive resources.",
      useCases: ["Web application protection", "API security", "DDoS mitigation", "Bot management"],
      relatedServices: ["CloudFront", "ALB", "API Gateway", "Shield"],
      learningResources: [
        { type: "tutorial", title: "WAF Getting Started", url: "https://docs.aws.amazon.com/waf/latest/developerguide/getting-started.html" },
        { type: "video", title: "WAF Tutorial", url: "https://www.youtube.com/results?search_query=aws+waf+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "Shield": {
      description: "Managed Distributed Denial of Service (DDoS) protection service that safeguards applications running on AWS.",
      useCases: ["DDoS protection", "Application availability", "Infrastructure protection", "Attack mitigation"],
      relatedServices: ["CloudFront", "Route 53", "ELB", "WAF"],
      learningResources: [
        { type: "tutorial", title: "Shield Getting Started", url: "https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html" },
        { type: "video", title: "Shield Tutorial", url: "https://www.youtube.com/results?search_query=aws+shield+ddos+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "Cognito": {
      description: "Identity management service that provides authentication, authorization, and user management for web and mobile applications.",
      useCases: ["User authentication", "Social sign-in", "Mobile app security", "API authorization"],
      relatedServices: ["API Gateway", "Lambda", "S3", "DynamoDB"],
      learningResources: [
        { type: "tutorial", title: "Cognito Getting Started", url: "https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started.html" },
        { type: "video", title: "Cognito Tutorial", url: "https://www.youtube.com/results?search_query=aws+cognito+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "Secrets Manager": {
      description: "Service that helps you protect secrets needed to access your applications, services, and IT resources without the upfront investment and on-going maintenance costs of operating your own infrastructure.",
      useCases: ["Database credentials", "API keys", "OAuth tokens", "Application secrets"],
      relatedServices: ["RDS", "Lambda", "IAM", "CloudFormation"],
      learningResources: [
        { type: "tutorial", title: "Secrets Manager Getting Started", url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/getting-started.html" },
        { type: "video", title: "Secrets Manager Tutorial", url: "https://www.youtube.com/results?search_query=aws+secrets+manager+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },

    // MACHINE LEARNING SERVICES
    "SageMaker": {
      description: "Fully managed service that provides every developer and data scientist with the ability to build, train, and deploy machine learning models quickly.",
      useCases: ["Machine learning model development", "Data preparation", "Model training", "Model deployment"],
      relatedServices: ["S3", "EC2", "Lambda", "CloudWatch"],
      learningResources: [
        { type: "tutorial", title: "SageMaker Getting Started", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/getting-started.html" },
        { type: "video", title: "SageMaker Tutorial", url: "https://www.youtube.com/results?search_query=aws+sagemaker+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },
    "Rekognition": {
      description: "Image and video analysis service that makes it easy to add image and video analysis capabilities to your applications using proven, highly scalable deep learning technology.",
      useCases: ["Image analysis", "Facial recognition", "Object detection", "Content moderation"],
      relatedServices: ["S3", "Lambda", "API Gateway", "DynamoDB"],
      learningResources: [
        { type: "tutorial", title: "Rekognition Getting Started", url: "https://docs.aws.amazon.com/rekognition/latest/dg/getting-started.html" },
        { type: "video", title: "Rekognition Tutorial", url: "https://www.youtube.com/results?search_query=aws+rekognition+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },
    "Comprehend": {
      description: "Natural language processing (NLP) service that uses machine learning to find insights and relationships in text.",
      useCases: ["Sentiment analysis", "Entity recognition", "Language detection", "Topic modeling"],
      relatedServices: ["S3", "Lambda", "Kinesis", "Transcribe"],
      learningResources: [
        { type: "tutorial", title: "Comprehend Getting Started", url: "https://docs.aws.amazon.com/comprehend/latest/dg/getting-started.html" },
        { type: "video", title: "Comprehend Tutorial", url: "https://www.youtube.com/results?search_query=aws+comprehend+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },
    "Textract": {
      description: "Machine learning service that automatically extracts text, handwriting, and data from scanned documents that goes beyond simple optical character recognition (OCR).",
      useCases: ["Document processing", "Form extraction", "Table extraction", "Handwriting recognition"],
      relatedServices: ["S3", "Lambda", "Comprehend", "DynamoDB"],
      learningResources: [
        { type: "tutorial", title: "Textract Getting Started", url: "https://docs.aws.amazon.com/textract/latest/dg/getting-started.html" },
        { type: "video", title: "Textract Tutorial", url: "https://www.youtube.com/results?search_query=aws+textract+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },
    "Translate": {
      description: "Neural machine translation service that delivers fast, high-quality, and affordable language translation.",
      useCases: ["Content localization", "Real-time translation", "Document translation", "Website translation"],
      relatedServices: ["S3", "Lambda", "Comprehend", "Polly"],
      learningResources: [
        { type: "tutorial", title: "Translate Getting Started", url: "https://docs.aws.amazon.com/translate/latest/dg/getting-started.html" },
        { type: "video", title: "Translate Tutorial", url: "https://www.youtube.com/results?search_query=aws+translate+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },

    // ANALYTICS SERVICES
    "Redshift": {
      description: "Fast, simple, cost-effective data warehousing service that can extend queries to exabytes of data in data lakes.",
      useCases: ["Data warehousing", "Business intelligence", "Analytics", "Data lakes"],
      relatedServices: ["S3", "QuickSight", "Glue", "Athena"],
      learningResources: [
        { type: "tutorial", title: "Redshift Getting Started", url: "https://docs.aws.amazon.com/redshift/latest/gsg/getting-started.html" },
        { type: "video", title: "Redshift Tutorial", url: "https://www.youtube.com/results?search_query=aws+redshift+tutorial" },
        { type: "certification", title: "Data Analytics Specialty", url: "https://aws.amazon.com/certification/certified-data-analytics-specialty/" }
      ]
    },
    "Athena": {
      description: "Interactive query service that makes it easy to analyze data in Amazon S3 using standard SQL without managing any infrastructure.",
      useCases: ["Ad-hoc querying", "Log analysis", "Data lake analytics", "Cost optimization"],
      relatedServices: ["S3", "Glue", "QuickSight", "CloudTrail"],
      learningResources: [
        { type: "tutorial", title: "Athena Getting Started", url: "https://docs.aws.amazon.com/athena/latest/ug/getting-started.html" },
        { type: "video", title: "Athena Tutorial", url: "https://www.youtube.com/results?search_query=aws+athena+tutorial" },
        { type: "certification", title: "Data Analytics Specialty", url: "https://aws.amazon.com/certification/certified-data-analytics-specialty/" }
      ]
    },
    "Kinesis": {
      description: "Platform for streaming data on AWS, offering powerful services to make it easy to load and analyze streaming data.",
      useCases: ["Real-time analytics", "Log and event data collection", "IoT data processing", "Clickstream analysis"],
      relatedServices: ["Lambda", "S3", "Redshift", "ElasticSearch"],
      learningResources: [
        { type: "tutorial", title: "Kinesis Getting Started", url: "https://docs.aws.amazon.com/kinesis/latest/dev/getting-started.html" },
        { type: "video", title: "Kinesis Tutorial", url: "https://www.youtube.com/results?search_query=aws+kinesis+tutorial" },
        { type: "certification", title: "Data Analytics Specialty", url: "https://aws.amazon.com/certification/certified-data-analytics-specialty/" }
      ]
    },
    "EMR": {
      description: "Big data platform for processing vast amounts of data using open source tools such as Apache Spark, Apache Hive, Apache HBase, Apache Flink, and Apache Hudi.",
      useCases: ["Big data processing", "Machine learning", "Data transformation", "Log analysis"],
      relatedServices: ["S3", "EC2", "Redshift", "Glue"],
      learningResources: [
        { type: "tutorial", title: "EMR Getting Started", url: "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-getting-started.html" },
        { type: "video", title: "EMR Tutorial", url: "https://www.youtube.com/results?search_query=aws+emr+tutorial" },
        { type: "certification", title: "Data Analytics Specialty", url: "https://aws.amazon.com/certification/certified-data-analytics-specialty/" }
      ]
    },
    "Glue": {
      description: "Fully managed extract, transform, and load (ETL) service that makes it easy for customers to prepare and load their data for analytics.",
      useCases: ["Data preparation", "ETL workflows", "Data cataloging", "Schema discovery"],
      relatedServices: ["S3", "Redshift", "Athena", "EMR"],
      learningResources: [
        { type: "tutorial", title: "Glue Getting Started", url: "https://docs.aws.amazon.com/glue/latest/dg/getting-started.html" },
        { type: "video", title: "Glue Tutorial", url: "https://www.youtube.com/results?search_query=aws+glue+tutorial" },
        { type: "certification", title: "Data Analytics Specialty", url: "https://aws.amazon.com/certification/certified-data-analytics-specialty/" }
      ]
    },
    "QuickSight": {
      description: "Fast, cloud-powered business intelligence service that makes it easy to deliver insights to everyone in your organization.",
      useCases: ["Business intelligence", "Data visualization", "Dashboard creation", "Self-service analytics"],
      relatedServices: ["S3", "Redshift", "Athena", "RDS"],
      learningResources: [
        { type: "tutorial", title: "QuickSight Getting Started", url: "https://docs.aws.amazon.com/quicksight/latest/user/getting-started.html" },
        { type: "video", title: "QuickSight Tutorial", url: "https://www.youtube.com/results?search_query=aws+quicksight+tutorial" },
        { type: "certification", title: "Data Analytics Specialty", url: "https://aws.amazon.com/certification/certified-data-analytics-specialty/" }
      ]
    },

    // DEVELOPER TOOLS
    "CloudWatch": {
      description: "Monitoring and observability service that provides data and actionable insights to monitor applications, respond to system-wide performance changes, and optimize resource utilization.",
      useCases: ["Application monitoring", "Infrastructure monitoring", "Log management", "Performance optimization"],
      relatedServices: ["EC2", "Lambda", "RDS", "ELB"],
      learningResources: [
        { type: "tutorial", title: "CloudWatch Getting Started", url: "https://docs.aws.amazon.com/cloudwatch/latest/monitoring/GettingStarted.html" },
        { type: "video", title: "CloudWatch Tutorial", url: "https://www.youtube.com/results?search_query=aws+cloudwatch+tutorial" },
        { type: "certification", title: "SysOps Administrator", url: "https://aws.amazon.com/certification/certified-sysops-admin-associate/" }
      ]
    },
    "CloudFormation": {
      description: "Service that helps you model and set up your Amazon Web Services resources so that you can spend less time managing those resources and more time focusing on your applications.",
      useCases: ["Infrastructure as code", "Resource provisioning", "Stack management", "Environment replication"],
      relatedServices: ["EC2", "S3", "IAM", "Lambda"],
      learningResources: [
        { type: "tutorial", title: "CloudFormation Getting Started", url: "https://docs.aws.amazon.com/cloudformation/latest/userguide/GettingStarted.html" },
        { type: "video", title: "CloudFormation Tutorial", url: "https://www.youtube.com/results?search_query=aws+cloudformation+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "CodeCommit": {
      description: "Fully-managed source control service that hosts secure Git-based repositories. It makes it easy for teams to collaborate on code in a secure and highly scalable ecosystem.",
      useCases: ["Source code management", "Version control", "Code collaboration", "CI/CD pipelines"],
      relatedServices: ["CodeBuild", "CodePipeline", "CodeDeploy", "IAM"],
      learningResources: [
        { type: "tutorial", title: "CodeCommit Getting Started", url: "https://docs.aws.amazon.com/codecommit/latest/userguide/getting-started.html" },
        { type: "video", title: "CodeCommit Tutorial", url: "https://www.youtube.com/results?search_query=aws+codecommit+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "CodeBuild": {
      description: "Fully managed continuous integration service that compiles source code, runs tests, and produces software packages that are ready to deploy.",
      useCases: ["Continuous integration", "Code compilation", "Test automation", "Package creation"],
      relatedServices: ["CodeCommit", "CodePipeline", "S3", "CloudWatch"],
      learningResources: [
        { type: "tutorial", title: "CodeBuild Getting Started", url: "https://docs.aws.amazon.com/codebuild/latest/userguide/getting-started.html" },
        { type: "video", title: "CodeBuild Tutorial", url: "https://www.youtube.com/results?search_query=aws+codebuild+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "CodePipeline": {
      description: "Fully managed continuous delivery service that helps you automate your release pipelines for fast and reliable application and infrastructure updates.",
      useCases: ["Continuous delivery", "Release automation", "Pipeline orchestration", "Multi-stage deployments"],
      relatedServices: ["CodeCommit", "CodeBuild", "CodeDeploy", "S3"],
      learningResources: [
        { type: "tutorial", title: "CodePipeline Getting Started", url: "https://docs.aws.amazon.com/codepipeline/latest/userguide/getting-started.html" },
        { type: "video", title: "CodePipeline Tutorial", url: "https://www.youtube.com/results?search_query=aws+codepipeline+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "SNS": {
      description: "Fully managed messaging service for both application-to-application (A2A) and application-to-person (A2P) communication.",
      useCases: ["Push notifications", "SMS messaging", "Email notifications", "Application integration"],
      relatedServices: ["SQS", "Lambda", "CloudWatch", "EC2"],
      learningResources: [
        { type: "tutorial", title: "SNS Getting Started", url: "https://docs.aws.amazon.com/sns/latest/dg/sns-getting-started.html" },
        { type: "video", title: "SNS Tutorial", url: "https://www.youtube.com/results?search_query=aws+sns+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "SQS": {
      description: "Fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications.",
      useCases: ["Message queuing", "Application decoupling", "Batch processing", "Microservices communication"],
      relatedServices: ["SNS", "Lambda", "EC2", "ECS"],
      learningResources: [
        { type: "tutorial", title: "SQS Getting Started", url: "https://docs.aws.amazon.com/sqs/latest/dg/getting-started.html" },
        { type: "video", title: "SQS Tutorial", url: "https://www.youtube.com/results?search_query=aws+sqs+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },

    // IOT SERVICES
    "IoT Core": {
      description: "Managed cloud service that lets connected devices easily and securely interact with cloud applications and other devices.",
      useCases: ["Device connectivity", "IoT data collection", "Device management", "Real-time messaging"],
      relatedServices: ["IoT Analytics", "IoT Events", "Lambda", "Kinesis"],
      learningResources: [
        { type: "tutorial", title: "IoT Core Getting Started", url: "https://docs.aws.amazon.com/iot/latest/developerguide/iot-gs.html" },
        { type: "video", title: "IoT Core Tutorial", url: "https://www.youtube.com/results?search_query=aws+iot+core+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "IoT Analytics": {
      description: "Fully managed service that makes it easy to run and operationalize analytics on massive volumes of IoT data.",
      useCases: ["IoT data analysis", "Data preprocessing", "Time series analytics", "Machine learning on IoT data"],
      relatedServices: ["IoT Core", "S3", "SageMaker", "QuickSight"],
      learningResources: [
        { type: "tutorial", title: "IoT Analytics Getting Started", url: "https://docs.aws.amazon.com/iotanalytics/latest/userguide/getting-started.html" },
        { type: "video", title: "IoT Analytics Tutorial", url: "https://www.youtube.com/results?search_query=aws+iot+analytics+tutorial" },
        { type: "certification", title: "Data Analytics Specialty", url: "https://aws.amazon.com/certification/certified-data-analytics-specialty/" }
      ]
    },
    "IoT Device Management": {
      description: "Service that makes it easy to securely register, organize, monitor, and remotely manage IoT devices at scale.",
      useCases: ["Device fleet management", "Device monitoring", "Remote device updates", "Device organization"],
      relatedServices: ["IoT Core", "IoT Events", "CloudWatch", "Systems Manager"],
      learningResources: [
        { type: "tutorial", title: "IoT Device Management Getting Started", url: "https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-management.html" },
        { type: "video", title: "IoT Device Management Tutorial", url: "https://www.youtube.com/results?search_query=aws+iot+device+management+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "IoT Events": {
      description: "Fully managed service that makes it easy to detect and respond to events from IoT sensors and applications.",
      useCases: ["Event detection", "IoT monitoring", "Automated responses", "Alert systems"],
      relatedServices: ["IoT Core", "Lambda", "SNS", "CloudWatch"],
      learningResources: [
        { type: "tutorial", title: "IoT Events Getting Started", url: "https://docs.aws.amazon.com/iotevents/latest/developerguide/getting-started.html" },
        { type: "video", title: "IoT Events Tutorial", url: "https://www.youtube.com/results?search_query=aws+iot+events+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "IoT Greengrass": {
      description: "Edge runtime and cloud service for building, deploying, and managing device software for IoT devices.",
      useCases: ["Edge computing", "Local data processing", "Offline operation", "Device software management"],
      relatedServices: ["IoT Core", "Lambda", "EC2", "S3"],
      learningResources: [
        { type: "tutorial", title: "IoT Greengrass Getting Started", url: "https://docs.aws.amazon.com/greengrass/latest/developerguide/getting-started.html" },
        { type: "video", title: "IoT Greengrass Tutorial", url: "https://www.youtube.com/results?search_query=aws+iot+greengrass+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },

    // MANAGEMENT & GOVERNANCE
    "CloudTrail": {
      description: "Service that enables governance, compliance, operational auditing, and risk auditing of your AWS account.",
      useCases: ["API call logging", "Compliance auditing", "Security analysis", "Troubleshooting"],
      relatedServices: ["CloudWatch", "S3", "IAM", "GuardDuty"],
      learningResources: [
        { type: "tutorial", title: "CloudTrail Getting Started", url: "https://docs.aws.amazon.com/cloudtrail/latest/userguide/cloudtrail-getting-started.html" },
        { type: "video", title: "CloudTrail Tutorial", url: "https://www.youtube.com/results?search_query=aws+cloudtrail+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "Config": {
      description: "Service that enables you to assess, audit, and evaluate the configurations of your AWS resources.",
      useCases: ["Configuration compliance", "Resource monitoring", "Change tracking", "Security analysis"],
      relatedServices: ["CloudTrail", "Systems Manager", "IAM", "Lambda"],
      learningResources: [
        { type: "tutorial", title: "Config Getting Started", url: "https://docs.aws.amazon.com/config/latest/developerguide/getting-started.html" },
        { type: "video", title: "Config Tutorial", url: "https://www.youtube.com/results?search_query=aws+config+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "Systems Manager": {
      description: "Central place to view operational data from multiple AWS services and automate operational tasks.",
      useCases: ["Server management", "Patch management", "Configuration management", "Automation"],
      relatedServices: ["EC2", "CloudWatch", "IAM", "Lambda"],
      learningResources: [
        { type: "tutorial", title: "Systems Manager Getting Started", url: "https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started.html" },
        { type: "video", title: "Systems Manager Tutorial", url: "https://www.youtube.com/results?search_query=aws+systems+manager+tutorial" },
        { type: "certification", title: "SysOps Administrator", url: "https://aws.amazon.com/certification/certified-sysops-admin-associate/" }
      ]
    },
    "Organizations": {
      description: "Account management service that enables you to centrally manage and govern your environment as you grow and scale your AWS resources.",
      useCases: ["Multi-account management", "Billing consolidation", "Policy management", "Account governance"],
      relatedServices: ["IAM", "CloudTrail", "Config", "Control Tower"],
      learningResources: [
        { type: "tutorial", title: "Organizations Getting Started", url: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started.html" },
        { type: "video", title: "Organizations Tutorial", url: "https://www.youtube.com/results?search_query=aws+organizations+tutorial" },
        { type: "certification", title: "Solutions Architect Professional", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" }
      ]
    },
    "Control Tower": {
      description: "Service that offers the easiest way to set up and govern a secure, multi-account AWS environment.",
      useCases: ["Multi-account setup", "Governance automation", "Compliance management", "Account baseline"],
      relatedServices: ["Organizations", "CloudFormation", "Config", "CloudTrail"],
      learningResources: [
        { type: "tutorial", title: "Control Tower Getting Started", url: "https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-with-control-tower.html" },
        { type: "video", title: "Control Tower Tutorial", url: "https://www.youtube.com/results?search_query=aws+control+tower+tutorial" },
        { type: "certification", title: "Solutions Architect Professional", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" }
      ]
    },
    "Trusted Advisor": {
      description: "Online tool that provides real-time guidance to help you provision your resources following AWS best practices.",
      useCases: ["Cost optimization", "Performance monitoring", "Security recommendations", "Fault tolerance"],
      relatedServices: ["CloudWatch", "Cost Explorer", "Support", "Well-Architected Tool"],
      learningResources: [
        { type: "tutorial", title: "Trusted Advisor Getting Started", url: "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html" },
        { type: "video", title: "Trusted Advisor Tutorial", url: "https://www.youtube.com/results?search_query=aws+trusted+advisor+tutorial" },
        { type: "certification", title: "Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" }
      ]
    },

    // MIGRATION & TRANSFER
    "Migration Hub": {
      description: "Single location to track the progress of application migrations across multiple AWS and partner solutions.",
      useCases: ["Migration tracking", "Application discovery", "Migration planning", "Progress monitoring"],
      relatedServices: ["DMS", "Server Migration Service", "DataSync", "Application Discovery Service"],
      learningResources: [
        { type: "tutorial", title: "Migration Hub Getting Started", url: "https://docs.aws.amazon.com/migrationhub/latest/ug/getting-started.html" },
        { type: "video", title: "Migration Hub Tutorial", url: "https://www.youtube.com/results?search_query=aws+migration+hub+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "DMS": {
      description: "Database Migration Service helps you migrate databases to AWS quickly and securely.",
      useCases: ["Database migration", "Data replication", "Database modernization", "Continuous data replication"],
      relatedServices: ["RDS", "Aurora", "Redshift", "S3"],
      learningResources: [
        { type: "tutorial", title: "DMS Getting Started", url: "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.html" },
        { type: "video", title: "DMS Tutorial", url: "https://www.youtube.com/results?search_query=aws+database+migration+service+tutorial" },
        { type: "certification", title: "Database Specialty", url: "https://aws.amazon.com/certification/certified-database-specialty/" }
      ]
    },
    "DataSync": {
      description: "Online data transfer service that simplifies, automates, and accelerates moving data between on-premises storage and AWS.",
      useCases: ["Data migration", "Data archival", "Data replication", "Hybrid storage"],
      relatedServices: ["S3", "EFS", "FSx", "Storage Gateway"],
      learningResources: [
        { type: "tutorial", title: "DataSync Getting Started", url: "https://docs.aws.amazon.com/datasync/latest/userguide/getting-started.html" },
        { type: "video", title: "DataSync Tutorial", url: "https://www.youtube.com/results?search_query=aws+datasync+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "Application Discovery Service": {
      description: "Service that helps enterprise customers plan migration projects by gathering information about their on-premises data centers.",
      useCases: ["Application discovery", "Migration planning", "Dependency mapping", "Infrastructure assessment"],
      relatedServices: ["Migration Hub", "Server Migration Service", "DMS", "CloudFormation"],
      learningResources: [
        { type: "tutorial", title: "Application Discovery Service Getting Started", url: "https://docs.aws.amazon.com/application-discovery/latest/userguide/getting-started.html" },
        { type: "video", title: "Application Discovery Service Tutorial", url: "https://www.youtube.com/results?search_query=aws+application+discovery+service+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "Server Migration Service": {
      description: "Agentless service which makes it easier and faster for you to migrate thousands of on-premises workloads to AWS.",
      useCases: ["Server migration", "VM migration", "Migration automation", "Workload modernization"],
      relatedServices: ["EC2", "Migration Hub", "Application Discovery Service", "CloudFormation"],
      learningResources: [
        { type: "tutorial", title: "Server Migration Service Getting Started", url: "https://docs.aws.amazon.com/server-migration-service/latest/userguide/getting-started.html" },
        { type: "video", title: "Server Migration Service Tutorial", url: "https://www.youtube.com/results?search_query=aws+server+migration+service+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },

    // ADDITIONAL ML SERVICES
    "Polly": {
      description: "Text-to-speech service that uses advanced deep learning technologies to synthesize natural sounding human speech.",
      useCases: ["Voice applications", "Content creation", "Accessibility", "Interactive voice response"],
      relatedServices: ["Transcribe", "Translate", "Lex", "Connect"],
      learningResources: [
        { type: "tutorial", title: "Polly Getting Started", url: "https://docs.aws.amazon.com/polly/latest/dg/getting-started.html" },
        { type: "video", title: "Polly Tutorial", url: "https://www.youtube.com/results?search_query=aws+polly+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },
    "Transcribe": {
      description: "Automatic speech recognition service that makes it easy to convert audio to text.",
      useCases: ["Speech-to-text", "Call analytics", "Subtitles generation", "Content transcription"],
      relatedServices: ["Polly", "Translate", "Comprehend", "S3"],
      learningResources: [
        { type: "tutorial", title: "Transcribe Getting Started", url: "https://docs.aws.amazon.com/transcribe/latest/dg/getting-started.html" },
        { type: "video", title: "Transcribe Tutorial", url: "https://www.youtube.com/results?search_query=aws+transcribe+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },
    "Lex": {
      description: "Service for building conversational interfaces into any application using voice and text.",
      useCases: ["Chatbots", "Voice assistants", "Customer service automation", "Interactive applications"],
      relatedServices: ["Polly", "Lambda", "Connect", "Transcribe"],
      learningResources: [
        { type: "tutorial", title: "Lex Getting Started", url: "https://docs.aws.amazon.com/lex/latest/dg/getting-started.html" },
        { type: "video", title: "Lex Tutorial", url: "https://www.youtube.com/results?search_query=aws+lex+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },
    "Personalize": {
      description: "Machine learning service that makes it easy to develop individualized recommendations for customers.",
      useCases: ["Recommendation engines", "Personalization", "Content recommendations", "Product recommendations"],
      relatedServices: ["S3", "Kinesis", "Lambda", "API Gateway"],
      learningResources: [
        { type: "tutorial", title: "Personalize Getting Started", url: "https://docs.aws.amazon.com/personalize/latest/dg/getting-started.html" },
        { type: "video", title: "Personalize Tutorial", url: "https://www.youtube.com/results?search_query=aws+personalize+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },
    "Forecast": {
      description: "Fully managed service that uses machine learning to deliver highly accurate forecasts.",
      useCases: ["Demand forecasting", "Inventory planning", "Financial planning", "Resource planning"],
      relatedServices: ["S3", "QuickSight", "SageMaker", "Lambda"],
      learningResources: [
        { type: "tutorial", title: "Forecast Getting Started", url: "https://docs.aws.amazon.com/forecast/latest/dg/getting-started.html" },
        { type: "video", title: "Forecast Tutorial", url: "https://www.youtube.com/results?search_query=aws+forecast+tutorial" },
        { type: "certification", title: "Machine Learning Specialty", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" }
      ]
    },

    // BUSINESS APPLICATIONS
    "Connect": {
      description: "Cloud-based contact center service that makes it easy to set up and manage a customer contact center.",
      useCases: ["Customer service", "Contact centers", "Call routing", "Customer support automation"],
      relatedServices: ["Lex", "Polly", "Transcribe", "Lambda"],
      learningResources: [
        { type: "tutorial", title: "Connect Getting Started", url: "https://docs.aws.amazon.com/connect/latest/adminguide/getting-started.html" },
        { type: "video", title: "Connect Tutorial", url: "https://www.youtube.com/results?search_query=aws+connect+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "WorkMail": {
      description: "Secure, managed business email and calendar service with support for existing desktop and mobile email client applications.",
      useCases: ["Business email", "Calendar management", "Corporate communication", "Email hosting"],
      relatedServices: ["WorkDocs", "Directory Service", "IAM", "KMS"],
      learningResources: [
        { type: "tutorial", title: "WorkMail Getting Started", url: "https://docs.aws.amazon.com/workmail/latest/adminguide/getting_started.html" },
        { type: "video", title: "WorkMail Tutorial", url: "https://www.youtube.com/results?search_query=aws+workmail+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "WorkDocs": {
      description: "Fully managed, secure content creation, storage, and collaboration service.",
      useCases: ["Document collaboration", "File sharing", "Content management", "Team collaboration"],
      relatedServices: ["WorkMail", "IAM", "Directory Service", "CloudTrail"],
      learningResources: [
        { type: "tutorial", title: "WorkDocs Getting Started", url: "https://docs.aws.amazon.com/workdocs/latest/adminguide/getting_started.html" },
        { type: "video", title: "WorkDocs Tutorial", url: "https://www.youtube.com/results?search_query=aws+workdocs+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "WorkSpaces": {
      description: "Managed, secure Desktop-as-a-Service (DaaS) solution running on AWS.",
      useCases: ["Virtual desktops", "Remote work", "BYOD solutions", "Secure computing"],
      relatedServices: ["Directory Service", "WorkDocs", "WorkMail", "VPC"],
      learningResources: [
        { type: "tutorial", title: "WorkSpaces Getting Started", url: "https://docs.aws.amazon.com/workspaces/latest/adminguide/getting-started.html" },
        { type: "video", title: "WorkSpaces Tutorial", url: "https://www.youtube.com/results?search_query=aws+workspaces+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },

    // ADDITIONAL SECURITY SERVICES
    "Inspector": {
      description: "Automated security assessment service that helps improve the security and compliance of applications deployed on AWS.",
      useCases: ["Security assessments", "Vulnerability scanning", "Compliance checking", "Application security"],
      relatedServices: ["EC2", "ECR", "Systems Manager", "Security Hub"],
      learningResources: [
        { type: "tutorial", title: "Inspector Getting Started", url: "https://docs.aws.amazon.com/inspector/latest/userguide/getting_started_tutorial.html" },
        { type: "video", title: "Inspector Tutorial", url: "https://www.youtube.com/results?search_query=aws+inspector+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "CloudHSM": {
      description: "Cloud-based hardware security module (HSM) that enables you to easily generate and use your own encryption keys on the AWS Cloud.",
      useCases: ["Key management", "Cryptographic operations", "SSL/TLS processing", "Database encryption"],
      relatedServices: ["KMS", "RDS", "Redshift", "CloudFormation"],
      learningResources: [
        { type: "tutorial", title: "CloudHSM Getting Started", url: "https://docs.aws.amazon.com/cloudhsm/latest/userguide/getting-started.html" },
        { type: "video", title: "CloudHSM Tutorial", url: "https://www.youtube.com/results?search_query=aws+cloudhsm+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "Directory Service": {
      description: "Managed service that makes it easy to set up and run directories in the AWS cloud, or connect your AWS resources with an existing on-premises Microsoft Active Directory.",
      useCases: ["User authentication", "Directory services", "LDAP integration", "Single sign-on"],
      relatedServices: ["WorkSpaces", "WorkMail", "EC2", "RDS"],
      learningResources: [
        { type: "tutorial", title: "Directory Service Getting Started", url: "https://docs.aws.amazon.com/directoryservice/latest/admin-guide/getting_started.html" },
        { type: "video", title: "Directory Service Tutorial", url: "https://www.youtube.com/results?search_query=aws+directory+service+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },
    "Certificate Manager": {
      description: "Service that lets you easily provision, manage, and deploy public and private Secure Sockets Layer/Transport Layer Security (SSL/TLS) certificates.",
      useCases: ["SSL certificate management", "Website security", "Load balancer certificates", "API Gateway certificates"],
      relatedServices: ["CloudFront", "ELB", "API Gateway", "Route 53"],
      learningResources: [
        { type: "tutorial", title: "Certificate Manager Getting Started", url: "https://docs.aws.amazon.com/acm/latest/userguide/gs.html" },
        { type: "video", title: "Certificate Manager Tutorial", url: "https://www.youtube.com/results?search_query=aws+certificate+manager+tutorial" },
        { type: "certification", title: "Security Specialty", url: "https://aws.amazon.com/certification/certified-security-specialty/" }
      ]
    },

    // ADDITIONAL NETWORKING SERVICES
    "Transit Gateway": {
      description: "Service that enables customers to connect their Amazon Virtual Private Clouds (VPCs) and their on-premises networks to a single gateway.",
      useCases: ["Network connectivity", "Multi-VPC connectivity", "Hybrid networking", "Network scaling"],
      relatedServices: ["VPC", "Direct Connect", "VPN", "Route 53"],
      learningResources: [
        { type: "tutorial", title: "Transit Gateway Getting Started", url: "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-getting-started.html" },
        { type: "video", title: "Transit Gateway Tutorial", url: "https://www.youtube.com/results?search_query=aws+transit+gateway+tutorial" },
        { type: "certification", title: "Advanced Networking Specialty", url: "https://aws.amazon.com/certification/certified-advanced-networking-specialty/" }
      ]
    },
    "PrivateLink": {
      description: "Technology that enables you to privately access services by using private IP addresses.",
      useCases: ["Private connectivity", "Service access", "Network security", "VPC endpoints"],
      relatedServices: ["VPC", "EC2", "S3", "DynamoDB"],
      learningResources: [
        { type: "tutorial", title: "PrivateLink Getting Started", url: "https://docs.aws.amazon.com/vpc/latest/privatelink/getting-started.html" },
        { type: "video", title: "PrivateLink Tutorial", url: "https://www.youtube.com/results?search_query=aws+privatelink+tutorial" },
        { type: "certification", title: "Advanced Networking Specialty", url: "https://aws.amazon.com/certification/certified-advanced-networking-specialty/" }
      ]
    },
    "Global Accelerator": {
      description: "Networking service that improves the performance of your users' traffic by up to 60% using Amazon Web Services' global network infrastructure.",
      useCases: ["Application acceleration", "Global traffic management", "DDoS protection", "Performance optimization"],
      relatedServices: ["CloudFront", "ELB", "Route 53", "Shield"],
      learningResources: [
        { type: "tutorial", title: "Global Accelerator Getting Started", url: "https://docs.aws.amazon.com/global-accelerator/latest/dg/getting-started.html" },
        { type: "video", title: "Global Accelerator Tutorial", url: "https://www.youtube.com/results?search_query=aws+global+accelerator+tutorial" },
        { type: "certification", title: "Advanced Networking Specialty", url: "https://aws.amazon.com/certification/certified-advanced-networking-specialty/" }
      ]
    },

    // MEDIA SERVICES
    "Elemental MediaLive": {
      description: "Broadcast-grade live video processing service that creates high-quality video streams for delivery to broadcast televisions and internet-connected multiscreen devices.",
      useCases: ["Live video streaming", "Broadcast production", "Video processing", "Multi-screen delivery"],
      relatedServices: ["MediaStore", "MediaPackage", "CloudFront", "S3"],
      learningResources: [
        { type: "tutorial", title: "MediaLive Getting Started", url: "https://docs.aws.amazon.com/medialive/latest/ug/getting-started.html" },
        { type: "video", title: "MediaLive Tutorial", url: "https://www.youtube.com/results?search_query=aws+medialive+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },
    "Elemental MediaConvert": {
      description: "File-based video transcoding service with broadcast-grade features that creates video-on-demand (VOD) content for broadcast and multiscreen delivery at scale.",
      useCases: ["Video transcoding", "Format conversion", "Video processing", "Content preparation"],
      relatedServices: ["S3", "CloudFront", "MediaPackage", "Lambda"],
      learningResources: [
        { type: "tutorial", title: "MediaConvert Getting Started", url: "https://docs.aws.amazon.com/mediaconvert/latest/ug/getting-started.html" },
        { type: "video", title: "MediaConvert Tutorial", url: "https://www.youtube.com/results?search_query=aws+mediaconvert+tutorial" },
        { type: "certification", title: "Solutions Architect Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ]
    },

    // COST MANAGEMENT
    "Cost Explorer": {
      description: "Tool that enables you to view and analyze your costs and usage. You can explore your AWS costs using an interface that lets you create custom reports.",
      useCases: ["Cost analysis", "Usage tracking", "Budget planning", "Cost optimization"],
      relatedServices: ["Budgets", "Billing", "Organizations", "Trusted Advisor"],
      learningResources: [
        { type: "tutorial", title: "Cost Explorer Getting Started", url: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-getting-started.html" },
        { type: "video", title: "Cost Explorer Tutorial", url: "https://www.youtube.com/results?search_query=aws+cost+explorer+tutorial" },
        { type: "certification", title: "Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" }
      ]
    },
    "Budgets": {
      description: "Service that gives you the ability to set custom budgets that alert you when your costs or usage exceed (or are forecasted to exceed) your budgeted amount.",
      useCases: ["Cost control", "Budget alerts", "Spending tracking", "Financial governance"],
      relatedServices: ["Cost Explorer", "CloudWatch", "SNS", "Organizations"],
      learningResources: [
        { type: "tutorial", title: "Budgets Getting Started", url: "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-getting-started.html" },
        { type: "video", title: "Budgets Tutorial", url: "https://www.youtube.com/results?search_query=aws+budgets+tutorial" },
        { type: "certification", title: "Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" }
      ]
    },

    // ADDITIONAL DATABASE SERVICES
    "Aurora": {
      description: "MySQL and PostgreSQL-compatible relational database built for the cloud that combines the performance and availability of traditional enterprise databases with the simplicity and cost-effectiveness of open source databases.",
      useCases: ["High-performance databases", "Global applications", "Serverless databases", "Multi-region replication"],
      relatedServices: ["RDS", "DynamoDB", "ElastiCache", "VPC"],
      learningResources: [
        { type: "tutorial", title: "Aurora Getting Started", url: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_GettingStartedAurora.html" },
        { type: "video", title: "Aurora Tutorial", url: "https://www.youtube.com/results?search_query=aws+aurora+tutorial" },
        { type: "certification", title: "Database Specialty", url: "https://aws.amazon.com/certification/certified-database-specialty/" }
      ]
    },
    "QLDB": {
      description: "Fully managed ledger database that provides a transparent, immutable, and cryptographically verifiable transaction log owned by a central trusted authority.",
      useCases: ["Ledger applications", "Audit trails", "Cryptocurrency tracking", "Supply chain tracking"],
      relatedServices: ["IAM", "CloudWatch", "Lambda", "API Gateway"],
      learningResources: [
        { type: "tutorial", title: "QLDB Getting Started", url: "https://docs.aws.amazon.com/qldb/latest/developerguide/getting-started.html" },
        { type: "video", title: "QLDB Tutorial", url: "https://www.youtube.com/results?search_query=aws+qldb+tutorial" },
        { type: "certification", title: "Database Specialty", url: "https://aws.amazon.com/certification/certified-database-specialty/" }
      ]
    },
    "Keyspaces": {
      description: "Scalable, highly available, and managed Apache Cassandra-compatible database service.",
      useCases: ["IoT applications", "Time series data", "Gaming applications", "High-scale applications"],
      relatedServices: ["DynamoDB", "Kinesis", "Lambda", "VPC"],
      learningResources: [
        { type: "tutorial", title: "Keyspaces Getting Started", url: "https://docs.aws.amazon.com/keyspaces/latest/devguide/getting-started.html" },
        { type: "video", title: "Keyspaces Tutorial", url: "https://www.youtube.com/results?search_query=aws+keyspaces+tutorial" },
        { type: "certification", title: "Database Specialty", url: "https://aws.amazon.com/certification/certified-database-specialty/" }
      ]
    },

    // ADDITIONAL DEVELOPER TOOLS
    "X-Ray": {
      description: "Service that collects data about requests that your application serves, and provides tools you can use to view, filter, and gain insights into that data to identify issues and opportunities for optimization.",
      useCases: ["Application debugging", "Performance analysis", "Request tracing", "Service map visualization"],
      relatedServices: ["Lambda", "EC2", "ECS", "API Gateway"],
      learningResources: [
        { type: "tutorial", title: "X-Ray Getting Started", url: "https://docs.aws.amazon.com/xray/latest/devguide/xray-gettingstarted.html" },
        { type: "video", title: "X-Ray Tutorial", url: "https://www.youtube.com/results?search_query=aws+xray+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "AppSync": {
      description: "Managed service that uses GraphQL to make it easy for applications to get exactly the data they need.",
      useCases: ["GraphQL APIs", "Real-time data", "Offline sync", "Mobile backends"],
      relatedServices: ["DynamoDB", "Lambda", "Cognito", "S3"],
      learningResources: [
        { type: "tutorial", title: "AppSync Getting Started", url: "https://docs.aws.amazon.com/appsync/latest/devguide/getting-started.html" },
        { type: "video", title: "AppSync Tutorial", url: "https://www.youtube.com/results?search_query=aws+appsync+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "CodeDeploy": {
      description: "Deployment service that automates application deployments to Amazon EC2 instances, on-premises instances, serverless Lambda functions, or Amazon ECS services.",
      useCases: ["Application deployment", "Rolling deployments", "Blue/green deployments", "Deployment automation"],
      relatedServices: ["EC2", "Lambda", "ECS", "CodePipeline"],
      learningResources: [
        { type: "tutorial", title: "CodeDeploy Getting Started", url: "https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started.html" },
        { type: "video", title: "CodeDeploy Tutorial", url: "https://www.youtube.com/results?search_query=aws+codedeploy+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "CodeStar": {
      description: "Cloud-based service for creating, managing, and working with software development projects on AWS.",
      useCases: ["Project management", "Development workflows", "Team collaboration", "CI/CD setup"],
      relatedServices: ["CodeCommit", "CodeBuild", "CodePipeline", "CodeDeploy"],
      learningResources: [
        { type: "tutorial", title: "CodeStar Getting Started", url: "https://docs.aws.amazon.com/codestar/latest/userguide/getting-started.html" },
        { type: "video", title: "CodeStar Tutorial", url: "https://www.youtube.com/results?search_query=aws+codestar+tutorial" },
        { type: "certification", title: "Developer Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" }
      ]
    },
    "Well-Architected Tool": {
      description: "Service that helps you review the state of your applications and workloads against architectural best practices, identify opportunities for improvement, and track progress over time.",
      useCases: ["Architecture review", "Best practices", "Risk assessment", "Improvement tracking"],
      relatedServices: ["Trusted Advisor", "CloudFormation", "Config", "Systems Manager"],
      learningResources: [
        { type: "tutorial", title: "Well-Architected Tool Getting Started", url: "https://docs.aws.amazon.com/wellarchitected/latest/userguide/getting-started.html" },
        { type: "video", title: "Well-Architected Tool Tutorial", url: "https://www.youtube.com/results?search_query=aws+well+architected+tool+tutorial" },
        { type: "certification", title: "Solutions Architect Professional", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" }
      ]
    },
    "Console Mobile Application": {
      description: "Mobile application that provides AWS customers with a simple and secure way to view resources and basic metrics, check the health of resources, and view service outages.",
      useCases: ["Mobile monitoring", "Resource management", "Alert notifications", "Basic operations"],
      relatedServices: ["CloudWatch", "SNS", "IAM", "Organizations"],
      learningResources: [
        { type: "tutorial", title: "Console Mobile App Getting Started", url: "https://docs.aws.amazon.com/console-mobile-app/latest/userguide/getting-started.html" },
        { type: "video", title: "Console Mobile App Tutorial", url: "https://www.youtube.com/results?search_query=aws+console+mobile+app+tutorial" },
        { type: "certification", title: "Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" }
      ]
    },

    // MICROSERVICES (Non-AWS technologies included in your list)
    "MongoDB": {
      description: "NoSQL document database that provides high performance, high availability, and easy scalability.",
      useCases: ["Document storage", "Content management", "Real-time analytics", "IoT applications"],
      relatedServices: ["DocumentDB", "DynamoDB", "Lambda", "EC2"],
      learningResources: [
        { type: "tutorial", title: "MongoDB Documentation", url: "https://www.mongodb.com/docs/" },
        { type: "video", title: "MongoDB Tutorial", url: "https://www.youtube.com/results?search_query=mongodb+tutorial" },
        { type: "certification", title: "MongoDB Certification", url: "https://university.mongodb.com/certification" }
      ]
    },
    "Redis": {
      description: "In-memory data structure store used as a database, cache, and message broker.",
      useCases: ["Caching", "Session storage", "Real-time analytics", "Message queuing"],
      relatedServices: ["ElastiCache", "DynamoDB", "Lambda", "EC2"],
      learningResources: [
        { type: "tutorial", title: "Redis Documentation", url: "https://redis.io/docs/" },
        { type: "video", title: "Redis Tutorial", url: "https://www.youtube.com/results?search_query=redis+tutorial" },
        { type: "certification", title: "Redis Certification", url: "https://redis.com/training/" }
      ]
    },
    "PostgreSQL": {
      description: "Advanced open source relational database that supports both SQL and JSON querying.",
      useCases: ["Relational databases", "Data warehousing", "Geographic data", "JSON storage"],
      relatedServices: ["RDS", "Aurora", "DynamoDB", "Redshift"],
      learningResources: [
        { type: "tutorial", title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/" },
        { type: "video", title: "PostgreSQL Tutorial", url: "https://www.youtube.com/results?search_query=postgresql+tutorial" },
        { type: "certification", title: "PostgreSQL Certification", url: "https://www.postgresql.org/community/certification/" }
      ]
    },
    "Apache Kafka": {
      description: "Distributed event streaming platform capable of handling trillions of events a day.",
      useCases: ["Event streaming", "Real-time data processing", "Log aggregation", "Message queuing"],
      relatedServices: ["Kinesis", "MSK", "Lambda", "EC2"],
      learningResources: [
        { type: "tutorial", title: "Apache Kafka Documentation", url: "https://kafka.apache.org/documentation/" },
        { type: "video", title: "Apache Kafka Tutorial", url: "https://www.youtube.com/results?search_query=apache+kafka+tutorial" },
        { type: "certification", title: "Confluent Kafka Certification", url: "https://www.confluent.io/certification/" }
      ]
    },
    "RabbitMQ": {
      description: "Message broker software that implements the Advanced Message Queuing Protocol (AMQP).",
      useCases: ["Message queuing", "Microservices communication", "Event-driven architecture", "Workflow coordination"],
      relatedServices: ["SQS", "SNS", "Lambda", "EC2"],
      learningResources: [
        { type: "tutorial", title: "RabbitMQ Documentation", url: "https://www.rabbitmq.com/docs/" },
        { type: "video", title: "RabbitMQ Tutorial", url: "https://www.youtube.com/results?search_query=rabbitmq+tutorial" },
        { type: "certification", title: "RabbitMQ Training", url: "https://www.rabbitmq.com/training/" }
      ]
    },
    "Express.js": {
      description: "Fast, minimalist web framework for Node.js applications.",
      useCases: ["Web applications", "API development", "Microservices", "Server-side rendering"],
      relatedServices: ["Lambda", "EC2", "ECS", "API Gateway"],
      learningResources: [
        { type: "tutorial", title: "Express.js Documentation", url: "https://expressjs.com/en/guide/" },
        { type: "video", title: "Express.js Tutorial", url: "https://www.youtube.com/results?search_query=expressjs+tutorial" },
        { type: "certification", title: "Node.js Certification", url: "https://nodejs.org/en/certification/" }
      ]
    },
    "FastAPI": {
      description: "Modern, fast web framework for building APIs with Python based on standard Python type hints.",
      useCases: ["API development", "Microservices", "Machine learning APIs", "High-performance applications"],
      relatedServices: ["Lambda", "EC2", "ECS", "API Gateway"],
      learningResources: [
        { type: "tutorial", title: "FastAPI Documentation", url: "https://fastapi.tiangolo.com/" },
        { type: "video", title: "FastAPI Tutorial", url: "https://www.youtube.com/results?search_query=fastapi+tutorial" },
        { type: "certification", title: "Python Certification", url: "https://www.python.org/jobs/certification/" }
      ]
    },
    "Prometheus": {
      description: "Open-source monitoring system with a dimensional data model, flexible query language, and alerting.",
      useCases: ["Infrastructure monitoring", "Application monitoring", "Alerting", "Time series data"],
      relatedServices: ["CloudWatch", "X-Ray", "ECS", "EKS"],
      learningResources: [
        { type: "tutorial", title: "Prometheus Documentation", url: "https://prometheus.io/docs/" },
        { type: "video", title: "Prometheus Tutorial", url: "https://www.youtube.com/results?search_query=prometheus+tutorial" },
        { type: "certification", title: "Prometheus Training", url: "https://prometheus.io/community/" }
      ]
    },
    "Grafana": {
      description: "Open source analytics and interactive visualization web application for monitoring and observability.",
      useCases: ["Data visualization", "Dashboard creation", "Monitoring", "Analytics"],
      relatedServices: ["CloudWatch", "Prometheus", "X-Ray", "QuickSight"],
      learningResources: [
        { type: "tutorial", title: "Grafana Documentation", url: "https://grafana.com/docs/" },
        { type: "video", title: "Grafana Tutorial", url: "https://www.youtube.com/results?search_query=grafana+tutorial" },
        { type: "certification", title: "Grafana Certification", url: "https://grafana.com/training/" }
      ]
    }
  };

  return serviceDetails[serviceName] || {
    description: "A powerful AWS service that helps you build scalable and reliable cloud applications.",
    useCases: [
      "Cloud infrastructure",
      "Application development",
      "Data processing",
      "Enterprise solutions"
    ],
    relatedServices: ["IAM", "CloudWatch", "VPC"],
    learningResources: [
      { type: "tutorial", title: "AWS Documentation", url: "https://docs.aws.amazon.com/" },
      { type: "certification", title: "Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" }
    ]
  };
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case "tutorial":
      return <BookOpen className="w-4 h-4" />;
    case "video":
      return <Youtube className="w-4 h-4" />;
    case "certification":
      return <Award className="w-4 h-4" />;
    default:
      return <Link2 className="w-4 h-4" />;
  }
};

const getResourceColor = (type: string) => {
  switch (type) {
    case "tutorial":
      return "text-blue-600 dark:text-blue-400";
    case "video":
      return "text-red-600 dark:text-red-400";
    case "certification":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

export function ServiceDeepDiveModal({ service, isOpen, onClose }: ServiceDeepDiveModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "resources">("overview");

  if (!service) return null;

  const details = getServiceDetails(service.name);
  const consoleUrl = `https://console.aws.amazon.com/${service.name.toLowerCase()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: `${service.color}20`,
                color: service.color
              }}
            >
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {service.name}
                <Badge 
                  variant="outline" 
                  style={{ 
                    backgroundColor: `${service.color}15`,
                    borderColor: `${service.color}50`,
                    color: service.color
                  }}
                >
                  {service.category}
                </Badge>
              </DialogTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{service.fullName}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="flex-1"
          >
            <Brain className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === "resources" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("resources")}
            className="flex-1"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Resources
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                📘 What is {service.name}?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {details.description}
              </p>
            </div>

            <Separator />

            {/* Use Cases */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                🧰 Common Use Cases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {details.useCases.map((useCase: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Related Services */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                📎 Related Services
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Services that work well with {service.name}:
              </p>
              <div className="flex flex-wrap gap-2">
                {details.relatedServices.map((relatedService: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    {relatedService}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Try It Button */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                🧪 Ready to try {service.name}?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Open the AWS Console to start experimenting with {service.name} in a real environment.
              </p>
              <Button 
                onClick={() => window.open(consoleUrl, '_blank')}
                className="bg-aws-orange hover:bg-aws-orange/90 text-white"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Open in AWS Console
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                🎓 Learning Resources
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Curated resources to help you learn and master {service.name}:
              </p>
              <div className="space-y-3">
                {details.learningResources.map((resource: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <div className={`flex-shrink-0 ${getResourceColor(resource.type)}`}>
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{resource.type}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certification Info */}
            {service.certificationTracks && service.certificationTracks.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    🏆 Certification Relevance
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    This service is covered in the following AWS certifications:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.certificationTracks.map((track, index) => (
                      <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800">
                        <Award className="w-3 h-3 mr-1" />
                        {track.replace("AWS Certified ", "")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

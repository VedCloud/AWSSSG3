import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, BookOpen, Clock, Users, Star, Trophy, CheckCircle, PlayCircle, FileText, ExternalLink, Award, Target, Lightbulb, Code, Database, Shield, Globe, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface LearningResource {
  type: 'video' | 'documentation' | 'lab' | 'whitepaper' | 'course' | 'certification' | 'workshop' | 'case-study';
  title: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  url: string;
  description: string;
  provider: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  completed: boolean;
  topics: string[];
  resources: LearningResource[];
  prerequisites?: string[];
  outcomes: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: 'associate' | 'professional' | 'specialty';
  duration: string;
  modules: Module[];
  certification: string;
  icon: React.ReactNode;
  color: string;
  popularity: number;
  completionRate: number;
  avgSalary?: string;
  jobRoles: string[];
  skills: string[];
}

const learningPaths: LearningPath[] = [
  {
    id: 'solutions-architect',
    title: 'AWS Solutions Architect',
    description: 'Master the art of designing distributed systems on AWS. Learn to architect scalable, secure, and cost-effective solutions.',
    level: 'associate',
    duration: '3-4 months',
    certification: 'AWS Certified Solutions Architect - Associate',
    icon: <Globe className="w-6 h-6" />,
    color: 'bg-blue-500',
    popularity: 95,
    completionRate: 78,
    avgSalary: '$130,000',
    jobRoles: ['Solutions Architect', 'Cloud Architect', 'Technical Lead', 'Cloud Consultant'],
    skills: ['System Design', 'Cost Optimization', 'Security', 'High Availability', 'Disaster Recovery'],
    modules: [
      {
        id: 'sa-fundamentals',
        title: 'AWS Cloud Fundamentals',
        description: 'Deep dive into AWS core services and architectural principles',
        duration: '3 weeks',
        difficulty: 'beginner',
        completed: false,
        topics: ['EC2 Deep Dive', 'VPC Networking', 'IAM Best Practices', 'S3 Storage Classes', 'CloudFront CDN'],
        prerequisites: [],
        outcomes: ['Understand AWS global infrastructure', 'Design basic VPC architectures', 'Implement security best practices'],
        resources: [
          {
            type: 'course',
            title: 'AWS Cloud Practitioner Essentials',
            duration: '6 hours',
            difficulty: 'beginner',
            url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
            description: 'Foundational course covering AWS services and concepts',
            provider: 'AWS Training'
          },
          {
            type: 'lab',
            title: 'Building Your First VPC',
            duration: '2 hours',
            difficulty: 'beginner',
            url: 'https://aws.amazon.com/getting-started/hands-on/build-vpc-network/',
            description: 'Hands-on lab to create a virtual private cloud from scratch',
            provider: 'AWS Hands-On'
          },
          {
            type: 'documentation',
            title: 'AWS Well-Architected Framework',
            duration: '4 hours',
            difficulty: 'intermediate',
            url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/',
            description: 'Comprehensive guide to architectural best practices',
            provider: 'AWS Documentation'
          }
        ]
      },
      {
        id: 'sa-compute',
        title: 'Compute Services Mastery',
        description: 'Master EC2, Lambda, containers, and serverless architectures',
        duration: '4 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['EC2 Instance Types', 'Auto Scaling', 'Lambda Functions', 'ECS/EKS', 'Fargate', 'Batch Processing'],
        prerequisites: ['AWS Cloud Fundamentals'],
        outcomes: ['Design auto-scaling architectures', 'Implement serverless solutions', 'Optimize compute costs'],
        resources: [
          {
            type: 'course',
            title: 'Advanced EC2 and Auto Scaling',
            duration: '8 hours',
            difficulty: 'intermediate',
            url: 'https://aws.amazon.com/training/classroom/advanced-architecting-on-aws/',
            description: 'Deep dive into EC2 optimization and auto scaling strategies',
            provider: 'AWS Training'
          },
          {
            type: 'workshop',
            title: 'Serverless Web Application',
            duration: '4 hours',
            difficulty: 'intermediate',
            url: 'https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/',
            description: 'Build a complete serverless application using Lambda, API Gateway, and DynamoDB',
            provider: 'AWS Workshops'
          },
          {
            type: 'case-study',
            title: 'Netflix Migration to AWS',
            duration: '1 hour',
            difficulty: 'advanced',
            url: 'https://aws.amazon.com/solutions/case-studies/netflix/',
            description: 'Learn how Netflix architected their streaming platform on AWS',
            provider: 'AWS Case Studies'
          }
        ]
      },
      {
        id: 'sa-storage',
        title: 'Storage and Database Architecture',
        description: 'Design robust data storage solutions with S3, EBS, EFS, and various database services',
        duration: '3 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['S3 Storage Classes', 'EBS Volume Types', 'EFS vs FSx', 'RDS Multi-AZ', 'DynamoDB Design', 'ElastiCache'],
        prerequisites: ['AWS Cloud Fundamentals'],
        outcomes: ['Design data storage strategies', 'Implement backup and recovery', 'Optimize database performance'],
        resources: [
          {
            type: 'course',
            title: 'Data Engineering on AWS',
            duration: '10 hours',
            difficulty: 'advanced',
            url: 'https://aws.amazon.com/training/classroom/data-engineering-on-aws/',
            description: 'Comprehensive course on data architecture patterns',
            provider: 'AWS Training'
          },
          {
            type: 'whitepaper',
            title: 'Amazon S3 Best Practices',
            duration: '2 hours',
            difficulty: 'intermediate',
            url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html',
            description: 'Performance optimization and cost management for S3',
            provider: 'AWS Whitepapers'
          }
        ]
      }
    ]
  },
  {
    id: 'developer',
    title: 'AWS Developer',
    description: 'Build and deploy applications on AWS. Master serverless architectures, APIs, and DevOps practices.',
    level: 'associate',
    duration: '2-3 months',
    certification: 'AWS Certified Developer - Associate',
    icon: <Code className="w-6 h-6" />,
    color: 'bg-green-500',
    popularity: 88,
    completionRate: 82,
    avgSalary: '$115,000',
    jobRoles: ['Cloud Developer', 'DevOps Engineer', 'Full-Stack Developer', 'Backend Engineer'],
    skills: ['Serverless Development', 'API Design', 'CI/CD', 'Monitoring', 'Security'],
    modules: [
      {
        id: 'dev-fundamentals',
        title: 'Development Fundamentals',
        description: 'Essential development tools and services on AWS',
        duration: '2 weeks',
        difficulty: 'beginner',
        completed: false,
        topics: ['AWS CLI', 'SDK Usage', 'CloudFormation', 'CDK', 'API Gateway', 'Lambda Development'],
        prerequisites: [],
        outcomes: ['Set up development environment', 'Use AWS SDKs effectively', 'Deploy infrastructure as code'],
        resources: [
          {
            type: 'course',
            title: 'Developing on AWS',
            duration: '12 hours',
            difficulty: 'intermediate',
            url: 'https://aws.amazon.com/training/classroom/developing-on-aws/',
            description: 'Hands-on course for developing cloud applications',
            provider: 'AWS Training'
          },
          {
            type: 'lab',
            title: 'AWS CDK Workshop',
            duration: '4 hours',
            difficulty: 'intermediate',
            url: 'https://cdkworkshop.com/',
            description: 'Interactive workshop for learning AWS CDK',
            provider: 'AWS CDK Team'
          },
          {
            type: 'documentation',
            title: 'AWS CLI User Guide',
            duration: '3 hours',
            difficulty: 'beginner',
            url: 'https://docs.aws.amazon.com/cli/latest/userguide/',
            description: 'Complete guide to AWS Command Line Interface',
            provider: 'AWS Documentation'
          }
        ]
      },
      {
        id: 'dev-serverless',
        title: 'Serverless Application Development',
        description: 'Build scalable serverless applications using Lambda, API Gateway, and DynamoDB',
        duration: '3 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['Lambda Functions', 'API Gateway', 'DynamoDB', 'Step Functions', 'EventBridge', 'SQS', 'SNS'],
        prerequisites: ['Development Fundamentals'],
        outcomes: ['Build serverless APIs', 'Implement event-driven architectures', 'Design scalable data patterns'],
        resources: [
          {
            type: 'workshop',
            title: 'Serverless Web Application Workshop',
            duration: '6 hours',
            difficulty: 'intermediate',
            url: 'https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/',
            description: 'Build a complete serverless web application',
            provider: 'AWS Workshops'
          },
          {
            type: 'course',
            title: 'AWS Lambda Deep Dive',
            duration: '8 hours',
            difficulty: 'advanced',
            url: 'https://aws.amazon.com/training/classroom/advanced-developing-on-aws/',
            description: 'Advanced Lambda development patterns and best practices',
            provider: 'AWS Training'
          },
          {
            type: 'lab',
            title: 'DynamoDB Single Table Design',
            duration: '3 hours',
            difficulty: 'advanced',
            url: 'https://aws.amazon.com/getting-started/hands-on/design-a-database-for-a-mobile-app-with-dynamodb/',
            description: 'Learn advanced DynamoDB modeling techniques',
            provider: 'AWS Hands-On'
          }
        ]
      },
      {
        id: 'dev-cicd',
        title: 'CI/CD and DevOps Practices',
        description: 'Implement automated deployment pipelines and DevOps best practices',
        duration: '2 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['CodeCommit', 'CodeBuild', 'CodeDeploy', 'CodePipeline', 'CloudFormation', 'CDK', 'SAM'],
        prerequisites: ['Development Fundamentals'],
        outcomes: ['Build CI/CD pipelines', 'Automate deployments', 'Implement infrastructure as code'],
        resources: [
          {
            type: 'workshop',
            title: 'CI/CD for Serverless Applications',
            duration: '4 hours',
            difficulty: 'intermediate',
            url: 'https://catalog.workshops.aws/cicd-serverless/',
            description: 'Complete CI/CD pipeline for serverless apps',
            provider: 'AWS Workshops'
          },
          {
            type: 'course',
            title: 'DevOps Engineering on AWS',
            duration: '12 hours',
            difficulty: 'advanced',
            url: 'https://aws.amazon.com/training/classroom/devops-engineering-on-aws/',
            description: 'Comprehensive DevOps practices on AWS',
            provider: 'AWS Training'
          }
        ]
      }
    ]
  },
  {
    id: 'sysops',
    title: 'AWS SysOps Administrator',
    description: 'Manage and operate scalable, highly available systems on AWS. Focus on monitoring, automation, and optimization.',
    level: 'associate',
    duration: '2-3 months',
    certification: 'AWS Certified SysOps Administrator - Associate',
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-orange-500',
    popularity: 75,
    completionRate: 71,
    avgSalary: '$105,000',
    jobRoles: ['SysOps Administrator', 'Cloud Operations Engineer', 'Infrastructure Engineer', 'Site Reliability Engineer'],
    skills: ['System Monitoring', 'Automation', 'Backup & Recovery', 'Performance Tuning', 'Cost Management'],
    modules: [
      {
        id: 'sysops-monitoring',
        title: 'Monitoring and Observability',
        description: 'Implement comprehensive monitoring and alerting solutions',
        duration: '3 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['CloudWatch Deep Dive', 'X-Ray Tracing', 'AWS Config', 'CloudTrail', 'Custom Metrics', 'Dashboards'],
        prerequisites: [],
        outcomes: ['Design monitoring strategies', 'Set up automated alerting', 'Implement distributed tracing'],
        resources: [
          {
            type: 'course',
            title: 'Systems Operations on AWS',
            duration: '12 hours',
            difficulty: 'intermediate',
            url: 'https://aws.amazon.com/training/classroom/systems-operations-on-aws/',
            description: 'Comprehensive SysOps training course',
            provider: 'AWS Training'
          },
          {
            type: 'lab',
            title: 'CloudWatch Monitoring Lab',
            duration: '2 hours',
            difficulty: 'beginner',
            url: 'https://aws.amazon.com/getting-started/hands-on/getting-started-with-amazon-cloudwatch/',
            description: 'Hands-on CloudWatch monitoring setup',
            provider: 'AWS Hands-On'
          },
          {
            type: 'workshop',
            title: 'Observability Workshop',
            duration: '4 hours',
            difficulty: 'intermediate',
            url: 'https://catalog.workshops.aws/observability/',
            description: 'Complete observability implementation workshop',
            provider: 'AWS Workshops'
          }
        ]
      },
      {
        id: 'sysops-automation',
        title: 'Infrastructure Automation',
        description: 'Automate operations using Systems Manager, CloudFormation, and scripting',
        duration: '3 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['Systems Manager', 'Parameter Store', 'Secrets Manager', 'CloudFormation', 'OpsWorks', 'Patch Management'],
        prerequisites: ['Monitoring and Observability'],
        outcomes: ['Automate patch management', 'Implement configuration management', 'Create self-healing systems'],
        resources: [
          {
            type: 'course',
            title: 'Advanced Systems Operations on AWS',
            duration: '10 hours',
            difficulty: 'advanced',
            url: 'https://aws.amazon.com/training/classroom/advanced-systems-operations-on-aws/',
            description: 'Advanced automation and operations techniques',
            provider: 'AWS Training'
          },
          {
            type: 'workshop',
            title: 'Systems Manager Workshop',
            duration: '3 hours',
            difficulty: 'intermediate',
            url: 'https://catalog.workshops.aws/systems-manager/',
            description: 'Comprehensive Systems Manager automation workshop',
            provider: 'AWS Workshops'
          }
        ]
      },
      {
        id: 'sysops-performance',
        title: 'Performance Optimization & Cost Management',
        description: 'Optimize system performance and manage costs effectively',
        duration: '2 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['Cost Explorer', 'Trusted Advisor', 'Performance Insights', 'Auto Scaling', 'Reserved Instances', 'Spot Instances'],
        prerequisites: ['Infrastructure Automation'],
        outcomes: ['Optimize costs', 'Improve performance', 'Implement cost governance'],
        resources: [
          {
            type: 'course',
            title: 'AWS Cost Optimization',
            duration: '6 hours',
            difficulty: 'intermediate',
            url: 'https://aws.amazon.com/training/classroom/aws-cost-optimization/',
            description: 'Comprehensive cost optimization strategies',
            provider: 'AWS Training'
          },
          {
            type: 'whitepaper',
            title: 'Cost Optimization Pillar',
            duration: '2 hours',
            difficulty: 'intermediate',
            url: 'https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/',
            description: 'Well-Architected cost optimization guidance',
            provider: 'AWS Documentation'
          }
        ]
      }
    ]
  },
  {
    id: 'machine-learning',
    title: 'AWS Machine Learning',
    description: 'Build, train, and deploy ML models at scale. Master SageMaker, AI services, and MLOps practices.',
    level: 'specialty',
    duration: '4-6 months',
    certification: 'AWS Certified Machine Learning - Specialty',
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-purple-500',
    popularity: 92,
    completionRate: 65,
    avgSalary: '$160,000',
    jobRoles: ['ML Engineer', 'Data Scientist', 'AI Specialist', 'ML Architect'],
    skills: ['Machine Learning', 'Deep Learning', 'MLOps', 'Data Engineering', 'Model Deployment'],
    modules: [
      {
        id: 'ml-fundamentals',
        title: 'ML Fundamentals on AWS',
        description: 'Introduction to machine learning concepts and AWS AI/ML services',
        duration: '4 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['SageMaker Studio', 'Built-in Algorithms', 'Rekognition', 'Comprehend', 'Textract', 'Polly'],
        prerequisites: ['Python Programming', 'Statistics Knowledge'],
        outcomes: ['Understand ML workflow on AWS', 'Use pre-built AI services', 'Train first ML model'],
        resources: [
          {
            type: 'course',
            title: 'Machine Learning on AWS',
            duration: '16 hours',
            difficulty: 'advanced',
            url: 'https://aws.amazon.com/training/classroom/machine-learning-on-aws/',
            description: 'Comprehensive ML training covering all AWS ML services',
            provider: 'AWS Training'
          },
          {
            type: 'workshop',
            title: 'SageMaker Immersion Day',
            duration: '8 hours',
            difficulty: 'intermediate',
            url: 'https://catalog.workshops.aws/sagemaker-101/',
            description: 'Hands-on workshop covering SageMaker features',
            provider: 'AWS Workshops'
          },
          {
            type: 'lab',
            title: 'Build Your First ML Model',
            duration: '3 hours',
            difficulty: 'beginner',
            url: 'https://aws.amazon.com/getting-started/hands-on/build-train-deploy-machine-learning-model-sagemaker/',
            description: 'End-to-end ML model development with SageMaker',
            provider: 'AWS Hands-On'
          }
        ]
      },
      {
        id: 'ml-advanced',
        title: 'Advanced ML and Deep Learning',
        description: 'Deep dive into advanced ML algorithms and deep learning frameworks',
        duration: '6 weeks',
        difficulty: 'advanced',
        completed: false,
        topics: ['Deep Learning AMIs', 'TensorFlow on AWS', 'PyTorch', 'Custom Algorithms', 'Hyperparameter Tuning', 'Model Optimization'],
        prerequisites: ['ML Fundamentals on AWS'],
        outcomes: ['Build custom ML algorithms', 'Implement deep learning models', 'Optimize model performance'],
        resources: [
          {
            type: 'course',
            title: 'Advanced Machine Learning on AWS',
            duration: '20 hours',
            difficulty: 'expert',
            url: 'https://aws.amazon.com/training/classroom/advanced-machine-learning-on-aws/',
            description: 'Advanced ML techniques and custom model development',
            provider: 'AWS Training'
          },
          {
            type: 'workshop',
            title: 'Deep Learning Workshop',
            duration: '8 hours',
            difficulty: 'advanced',
            url: 'https://catalog.workshops.aws/deep-learning/',
            description: 'Hands-on deep learning with AWS services',
            provider: 'AWS Workshops'
          },
          {
            type: 'whitepaper',
            title: 'Machine Learning Best Practices',
            duration: '3 hours',
            difficulty: 'advanced',
            url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview-machine-learning/',
            description: 'Best practices for ML on AWS',
            provider: 'AWS Whitepapers'
          }
        ]
      },
      {
        id: 'ml-mlops',
        title: 'MLOps and Production ML',
        description: 'Implement MLOps practices for production ML systems',
        duration: '4 weeks',
        difficulty: 'advanced',
        completed: false,
        topics: ['SageMaker Pipelines', 'Model Registry', 'A/B Testing', 'Model Monitoring', 'Auto Scaling', 'CI/CD for ML'],
        prerequisites: ['Advanced ML and Deep Learning'],
        outcomes: ['Implement MLOps pipelines', 'Deploy production ML systems', 'Monitor model performance'],
        resources: [
          {
            type: 'workshop',
            title: 'MLOps Workshop',
            duration: '6 hours',
            difficulty: 'advanced',
            url: 'https://catalog.workshops.aws/mlops/',
            description: 'Complete MLOps implementation workshop',
            provider: 'AWS Workshops'
          },
          {
            type: 'course',
            title: 'MLOps Engineering on AWS',
            duration: '12 hours',
            difficulty: 'expert',
            url: 'https://aws.amazon.com/training/classroom/mlops-engineering-on-aws/',
            description: 'Comprehensive MLOps engineering practices',
            provider: 'AWS Training'
          }
        ]
      }
    ]
  },
  {
    id: 'security',
    title: 'AWS Security',
    description: 'Implement comprehensive security controls and compliance frameworks. Master AWS security services and best practices.',
    level: 'specialty',
    duration: '3-4 months',
    certification: 'AWS Certified Security - Specialty',
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-red-500',
    popularity: 85,
    completionRate: 68,
    avgSalary: '$145,000',
    jobRoles: ['Security Engineer', 'Cloud Security Architect', 'Compliance Specialist', 'Security Consultant'],
    skills: ['Security Architecture', 'Compliance', 'Incident Response', 'Threat Detection', 'Data Protection'],
    modules: [
      {
        id: 'security-fundamentals',
        title: 'Security Fundamentals',
        description: 'Core security concepts and AWS security services',
        duration: '3 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['IAM Advanced', 'VPC Security', 'GuardDuty', 'Security Hub', 'WAF', 'Shield'],
        prerequisites: ['AWS Cloud Fundamentals'],
        outcomes: ['Design secure architectures', 'Implement threat detection', 'Manage compliance'],
        resources: [
          {
            type: 'course',
            title: 'Security Engineering on AWS',
            duration: '12 hours',
            difficulty: 'advanced',
            url: 'https://aws.amazon.com/training/classroom/security-engineering-on-aws/',
            description: 'Advanced security engineering practices',
            provider: 'AWS Training'
          },
          {
            type: 'workshop',
            title: 'AWS Security Workshops',
            duration: '8 hours',
            difficulty: 'intermediate',
            url: 'https://catalog.workshops.aws/security/',
            description: 'Hands-on security implementation workshops',
            provider: 'AWS Workshops'
          },
          {
            type: 'whitepaper',
            title: 'AWS Security Best Practices',
            duration: '4 hours',
            difficulty: 'intermediate',
            url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-security-best-practices/',
            description: 'Comprehensive security best practices guide',
            provider: 'AWS Whitepapers'
          }
        ]
      },
      {
        id: 'security-identity',
        title: 'Identity and Access Management',
        description: 'Master advanced IAM concepts, federation, and access controls',
        duration: '3 weeks',
        difficulty: 'advanced',
        completed: false,
        topics: ['IAM Policies', 'SAML Federation', 'AWS SSO', 'Cognito', 'Directory Service', 'Organizations SCPs'],
        prerequisites: ['Security Fundamentals'],
        outcomes: ['Implement federated access', 'Design identity architectures', 'Manage enterprise access'],
        resources: [
          {
            type: 'workshop',
            title: 'Identity and Access Management Workshop',
            duration: '6 hours',
            difficulty: 'advanced',
            url: 'https://catalog.workshops.aws/iam/',
            description: 'Advanced IAM implementation patterns',
            provider: 'AWS Workshops'
          },
          {
            type: 'course',
            title: 'Advanced Security on AWS',
            duration: '10 hours',
            difficulty: 'expert',
            url: 'https://aws.amazon.com/training/classroom/advanced-security-on-aws/',
            description: 'Advanced security architecture and implementation',
            provider: 'AWS Training'
          }
        ]
      },
      {
        id: 'security-compliance',
        title: 'Compliance and Governance',
        description: 'Implement compliance frameworks and security governance',
        duration: '3 weeks',
        difficulty: 'advanced',
        completed: false,
        topics: ['AWS Config', 'CloudTrail', 'AWS Audit Manager', 'Compliance Frameworks', 'Security Assessments', 'Remediation'],
        prerequisites: ['Identity and Access Management'],
        outcomes: ['Implement compliance automation', 'Design governance frameworks', 'Manage security assessments'],
        resources: [
          {
            type: 'workshop',
            title: 'Governance and Compliance Workshop',
            duration: '4 hours',
            difficulty: 'advanced',
            url: 'https://catalog.workshops.aws/well-architected-security/',
            description: 'Security governance and compliance automation',
            provider: 'AWS Workshops'
          },
          {
            type: 'whitepaper',
            title: 'Compliance Validation Guide',
            duration: '3 hours',
            difficulty: 'advanced',
            url: 'https://docs.aws.amazon.com/whitepapers/latest/compliance-validation-guide/',
            description: 'Guide to compliance validation on AWS',
            provider: 'AWS Documentation'
          }
        ]
      }
    ]
  },
  {
    id: 'data-analytics',
    title: 'AWS Data Analytics',
    description: 'Build end-to-end data analytics solutions. Master data lakes, ETL, streaming, and visualization.',
    level: 'specialty',
    duration: '4-5 months',
    certification: 'AWS Certified Data Analytics - Specialty',
    icon: <Database className="w-6 h-6" />,
    color: 'bg-indigo-500',
    popularity: 80,
    completionRate: 62,
    avgSalary: '$150,000',
    jobRoles: ['Data Engineer', 'Analytics Engineer', 'Data Architect', 'BI Developer'],
    skills: ['Data Engineering', 'ETL/ELT', 'Real-time Analytics', 'Data Visualization', 'Big Data'],
    modules: [
      {
        id: 'analytics-fundamentals',
        title: 'Data Analytics Foundations',
        description: 'Core concepts of data analytics and AWS analytics services',
        duration: '4 weeks',
        difficulty: 'intermediate',
        completed: false,
        topics: ['S3 Data Lake', 'Glue ETL', 'Athena', 'Kinesis', 'Redshift', 'QuickSight'],
        prerequisites: ['SQL Knowledge', 'Data Concepts'],
        outcomes: ['Build data lakes', 'Design ETL pipelines', 'Create analytics dashboards'],
        resources: [
          {
            type: 'course',
            title: 'Data Analytics Fundamentals',
            duration: '14 hours',
            difficulty: 'intermediate',
            url: 'https://aws.amazon.com/training/classroom/data-analytics-fundamentals/',
            description: 'Comprehensive data analytics training',
            provider: 'AWS Training'
          },
          {
            type: 'workshop',
            title: 'Data Lake Workshop',
            duration: '6 hours',
            difficulty: 'intermediate',
            url: 'https://catalog.workshops.aws/data-lake/',
            description: 'Build a complete data lake solution',
            provider: 'AWS Workshops'
          },
          {
            type: 'lab',
            title: 'Query Data with Amazon Athena',
            duration: '2 hours',
            difficulty: 'beginner',
            url: 'https://aws.amazon.com/getting-started/hands-on/query-data-amazon-athena/',
            description: 'Hands-on Athena querying lab',
            provider: 'AWS Hands-On'
          }
        ]
      },
      {
        id: 'analytics-streaming',
        title: 'Real-time Data Streaming',
        description: 'Implement real-time data processing and streaming analytics',
        duration: '4 weeks',
        difficulty: 'advanced',
        completed: false,
        topics: ['Kinesis Data Streams', 'Kinesis Analytics', 'Kinesis Firehose', 'MSK', 'Lambda Streaming', 'Real-time Dashboards'],
        prerequisites: ['Data Analytics Foundations'],
        outcomes: ['Build streaming pipelines', 'Process real-time data', 'Implement stream analytics'],
        resources: [
          {
            type: 'workshop',
            title: 'Real-time Analytics Workshop',
            duration: '8 hours',
            difficulty: 'advanced',
            url: 'https://catalog.workshops.aws/realtime-analytics/',
            description: 'Complete real-time analytics implementation',
            provider: 'AWS Workshops'
          },
          {
            type: 'course',
            title: 'Advanced Data Analytics on AWS',
            duration: '16 hours',
            difficulty: 'expert',
            url: 'https://aws.amazon.com/training/classroom/advanced-data-analytics-on-aws/',
            description: 'Advanced analytics techniques and architectures',
            provider: 'AWS Training'
          }
        ]
      },
      {
        id: 'analytics-warehouse',
        title: 'Data Warehousing and BI',
        description: 'Design and implement data warehouses and business intelligence solutions',
        duration: '4 weeks',
        difficulty: 'advanced',
        completed: false,
        topics: ['Redshift Architecture', 'Data Modeling', 'ETL Best Practices', 'QuickSight Advanced', 'Performance Optimization', 'Cost Management'],
        prerequisites: ['Real-time Data Streaming'],
        outcomes: ['Design data warehouses', 'Optimize query performance', 'Build BI dashboards'],
        resources: [
          {
            type: 'workshop',
            title: 'Data Warehousing Workshop',
            duration: '6 hours',
            difficulty: 'advanced',
            url: 'https://catalog.workshops.aws/redshift-immersionday/',
            description: 'Complete data warehousing with Redshift',
            provider: 'AWS Workshops'
          },
          {
            type: 'whitepaper',
            title: 'Data Warehousing on AWS',
            duration: '3 hours',
            difficulty: 'advanced',
            url: 'https://docs.aws.amazon.com/whitepapers/latest/data-warehousing-on-aws/',
            description: 'Best practices for data warehousing on AWS',
            provider: 'AWS Whitepapers'
          }
        ]
      }
    ]
  }
];

export default function LearningPaths() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle classNameName="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'lab': return <Zap className="w-4 h-4" />;
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'certification': return <Award className="w-4 h-4" />;
      case 'workshop': return <Users className="w-4 h-4" />;
      case 'whitepaper': return <FileText className="w-4 h-4" />;
      case 'case-study': return <Lightbulb className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (selectedPath) {
    const path = learningPaths.find(p => p.id === selectedPath);
    if (!path) return null;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPath(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Paths
                </Button>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${path.color} text-white`}>
                    {path.icon}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      {path.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {path.certification}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{path.level.toUpperCase()}</Badge>
                <Badge variant="outline">{path.duration}</Badge>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Learning Path Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">{path.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Skills</h4>
                        <div className="space-y-1">
                          {path.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="mr-1 mb-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Career Opportunities</h4>
                        <div className="space-y-1">
                          {path.jobRoles.map(role => (
                            <div key={role} className="text-sm text-gray-600 dark:text-gray-300">
                              • {role}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Path Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Popularity</span>
                        <span>{path.popularity}%</span>
                      </div>
                      <Progress value={path.popularity} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>{path.completionRate}%</span>
                      </div>
                      <Progress value={path.completionRate} className="h-2" />
                    </div>
                    {path.avgSalary && (
                      <div className="pt-2 border-t">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Average Salary</div>
                        <div className="text-2xl font-bold text-green-600">{path.avgSalary}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-4">
                {path.modules.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold">{module.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDifficultyColor(module.difficulty)}>{module.difficulty}</Badge>
                          <Badge variant="outline">{module.duration}</Badge>
                          {module.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="ml-11 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Learning Outcomes</h4>
                          <ul className="space-y-1">
                            {module.outcomes.map((outcome, i) => (
                              <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                                <Target className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Topics Covered</h4>
                          <div className="flex flex-wrap gap-1">
                            {module.topics.map(topic => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Learning Resources</h4>
                          <div className="grid gap-3">
                            {module.resources.map((resource, i) => (
                              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  {getResourceIcon(resource.type)}
                                  <div>
                                    <h5 className="font-medium">{resource.title}</h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="outline" className="text-xs">{resource.provider}</Badge>
                                      {resource.duration && (
                                        <Badge variant="outline" className="text-xs">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {resource.duration}
                                        </Badge>
                                      )}
                                      <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                                        {resource.difficulty}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <Button size="sm" variant="ghost" asChild>
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid gap-4">
                {path.modules.flatMap(module => module.resources).map((resource, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getResourceIcon(resource.type)}
                          <div>
                            <h4 className="font-semibold">{resource.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">{resource.provider}</Badge>
                              {resource.duration && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {resource.duration}
                                </Badge>
                              )}
                              <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                                {resource.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            Start Learning
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>0 / {path.modules.length} modules</span>
                      </div>
                      <Progress value={0} className="h-3" />
                    </div>

                    <div className="grid gap-3">
                      {path.modules.map((module, index) => (
                        <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold text-xs">
                              {index + 1}
                            </div>
                            <span className="font-medium">{module.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{module.duration}</Badge>
                            {module.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Button size="sm">Start</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

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
                AWS Learning Paths
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Accelerate Your Cloud Career
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive learning paths designed to help you master AWS services and earn industry-recognized certifications.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <Card key={path.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPath(path.id)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${path.color} text-white`}>
                    {path.icon}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{path.popularity}%</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={path.level === 'specialty' ? 'default' : 'secondary'}>
                    {path.level.charAt(0).toUpperCase() + path.level.slice(1)}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {path.duration}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span>{path.completionRate}%</span>
                  </div>
                  <Progress value={path.completionRate} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {path.certification}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {path.modules.length} modules
                    </div>
                  </div>
                  {path.avgSalary && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Avg Salary</div>
                      <div className="font-semibold text-green-600">{path.avgSalary}</div>
                    </div>
                  )}
                </div>

                <Button className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Start Learning Path
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
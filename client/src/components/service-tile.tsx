import { type AwsService } from "@shared/schema";
import { ExternalLink, Server, Database, Brain, Shield, Globe, Network, Code, Search, BarChart3, FileText, Zap, Star, Award, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ServiceTileProps {
  service: AwsService;
  onClick: () => void;
  onDeepDive?: () => void;
  viewMode: "compact" | "expanded";
  isFavorite?: boolean;
  onToggleFavorite?: (event: React.MouseEvent) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Compute":
      return <Server className="w-6 h-6" />;
    case "Database":
      return <Database className="w-6 h-6" />;
    case "Machine Learning":
      return <Brain className="w-6 h-6" />;
    case "Security":
      return <Shield className="w-6 h-6" />;
    case "Networking":
      return <Network className="w-6 h-6" />;
    case "Developer Tools":
      return <Code className="w-6 h-6" />;
    case "Analytics":
      return <BarChart3 className="w-6 h-6" />;
    case "Storage":
      return <FileText className="w-6 h-6" />;
    case "Microservices":
      return <Network className="w-6 h-6" />;
    default:
      return <Zap className="w-6 h-6" />;
  }
};

const getStatusIcon = (status: string | null) => {
  switch (status) {
    case "operational":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "degraded":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "outage":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <CheckCircle className="w-4 h-4 text-green-500" />;
  }
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "operational":
      return "bg-green-500";
    case "degraded":
      return "bg-yellow-500";
    case "outage":
      return "bg-red-500";
    default:
      return "bg-green-500";
  }
};

const getCategoryGradientClass = (category: string) => {
  switch (category) {
    case "Analytics":
      return "category-gradient-analytics";
    case "Compute":
      return "category-gradient-compute";
    case "Database":
      return "category-gradient-database";
    case "Machine Learning":
      return "category-gradient-ml";
    case "Storage":
      return "category-gradient-storage";
    case "Security":
      return "category-gradient-security";
    case "Networking":
      return "category-gradient-networking";
    case "Developer Tools":
      return "category-gradient-developer-tools";
    case "Microservices":
      return "category-gradient-microservices";
    default:
      return "category-gradient-compute";
  }
};

export function ServiceTile({ service, onClick, onDeepDive, viewMode, isFavorite = false, onToggleFavorite }: ServiceTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const categoryIcon = getCategoryIcon(service.category);
  const gradientClass = getCategoryGradientClass(service.category);
  
  // Convert hex to rgba for transparency effects
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
    onClick();
  };

  const handleDeepDive = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDeepDive) {
      onDeepDive();
    }
  };

  const tooltipContent = (
    <div className="max-w-xs p-2">
      <h4 className="font-semibold text-sm mb-1">{service.name}</h4>
      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{service.fullName}</p>
      <div className="flex items-center justify-between">
        <span 
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: hexToRgba(service.color, 0.1),
            color: service.color
          }}
        >
          {service.category}
        </span>
        <span className="text-xs text-gray-500">Click to open docs</span>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              relative group rounded-xl shadow-sm border transition-all duration-300 cursor-pointer animate-fade-in
              ${gradientClass}
              ${viewMode === "compact" ? "tile-compact" : "tile-expanded"}
              ${isHovered ? "shadow-lg scale-105 border-blue-300 dark:border-blue-600" : "border-blue-100 dark:border-blue-900/50"}
              ${isBouncing ? "animate-bounce" : ""}
              hover:shadow-xl hover:scale-105 hover:animate-pulse
              dark:bg-slate-800/50 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10
            `}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Status Indicator */}
            <div className="absolute top-2 right-8 z-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)} animate-pulse`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(service.status)}
                      <span className="capitalize">
                        {service.status || "operational"}
                      </span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              {/* Service Icon */}
              <div 
                className={`
                  service-icon flex items-center justify-center rounded-lg transition-all duration-300
                  ${isHovered ? "scale-110" : ""}
                `}
                style={{ 
                  backgroundColor: hexToRgba(service.color, 0.15),
                  color: service.color
                }}
              >
                {categoryIcon}
              </div>
              
              {/* Service Names */}
              <div className="space-y-1">
                <h3 className="service-name font-semibold text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <p className="service-description text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  {service.fullName}
                </p>
              </div>
              
              {/* Category Badge */}
              <div 
                className="category-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-300"
                style={{ 
                  backgroundColor: hexToRgba(service.color, 0.1),
                  color: service.color,
                  borderColor: hexToRgba(service.color, 0.3)
                }}
              >
                <span>{service.category}</span>
              </div>

              {/* Certification Track Badges - only show if tracks exist and in expanded mode */}
              {viewMode === "expanded" && service.certificationTracks && service.certificationTracks.length > 0 && (
                <div className="certification-tracks flex flex-wrap items-center justify-center gap-1 mt-2">
                  <Award className="w-3 h-3 text-yellow-500 mb-1" />
                  <div className="flex flex-wrap justify-center gap-1 max-w-full">
                    {service.certificationTracks.slice(0, 2).map((track, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs px-1.5 py-0.5 bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800 whitespace-nowrap"
                      >
                        {track.replace("AWS Certified ", "").replace(" – ", " ")}
                      </Badge>
                    ))}
                    {service.certificationTracks.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs px-1.5 py-0.5 text-gray-600 dark:text-gray-400"
                      >
                        +{service.certificationTracks.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Deep Dive Button - only show in expanded mode */}
              {viewMode === "expanded" && onDeepDive && (
                <button
                  onClick={handleDeepDive}
                  className="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/80 dark:bg-slate-700/80 border border-gray-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  style={{ 
                    borderColor: `${service.color}30`,
                  }}
                >
                  <Brain className="w-3 h-3" />
                  Deep Dive
                </button>
              )}
            </div>
            
            {/* Favorites star */}
            {onToggleFavorite && (
              <div 
                className="absolute top-2 left-2 transition-all duration-200 cursor-pointer z-10"
                onClick={onToggleFavorite}
              >
                <Star 
                  className={`w-5 h-5 transition-all duration-200 hover:scale-110 ${
                    isFavorite 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-400 hover:text-yellow-400"
                  }`}
                />
              </div>
            )}

            {/* External link indicator */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110">
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </div>

            {/* Hover glow effect */}
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${hexToRgba(service.color, 0.2)} 0%, transparent 70%)`
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AwsService } from "@shared/schema";

interface HealthStatus {
  operational: number;
  degraded: number;
  outage: number;
  total: number;
}

export function HealthDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);

  // Fetch all services to calculate health status
  const { data: services = [], isLoading } = useQuery<AwsService[]>({
    queryKey: ["/api/services"],
    refetchInterval: isAutoRefresh ? 30000 : false, // Auto-refresh every 30 seconds if enabled
  });

  // Health check mutation
  const healthCheckMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/health-check"),
    onSuccess: (data: any) => {
      toast({
        title: "Health Check Complete",
        description: `Updated ${data.updatedServices} services`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: () => {
      toast({
        title: "Health Check Failed",
        description: "Could not update service statuses",
        variant: "destructive",
      });
    }
  });

  // Calculate health statistics
  const healthStats: HealthStatus = services.reduce(
    (stats, service) => {
      const status = service.status || "operational";
      stats[status as keyof Omit<HealthStatus, "total">]++;
      stats.total++;
      return stats;
    },
    { operational: 0, degraded: 0, outage: 0, total: 0 }
  );

  const overallHealthPercentage = healthStats.total > 0 
    ? Math.round((healthStats.operational / healthStats.total) * 100)
    : 100;

  const getOverallStatusColor = () => {
    if (healthStats.outage > 0) return "text-red-500";
    if (healthStats.degraded > 0) return "text-yellow-500";
    return "text-green-500";
  };

  const getOverallStatusIcon = () => {
    if (healthStats.outage > 0) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (healthStats.degraded > 0) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  // Auto-refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefresh, queryClient]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            AWS Service Health Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading health status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          AWS Service Health Dashboard
        </CardTitle>
        <CardDescription>
          Real-time monitoring of AWS service status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Status */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            {getOverallStatusIcon()}
            <div>
              <h3 className={`text-lg font-semibold ${getOverallStatusColor()}`}>
                {overallHealthPercentage}% Operational
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {healthStats.total} total services
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={isAutoRefresh ? "bg-green-50 border-green-200 text-green-700" : ""}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isAutoRefresh ? "animate-spin" : ""}`} />
              Auto-refresh {isAutoRefresh ? "ON" : "OFF"}
            </Button>
            
            <Button
              onClick={() => healthCheckMutation.mutate()}
              disabled={healthCheckMutation.isPending}
              size="sm"
            >
              {healthCheckMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Activity className="w-4 h-4 mr-1" />
              )}
              Run Health Check
            </Button>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-700 dark:text-green-300">Operational</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
              {healthStats.operational}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-yellow-700 dark:text-yellow-300">Degraded</span>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
              {healthStats.degraded}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-700 dark:text-red-300">Outage</span>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
              {healthStats.outage}
            </Badge>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
          {isAutoRefresh && " • Auto-refreshing every 30 seconds"}
        </div>
      </CardContent>
    </Card>
  );
}
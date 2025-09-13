import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, ExternalLink, RefreshCw, Clock, ArrowLeft, Info, ChevronDown, ChevronUp } from "lucide-react";
import { SiAmazonwebservices } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string;
  categories: string[];
}

interface NewsResponse {
  items: NewsItem[];
  lastUpdated: string;
  totalItems: number;
}

export default function News() {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showLegend, setShowLegend] = useState<boolean>(false);

  const { data: newsData, isLoading, error, refetch } = useQuery<NewsResponse>({
    queryKey: ["/api/news"],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  // Update last refresh time when data is successfully fetched (including auto-refetch)
  useEffect(() => {
    if (newsData) {
      setLastRefresh(new Date());
    }
  }, [newsData]);

  const handleRefresh = async () => {
    await refetch();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        return 'Recently';
      }
    } catch {
      return 'Recently';
    }
  };

  // Color categorization for news items based on content and source
  const getCategoryColor = (item: NewsItem): string => {
    const title = (item.title || '').toLowerCase();
    const source = (item.source || '').toLowerCase();
    const content = (item.contentSnippet || '').toLowerCase();
    
    // Check for security-related content
    if (title.includes('security') || content.includes('security') || source.includes('security') || 
        title.includes('compliance') || content.includes('compliance')) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
    
    // Check for announcements and launches
    if (title.includes('announcement') || title.includes('launch') || title.includes('introduces') ||
        title.includes('adds support') || title.includes('now supports') || title.includes('available')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    
    // Check for updates and improvements
    if (title.includes('update') || title.includes('improvement') || title.includes('enhanced') ||
        title.includes('improved') || content.includes('enhancement')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    
    // Check for blog content
    if (source.includes('blog') || source.includes('article')) {
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
    
    // Check for service and feature content
    if (title.includes('service') || title.includes('feature') || content.includes('service') ||
        title.includes('amazon') || title.includes('aws')) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
    
    // Check for guides and tutorials
    if (title.includes('guide') || title.includes('tutorial') || title.includes('how to') ||
        content.includes('learn more') || content.includes('documentation')) {
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
    
    // Default color
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Get appropriate category label based on the color
  const getCategoryLabel = (item: NewsItem): string => {
    const color = getCategoryColor(item);
    
    if (color.includes('red')) return 'Security & Compliance';
    if (color.includes('blue')) return 'Announcements & Launches';
    if (color.includes('green')) return 'Updates & Improvements';
    if (color.includes('purple')) return 'Blog Articles';
    if (color.includes('yellow')) return 'Services & Features';
    if (color.includes('cyan')) return 'Guides & Tutorials';
    return 'General';
  };

  // Legend data for category colors
  const categoryLegend = [
    { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Security & Compliance', description: 'Security updates and compliance information' },
    { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Announcements & Launches', description: 'New service announcements and launches' },
    { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Updates & Improvements', description: 'Service updates and improvements' },
    { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Blog Articles', description: 'Blog posts and articles' },
    { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Services & Features', description: 'Service and feature information' },
    { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: 'Guides & Tutorials', description: 'How-to guides and tutorials' },
    { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'General', description: 'General AWS content' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-4">
            <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-aws-orange rounded-lg">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <SiAmazonwebservices className="w-8 h-8 text-aws-orange" />
              <h1 className="text-3xl font-bold">AWS News & Updates</h1>
            </div>
          </div>
          <p className="text-gray-400 text-lg mb-4">
            Stay up-to-date with the latest AWS announcements, new services, and important updates
          </p>

          {/* Color Legend Toggle */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLegend(!showLegend)}
              className="text-gray-400 hover:text-white mb-3"
            >
              <Info className="w-4 h-4 mr-2" />
              Category Legend
              {showLegend ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
            
            {showLegend && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryLegend.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Badge variant="outline" className={`${item.color} min-w-fit`}>
                          {item.label}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Refresh Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Last updated: {formatDate(newsData?.lastUpdated || lastRefresh.toISOString())}</span>
              </div>
              {newsData && (
                <span>{newsData.totalItems} articles available</span>
              )}
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="bg-aws-orange hover:bg-aws-orange/90 text-white border-aws-orange hover:border-aws-orange/90"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/4 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-400">
                <Newspaper className="w-5 h-5" />
                <span className="font-medium">Failed to load AWS news</span>
              </div>
              <p className="text-gray-400 mt-2">
                Unable to fetch the latest AWS updates. Please try refreshing or check your connection.
              </p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="mt-4 border-red-600 text-red-400 hover:bg-red-900/30"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* News Items */}
        {newsData && newsData.items && (
          <div className="space-y-4">
            {newsData.items.map((item, index) => (
              <Card key={`${item.link}-${index}`} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight hover:text-aws-orange transition-colors">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0 opacity-60" />
                        </a>
                      </CardTitle>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                        <Badge variant="secondary" className="bg-aws-orange/20 text-aws-orange border-aws-orange/30">
                          {item.source}
                        </Badge>
                        <span>{formatTimeAgo(item.pubDate)}</span>
                        <span className="text-gray-500">•</span>
                        <span>{formatDate(item.pubDate)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {item.contentSnippet && (
                    <p className="text-gray-300 leading-relaxed">
                      {item.contentSnippet}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getCategoryColor(item)}`}
                    >
                      {getCategoryLabel(item)}
                    </Badge>
                    {item.categories && item.categories.length > 0 && item.categories.slice(0, 2).map((category, catIndex) => (
                      <Badge
                        key={catIndex}
                        variant="outline"
                        className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {newsData && (!newsData.items || newsData.items.length === 0) && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-center">
              <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No news available</h3>
              <p className="text-gray-500">
                No AWS news items could be loaded at this time. Try refreshing to check for updates.
              </p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="mt-4 bg-aws-orange hover:bg-aws-orange/90 text-white border-aws-orange hover:border-aws-orange/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh News
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
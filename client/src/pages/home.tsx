import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Sun, Moon, Grid3X3, LayoutGrid, Star, Trophy, BookOpen } from "lucide-react";
import { SiAmazonwebservices } from "react-icons/si";
import { Link } from "wouter";
import { ServiceTile } from "@/components/service-tile";
import { CategoryLegend } from "@/components/category-legend";
import { HealthDashboard } from "@/components/health-dashboard";
import { ServiceDeepDiveModal } from "@/components/service-deep-dive-modal";
import { useTheme } from "@/components/theme-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type AwsService, CertificationTrackEnum } from "@shared/schema";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCertificationTrack, setSelectedCertificationTrack] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"compact" | "expanded">("expanded");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [selectedServiceForDeepDive, setSelectedServiceForDeepDive] = useState<AwsService | null>(null);
  const [isDeepDiveModalOpen, setIsDeepDiveModalOpen] = useState(false);

  const { data: services, isLoading, error } = useQuery<AwsService[]>({
    queryKey: ["/api/services"],
  });

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("aws-services-favorites");
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(new Set(parsedFavorites));
      } catch (error) {
        console.error("Error parsing favorites:", error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("aws-services-favorites", JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const filteredServices = useMemo(() => {
    if (!services) return [];

    return services.filter((service) => {
      // Filter by tab (all or favorites)
      if (activeTab === "favorites" && !favorites.has(service.id)) {
        return false;
      }

      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === "all" || service.category === selectedCategory;

      const matchesCertificationTrack = 
        selectedCertificationTrack === "all" || 
        (service.certificationTracks && service.certificationTracks.includes(selectedCertificationTrack));

      return matchesSearch && matchesCategory && matchesCertificationTrack;
    });
  }, [services, searchQuery, selectedCategory, selectedCertificationTrack, activeTab, favorites]);

  const handleServiceClick = (service: AwsService) => {
    window.open(service.link, "_blank");
  };

   const handleDeepDive = (service: AwsService) => {
    setSelectedServiceForDeepDive(service);
    setIsDeepDiveModalOpen(true);
  };

  const handleCloseDeepDive = () => {
    setIsDeepDiveModalOpen(false);
    setSelectedServiceForDeepDive(null);
  };

  const toggleFavorite = (serviceId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the service link
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(serviceId)) {
        newFavorites.delete(serviceId);
      } else {
        newFavorites.add(serviceId);
      }
      return newFavorites;
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const categories = useMemo(() => {
    if (!services) return [];
    return Array.from(new Set(services.map(service => service.category)));
  }, [services]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-aws-orange rounded-lg flex items-center justify-center">
                  <SiAmazonwebservices className="text-white text-xl" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AWS Services Grid
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Discover and explore AWS services
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <div className="flex gap-4">
                <Link href="/learning-paths">
                  <Button 
                    variant="outline" 
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learning Paths
                  </Button>
                </Link>
                <Link href="/architecture-builder">
                  <Button 
                    variant="outline" 
                    className="bg-aws-orange hover:bg-aws-orange/90 text-white border-aws-orange hover:border-aws-orange/90"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Architecture Builder
                  </Button>
                </Link>
                <Link href="/challenge-mode">
                  <Button size="lg" variant="outline" className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950">
                    <Trophy className="w-5 h-5 mr-2" />
                    Challenge Mode
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-aws-orange transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-aws-orange focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out translate-x-0 dark:translate-x-5" />
                </Button>
                <Moon className="w-4 h-4 text-gray-400 dark:text-aws-orange" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search and Category Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search services by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:ring-aws-orange focus:border-aws-orange"
              />
            </div>

            {/* Category Filter and View Controls */}
            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:ring-aws-orange focus:border-aws-orange">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Certification Track Filter */}
              <Select value={selectedCertificationTrack} onValueChange={setSelectedCertificationTrack}>
                <SelectTrigger className="w-56 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:ring-aws-orange focus:border-aws-orange">
                  <SelectValue placeholder="All Certification Tracks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certification Tracks</SelectItem>
                  {CertificationTrackEnum.options.map((track) => (
                    <SelectItem key={track} value={track}>
                      {track}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Grid Density Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                <Button 
                  onClick={() => setViewMode("compact")}
                  variant={viewMode === "compact" ? "default" : "ghost"}
                  size="sm"
                  className="transition-all duration-200 h-8 w-8 p-0"
                  title="Compact view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => setViewMode("expanded")}
                  variant={viewMode === "expanded" ? "default" : "ghost"}
                  size="sm"
                  className="transition-all duration-200 h-8 w-8 p-0"
                  title="Expanded view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>

              {/* Results Count */}
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {filteredServices.length} services
              </span>
            </div>
          </div>

          {/* Category Legend */}
          <CategoryLegend />
        </div>

        {/* Health Dashboard */}
        <div className="mb-8">
          <HealthDashboard />
        </div>

        {/* Tabs for All Services / Favorites */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "favorites")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-slate-800 dark:bg-slate-700 border border-slate-600">
            <TabsTrigger 
              value="all" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              All Services
              {services && (
                <span className="text-xs bg-slate-600 text-slate-300 rounded-full px-2 py-1 ml-2">
                  {services.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors"
            >
              <Star className="w-4 h-4" />
              Favorites
              <span className="text-xs bg-slate-600 text-slate-300 rounded-full px-2 py-1 ml-2">
                {favorites.size}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="mx-auto max-w-md">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Error loading services
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    There was an error loading the AWS services. Please try again.
                  </p>
                </div>
              </div>
            )}

            {/* No Results State */}
            {!isLoading && !error && filteredServices.length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto max-w-md">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No services found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try adjusting your search terms or clearing the filters.
                  </p>
                  <Button 
                    onClick={handleClearFilters}
                    className="bg-aws-orange hover:bg-aws-orange/90 text-white"
                  >
                    Clear filters
                  </Button>
                </div>
              </div>
            )}

            {/* Services Grid */}
            {!isLoading && !error && filteredServices.length > 0 && (
              <div className={`grid gap-6 ${
                viewMode === "compact" 
                  ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10" 
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
              }`}>
                {filteredServices.map((service) => (
                  <ServiceTile
                    key={service.id}
                    service={service}
                    onClick={() => handleServiceClick(service)}
                    onDeepDive={() => handleDeepDive(service)}
                    viewMode={viewMode}
                    isFavorite={favorites.has(service.id)}
                    onToggleFavorite={(event) => toggleFavorite(service.id, event)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-0">
            {/* No Favorites State */}
            {!isLoading && !error && activeTab === "favorites" && filteredServices.length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto max-w-md">
                  <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Click the star icon on any service to add it to your favorites.
                  </p>
                </div>
              </div>
            )}

            {/* Favorites Grid */}
            {!isLoading && !error && filteredServices.length > 0 && (
              <div className={`grid gap-6 ${
                viewMode === "compact" 
                  ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10" 
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
              }`}>
                {filteredServices.map((service) => (
                  <ServiceTile
                    key={service.id}
                    service={service}
                    onClick={() => handleServiceClick(service)}
                    onDeepDive={() => handleDeepDive(service)}
                    viewMode={viewMode}
                    isFavorite={favorites.has(service.id)}
                    onToggleFavorite={(event) => toggleFavorite(service.id, event)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer Credit */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Made by Ved Prajapati
        </div>
      </footer>

      {/* Deep Dive Modal */}
      <ServiceDeepDiveModal
        service={selectedServiceForDeepDive}
        isOpen={isDeepDiveModalOpen}
        onClose={handleCloseDeepDive}
      />
    </div>
  );
};
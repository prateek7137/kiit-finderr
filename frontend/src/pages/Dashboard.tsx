import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ItemCardNew } from '@/components/ItemCardNew';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { itemService } from '@/services/itemService';
import { Item } from '@/types/item';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, ChevronDown, Loader2, AlertCircle, CheckCircle, Package, Menu } from 'lucide-react';

export const Dashboard = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentView, setCurrentView] = useState<'all' | 'lost' | 'found'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Initial load + live auto-refresh every 15 seconds (paused while the tab is hidden)
  useEffect(() => {
    fetchItems();

    const REFRESH_MS = 15000;
    const interval = setInterval(() => {
      if (!document.hidden) fetchItems(true);
    }, REFRESH_MS);

    const onVisible = () => {
      if (!document.hidden) fetchItems(true);
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // Go back to page 1 only when the user changes a filter (not on every auto-refresh)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, currentView]);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, statusFilter, categoryFilter, currentView]);

  useEffect(() => {
    paginateItems();
  }, [filteredItems, currentPage]);

  // silent = true is used by the auto-refresh: no loading spinner, no error toast
  const fetchItems = async (silent = false) => {
    try {
      const data = await itemService.getAllItems();
      // Only update state when something really changed, so the UI does not re-render for nothing
      setItems(prev => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    } catch (error) {
      if (!silent) {
        toast({
          title: "Error",
          description: "Failed to fetch items",
          variant: "destructive",
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Apply view filter first
    if (currentView !== 'all') {
      if (currentView === 'lost') {
        filtered = filtered.filter(item => item.status === 'LOST');
      } else if (currentView === 'found') {
        filtered = filtered.filter(item =>
          item.status === 'FOUND_PENDING' || item.status === 'FOUND_CONFIRMED'
        );
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.name || item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const paginateItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedItems(filteredItems.slice(0, endIndex));
  };

  const loadMoreItems = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500);
  };

  const handleViewChange = (view: 'all' | 'lost' | 'found') => {
    setCurrentView(view);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setCurrentView('all');
  };

  const categories = [...new Set(items.map(item => item.category))];
  const hasMoreItems = displayedItems.length < filteredItems.length;

  const tabTriggerClass =
    "rounded-lg sm:rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground transition-all duration-300 px-2 sm:px-4";
  const tabBadgeClass = "ml-1 sm:ml-2 text-xs px-1 bg-secondary text-secondary-foreground";
  const filterBadgeClass = "rounded-full text-xs px-2 py-1 bg-secondary text-secondary-foreground border border-border";

  if (loading) {
    return (
      <div className="flex min-h-screen hero-gradient">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-primary mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">Loading items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Same header as the home page */}
      <Header />

      <div className="flex">
        {/* Desktop Sidebar - Fixed/Sticky positioned below navbar */}
        <div className="hidden lg:block fixed left-0 top-14 sm:top-16 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main content with left margin for sidebar */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 lg:ml-64">
          {/* Mobile Header with Hamburger */}
          <div className="lg:hidden flex items-center justify-between mb-4 p-2 border-b border-border">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>

            <h1 className="text-lg font-bold text-foreground">
              Lost & Found
            </h1>

            <div className="w-10"></div> {/* Spacer for centering */}
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-primary">
                Lost & Found
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                Browse all items • {filteredItems.length} found
              </p>
            </div>

            {/* Category Tabs */}
            <Tabs value={currentView} onValueChange={(value) => handleViewChange(value as 'all' | 'lost' | 'found')} className="mb-4 sm:mb-6 lg:mb-8">
              <TabsList className="grid w-full grid-cols-3 h-auto rounded-xl sm:rounded-2xl p-1 bg-white border border-border shadow-sm text-xs sm:text-sm">
                <TabsTrigger value="all" className={tabTriggerClass}>
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">All Items</span>
                  <span className="sm:hidden">All</span>
                  <Badge variant="secondary" className={tabBadgeClass}>
                    {items.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="lost" className={tabTriggerClass}>
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Lost
                  <Badge variant="secondary" className={tabBadgeClass}>
                    {items.filter(item => item.status === 'LOST').length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="found" className={tabTriggerClass}>
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Found
                  <Badge variant="secondary" className={tabBadgeClass}>
                    {items.filter(item => item.status === 'FOUND_PENDING' || item.status === 'FOUND_CONFIRMED').length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Filter Section */}
              <div className="mb-4 sm:mb-6 lg:mb-8 mt-4 sm:mt-6">
                <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {/* Search Bar */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-lg sm:rounded-[16px] border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  </div>

                  {/* Filter Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-lg sm:rounded-[16px] border-border bg-white hover:bg-secondary h-10 sm:h-12 px-4 sm:px-6 text-sm text-foreground"
                  >
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Filters</span>
                    <span className="sm:hidden">Filter</span>
                    <ChevronDown
                      className={`w-3 h-3 sm:w-4 sm:h-4 ml-2 transition-transform duration-300 ${
                        showFilters ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                  <div className="bg-white rounded-xl sm:rounded-[20px] p-4 sm:p-6 border border-border shadow-sm fade-in-up">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px] rounded-lg sm:rounded-[12px] h-10 text-sm bg-white border-border text-foreground">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-border">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="LOST">Lost</SelectItem>
                          <SelectItem value="FOUND_PENDING">Found Pending</SelectItem>
                          <SelectItem value="FOUND_CONFIRMED">Found Confirmed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-[200px] rounded-lg sm:rounded-[12px] h-10 text-sm bg-white border-border text-foreground">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-border">
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="rounded-lg sm:rounded-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary text-sm h-10"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}

                {/* Active Filters Display */}
                {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || currentView !== 'all') && (
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                    {currentView !== 'all' && (
                      <Badge variant="secondary" className={filterBadgeClass}>
                        {currentView === 'lost' ? 'Lost' : 'Found'}
                      </Badge>
                    )}
                    {searchTerm && (
                      <Badge variant="secondary" className={filterBadgeClass}>
                        "{searchTerm}"
                      </Badge>
                    )}
                    {statusFilter !== 'all' && (
                      <Badge variant="secondary" className={filterBadgeClass}>
                        {statusFilter}
                      </Badge>
                    )}
                    {categoryFilter !== 'all' && (
                      <Badge variant="secondary" className={filterBadgeClass}>
                        {categoryFilter}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Items Grid */}
              <TabsContent value="all" className="mt-0">
                {renderItemsGrid()}
              </TabsContent>

              <TabsContent value="lost" className="mt-0">
                {renderItemsGrid()}
              </TabsContent>

              <TabsContent value="found" className="mt-0">
                {renderItemsGrid()}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );

  function renderItemsGrid() {
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-3">No items found</h3>
          <p className="text-muted-foreground mb-6">
            {currentView === 'all'
              ? 'Try adjusting your search terms or filters'
              : `No ${currentView} items match your criteria`
            }
          </p>
          <Button onClick={clearFilters} variant="outline" className="rounded-xl bg-white border-border text-foreground hover:bg-secondary">
            Clear All Filters
          </Button>
        </div>
      );
    }

    return (
      <>
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {displayedItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ItemCardNew
                item={item}
                onItemUpdate={() => fetchItems()}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreItems && (
          <div className="text-center">
            <Button
              onClick={loadMoreItems}
              disabled={loadingMore}
              size="lg"
              className="rounded-xl px-6 sm:px-8 py-2 sm:py-3 transition-all duration-300 hover:shadow-lg text-sm bg-white border-border text-foreground hover:bg-secondary"
              variant="outline"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    Load More ({filteredItems.length - displayedItems.length} remaining)
                  </span>
                  <span className="sm:hidden">
                    Load More ({filteredItems.length - displayedItems.length})
                  </span>
                </>
              )}
            </Button>
          </div>
        )}
      </>
    );
  }
};

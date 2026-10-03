import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ItemCardNew } from '@/components/ItemCardNew';
import { itemService } from '@/services/itemService';
import { Item } from '@/types/item';
import { useToast } from '@/hooks/use-toast';

export const MyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'LOST', label: 'Lost Items' },
    { id: 'FOUND', label: 'Found Items' }
  ];

  const matchesTab = (item: Item, tabId: string) => {
    if (tabId === 'all') return true;
    if (tabId === 'LOST') return item.status === 'LOST';
    if (tabId === 'FOUND') return item.status === 'FOUND_PENDING' || item.status === 'FOUND_CONFIRMED';
    return true;
  };

  const filteredItems = items.filter(item => matchesTab(item, activeTab));

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const data = await itemService.getMyItems();
      setItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen hero-gradient">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      <div className="flex">
        {/* Desktop Sidebar - Fixed/Sticky positioned below navbar */}
        <div className="hidden lg:block fixed left-0 top-14 sm:top-16 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar />
        </div>

        {/* Main content with left margin for sidebar */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white border border-border shadow-sm rounded-2xl p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                My Items
              </h1>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {tab.label} ({items.filter(item => matchesTab(item, tab.id)).length})
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              {filteredItems.length > 0 ? (
                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((item) => (
                    <ItemCardNew key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-foreground text-lg mb-2">
                    No {activeTab === 'all' ? '' : activeTab} items found
                  </div>
                  <p className="text-muted-foreground">
                    {activeTab === 'all'
                      ? "You haven't reported any items yet."
                      : `You haven't reported any ${activeTab} items yet.`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

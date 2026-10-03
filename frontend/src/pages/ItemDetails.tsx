import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { StatusBadge } from '@/components/StatusBadge';
import { FoundButton } from '@/components/FoundButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { itemService } from '@/services/itemService';
import { authService } from '@/services/authService';
import { Item } from '@/types/item';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, User, Phone, ArrowLeft, Star, AlertCircle, Award, Package } from 'lucide-react';

export const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const currentUser = authService.getCurrentUserFromStorage();

  // Check if current user can see "I Found This" button
  const title = (item?.name || item?.title || '').toLowerCase();
  let effectiveStatus = item?.status;

  // If the title suggests it's found but status says lost, correct it
  if (title.includes('found') && item?.status === 'LOST') {
    effectiveStatus = 'FOUND_CONFIRMED';
  }

  const canReportFound = effectiveStatus === 'LOST' &&
                        currentUser &&
                        item?.postedById !== currentUser.id;

  useEffect(() => {
    if (id) {
      fetchItem(parseInt(id));
    }
  }, [id]);

  const fetchItem = async (itemId: number) => {
    try {
      const data = await itemService.getItemById(itemId);
      setItem(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch item details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    // Handle inconsistent data - if title contains "found" but status is wrong
    const title = (item?.name || item?.title || '').toLowerCase();
    let displayStatus = item?.status;

    // If the title suggests it's found but status says lost, prioritize found
    if (title.includes('found') && item?.status === 'LOST') {
      displayStatus = 'FOUND_CONFIRMED';
    }

    if (!displayStatus) return null;
    return <StatusBadge status={displayStatus} size="lg" />;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null; // Invalid date
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const handleContact = () => {
    if (!item?.contactInfo) return;
    const contact = item.contactInfo.trim();
    const link = contact.includes('@') ? `mailto:${contact}` : `tel:${contact}`;
    window.location.href = link;
  };

  const cardClass = "bg-white border border-border shadow-sm rounded-3xl";
  const iconBoxClass = "w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0";
  const iconClass = "w-5 h-5 sm:w-6 sm:h-6 text-primary";
  const labelClass = "text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide";
  const valueClass = "text-sm sm:text-base lg:text-lg font-semibold text-foreground break-words";

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient">
        <Header />
        <div className="flex items-center justify-center p-4 min-h-[70vh]">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Loading Item Details</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen hero-gradient">
        <Header />
        <div className="flex items-center justify-center p-4 min-h-[70vh]">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-destructive" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3">Item Not Found</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">The requested item could not be found or may have been removed.</p>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
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
        {/* Desktop Sidebar - fixed below the header (hidden on mobile) */}
        <div className="hidden lg:block fixed left-0 top-14 sm:top-16 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
          <Sidebar />
        </div>

        <main className="flex-1 p-3 sm:p-4 lg:p-8 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            {/* Back Button and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="self-start text-primary hover:text-primary hover:bg-secondary text-sm sm:text-base rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>

              {canReportFound && (
                <FoundButton
                  itemId={item.id}
                  itemName={item.name || item.title || 'Unknown Item'}
                  onFound={() => {
                    // Refresh item details after reporting found
                    if (id) {
                      fetchItem(parseInt(id));
                    }
                  }}
                  className="self-start sm:self-center rounded-xl"
                />
              )}
            </div>

            {/* Main Content - Stack on mobile, side-by-side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Image Section */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <Card className={`overflow-hidden ${cardClass}`}>
                  {item.imageUrl ? (
                    <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[500px]">
                      <img
                        src={item.imageUrl}
                        alt={item.name || item.title || 'Item image'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        {getStatusBadge()}
                      </div>
                      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg line-clamp-2">
                          {item.name || item.title}
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-white/90 drop-shadow line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  ) : (
                    <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-secondary border border-border rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Package className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-primary/50" />
                      </div>
                      <div className="mb-3 sm:mb-4 flex justify-center">{getStatusBadge()}</div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4 break-words">{item.name || item.title}</h1>
                      <p className="text-base sm:text-lg text-muted-foreground break-words">{item.description}</p>
                    </CardContent>
                  )}
                </Card>
              </div>

              {/* Right column: Details, Category, then Contact */}
              <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                {/* Details */}
                <Card className={cardClass}>
                  <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">Details</h3>

                    {/* Location */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={iconBoxClass}>
                        <MapPin className={iconClass} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={labelClass}>Location</p>
                        <p className={valueClass}>{item.location}</p>
                      </div>
                    </div>

                    {/* Date Reported - prefer formatted date from backend */}
                    {(item.createdAtFormatted || formatDate(item.dateReported)) && (
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={iconBoxClass}>
                          <Calendar className={iconClass} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={labelClass}>Posted</p>
                          <p className={valueClass}>
                            {item.createdAtFormatted || formatDate(item.dateReported)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Reporter - only show if available */}
                    {(item.postedByName || item.userName) && (
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={iconBoxClass}>
                          <User className={iconClass} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={labelClass}>Reported By</p>
                          <p className={valueClass}>{item.postedByName || item.userName}</p>
                        </div>
                      </div>
                    )}

                    {/* Reward - only show if available */}
                    {item.reward && (
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-amber-700 uppercase tracking-wide">Reward</p>
                          <p className={valueClass}>₹{item.reward}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Category & Status */}
                <Card className={cardClass}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={iconBoxClass}>
                        <Star className={iconClass} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={labelClass}>Category</p>
                        <p className={valueClass}>{item.category}</p>
                      </div>
                    </div>
                    {!item.imageUrl && getStatusBadge() && (
                      <div className="pt-4 mt-4 border-t border-border">
                        {getStatusBadge()}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Information - highlighted, shown last */}
                <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 rounded-3xl shadow-lg ring-4 ring-primary/10">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 sm:gap-3">
                      <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </span>
                      Contact Information
                    </h3>

                    <div className="bg-white/15 border border-white/25 rounded-2xl p-3 sm:p-4 mb-4">
                      <p className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wide mb-1">Contact</p>
                      <p className="text-base sm:text-lg lg:text-xl font-bold break-all">{item.contactInfo}</p>
                    </div>

                    <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-4">
                      Please reach out to the contact person if you have information about this item or if you are the owner.
                    </p>

                    <Button
                      className="w-full bg-white text-primary hover:bg-white/90 font-semibold py-2 sm:py-3 rounded-xl shadow-md transition-all duration-300 text-sm sm:text-base"
                      onClick={handleContact}
                    >
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Contact Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, User, Trash2, Eye, Star, Award, Package } from "lucide-react";
import { Item } from '@/types/item';
import { Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { FoundButton } from './FoundButton';

interface ItemCardNewProps {
  item: Item;
  onDelete?: (id: number) => void;
  showDeleteButton?: boolean;
  onItemUpdate?: () => void;
}

export const ItemCardNew = ({ item, onDelete, showDeleteButton = false, onItemUpdate }: ItemCardNewProps) => {
  const currentUser = authService.getCurrentUserFromStorage();
  const canDelete = showDeleteButton && (currentUser?.role === 'ADMIN' || item.userId === currentUser?.id);

  // Handle inconsistent data - if the title says "found" but status is LOST, treat it as found
  const title = (item.name || item.title || '').toLowerCase();
  let displayStatus = item.status;
  if (title.includes('found') && item.status === 'LOST') {
    displayStatus = 'FOUND_CONFIRMED';
  }

  const canReportFound =
    displayStatus === 'LOST' &&
    currentUser &&
    item.postedById !== currentUser.id;

  const statusBadge = displayStatus ? <StatusBadge status={displayStatus} size="sm" /> : null;

  const getCardBorder = () => {
    if (displayStatus === 'FOUND_CONFIRMED') return "border-primary/30";
    if (displayStatus === 'FOUND_PENDING') return "border-amber-300";
    return "border-border";
  };

  return (
    <Card className={cn(
      "h-full flex flex-col overflow-hidden group relative",
      "bg-white border-2 rounded-3xl shadow-sm",
      "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      getCardBorder()
    )}>
      {/* User Header */}
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm border-2 border-white ring-1 ring-primary/30 shrink-0 aspect-square">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {item.postedByName || item.userName || 'Anonymous User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {item.createdAtFormatted ? `posted ${item.createdAtFormatted}` : 'reported'} • {item.location}
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative mx-4 sm:mx-5 mb-4 h-40 sm:h-44 rounded-2xl overflow-hidden border border-border bg-secondary/60">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name || item.title || 'Item image'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Package className="w-10 h-10 text-primary/40" />
            <p className="text-xs text-muted-foreground">No Image</p>
          </div>
        )}
        {statusBadge && (
          <div className="absolute top-3 right-3 z-20">
            {statusBadge}
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="px-4 sm:px-5 pt-0 pb-2 flex-1 flex flex-col">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="font-bold text-base sm:text-lg text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors duration-300">
            {item.name || item.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Quick Info - one per row so values are never cut off */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {item.category && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/50 border border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 aspect-square">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground leading-tight">Category</p>
                <p className="text-sm font-medium text-foreground break-words">{item.category}</p>
              </div>
            </div>
          )}

          {item.location && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/50 border border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 aspect-square">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground leading-tight">Location</p>
                <p className="text-sm font-medium text-foreground break-words">{item.location}</p>
              </div>
            </div>
          )}
        </div>

        {/* Reward */}
        {item.reward && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 mt-auto">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 aspect-square">
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-amber-700 uppercase tracking-wider leading-tight">Reward</p>
              <p className="text-sm font-bold text-foreground">₹{item.reward}</p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 sm:px-5 pt-3 pb-4 sm:pb-5 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Link to={`/item/${item.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-xl border-2 border-primary/30 bg-white text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 font-semibold text-sm h-10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>

          {canDelete && onDelete && (
            <Button
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="text-destructive hover:text-white hover:bg-destructive rounded-xl border-2 border-destructive/20 hover:border-destructive bg-white px-3 h-10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Found button - full width on its own row */}
        {canReportFound && (
          <FoundButton
            itemId={item.id}
            itemName={item.name || item.title || 'Unknown Item'}
            onFound={onItemUpdate}
            className="w-full rounded-xl text-sm h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
          />
        )}
      </CardFooter>
    </Card>
  );
};

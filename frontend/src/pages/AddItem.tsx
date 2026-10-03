import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { itemService } from '@/services/itemService';
import { CreateItemRequest } from '@/types/item';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export const AddItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateItemRequest>({
    title: '',
    description: '',
    category: '',
    status: 'LOST',
    location: '',
    contactInfo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // itemService.createItem already shows the success toast
      await itemService.createItem(formData);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateItemRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputClass = "bg-white border-border focus-visible:ring-primary";

  return (
    <div className="flex min-h-screen hero-gradient">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              Report an Item
            </h1>
            <p className="text-muted-foreground">
              Help others find their lost belongings or report found items
            </p>
          </div>

          <Card className="bg-white border border-border shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Item Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    className={inputClass}
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., iPhone 13 Pro, Blue Backpack"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    className={inputClass}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Provide detailed description including color, brand, distinctive features..."
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value: 'LOST' | 'FOUND') => handleChange('status', value)}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-border">
                        <SelectItem value="LOST">Lost</SelectItem>
                        <SelectItem value="FOUND">Found</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-border">
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Documents">Documents</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    className={inputClass}
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g., Central Library, Academic Block 2, Cafeteria"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Contact Information *</Label>
                  <Input
                    id="contactInfo"
                    className={inputClass}
                    value={formData.contactInfo}
                    onChange={(e) => handleChange('contactInfo', e.target.value)}
                    placeholder="Phone number or email for contact"
                    required
                  />
                </div>

                <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
                  {loading ? "Reporting..." : "Report Item"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

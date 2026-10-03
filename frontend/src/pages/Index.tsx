import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, PackageSearch, Handshake, Users, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/KIITBBSR.jpeg";

// Mock data for demonstration
const mockItems = [
  {
    id: "1",
    title: "MacBook Pro 13-inch",
    description: "Silver MacBook Pro with stickers. Lost near Library.",
    category: "Electronics",
    status: "lost" as const,
    date: "2024-01-20",
    location: "Central Library",
    contactPerson: "Rahul S.",
  },
  {
    id: "2",
    title: "Blue Water Bottle",
    description: "Insulated blue water bottle with KIIT logo.",
    category: "Other",
    status: "found" as const,
    date: "2024-01-19",
    location: "Academic Block 3",
    contactPerson: "Priya M.",
  },
  {
    id: "3",
    title: "Physics Textbook",
    description: "Resnick Halliday Physics textbook, lots of notes inside.",
    category: "Books",
    status: "lost" as const,
    date: "2024-01-18",
    location: "Hostel B",
    contactPerson: "Arjun K.",
  },
  {
    id: "4",
    title: "Black Earphones",
    description: "Sony WH-1000XM4 noise cancelling headphones in black.",
    category: "Electronics",
    status: "found" as const,
    date: "2024-01-17",
    location: "Cafeteria",
    contactPerson: "Sneha L.",
  },
];

const stats = [
  { icon: PackageSearch, value: "50+", label: "Items Reported" },
  { icon: Handshake, value: "20+", label: "Matches Found" },
  { icon: Users, value: "120+", label: "Active Users" },
  { icon: ShieldCheck, value: "Official Support by", label: "KIIT University", small: true },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Lost it on campus?<br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  We'll help you find it!
                </span>
              </h1>
              <p className="text-lg md:text-1xl text-muted-foreground max-w-lg">
                KIIT Finder is a central campus platform that connects students to quickly report and reclaim lost belongings dedicatedly designed for KIITians.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/report-lost">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-primary text-primary-foreground border border-primary/40 shadow-gentle transition-all duration-300 hover:bg-none hover:bg-background hover:text-primary hover:border-primary hover:ring-2 hover:ring-primary/30 hover:shadow-soft hover:-translate-y-0.5">
                    <Plus className="w-5 h-5 mr-2" />
                    Report Lost Item
                  </Button>
                </Link>
                <Link to="/report-found">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto border border-primary/30 transition-all duration-300 hover:bg-gradient-primary hover:text-primary-foreground hover:border-primary hover:ring-2 hover:ring-primary/30 hover:shadow-soft hover:-translate-y-0.5">
                    <Heart className="w-5 h-5 mr-2" />
                    Report Found Item
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-96 flex items-center justify-center"> 
              <img src={heroImage} alt="KIIT University campus, Bhubaneswar" className="w-full h-full object-cover rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Search Lost & Found Items
            </h2>
            <p className="text-muted-foreground">
              Browse through recent reports or search for your specific item
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {stats.map(({ icon: Icon, value, label, small }) => (
            <div
              key={label}
              className="group card-soft relative overflow-hidden px-8 py-6 text-center cursor-default transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Gradient layer fades in on hover */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-95" />
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center transition-colors duration-300 group-hover:bg-none group-hover:bg-white/20">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3
                  className={`font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary-foreground ${
                    small ? "text-base leading-snug text-balance sm:text-lg" : "text-2xl"
                  }`}
                >
                  {value}
                </h3>
                <p className="text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground/90">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Recent Reports by Students</h2>
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockItems.map((item) => (
            <ItemCard key={item.id} {...item} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Items
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

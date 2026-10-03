import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Instagram, Home } from "lucide-react";

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="mt-20 bg-gradient-card border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/KIIT-logo-HD.png"
                alt="KIIT University logo"
                className="h-10 w-auto object-contain"
              />
              <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                KIIT Finder
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Helping KIIT Students to quickly report and reclaim lost belongings.</p>
            <p className="text-muted-foreground text-sm">
              Built with ❤️ especially for KIIT ecosystem.</p>
              
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Search Items
                </a>
              </li>
              <li>
                <a href="/report-lost" className="text-muted-foreground hover:text-primary transition-colors">
                  Report Lost Item
                </a>
              </li>
              <li>
                <a href="/report-found" className="text-muted-foreground hover:text-primary transition-colors">
                  Report Found Item
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  My Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <a href="tel:+918700612578" className="hover:text-primary transition-colors">
                  +91 8700612578
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <a
                  href="mailto:support@kiitfinder.prateeksingh.co.in"
                  className="min-w-0 break-all hover:text-primary transition-colors"
                >
                  support@kiitfinder.prateeksingh.co.in
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>KIIT University, Bhubaneswar</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Follow Us</h4>
            <div className="flex gap-3">
              <Button asChild size="icon" variant="outline" className="rounded-full w-10 h-10">
                <a href="https://kiit.ac.in/" target="_blank" rel="noopener noreferrer" aria-label="KIIT University website">
                  <Home className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild size="icon" variant="outline" className="rounded-full w-10 h-10">
                <a href="https://www.instagram.com/kiituniversity/" target="_blank" rel="noopener noreferrer" aria-label="KIIT University on Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild size="icon" variant="outline" className="rounded-full w-10 h-10">
                <a href="https://x.com/KIITUniversity" target="_blank" rel="noopener noreferrer" aria-label="KIIT University on X">
                  <XLogo className="w-4 h-4" />
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Stay connected for updates and community stories!
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 KIIT Finder. Made by KIITians, For KIITians.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Scissors, Phone, User, Heart, ShoppingBag, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "Uniforms", path: "/uniforms" },
  { name: "Men's Tailoring", path: "/mens" },
  { name: "Measurements", path: "/measurements" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <SheetHeader className="p-4 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                      <Scissors className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <SheetTitle className="text-left font-display text-lg">StitchCraft</SheetTitle>
                      <p className="text-xs text-muted-foreground">Premium Tailoring</p>
                    </div>
                  </div>
                </SheetHeader>
                
                <nav className="flex flex-col py-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors border-b border-border/30 ${
                        location.pathname === link.path
                          ? "bg-primary/10 text-primary border-l-4 border-l-primary"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-muted/30">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" /> Call Us
                    </Button>
                    <Button variant="gold" size="sm" className="w-full">
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
                <Scissors className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-display font-bold text-foreground leading-none">
                  StitchCraft
                </h1>
                <p className="text-[10px] md:text-xs text-muted-foreground">Premium Tailoring</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions - Myntra Style */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Contact">
              <Phone className="w-5 h-5" />
            </Button>
            
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {/* Wishlist count badge - can be made dynamic */}
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-[10px] font-bold text-accent-foreground rounded-full flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {/* Cart count badge - can be made dynamic */}
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-[10px] font-bold text-accent-foreground rounded-full flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Profile">
              <User className="w-5 h-5" />
            </Button>
            
            <Button variant="gold" size="sm" className="hidden md:flex">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

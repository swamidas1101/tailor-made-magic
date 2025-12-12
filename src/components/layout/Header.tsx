import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Scissors, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-bold text-foreground leading-none">
                StitchCraft
              </h1>
              <p className="text-xs text-muted-foreground">Premium Tailoring</p>
            </div>
          </Link>

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

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="gold" size="sm" className="hidden sm:flex">
              Book Now
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-border/50 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="w-4 h-4 mr-1" /> Call Us
                </Button>
                <Button variant="gold" size="sm" className="flex-1">
                  Book Now
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Scissors, Phone, Heart, ShoppingBag, ChevronRight, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "@/components/auth/UserMenu";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

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
  const { totalItems: cartCount, justAdded } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  return (
    <motion.header 
      className="sticky top-0 z-50 glass border-b border-border/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-rose/10"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-0 bg-card">
                <SheetHeader className="p-5 border-b border-border/50 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Scissors className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <SheetTitle className="text-left font-display text-xl text-white">Tailo</SheetTitle>
                      <SheetDescription className="text-xs text-white/80">Premium Tailoring Services</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
                
                <nav className="flex flex-col py-4">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between px-5 py-4 text-sm font-medium transition-all ${
                          location.pathname === link.path
                            ? "bg-orange-50 text-orange-600 border-l-4 border-l-orange-500"
                            : "text-foreground hover:bg-muted/50 hover:pl-6"
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-border/50 bg-muted/30">
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" size="default" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" /> Call Us
                    </Button>
                    <Button variant="rose" size="default" className="w-full" asChild>
                      <Link to="/categories">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Explore Designs
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Scissors className="w-5 h-5 md:w-5 md:h-5 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-display font-bold text-foreground leading-none">
                  Tailo
                </h1>
                <p className="text-[10px] md:text-xs text-muted-foreground font-medium">Premium Tailoring</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 text-sm font-medium transition-colors group"
              >
                <span className={location.pathname === link.path ? "text-orange-600" : "text-foreground/80 group-hover:text-foreground"}>
                  {link.name}
                </span>
                {location.pathname === link.path && (
                  <motion.div 
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-orange-50" aria-label="Contact">
                <Phone className="w-5 h-5" />
              </Button>
            </motion.div>
            
            <Link to="/wishlist">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative hover:bg-orange-50" aria-label="Wishlist">
                  <Heart className="w-5 h-5" />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span 
                        className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-amber-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-md"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </Link>
            
            <Link to="/cart">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`relative hover:bg-orange-50 transition-all duration-500 ${justAdded ? "scale-110" : ""}`} 
                  aria-label="Cart"
                >
                  <ShoppingBag className={`w-5 h-5 transition-all duration-500 ${justAdded ? "text-green-500" : ""}`} />
                  <AnimatePresence>
                    <motion.span 
                      className={`absolute -top-1 -right-1 min-w-5 h-5 px-1 text-[10px] font-bold rounded-full flex items-center justify-center shadow-md ${
                        justAdded 
                          ? "bg-green-500 text-white" 
                          : cartCount > 0 
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white" 
                            : "bg-muted text-muted-foreground"
                      }`}
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {cartCount}
                    </motion.span>
                  </AnimatePresence>
                  {justAdded && (
                    <motion.span 
                      className="absolute inset-0 rounded-full bg-green-500/20"
                      initial={{ scale: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </Button>
              </motion.div>
            </Link>
            
            {/* User Menu with Dropdown */}
            <UserMenu />
            
            <Button variant="default" size="sm" className="hidden md:flex group" asChild>
              <Link to="/categories">
                Book Now
                <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

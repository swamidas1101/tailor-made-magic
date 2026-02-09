import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Scissors, Phone, Heart, ShoppingBag, ChevronRight, X, Sparkles, ChevronDown, ArrowRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "@/components/auth/UserMenu";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { categories, menCategories } from "@/data/mockData";

const navLinks = [
  { name: "Home", path: "/" },
  // Categories is handled separately
  { name: "Materials", path: "/materials" },
  { name: "Uniforms", path: "/uniforms" },
  { name: "Measurements", path: "/measurements" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems: cartCount, justAdded } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, activeRole } = useAuth();

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
              <SheetContent side="left" className="w-[320px] p-0 bg-card overflow-y-auto">
                <SheetHeader className="p-6 border-b border-white/10 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg ring-2 ring-white/10">
                      <Scissors className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <SheetTitle className="font-display font-bold text-xl text-white tracking-wide">Tailo</SheetTitle>
                      <SheetDescription className="text-xs text-white/60 font-medium uppercase tracking-wider">Premium Tailoring</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <div className="p-0 flex-1 overflow-y-auto">
                  <nav className="flex flex-col">
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between px-6 py-4 text-sm font-medium border-b border-border/40 transition-all ${location.pathname === "/"
                        ? "bg-orange-50/50 text-orange-700"
                        : "text-foreground hover:bg-muted/30"
                        }`}
                    >
                      <span className="text-base">Home</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    </Link>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categories" className="border-b border-border/40">
                        <AccordionTrigger
                          className={`px-6 py-4 text-sm font-medium hover:no-underline hover:bg-muted/30 data-[state=open]:bg-muted/30 ${location.pathname === '/categories' || location.pathname.includes('/category/')
                            ? "text-black font-extrabold bg-orange-50/50"
                            : "text-foreground"
                            }`}
                        >
                          Categories
                        </AccordionTrigger>
                        <AccordionContent className="pb-0 bg-muted/20">
                          <div className="flex flex-col">
                            <Link
                              to="/categories"
                              onClick={() => setIsMenuOpen(false)}
                              className="px-8 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50/50 flex items-center gap-2"
                            >
                              View All Categories <ArrowRight className="w-3 h-3" />
                            </Link>

                            <div className="px-8 py-2">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Women's Tailoring</p>
                              <div className="space-y-1">
                                {categories.map((cat) => (
                                  <Link
                                    key={cat.id}
                                    to={`/category/${cat.id}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2 text-sm text-foreground/80 hover:text-orange-600 transition-colors"
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </div>
                            </div>

                            <div className="px-8 py-2 pb-4">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-2">Men's Tailoring</p>
                              <div className="space-y-1">
                                {menCategories.map((cat) => (
                                  <Link
                                    key={cat.id}
                                    to={`/category/${cat.id}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2 text-sm text-foreground/80 hover:text-orange-600 transition-colors"
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {navLinks.slice(1).map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between px-6 py-4 text-sm font-medium border-b border-border/40 transition-all ${location.pathname === link.path
                          ? "bg-orange-50/50 text-orange-700"
                          : "text-foreground hover:bg-muted/30"
                          }`}
                      >
                        <span className="text-base">{link.name}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="p-6 border-t border-border bg-muted/10">
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" size="lg" className="w-full justify-center border-orange-200 hover:bg-orange-50 hover:text-orange-700 text-orange-900">
                      <Phone className="w-4 h-4 mr-2" /> Call Support
                    </Button>
                    <Button size="lg" className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg" asChild>
                      <Link to="/booking">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Book Appointment
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
            <Link
              to="/"
              className="relative px-4 py-2 text-sm font-medium transition-colors group"
            >
              <span className={location.pathname === "/" ? "text-orange-600" : "text-foreground/80 group-hover:text-foreground"}>
                Home
              </span>
              {location.pathname === "/" && (
                <motion.div
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                  layoutId="activeNav"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`!bg-transparent hover:!bg-transparent data-[state=open]:!bg-transparent focus:!bg-transparent text-sm font-medium cursor-pointer px-0 transition-none shadow-none ${location.pathname.includes('/categories') || location.pathname.includes('/category/')
                      ? "!text-orange-600 hover:!text-orange-600 data-[state=open]:!text-orange-600"
                      : "!text-foreground/80 hover:!text-foreground/80 data-[state=open]:!text-foreground/80"
                      }`}
                    onClick={() => window.location.href = '/categories'}
                  >
                    <Link to="/categories" className="mr-1">Categories</Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[85vw] md:w-[700px] lg:w-[800px] bg-popover rounded-xl shadow-lg border-none overflow-hidden p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
                        {/* Women's Column */}
                        <div className="p-6 bg-white/50 group/women hover:bg-rose-50/50 transition-colors duration-300">
                          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-rose-100">
                            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                              <Scissors className="w-4 h-4" />
                            </div>
                            <h4 className="font-display font-bold text-base text-gray-900 group-hover/women:text-rose-700 transition-colors">Women's Tailoring</h4>
                          </div>
                          <ul className="grid gap-2">
                            {categories.map((cat) => (
                              <li key={cat.id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to={`/category/${cat.id}`}
                                    className="flex items-center justify-between text-sm text-gray-600 hover:text-rose-600 hover:bg-white rounded-lg px-3 py-2 transition-all hover:shadow-sm"
                                  >
                                    <span>{cat.name}</span>
                                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-rose-400" />
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Men's Column */}
                        <div className="p-6 bg-white/50 group/men hover:bg-blue-50/50 transition-colors duration-300 border-l border-gray-100/50">
                          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-blue-100">
                            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <h4 className="font-display font-bold text-base text-gray-900 group-hover/men:text-blue-700 transition-colors">Men's Tailoring</h4>
                          </div>
                          <ul className="grid gap-2">
                            {menCategories.map((cat) => (
                              <li key={cat.id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to={`/category/${cat.id}`}
                                    className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg px-3 py-2 transition-all hover:shadow-sm"
                                  >
                                    <span>{cat.name}</span>
                                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-400" />
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Special & CTA Column */}
                        <div className="p-5 bg-gradient-to-br from-amber-50/10 to-transparent flex flex-col h-full">
                          <h4 className="font-display font-bold text-base mb-4 text-amber-950">More Services</h4>
                          <ul className="grid gap-1 mb-6">
                            <li>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/uniforms"
                                  className="block select-none rounded-lg px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-amber-700 text-muted-foreground hover:font-medium"
                                >
                                  Uniforms & Bulk
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/materials"
                                  className="block select-none rounded-lg px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-amber-700 text-muted-foreground hover:font-medium"
                                >
                                  Materials
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          </ul>

                          <div className="mt-auto p-4 rounded-xl bg-orange-50 border border-orange-100">
                            <h5 className="font-semibold text-sm text-orange-900 mb-1">Browse Full Collection</h5>
                            <p className="text-xs text-orange-700/80 mb-3 leading-snug">View all designs, fabrics and customization options.</p>
                            <Button size="sm" variant="default" className="w-full text-xs h-8 shadow-none" asChild>
                              <Link to="/categories">View All Categories</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {navLinks.slice(1).map((link) => (
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

            {(activeRole === 'customer' || !user) && (
              <>
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
                          className={`absolute -top-1 -right-1 min-w-5 h-5 px-1 text-[10px] font-bold rounded-full flex items-center justify-center shadow-md ${justAdded
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
              </>
            )}

            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-orange-50" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </Button>

            {/* User Menu with Dropdown */}
            <UserMenu />

            {!user && (
              <Button variant="outline" size="sm" className="hidden lg:flex group border-primary/30 hover:bg-primary/5" asChild>
                <Link to="/auth">
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            )}

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

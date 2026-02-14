import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { WishlistCard } from "@/components/wishlist/WishlistCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Wishlist() {
  const { items, removeFromWishlist, totalItems } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    const isMaterial = item.id.startsWith('m');

    addToCart({
      designId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      withMaterial: isMaterial,
      size: isMaterial ? "N/A" : "custom",
      orderType: isMaterial ? undefined : "stitching",
      measurementType: null,
      tailorId: item.tailorId || "platform_admin",
      shopName: item.shopName || "Tailo Premium",
      category: item.category,
    });
    toast.success("Added to cart!", {
      description: `${item.name} has been added.`
    });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container px-4 min-h-[60vh] flex flex-col items-center justify-center text-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 max-w-sm"
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <Bookmark className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Your wishlist is empty</h1>
              <p className="text-muted-foreground text-sm font-body">
                Save your favorite items here to keep track of them and easily add them to your cart.
              </p>
            </div>
            <Button asChild size="lg" className="w-full rounded-full font-bold shadow-soft">
              <Link to="/categories">
                Discover Designs <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12 max-w-7xl">
        {/* Tightened Header */}
        <div className="flex flex-col gap-4 mb-8">
          <Link to="/categories">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground border-none font-bold text-[10px] uppercase tracking-widest px-3 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Continue Shopping
            </Button>
          </Link>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground font-body">
              Your Wishlist
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm font-body max-w-md">
              Collection of designs you've saved for later.
            </p>
          </div>
        </div>

        {/* Optimised Responsive Grid */}
        <div className="space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onMoveToCart={handleMoveToCart}
                  onRemove={removeFromWishlist}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Explore More Button */}
          <div className="flex justify-center pt-8 border-t border-border/40">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-10 border-2 font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
              asChild
            >
              <Link to="/categories">
                Explore More Designs <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

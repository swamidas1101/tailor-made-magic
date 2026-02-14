import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function Wishlist() {
  const { items, removeFromWishlist, totalItems } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: typeof items[0]) => {
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
    toast.success("Added to cart!", { description: item.name });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-3">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Save your favorite designs here! Tap the heart icon on any design to add it to your wishlist.
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link to="/categories">Explore Designs <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-display font-bold">My Wishlist</h1>
          <p className="text-sm text-muted-foreground">{totalItems} saved design{totalItems !== 1 ? 's' : ''}</p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card rounded-lg shadow-soft overflow-hidden group border border-border/50">
              <div className="relative aspect-square">
                <Link to={item.id.startsWith('m') ? `/material/${item.id}` : `/design/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="p-2">
                <Link to={item.id.startsWith('m') ? `/material/${item.id}` : `/design/${item.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-bold text-[11px] truncate leading-tight mb-0.5">{item.name}</h3>
                </Link>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-primary text-[11px]">₹{item.price.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground truncate max-w-[40px]">{item.category}</p>
                </div>

                {/* Fixed bottom actions */}
                <div className="flex gap-2 mt-2.5 pt-2 border-t border-border/50">
                  <Button
                    variant="gold"
                    size="icon"
                    className="h-8 w-8 rounded-lg shadow-sm"
                    onClick={() => handleMoveToCart(item)}
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-destructive border-2 border-destructive/10 hover:bg-destructive/5 rounded-lg shrink-0"
                    onClick={() => removeFromWishlist(item.id)}
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link to="/categories">Continue Browsing <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}

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
    addToCart({
      designId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      withMaterial: false,
      size: "M",
    });
    removeFromWishlist(item.id);
    toast.success("Moved to cart!", { description: item.name });
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
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">{totalItems} saved design{totalItems !== 1 ? 's' : ''}</p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-card rounded-xl shadow-soft overflow-hidden group">
              <div className="relative aspect-[3/4]">
                <Link to={item.id.startsWith('m') ? `/material/${item.id}` : `/design/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-destructive"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="gold"
                    size="sm"
                    className="w-full"
                    onClick={() => handleMoveToCart(item)}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" /> Move to Cart
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <Link to={item.id.startsWith('m') ? `/material/${item.id}` : `/design/${item.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                </Link>
                <p className="text-xs text-muted-foreground">{item.category}</p>
                <p className="font-bold text-primary mt-1">₹{item.price.toLocaleString()}</p>
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

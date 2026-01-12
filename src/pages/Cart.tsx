import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-3">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any designs to your cart yet. Explore our collection to find your perfect style!
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link to="/categories">Browse Designs <ArrowRight className="w-4 h-4 ml-2" /></Link>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card rounded-xl p-4 shadow-soft flex gap-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.size} • {item.withMaterial ? 'With Material' : 'Stitching Only'}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive -mt-1 -mr-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
              <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{Math.round(totalPrice * 0.18).toLocaleString()}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span className="text-primary">₹{Math.round(totalPrice * 1.18).toLocaleString()}</span>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Try FIRST10 for 10% off</p>
              </div>

              <Button variant="gold" size="lg" className="w-full mb-3">
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/categories"><ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

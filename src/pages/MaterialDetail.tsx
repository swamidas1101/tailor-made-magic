import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, IndianRupee, Heart, Share2, Check, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { mockMaterials } from "@/data/materialData";
import { SimilarProducts } from "@/components/shared/SimilarProducts";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

export default function MaterialDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const material = mockMaterials.find((m) => m.id === id);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isWishlisted = material ? isInWishlist(material.id) : false;


    if (!material) {
        return (
            <Layout>
                <div className="container px-4 py-20 text-center">
                    <h1 className="text-2xl font-display font-bold mb-4">Material not found</h1>
                    <Button asChild>
                        <Link to="/materials">Browse Materials</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    const similarMaterials = (() => {
        // 1. Try by same type (e.g., Silk)
        let similar = mockMaterials.filter((m) => m.type === material.type && m.id !== material.id);

        // 2. If less than 5, add same color (e.g., Red materials)
        if (similar.length < 5) {
            const more = mockMaterials.filter(m =>
                m.color === material.color &&
                m.id !== material.id &&
                !similar.find(s => s.id === m.id)
            );
            similar = [...similar, ...more];
        }

        // 3. If still less than 5, just fill with others (excluding current)
        if (similar.length < 5) {
            const others = mockMaterials.filter(m =>
                m.id !== material.id &&
                !similar.find(s => s.id === m.id)
            );
            similar = [...similar, ...others];
        }

        return similar.slice(0, 10);
    })();

    const handleAddToCart = () => {
        addToCart({
            designId: material.id, // Using material ID as designId for cart consistency, ideally cart supports materials
            name: material.name,
            image: material.image,
            price: material.price,
            withMaterial: true,
            size: "N/A",
            quantity: quantity,
            tailorId: "platform_admin",
            shopName: "Tailo Premium",
            category: material.type
        });
        toast.success("Added to cart", {
            description: `${quantity}m of ${material.name}`
        });
    };

    const handleBuyNow = () => {
        addToCart({
            designId: material.id,
            name: material.name,
            image: material.image,
            price: material.price,
            withMaterial: true,
            size: "N/A",
            quantity: quantity,
            tailorId: "platform_admin",
            shopName: "Tailo Premium",
            category: material.type
        });
        toast.success("Proceeding to checkout", {
            description: `${quantity}m of ${material.name} added to cart`
        });
        navigate("/cart");
    }

    const handleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(material.id);
            toast.success("Removed from wishlist");
        } else {
            addToWishlist({
                id: material.id,
                name: material.name,
                image: material.image,
                price: material.price,
                category: material.type,
                tailorId: "platform_admin",
                shopName: "Tailo Premium"
            });
            toast.success("Added to wishlist");
        }
    };

    return (
        <Layout>
            <div className="container px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/materials" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Materials
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Image */}
                    <div className="relative aspect-[3/4] lg:aspect-square rounded-2xl overflow-hidden shadow-xl border border-border/40 bg-muted">
                        <img src={material.image} alt={material.name} className="w-full h-full object-cover" />

                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 px-3 py-1 text-xs">{material.type}</Badge>
                            {!material.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                        </div>

                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                className={`rounded-full backdrop-blur-sm shadow-sm transition-colors ${isWishlisted ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-white/80 hover:bg-white text-gray-700"}`}
                                onClick={handleWishlist}
                            >
                                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                            </Button>
                            <Button variant="secondary" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 shadow-sm">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <Link to="/materials" className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-1 block">{material.brand}</Link>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{material.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold">{material.rating}</span>
                                    <span className="text-muted-foreground text-sm">(12 reviews)</span>
                                </div>
                                {material.inStock ? (
                                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                        <Check className="w-4 h-4" /> In Stock
                                    </div>
                                ) : (
                                    <div className="text-red-500 text-sm font-medium">Out of Stock</div>
                                )}
                            </div>
                        </div>

                        <div className="text-3xl font-bold flex items-baseline gap-1 mb-6">
                            <IndianRupee className="w-6 h-6" />
                            {material.price.toLocaleString()}
                            <span className="text-base font-normal text-muted-foreground">/ meter</span>
                        </div>

                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            {material.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Pattern</span>
                                <span className="font-medium">{material.pattern}</span>
                            </div>
                            <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Color</span>
                                <span className="font-medium">{material.color}</span>
                            </div>
                            <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Material Type</span>
                                <span className="font-medium">{material.type}</span>
                            </div>
                            <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Suitability</span>
                                <span className="font-medium">{material.gender === 'Unisex' ? 'Men & Women' : material.gender}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-border">
                            <div className="flex items-center border border-border rounded-lg bg-background w-fit">
                                <button
                                    className="w-10 h-12 flex items-center justify-center hover:bg-muted font-medium text-lg"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >-</button>
                                <div className="w-12 h-12 flex items-center justify-center font-semibold">{quantity}m</div>
                                <button
                                    className="w-10 h-12 flex items-center justify-center hover:bg-muted font-medium text-lg"
                                    onClick={() => setQuantity(quantity + 1)}
                                >+</button>
                            </div>

                            <div className="flex-1 flex gap-3">
                                <Button size="lg" className="flex-1 h-12 text-base" onClick={handleBuyNow}>
                                    Buy Now
                                </Button>
                                <Button size="lg" variant="outline" className="h-12 w-12 px-0 flex-shrink-0 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800" onClick={handleAddToCart}>
                                    <ShoppingCart className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <Truck className="w-3 h-3" />
                            Free delivery on orders above ₹2000
                        </div>
                    </div>
                </div>

                <SimilarProducts items={similarMaterials} type="material" title="Similar Fabrics" />
            </div>
        </Layout>
    );
}

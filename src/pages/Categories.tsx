import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { DesignCard } from "@/components/designs/DesignCard";
import { categories, designs } from "@/data/mockData";

export default function Categories() {
  const { id } = useParams();
  
  // If specific category selected
  if (id) {
    const category = categories.find((c) => c.id === id);
    const categoryDesigns = designs.filter(
      (d) => d.category.toLowerCase() === category?.name.split(" ")[0].toLowerCase()
    );

    return (
      <Layout>
        <div className="container px-4 py-8">
          <Link to="/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Categories
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{category?.name}</h1>
            <p className="text-muted-foreground">{category?.description}</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">{categoryDesigns.length} designs found</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="w-4 h-4 mr-1" /> Sort
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(categoryDesigns.length > 0 ? categoryDesigns : designs).map((design) => (
              <DesignCard key={design.id} {...design} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // All categories view
  return (
    <Layout>
      <div className="container px-4 py-8">
        <div className="text-center mb-12">
          <p className="text-accent font-medium mb-2">Explore Our Collection</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">All Categories</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From traditional blouses to modern kurtis, find the perfect design for every occasion. 
            Expert tailoring with premium quality materials.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} {...cat} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

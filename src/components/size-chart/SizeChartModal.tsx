import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Info } from "lucide-react";

const sizeCharts = {
  blouse: {
    name: "Blouse",
    sizes: [
      { size: "XS", bust: "30-32", underBust: "26-28", waist: "24-26", shoulder: "13" },
      { size: "S", bust: "32-34", underBust: "28-30", waist: "26-28", shoulder: "13.5" },
      { size: "M", bust: "34-36", underBust: "30-32", waist: "28-30", shoulder: "14" },
      { size: "L", bust: "36-38", underBust: "32-34", waist: "30-32", shoulder: "14.5" },
      { size: "XL", bust: "38-40", underBust: "34-36", waist: "32-34", shoulder: "15" },
      { size: "XXL", bust: "40-42", underBust: "36-38", waist: "34-36", shoulder: "15.5" },
    ],
    headers: ["Size", "Bust (in)", "Under Bust (in)", "Waist (in)", "Shoulder (in)"],
  },
  kurti: {
    name: "Kurti/Kurta",
    sizes: [
      { size: "XS", bust: "32", waist: "28", hips: "34", length: "36" },
      { size: "S", bust: "34", waist: "30", hips: "36", length: "38" },
      { size: "M", bust: "36", waist: "32", hips: "38", length: "40" },
      { size: "L", bust: "38", waist: "34", hips: "40", length: "42" },
      { size: "XL", bust: "40", waist: "36", hips: "42", length: "44" },
      { size: "XXL", bust: "42", waist: "38", hips: "44", length: "46" },
    ],
    headers: ["Size", "Bust (in)", "Waist (in)", "Hips (in)", "Length (in)"],
  },
  menShirt: {
    name: "Men's Shirt",
    sizes: [
      { size: "S", chest: "36", neck: "14.5", sleeve: "32", length: "28" },
      { size: "M", chest: "38", neck: "15", sleeve: "33", length: "29" },
      { size: "L", chest: "40", neck: "15.5", sleeve: "34", length: "30" },
      { size: "XL", chest: "42", neck: "16", sleeve: "35", length: "31" },
      { size: "XXL", chest: "44", neck: "16.5", sleeve: "36", length: "32" },
    ],
    headers: ["Size", "Chest (in)", "Neck (in)", "Sleeve (in)", "Length (in)"],
  },
  menPant: {
    name: "Men's Pants",
    sizes: [
      { size: "28", waist: "28", hips: "36", inseam: "30", outseam: "40" },
      { size: "30", waist: "30", hips: "38", inseam: "31", outseam: "41" },
      { size: "32", waist: "32", hips: "40", inseam: "32", outseam: "42" },
      { size: "34", waist: "34", hips: "42", inseam: "32", outseam: "42" },
      { size: "36", waist: "36", hips: "44", inseam: "33", outseam: "43" },
      { size: "38", waist: "38", hips: "46", inseam: "33", outseam: "43" },
    ],
    headers: ["Size", "Waist (in)", "Hips (in)", "Inseam (in)", "Outseam (in)"],
  },
};

type ChartKey = keyof typeof sizeCharts;

interface SizeChartModalProps {
  defaultCategory?: string;
  trigger?: React.ReactNode;
}

export function SizeChartModal({ defaultCategory = "blouse", trigger }: SizeChartModalProps) {
  const [activeTab, setActiveTab] = useState<ChartKey>(
    (defaultCategory.toLowerCase().includes("shirt") ? "menShirt" : 
     defaultCategory.toLowerCase().includes("pant") ? "menPant" :
     defaultCategory.toLowerCase().includes("kurti") ? "kurti" : "blouse") as ChartKey
  );

  const currentChart = sizeCharts[activeTab];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Ruler className="w-4 h-4" />
            Size Chart
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-primary" />
            Size Chart Guide
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ChartKey)} className="mt-4">
          <div className="overflow-x-auto -mx-2 px-2">
            <TabsList className="inline-flex h-auto gap-1 bg-muted/50 p-1 min-w-max">
              {Object.entries(sizeCharts).map(([key, chart]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="text-xs px-3 py-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white whitespace-nowrap"
                >
                  {chart.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(sizeCharts).map(([key, chart]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {chart.headers.map((header, i) => (
                        <th 
                          key={i} 
                          className={`py-2 px-3 text-left font-semibold text-foreground ${i === 0 ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tl-lg' : 'bg-muted/50'} ${i === chart.headers.length - 1 ? 'rounded-tr-lg' : ''}`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.sizes.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-semibold text-primary">{row.size}</td>
                        {Object.entries(row).slice(1).map(([key, value]) => (
                          <td key={key} className="py-2.5 px-3 text-muted-foreground">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-accent/10 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Measurement Tips</p>
                  <p>These are standard sizes. For the best fit, we recommend providing your exact measurements. 
                  All measurements are in inches.</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
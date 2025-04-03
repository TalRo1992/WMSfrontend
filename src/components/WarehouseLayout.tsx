
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryStore } from "@/store/useInventoryStore";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function WarehouseLayout() {
  const { products } = useInventoryStore();
  
  // Create a map of locations to products
  const locationMap = products.reduce<Record<string, typeof products>>((acc, product) => {
    const zone = product.location.split('-')[0];
    if (!acc[zone]) {
      acc[zone] = [];
    }
    acc[zone].push(product);
    return acc;
  }, {});
  
  // Helper function to get cell color based on product count
  const getCellColor = (zoneId: string) => {
    const productsInZone = locationMap[zoneId] || [];
    if (productsInZone.length === 0) return "bg-gray-100";
    
    const totalQuantity = productsInZone.reduce((sum, p) => sum + p.quantity, 0);
    
    if (totalQuantity > 50) return "bg-green-200";
    if (totalQuantity > 20) return "bg-green-100";
    if (totalQuantity > 0) return "bg-yellow-100";
    return "bg-red-100";
  };
  
  const getTooltipContent = (zoneId: string) => {
    const productsInZone = locationMap[zoneId] || [];
    if (productsInZone.length === 0) {
      return "Empty Zone";
    }
    
    return (
      <div className="space-y-2 max-w-xs">
        <p className="font-semibold">Zone {zoneId}</p>
        <ul className="text-xs space-y-1">
          {productsInZone.map((product) => (
            <li key={product.id} className="flex justify-between">
              <span>{product.name}</span>
              <span>{product.quantity} units</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Create a 5x5 grid for visualization
  const zones = ['A', 'B', 'C', 'D'];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Warehouse Layout</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs text-xs">
                  Color indicates inventory level: Green (high), Yellow (medium), Red (low/empty)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {zones.map((zone) => (
            <>
              {Array.from({ length: 5 }).map((_, i) => {
                const zoneId = `${zone}`;
                return (
                  <TooltipProvider key={`${zone}-${i + 1}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "aspect-square rounded-md border flex items-center justify-center text-sm font-medium transition-colors hover:bg-muted/50 cursor-default",
                            getCellColor(zoneId)
                          )}
                        >
                          {zone}-{i + 1}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {getTooltipContent(zoneId)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </>
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-sm bg-green-200" />
            <span>High Stock</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-sm bg-yellow-100" />
            <span>Medium Stock</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-sm bg-red-100" />
            <span>Low/Empty</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-sm bg-gray-100" />
            <span>Unused</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

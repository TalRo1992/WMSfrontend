
import { useEffect, useState } from "react";
import { useOrdersStore, Order } from "@/store/useOrdersStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Truck, Package, CheckCircle, BarChart4, QrCode, AlertCircle, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { BarcodeScanner } from "@/components/BarcodeScanner";

export default function Picking() {
  const { orders, fetchOrders, updateOrderStatus } = useOrdersStore();
  const { products, fetchInventoryItems: fetchProducts } = useInventoryStore();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [fetchOrders, fetchProducts]);

  const handleBarcodeScanned = (barcode: string) => {
    // In a real app, this would look up the product by barcode
    // For demo purposes, we'll just use the SKU as the barcode
    const product = products.find(p => p.sku === barcode);
    
    if (product && activeOrderId) {
      const order = orders.find(o => o.id === activeOrderId);
      
      if (order) {
        const orderItem = order.items.find(item => item.productId === product.id);
        
        if (orderItem) {
          setPickedItems(prev => ({
            ...prev,
            [product.id]: true
          }));
          
          toast({
            title: "Item scanned successfully",
            description: `Added ${product.name} to picked items`,
            variant: "default",
          });
        } else {
          toast({
            title: "Item not in order",
            description: `${product.name} is not part of this order`,
            variant: "destructive"
          });
        }
      }
    } else {
      toast({
        title: "Product not found",
        description: "No product found with this barcode",
        variant: "destructive"
      });
    }
  };

  const filteredOrders = orders.filter(order => 
    order.status === 'Picking' && 
    (searchTerm === "" || 
     order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeOrder = orders.find(order => order.id === activeOrderId);
  
  const completeOrderPicking = () => {
    if (activeOrderId) {
      updateOrderStatus(activeOrderId, 'Shipping');
      setActiveOrderId(null);
      setPickedItems({});
      toast({
        title: "Order picking completed",
        description: "The order has been moved to Shipping status",
      });
    }
  };

  const allItemsPicked = activeOrder ? 
    activeOrder.items.every(item => pickedItems[item.productId]) : 
    false;

  return (
    <motion.div 
      className="content-area"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Picking</h1>
          <p className="text-muted-foreground mt-1">
            Pick and prepare orders for shipping
          </p>
        </div>
        <Button 
          variant={scannerActive ? "default" : "outline"}
          onClick={() => setScannerActive(!scannerActive)}
          className="shadow-md hover:shadow-lg transition-all"
        >
          <QrCode className="mr-2 h-4 w-4" />
          {scannerActive ? "Stop Scanner" : "Start Scanner"}
        </Button>
      </div>

      <AnimatePresence>
        {scannerActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 overflow-hidden border border-primary/20">
              <CardHeader className="pb-3 bg-primary/5">
                <CardTitle className="flex items-center">
                  <QrCode className="mr-2 h-5 w-5 text-primary" />
                  Barcode Scanner
                </CardTitle>
                <CardDescription>
                  Scan product barcodes to add them to the current order
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <BarcodeScanner onScan={handleBarcodeScanned} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-primary/20 shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
              Orders To Pick
            </CardTitle>
            <CardDescription>
              Orders with "Picking" status
            </CardDescription>
            <div className="mt-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <motion.div 
              className="space-y-2"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {filteredOrders.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No picking orders found
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <Button
                      variant={activeOrderId === order.id ? "default" : "outline"}
                      className={`w-full justify-start text-left ${
                        activeOrderId === order.id ? "border-2 border-primary" : ""
                      }`}
                      onClick={() => {
                        setActiveOrderId(order.id);
                        setPickedItems({});
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {order.customer} - {order.items.length} items
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))
              )}
            </motion.div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-primary/20 shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-primary" />
              Active Order Picking
            </CardTitle>
            <CardDescription>
              {activeOrder ? `Picking items for order ${activeOrder.orderNumber}` : "Select an order to start picking"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {!activeOrder ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Active Order</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Select an order from the list on the left to start the picking process
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {activeOrder.orderNumber}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    {activeOrder.date}
                  </Badge>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                    Items: {activeOrder.items.length}
                  </Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Customer</h3>
                  <p className="text-muted-foreground">{activeOrder.customer}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Items to Pick</h3>
                  <AnimatePresence>
                    <div className="space-y-3">
                      {activeOrder.items.map((item) => {
                        const product = products.find(p => p.id === item.productId);
                        const isPicked = pickedItems[item.productId];
                        
                        return (
                          <motion.div 
                            key={item.productId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-center justify-between p-3 rounded-md border ${
                              isPicked 
                                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
                                : "bg-background"
                            }`}
                          >
                            <div className="flex items-center">
                              {isPicked ? (
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground mr-3" />
                              )}
                              <div>
                                <div className="font-medium">{product?.name || item.productName}</div>
                                <div className="text-sm text-muted-foreground">
                                  SKU: {product?.sku || "N/A"} - Quantity: {item.quantity}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Button
                                size="sm"
                                variant={isPicked ? "ghost" : "outline"}
                                className={isPicked ? "text-green-600 dark:text-green-400" : ""}
                                onClick={() => {
                                  setPickedItems(prev => ({
                                    ...prev,
                                    [item.productId]: !prev[item.productId]
                                  }));
                                }}
                              >
                                {isPicked ? "Picked" : "Mark as Picked"}
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </CardContent>
          {activeOrder && (
            <CardFooter className="flex justify-between bg-muted/30 p-4">
              <Button
                variant="outline"
                onClick={() => {
                  setActiveOrderId(null);
                  setPickedItems({});
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!allItemsPicked}
                onClick={completeOrderPicking}
                className={allItemsPicked ? "bg-primary shadow-lg" : ""}
              >
                <Truck className="mr-2 h-4 w-4" />
                Complete Picking
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </motion.div>
  );
}

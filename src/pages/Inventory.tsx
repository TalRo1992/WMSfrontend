import { useCallback, useEffect, useState } from "react";
import { useInventoryStore } from "@/store/useInventoryStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getProducts } from "@/api/product.api";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import NewInventoriesWizard from "@/components/NewInventoriesWizard";
import { useGlobalStore } from "@/store/useGlobalStore";

export default function Inventory() {
  const { products, isLoading, fetchInventoryItems } = useInventoryStore();
  const {currentUser} = useGlobalStore()  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newQuantity, setNewQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productsList, setProductsList] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('currentUser', currentUser);
        const res = await getProducts();
        setProductsList(res); // Store fetched products in the `products` state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();

  }, [showCreateDialog, fetchInventoryItems]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        fetchInventoryItems();
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);


  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercaseSearch) ||
            product.sku.toLowerCase().includes(lowercaseSearch) ||
            product.category.toLowerCase().includes(lowercaseSearch) ||
            product.location.toLowerCase().includes(lowercaseSearch)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchTerm]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'badge-success';
      case 'Low Stock':
        return 'badge-warning';
      case 'Out of Stock':
        return 'badge-error';
      default:
        return '';
    }
  };

  const handleNewInventory = useCallback(async () => {
    // Logic to handle creating a new location
    // This could be a modal or redirect to a new page
    // await createLocation(newLocation)
    console.log("Create Location button clicked");
    setShowCreateDialog(false);
  }, []);

  const _NewInventoriesWizard = (
      <div className="flex items-center gap-4 py-4">
        {/* Add the Select component */}
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-[200px] border p-2 rounded">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {productsList.map((product) => (
              <SelectItem key={product.id} value={product.name}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={newQuantity}
          type="number"
          onChange={(e) => setNewQuantity(Number(e.target.value))}
          placeholder="Enter Quantity"
          className="flex-1" />
      </div>);
  return (
    <div className="content-area">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage your warehouse inventory
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Inventory
        </Button>
      </div>

      <div className="mt-6 flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading inventory data...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                  <TableCell>{product.location}</TableCell>
                  <TableCell>
                    <span className={cn(getStatusBadgeStyle(product.status))}>
                      {product.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="h-[80vh] max-h-[80vh] w-[800px] max-w-[95vw] overflow-y-auto flex flex-col">
        <AlertDialogHeader>
            <AlertDialogTitle>Add New Inventory</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details for the new location.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {productsList.length > 0 && <NewInventoriesWizard productsList={productsList} />}
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewInventory}>Create</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

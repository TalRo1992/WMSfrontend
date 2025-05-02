import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
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
import { addProducts, getProducts } from "@/api/product.api";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";

export default function Product() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]); // Add a separate state for all products
  const [filteredProducts, setFilteredProducts] = useState([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res); // Store fetched products in the `products` state
        setFilteredProducts(res); // Initialize `filteredProducts` with all products
      } catch (error) {
        console.error("Error fetching products:", error);
        // toast({
        //   title: "Fetch Error",
        //   description: "Failed to fetch products.",
        //   variant: "destructive",
        // });
      }
    };
    fetchProducts();
  }, []); // Remove `getProducts` from dependencies

  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercaseSearch) ||
            product.sku.toLowerCase().includes(lowercaseSearch)
        )
      );
    } else {
      setFilteredProducts(products); // Reset to all products when search is cleared
    }
  }, [products, searchTerm]); // Use `products` and `searchTerm` as dependencies

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

  const handleAddProduct = () => {
    // Logic to handle adding a new product
    // This could be a modal or redirect to a new page
    console.log("Add Product button clicked");
  };

  const handleUploadItems = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const items = results.data.map((row: any) => ({
            sku: row["sku"],
            name: row["name"],
            description: row["description"],
            price: row["price"],
            weight: row["weight"],
          }));
          console.log("Uploaded Items:", items);
          try {
            const newProducts = await addProducts(items);
            setFilteredProducts((prev) => [...prev, ...newProducts]);
            toast({
              title: "Upload Successful",
              description: `${newProducts.length} items have been added to the inventory.`,
            });
          } catch (error) {
            toast({
              title: "Upload Failed",
              description: "An error occurred while uploading items.",
              variant: "destructive",
            });
          }
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
          toast({
            title: "Parsing Error",
            description: "Failed to parse the uploaded CSV file.",
            variant: "destructive",
          });
        },
      });
    }
  };

  return (
    <div className="content-area">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage Your Products Catalog
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleUploadItems} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

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
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading products data...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => (
                <TableRow key={`${product.sku}-${index}`}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.weight}</TableCell>
                  <TableCell>{product.price}</TableCell>
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
    </div>
  );
}


import { useState } from "react";
import { 
  PlusCircle, 
  Search, 
  MoreHorizontal, 
  Check, 
  X, 
  RefreshCw, 
  Download,
  MapPin,
  Mail,
  Phone,
  Building,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

// Interface for supplier data
interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  categories: string[];
  address: string;
  lastOrder: string;
  rating: number;
}

// Sample suppliers data
const initialSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "TechComponents Inc.",
    contactPerson: "John Smith",
    email: "john@techcomponents.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    categories: ["Electronics", "Hardware"],
    address: "123 Tech Drive, San Jose, CA 95123",
    lastOrder: "2023-11-15",
    rating: 4.8
  },
  {
    id: "SUP-002",
    name: "Global Packaging Solutions",
    contactPerson: "Maria Rodriguez",
    email: "maria@globalpackaging.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    categories: ["Packaging", "Materials"],
    address: "456 Box Ave, Chicago, IL 60611",
    lastOrder: "2023-12-01",
    rating: 4.5
  },
  {
    id: "SUP-003",
    name: "FastShip Logistics",
    contactPerson: "James Wilson",
    email: "james@fastship.com",
    phone: "+1 (555) 345-6789",
    status: "inactive",
    categories: ["Shipping", "Logistics"],
    address: "789 Transit Blvd, Atlanta, GA 30301",
    lastOrder: "2023-10-22",
    rating: 3.9
  },
  {
    id: "SUP-004",
    name: "Quality Parts Manufacturing",
    contactPerson: "Sarah Johnson",
    email: "sarah@qualityparts.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    categories: ["Automotive", "Industrial"],
    address: "101 Factory Lane, Detroit, MI 48201",
    lastOrder: "2023-11-28",
    rating: 4.7
  },
  {
    id: "SUP-005",
    name: "EcoFriendly Packaging",
    contactPerson: "Michael Brown",
    email: "michael@ecofriendly.com",
    phone: "+1 (555) 567-8901",
    status: "pending",
    categories: ["Packaging", "Eco-friendly"],
    address: "202 Green St, Portland, OR 97201",
    lastOrder: "2023-12-03",
    rating: 4.2
  }
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    status: "pending",
    categories: [],
    address: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  // Filter suppliers based on search term and active tab
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && supplier.status === "active";
    if (activeTab === "inactive") return matchesSearch && supplier.status === "inactive";
    if (activeTab === "pending") return matchesSearch && supplier.status === "pending";
    
    return matchesSearch;
  });

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Refreshed suppliers list",
        description: `${suppliers.length} suppliers loaded.`
      });
    }, 1000);
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.email) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const id = `SUP-${(suppliers.length + 1).toString().padStart(3, '0')}`;
    const supplier: Supplier = {
      id,
      name: newSupplier.name || "",
      contactPerson: newSupplier.contactPerson || "",
      email: newSupplier.email || "",
      phone: newSupplier.phone || "",
      status: newSupplier.status as "active" | "inactive" | "pending" || "pending",
      categories: newSupplier.categories || [],
      address: newSupplier.address || "",
      lastOrder: "N/A",
      rating: 0
    };

    setSuppliers(prev => [supplier, ...prev]);
    setIsAddDialogOpen(false);
    setNewSupplier({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      status: "pending",
      categories: [],
      address: "",
    });

    toast({
      title: "Supplier added",
      description: `${supplier.name} has been added to your suppliers list.`
    });
  };

  const handleStatusChange = (id: string, newStatus: "active" | "inactive" | "pending") => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, status: newStatus } : supplier
    ));

    toast({
      title: "Status updated",
      description: `Supplier status has been updated to ${newStatus}.`
    });
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    
    toast({
      title: "Supplier deleted",
      description: "The supplier has been removed from your list."
    });
  };

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleExportCSV = () => {
    // Simple CSV export for the suppliers
    const csvContent = [
      ["ID", "Name", "Contact Person", "Email", "Phone", "Status", "Categories", "Address", "Last Order", "Rating"].join(","),
      ...suppliers.map(s => [
        s.id,
        s.name,
        s.contactPerson,
        s.email,
        s.phone,
        s.status,
        s.categories.join(";"),
        s.address,
        s.lastOrder,
        s.rating
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `suppliers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export complete",
      description: "Suppliers data has been exported to CSV."
    });
  };

  return (
    <div className="content-area">
      <div className="mb-6">
        <motion.h1 
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Suppliers
        </motion.h1>
        <motion.p 
          className="text-muted-foreground mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Manage your suppliers and partnerships
        </motion.p>
      </div>

      <motion.div 
        className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search suppliers..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>
                  Enter the details of the new supplier. Required fields are marked with an asterisk (*).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Company name"
                    value={newSupplier.name || ""}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      placeholder="Full name"
                      value={newSupplier.contactPerson || ""}
                      onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      value={newSupplier.email || ""}
                      onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Phone number"
                      value={newSupplier.phone || ""}
                      onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newSupplier.status || "pending"}
                      onChange={(e) => setNewSupplier({...newSupplier, status: e.target.value as "active" | "inactive" | "pending"})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categories">Categories (comma separated)</Label>
                  <Input
                    id="categories"
                    placeholder="Electronics, Hardware, etc."
                    value={newSupplier.categories?.join(", ") || ""}
                    onChange={(e) => setNewSupplier({...newSupplier, categories: e.target.value.split(",").map(c => c.trim())})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Full address"
                    value={newSupplier.address || ""}
                    onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSupplier}>Add Supplier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredSuppliers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No suppliers found</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setActiveTab("all");
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetails(supplier)}>
                    <TableCell className="font-medium">{supplier.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p>{supplier.email}</p>
                        <p className="text-sm text-muted-foreground">{supplier.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {supplier.categories.map((category) => (
                          <Badge key={category} variant="outline" className="font-normal">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          supplier.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                            : supplier.status === "inactive"
                            ? "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                        }
                      >
                        {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(supplier);
                          }}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(supplier.id, "active");
                            }}
                            disabled={supplier.status === "active"}
                          >
                            Set as active
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(supplier.id, "inactive");
                            }}
                            disabled={supplier.status === "inactive"}
                          >
                            Set as inactive
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSupplier(supplier.id);
                            }}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}

      {/* Supplier Details Dialog */}
      <Dialog open={!!selectedSupplier} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedSupplier && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl flex items-center">
                    {selectedSupplier.name}
                    <Badge
                      className={`ml-2 ${
                        selectedSupplier.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedSupplier.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedSupplier.status.charAt(0).toUpperCase() + selectedSupplier.status.slice(1)}
                    </Badge>
                  </DialogTitle>
                  <div>
                    <Badge variant="outline">{selectedSupplier.id}</Badge>
                  </div>
                </div>
                <DialogDescription>
                  Supplier details and information
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{selectedSupplier.contactPerson}</p>
                          <p className="text-sm text-muted-foreground">Contact Person</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p>{selectedSupplier.email}</p>
                          <p className="text-sm text-muted-foreground">Email</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p>{selectedSupplier.phone}</p>
                          <p className="text-sm text-muted-foreground">Phone</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p>{selectedSupplier.address}</p>
                          <p className="text-sm text-muted-foreground">Address</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p>{selectedSupplier.lastOrder}</p>
                          <p className="text-sm text-muted-foreground">Last Order</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedSupplier.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="font-normal">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Supplier Rating</h3>
                  <div className="flex items-center">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < Math.floor(selectedSupplier.rating) ? "#f59e0b" : "#e5e7eb"} className="w-5 h-5">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">{selectedSupplier.rating} out of 5</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      handleDeleteSupplier(selectedSupplier.id);
                      setSelectedSupplier(null);
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedSupplier(null)}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      const newStatus = selectedSupplier.status === "active" ? "inactive" : "active";
                      handleStatusChange(selectedSupplier.id, newStatus);
                      setSelectedSupplier({...selectedSupplier, status: newStatus});
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {selectedSupplier.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

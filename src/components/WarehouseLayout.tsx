import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, useInventoryStore } from "@/store/useInventoryStore";
import { cn } from "@/lib/utils";
import { Info, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { createLocation, Location } from "@/api/locations.api";
import { useGlobalStore, WarehouseLocations } from "@/store/useGlobalStore";
import { createWarehouseStructure, fetchWarehouseLocations, ZoneStructureDto } from "@/api/warehouse.api";
import { toast } from "sonner";

export type Zones = {
  name: string;
  aisles: {
    name: string;
    shelves: {
      name: string;
      slots: {
        name: string;
        locationCode: string;
      }[];
    }[];
  }[];
}[];

export function WarehouseLayout() {
  const { currentUser } = useGlobalStore();
  const { products, fetchInventoryItems: fetchInventoryItems } = useInventoryStore();
  const [zones, setZones] = useState<WarehouseLocations[]>([]);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [newLocation, setNewLocation] = useState<Location>({
    id: "",
    name: "",
    zone: "",
    aisle: "",
    shelf: "",
    barcode: "",
    products: [],
  });
  const [zonesToCreate, setZonesToCreate] = useState<ZoneStructureDto[]>([
    { name: '', aisleQuantity: 1, shelvesPerAisle: 1, slotsPerShelf: 1 },
  ]);
  const [showZoneDialog, setShowZoneDialog] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        fetchInventoryItems();
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetchWarehouseLocations(currentUser.warehouseCode); // Adjust the API endpoint as needed
        console.log("Fetched zones:", response);
        setZones(response);
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };
    fetchZones();
  }, []);
  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);
  // Create a map of locations to products
  const locationMap = useMemo(() => {
    return products.reduce<Record<string, typeof products>>((acc, product) => {
      const zone = product?.location?.split('-')[0];
      if (!acc[zone]) {
        acc[zone] = [];
      }
      acc[zone].push(product);
      return acc;
    }, {});
  }, [products]);

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

  const handleCreateLocation = useCallback(async () => {
    // Logic to handle creating a new location
    // This could be a modal or redirect to a new page
    await createLocation(newLocation)
    console.log("Create Location button clicked");
    setShowLocationForm(false);
  }, []);
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex-start justify-between items-center mb-2">
            <Button onClick={() => setShowZoneDialog(true)}>+ Add Zone</Button>
          </div>
          <div className="space-y-4">
            {zones?.map((zone) => {
              const zoneCode = zone.name;

              // Flatten all slot locationCodes under this zone
              const locationCodes: string[] = zone.aisles.flatMap((aisle) =>
                aisle.shelves.flatMap((shelf) =>
                  shelf.slots.map((slot) => slot.locationCode)
                )
              );

              return (
                <div key={zoneCode}>
                  <h3 className="text-center font-semibold mb-2">{zoneCode}</h3>
                  <div className="relative">
                    <button
                      style={{
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        backgroundColor: "antiquewhite",
                      }}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
                      onClick={() => {
                        const container = document.getElementById(`carousel-${zoneCode}`);
                        if (container) {
                          container.scrollBy({ left: -200, behavior: "smooth" });
                        }
                      }}
                    >
                      &lt;
                    </button>

                    <div
                      id={`carousel-${zoneCode}`}
                      className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-8 py-4"
                    >
                      {locationCodes.map((locationId) => (
                        <div
                          key={locationId}
                          className={cn(
                            "flex flex-col items-center justify-center text-xs font-semibold text-gray-700 bg-white rounded-md shadow-md snap-center shrink-0",
                            getCellColor(locationId)
                          )}
                          style={{
                            minWidth: "50px",
                            minHeight: "50px",
                            maxWidth: "50px",
                            maxHeight: "50px",
                            textAlign: "center",
                          }}
                        >
                          {locationId}
                        </div>
                      ))}
                    </div>

                    <button
                      style={{
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        backgroundColor: "antiquewhite",
                      }}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
                      onClick={() => {
                        const container = document.getElementById(`carousel-${zoneCode}`);
                        if (container) {
                          container.scrollBy({ left: 200, behavior: "smooth" });
                        }
                      }}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardHeader>

        {/* <CardHeader>
          <div className="space-y-4">
            {zones.map((zone) => (
              <div key={zone}>
                <h3 className="text-center font-semibold mb-2">{zone}</h3>
                <div className="relative">
                  <button
                    style={{ width: "20px", height: "20px", display:'flex', alignItems: 'center', justifyContent: 'center', borderRadius: "50%", backgroundColor: "antiquewhite" }}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
                    onClick={() => {
                      const container = document.getElementById(`carousel-${zone}`);
                      if (container) {
                        container.scrollBy({ left: -200, behavior: "smooth" });
                      }
                    }}
                  >
                    &lt;
                  </button>
                  <div
                    id={`carousel-${zone}`}
                    className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-8 py-4"
                  >
                    {Array.from({ length: 20 }).map((_, i) => {
                      const locationId = `${zone}-${i + 1}`;
                      return (
                        <div
                          key={locationId}
                          className={cn(
                            "flex flex-col items-center justify-center text-xs font-semibold text-gray-700 bg-white rounded-md shadow-md snap-center shrink-0",
                            getCellColor(locationId)
                          )}
                          style={{
                            minWidth: "50px",
                            minHeight: "50px",
                            maxWidth: "50px",
                            maxHeight: "50px",
                          }}
                        >
                          {locationId}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    style={{ width: "20px", height: "20px", display:'flex', alignItems: 'center', justifyContent: 'center', borderRadius: "50%", backgroundColor: "antiquewhite" }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
                    onClick={() => {
                      const container = document.getElementById(`carousel-${zone}`);
                      if (container) {
                        container.scrollBy({ left: 200, behavior: "smooth" });
                      }
                    }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>

        </CardHeader> */}
        <CardContent>
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
      {showLocationForm && (
        <AlertDialog open={showLocationForm} onOpenChange={setShowLocationForm}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Location</AlertDialogTitle>
              <AlertDialogDescription>
                Enter the details for the new location.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <Input placeholder="Location Name" value={newLocation.name} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} />
              <Input placeholder="Aisle" value={newLocation.aisle} onChange={(e) => setNewLocation({ ...newLocation, aisle: e.target.value })} />
              <Input placeholder="Barcode" value={newLocation.barcode} onChange={(e) => setNewLocation({ ...newLocation, barcode: e.target.value })} />
            </div>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setShowLocationForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLocation}>Create</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <AlertDialog open={showZoneDialog} onOpenChange={setShowZoneDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Warehouse Zones</AlertDialogTitle>
            <AlertDialogDescription>
              Add multiple zones with their structure. You can add more zones before submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {zonesToCreate.map((zone, idx) => (
              <div key={idx} className="grid gap-2 border rounded-md p-4">
                <Input
                  placeholder="Zone Name"
                  value={zone.name}
                  onChange={(e) =>
                    setZonesToCreate((prev) =>
                      prev.map((z, i) => (i === idx ? { ...z, name: e.target.value } : z))
                    )
                  }
                />
                <Input
                  placeholder="Aisles"
                  value={zone.aisleQuantity}
                  onChange={(e) =>
                    setZonesToCreate((prev) =>
                      prev.map((z, i) =>
                        i === idx ? { ...z, aisleQuantity: Number(e.target.value) } : z
                      )
                    )
                  }
                />
                <Input
                  placeholder="Shelves per Aisle"
                  value={zone.shelvesPerAisle}
                  onChange={(e) =>
                    setZonesToCreate((prev) =>
                      prev.map((z, i) =>
                        i === idx ? { ...z, shelvesPerAisle: Number(e.target.value) } : z
                      )
                    )
                  }
                />
                <Input
                  placeholder="Slots per Shelf"
                  value={zone.slotsPerShelf}
                  onChange={(e) =>
                    setZonesToCreate((prev) =>
                      prev.map((z, i) =>
                        i === idx ? { ...z, slotsPerShelf: Number(e.target.value) } : z
                      )
                    )
                  }
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                setZonesToCreate((prev) => [
                  ...prev,
                  { name: '', aisleQuantity: 1, shelvesPerAisle: 1, slotsPerShelf: 1 },
                ])
              }
            >
              + Add Another Zone
            </Button>
          </div>

          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowZoneDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  const zones = Array.isArray(zonesToCreate) ? zonesToCreate : [zonesToCreate];
                  await createWarehouseStructure(currentUser.warehouseCode, {
                    zones: zones,
                  });
                  toast.success("Zones created successfully!");
                  setShowZoneDialog(false);
                  const updated = await fetchWarehouseLocations(currentUser.warehouseCode);
                  setZones(updated);
                } catch (err: any) {
                  toast.error("Failed to create zones", {
                    description: err?.message || "Unexpected error",
                  });
                }
                finally {
                  setShowZoneDialog(false);
                  setZonesToCreate([]);
                }
              }}
            >
              Create
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}

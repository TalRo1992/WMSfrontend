
import { useEffect } from "react";
import { WarehouseLayout } from "@/components/WarehouseLayout";
import { useInventoryStore } from "@/store/useInventoryStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Warehouse() {
  const { fetchInventoryItems } = useInventoryStore();

  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  return (
    <div className="content-area">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Warehouse</h1>
        <p className="text-muted-foreground mt-1">
          Warehouse layout and zone management
        </p>
      </div>

      <Tabs defaultValue="layout" className="mt-6">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="layout">Layout View</TabsTrigger>
          <TabsTrigger value="zones">Zone Management</TabsTrigger>
        </TabsList>
        <TabsContent value="layout" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <WarehouseLayout />
            <Card>
              <CardHeader>
                <CardTitle>Zone Information</CardTitle>
                <CardDescription>
                  Statistical breakdown of warehouse zones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="text-muted-foreground text-sm">Total Zones</div>
                    <div className="text-2xl font-bold mt-1">20</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-muted-foreground text-sm">Utilization</div>
                    <div className="text-2xl font-bold mt-1">76%</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-muted-foreground text-sm">Available Space</div>
                    <div className="text-2xl font-bold mt-1">24%</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-muted-foreground text-sm">Zones at Capacity</div>
                    <div className="text-2xl font-bold mt-1">5</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="zones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Zone Management</CardTitle>
              <CardDescription>
                Configure and manage warehouse zones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section allows you to configure warehouse zones, manage zone capacities, and assign products to specific locations.
              </p>
              <div className="mt-4 flex justify-center items-center h-40">
                <p className="text-center text-muted-foreground">
                  Zone management interface is currently under development.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

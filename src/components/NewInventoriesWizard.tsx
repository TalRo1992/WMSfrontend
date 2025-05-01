import { useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "./ui/checkbox";

const NewInventoryWizard = ({ productsList }) => {
    const [step, setStep] = useState(1);
    // const [selectedProduct, setSelectedProduct] = useState("");

    const [inventoryItems, setInventoryItems] = useState([
        { id: 1, product: "", quantity: "" }
    ]);

    const addInventoryItem = () => {
        setInventoryItems((prev) => [
            ...prev,
            { id: Date.now(), product: "", quantity: "" }
        ]);
    };

    const updateProduct = (id, product) => {
        const currentProductSku = productsList.find((product) => product.name === product)?.sku;
        setInventoryItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, product, sku: currentProductSku } : item))
        );
    };

    const updateQuantity = (id, quantity) => {
        setInventoryItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    return (
        <div className="p-6">
            {/* Stepper */}
            <div className="flex items-center mb-4 text-sm font-medium">
                <span className={step === 1 ? "text-blue-600" : "text-gray-400"}>Step 1</span>
                <span className="mx-2">➔</span>
                <span className={step === 2 ? "text-blue-600" : "text-gray-400"}>Step 2</span>
            </div>

            {/* Step 1 */}
            {step === 1 && (
                <>
                    {/* Scrollable Cards List */}
                    <div className="max-h-[350px] overflow-y-auto space-y-3 w-full">
                        {inventoryItems.map((item) => (
                            <Card key={item.id} className="w-full">
                                <CardContent className="p-3 space-y-2">
                                    {/* Product Select */}
                                    <Select value={item.product} onValueChange={(value) => updateProduct(item.id, value)}>
                                        <SelectTrigger>
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


                                    {/* Quantity Input */}
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, e.target.value)}
                                        placeholder="Quantity"
                                        className="h-8 text-sm"
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {/* Actions */}
                    <div className="flex gap-4 mt-4">
                        <button
                            className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={addInventoryItem}
                        >
                            + Add
                        </button>
                        <button
                            className="px-6 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => setStep(2)}
                        >
                            Continue
                        </button>
                    </div>
                </>
            )}

            {/* Step 2 */}
            {step === 2 && (
                <div className="flex flex-col gap-4">
                    <div className="text-lg font-bold">Step 2: Assign Warehouse</div>

                    {inventoryItems.map((item: any) => (
                        <Card key={item.id} className="w-full p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">{item.product || "Unnamed Product"}</p>
                                    <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                {/* <Checkbox
                    checked={!!item.selected}
                    onCheckedChange={(checked) =>
                    setInventoryItems((prev) =>
                        prev.map((i) =>
                        i.id === item.id ? { ...i, selected: !!checked } : i
                        )
                    )
                    }
                /> */}
                            </div>

                            {(
                                <div className="space-y-3">
                                    {/* Select Warehouse */}
                                    <Select
                                        value={item.warehouse || ""}
                                        onValueChange={(value) =>
                                            setInventoryItems((prev) =>
                                                prev.map((i) =>
                                                    i.id === item.id ? { ...i, warehouse: value } : i
                                                )
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select warehouse" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Main">Main Warehouse</SelectItem>
                                            <SelectItem value="Backup">Backup Warehouse</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Location + Zone (only if warehouse selected) */}
                                    {item.warehouse && (
                                        <>
                                            <Select
                                                value={item.location || ""}
                                                onValueChange={(value) =>
                                                    setInventoryItems((prev) =>
                                                        prev.map((i) =>
                                                            i.id === item.id ? { ...i, location: value } : i
                                                        )
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Shelf A">Shelf A</SelectItem>
                                                    <SelectItem value="Shelf B">Shelf B</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={item.zone || ""}
                                                onValueChange={(value) =>
                                                    setInventoryItems((prev) =>
                                                        prev.map((i) =>
                                                            i.id === item.id ? { ...i, zone: value } : i
                                                        )
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select zone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Zone 1">Zone 1</SelectItem>
                                                    <SelectItem value="Zone 2">Zone 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}

                    <div className="flex justify-between mt-6">
                        <button
                            className="px-4 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                            onClick={() => setStep(1)}
                        >
                            ← Back
                        </button>
                        <button
                            className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            onClick={() => {
                                console.log("Final result", inventoryItems);
                            }}
                        >
                            Save & Finish
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default NewInventoryWizard;

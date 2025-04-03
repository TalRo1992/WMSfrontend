
import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState("");
  const [hasCamera, setHasCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  // In a real app, this would use a real barcode scanner library
  // For demo purposes, we'll just simulate scanning with manual input

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setHasCamera(true);
      })
      .catch(() => {
        setHasCamera(false);
        setError("Camera access not available or denied");
      });
  }, []);

  const startCamera = async () => {
    if (!hasCamera || !videoRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      setError("Could not access the camera");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const simulateScan = () => {
    // In a real app, this would be replaced with actual barcode detection
    // For demo, we'll simulate scanning by using predefined barcodes
    const demoProducts = [
      "ELEC-1001", // Wireless Headphones
      "APP-2002",  // Cotton T-Shirt
      "HOME-3003", // Coffee Maker
      "TOOL-4004", // Power Drill
      "ELEC-1002", // Bluetooth Speaker
      "APP-2003"   // Denim Jeans
    ];
    
    const randomBarcode = demoProducts[Math.floor(Math.random() * demoProducts.length)];
    onScan(randomBarcode);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  useEffect(() => {
    return () => {
      // Clean up camera when component unmounts
      stopCamera();
    };
  }, []);

  return (
    <Tabs defaultValue="camera" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="camera">Camera Scanner</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="camera" className="space-y-4">
        <div className="relative">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-destructive flex items-center mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
            {!isCameraActive ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">Camera is not active</p>
                {hasCamera && (
                  <Button onClick={startCamera}>
                    Start Camera
                  </Button>
                )}
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                  autoPlay 
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-primary w-3/4 h-1/2 rounded-md opacity-50 pointer-events-none"></div>
                </div>
              </>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" width="640" height="480" />
          
          <div className="mt-4 flex justify-between">
            {isCameraActive ? (
              <>
                <Button variant="outline" onClick={stopCamera}>
                  Stop Camera
                </Button>
                <Button onClick={simulateScan}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Simulate Scan
                </Button>
              </>
            ) : (
              <Button disabled={!hasCamera} onClick={startCamera}>
                Start Camera
              </Button>
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="manual">
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Enter barcode manually"
              className="flex-1"
            />
            <Button type="submit">Submit</Button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Enter a product SKU to simulate scanning (e.g., ELEC-1001, APP-2002, HOME-3003)
            </p>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
}

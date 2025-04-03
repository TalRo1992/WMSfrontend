import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  LogIn,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const success = await login(email, password);

      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to Tapuz Wms",
        });
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Try admin@example.com / password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectLogin = async () => {
    try {
      setIsLoading(true);
      const success = await login("admin@example.com", "password");

      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to Tapuz Wms",
        });
        navigate("/dashboard");
      } else {
        setError("Something went wrong with direct login");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error("Direct login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <motion.div variants={item} className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="mr-3 rounded-md bg-primary p-2">
              <Boxes className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Tapuz Wms</h1>
          </div>
          <p className="text-muted-foreground">Warehouse Management System</p>
        </motion.div>

        <motion.div variants={item}>
          <Card className="w-full shadow-lg border-primary/10 dark:bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="mb-4 p-3 rounded-md bg-muted flex flex-col gap-1">
                <p className="text-sm font-medium">Demo Credentials:</p>
                <p className="text-xs text-muted-foreground">
                  Email: admin@example.com
                </p>
                <p className="text-xs text-muted-foreground">
                  Password: password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-3 text-muted-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-right">
                    <a href="#" className="text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <Separator className="my-4" />

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleDirectLogin}
                disabled={isLoading}
              >
                <LogIn className="h-4 w-4" />
                <span>Quick Login (Demo)</span>
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <a href="#" className="text-primary hover:underline">
                  Sign up
                </a>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>© {new Date().getFullYear()} Tapuz Wms. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

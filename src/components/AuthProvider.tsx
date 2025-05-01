import { useGlobalStore, User } from "@/store/useGlobalStore";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const {  warehouse, currentUser, fetchUser } = useGlobalStore();

  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    console.log("current user", currentUser);
    const checkAuth = () => {
      const isAuth = localStorage.getItem("isAuthenticated") === "true";
      // const storedUser = localStorage.getItem("user");

      if (isAuth && currentUser) {
        try {
          setUser(currentUser);
        } catch (e) {
          setUser(null);
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo credentials check
    return new Promise((resolve) => {
      fetchUser(email); // Fetch user data based on email
      setTimeout(() => {
        if (currentUser && password === "password") {
          const userData = { id: currentUser.id, email: currentUser.email, name: currentUser.name, role: currentUser.role, warehouse: currentUser.warehouse };
          setUser(userData);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(userData));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800); // Reduced timeout for faster login
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

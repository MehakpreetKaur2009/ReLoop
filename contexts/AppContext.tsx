import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type UserRole = "mall" | "truck" | null;

export interface UserProfile {
  email: string;
  password: string;
  role: UserRole;
  // Mall fields
  mallName?: string;
  mallAddress?: string;
  loadingDock?: string;
  contactPerson?: string;
  phoneNumber?: string;
  wasteType?: string;
  // Truck fields
  driverName?: string;
  truckNumber?: string;
  vehicleCapacity?: string;
  gpsEnabled?: boolean;
  // Plan
  plan?: string;
  daysLeft?: number;
}

export interface SubscriptionPlan {
  name: string;
  price: string;
  daysLeft: number;
  isCurrent: boolean;
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  user: UserProfile;
  login: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  logout: () => void;
  // Role
  setUserRole: (role: UserRole) => void;
  // Profile
  updateProfile: (data: Partial<UserProfile>) => void;
  // Subscription
  subscription: SubscriptionPlan;
  setSubscription: (plan: SubscriptionPlan) => void;
  // Theme
  isDark: boolean;
  toggleTheme: () => void;
}

const defaultUser: UserProfile = {
  email: "",
  password: "",
  role: null,
};

const defaultSubscription: SubscriptionPlan = {
  name: "Basic",
  price: "₹0",
  daysLeft: 10,
  isCurrent: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [subscription, setSubscriptionState] = useState<SubscriptionPlan>(defaultSubscription);
  const [isDark, setIsDark] = useState(false);

  const login = useCallback((email: string, password: string) => {
    setUser(prev => ({ ...prev, email, password }));
    setIsAuthenticated(true);
  }, []);

  const signup = useCallback((email: string, password: string) => {
    setUser(prev => ({ ...prev, email, password }));
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(defaultUser);
    setIsAuthenticated(false);
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
  }, []);

  const setSubscription = useCallback((plan: SubscriptionPlan) => {
    setSubscriptionState(plan);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        setUserRole,
        updateProfile,
        subscription,
        setSubscription,
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

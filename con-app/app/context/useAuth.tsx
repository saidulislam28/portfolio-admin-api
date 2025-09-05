import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ROUTES } from "@/constants/app.routes";
import { User } from "@sm/common";
import { removeAuthTokenMobile, setAuthTokenMobile } from "@/lib/authtokens";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null); // Add token state

  const router = useRouter();

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(userData.token); // Set token from user data
      }
    } catch (err) {
      console.log("Failed to load user from storage", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const login = async (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await setAuthTokenMobile(authToken);
    return { success: true };
  };

  const logout = async () => {
    setIsLoading(false);
    await AsyncStorage.removeItem("user");
    setUser(null);
    setToken(null);
    await removeAuthTokenMobile();
    router.replace(ROUTES.LOGIN as any);
  };

  // Add updateUser function
  const updateUser = async (updatedUserData: any) => {
    try {
      const mergedUserData = { ...user, ...updatedUserData };
      setUser(mergedUserData);
      await AsyncStorage.setItem("user", JSON.stringify(mergedUserData));
    } catch (err) {
      console.log("Failed to update user in storage", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      token, // Include token in context
      login,
      logout,
      updateUser // Export updateUser function
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  AuthState,
  LoginCredentials,
  CreateUserData,
  UpdateUserData,
} from "../types/auth";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../gql/mutations";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  createUser: (userData: CreateUserData) => Promise<User>;
  updateUser: (userId: string, userData: UpdateUserData) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  resetPassword: (userId: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock users data - In production, this would come from your backend
const mockUsers: User[] = [
  {
    id: "user1",
    email: "admin@education.ug",
    firstName: "System",
    lastName: "Administrator",
    role: "admin",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user2",
    email: "ministry@education.ug",
    firstName: "Ministry",
    lastName: "Official",
    role: "ministry_admin",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user3",
    email: "kampala@education.ug",
    firstName: "Kampala",
    lastName: "District Officer",
    role: "district_admin",
    district: "Kampala",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user4",
    email: "principal@greenhill.ug",
    firstName: "Sarah",
    lastName: "Namukwaya",
    role: "school_admin",
    district: "Kampala",
    schoolId: "SCH001",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user5",
    email: "analyst@education.ug",
    firstName: "Data",
    lastName: "Analyst",
    role: "data_analyst",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loginUser, { error, loading: logingInUser, data }] =
    useMutation(LOGIN_USER);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const [users, setUsers] = useState<User[]>(mockUsers);

  // Simulate API delay
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const storedUser = localStorage.getItem("ict_observatory_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to restore session",
        });
      }
    };

    checkExistingSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const res = await loginUser({
        variables: {
          email: credentials.email,
          password: credentials.password,
        },
      });

      // Check for GraphQL errors directly
      if (!res?.data?.login?.user) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const updatedUser = {
        ...res.data.login.user,
        lastLogin: new Date().toISOString(),
        role: res.data.login.user.role?.toLowerCase(),
      };

      localStorage.setItem("ict_observatory_user", JSON.stringify(updatedUser));

      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: err instanceof Error ? err.message : "Login failed",
      });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("ict_observatory_user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const createUser = async (userData: CreateUserData): Promise<User> => {
    try {
      await delay(500);

      // Check if email already exists
      if (users.some((u) => u.email === userData.email)) {
        throw new Error("Email already exists");
      }

      const newUser: User = {
        id: `user${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        district: userData.district,
        subCounty: userData.subCounty,
        schoolId: userData.schoolId,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (
    userId: string,
    userData: UpdateUserData
  ): Promise<User> => {
    try {
      await delay(500);

      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const updatedUser: User = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));

      // Update current user if it's the same user
      if (authState.user?.id === userId) {
        setAuthState((prev) => ({ ...prev, user: updatedUser }));
        localStorage.setItem(
          "ict_observatory_user",
          JSON.stringify(updatedUser)
        );
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      await delay(500);

      if (authState.user?.id === userId) {
        throw new Error("Cannot delete your own account");
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      throw error;
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    await delay(300);
    return users;
  };

  const resetPassword = async (
    userId: string,
    newPassword: string
  ): Promise<void> => {
    try {
      await delay(500);
      // In production, this would hash the password and update it in the database
      console.log(`Password reset for user ${userId}`);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        createUser,
        updateUser,
        deleteUser,
        getAllUsers,
        resetPassword,
        logingInUser,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  district?: string;
  subCounty?: string;
  schoolId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | "admin"
  | "admin" // Full system access
  | "ministry_admin" // Ministry of Education officials
  | "district_admin" // District Education Officers
  | "school_admin" // Head teachers/Principals
  | "ict_coordinator" // School ICT coordinators
  | "data_analyst" // Read-only access for analysis
  | "observer"; // Limited access for external observers

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  district?: string;
  subCounty?: string;
  schoolId?: string;
  password: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  district?: string;
  subCounty?: string;
  schoolId?: string;
  isActive?: boolean;
}

export interface RolePermissions {
  canViewAllSchools: boolean;
  canEditAllSchools: boolean;
  canDeleteSchools: boolean;
  canViewAllReports: boolean;
  canEditAllReports: boolean;
  canDeleteReports: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  restrictedToDistrict?: string;
  restrictedToSchool?: string;
}

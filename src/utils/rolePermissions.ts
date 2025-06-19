import { UserRole, RolePermissions, User } from "../types/auth";

export const getRolePermissions = (
  role: UserRole,
  user?: User
): RolePermissions => {
  switch (role) {
    case "admin":
      return {
        canViewAllSchools: true,
        canEditAllSchools: true,
        canDeleteSchools: true,
        canViewAllReports: true,
        canEditAllReports: true,
        canDeleteReports: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canExportData: true,
      };

    case "ministry_admin":
      return {
        canViewAllSchools: true,
        canEditAllSchools: true,
        canDeleteSchools: false,
        canViewAllReports: true,
        canEditAllReports: true,
        canDeleteReports: false,
        canManageUsers: true,
        canViewAnalytics: true,
        canExportData: true,
      };

    case "district_admin":
      return {
        canViewAllSchools: true,
        canEditAllSchools: true,
        canDeleteSchools: false,
        canViewAllReports: true,
        canEditAllReports: true,
        canDeleteReports: false,
        canManageUsers: true,
        canViewAnalytics: true,
        canExportData: true,
        restrictedToDistrict: user?.district,
      };

    case "school_admin":
      return {
        canViewAllSchools: false,
        canEditAllSchools: false,
        canDeleteSchools: false,
        canViewAllReports: false,
        canEditAllReports: true,
        canDeleteReports: false,
        canManageUsers: false,
        canViewAnalytics: true,
        canExportData: true,
        restrictedToSchool: user?.schoolId,
      };

    case "ict_coordinator":
      return {
        canViewAllSchools: false,
        canEditAllSchools: false,
        canDeleteSchools: false,
        canViewAllReports: false,
        canEditAllReports: true,
        canDeleteReports: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canExportData: false,
        restrictedToSchool: user?.schoolId,
      };

    case "data_analyst":
      return {
        canViewAllSchools: true,
        canEditAllSchools: false,
        canDeleteSchools: false,
        canViewAllReports: true,
        canEditAllReports: false,
        canDeleteReports: false,
        canManageUsers: false,
        canViewAnalytics: true,
        canExportData: true,
      };

    case "observer":
      return {
        canViewAllSchools: true,
        canEditAllSchools: false,
        canDeleteSchools: false,
        canViewAllReports: true,
        canEditAllReports: false,
        canDeleteReports: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canExportData: false,
      };

    default:
      return {
        canViewAllSchools: false,
        canEditAllSchools: false,
        canDeleteSchools: false,
        canViewAllReports: false,
        canEditAllReports: false,
        canDeleteReports: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canExportData: false,
      };
  }
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "Super Administrator";
    case "ministry_admin":
      return "Ministry Administrator";
    case "district_admin":
      return "District Administrator";
    case "school_admin":
      return "School Administrator";
    case "ict_coordinator":
      return "ICT Coordinator";
    case "data_analyst":
      return "Data Analyst";
    case "observer":
      return "Observer";
    default:
      return "Unknown Role";
  }
};

export const getRoleDescription = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "Full system access with all permissions including user management and system configuration.";
    case "ministry_admin":
      return "Ministry of Education officials with broad access to manage schools and reports across all districts.";
    case "district_admin":
      return "District Education Officers with access to manage schools and reports within their district.";
    case "school_admin":
      return "Head teachers/Principals with access to manage their school's data and reports.";
    case "ict_coordinator":
      return "School ICT coordinators responsible for updating ICT observations and reports.";
    case "data_analyst":
      return "Read-only access for data analysis and reporting across the system.";
    case "observer":
      return "Limited read-only access for external stakeholders and partners.";
    default:
      return "No description available.";
  }
};

export const canAccessResource = (
  userRole: UserRole,
  user: User,
  resourceType: "school" | "report",
  resourceData?: { schoolId?: string; district?: string }
): boolean => {
  const permissions = getRolePermissions(userRole, user);

  // Super admin can access everything
  if (userRole === "admin") return true;

  // Check district restrictions
  if (permissions.restrictedToDistrict && resourceData?.district) {
    if (permissions.restrictedToDistrict !== resourceData.district) {
      return false;
    }
  }

  // Check school restrictions
  if (permissions.restrictedToSchool && resourceData?.schoolId) {
    if (permissions.restrictedToSchool !== resourceData.schoolId) {
      return false;
    }
  }

  // Check specific permissions
  if (resourceType === "school") {
    return permissions.canViewAllSchools || !!permissions.restrictedToSchool;
  }

  if (resourceType === "report") {
    return permissions.canViewAllReports || !!permissions.restrictedToSchool;
  }

  return false;
};

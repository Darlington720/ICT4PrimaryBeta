import React from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types/auth";
import { getRolePermissions } from "../../utils/rolePermissions";
import { AlertCircle, Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Array<keyof ReturnType<typeof getRolePermissions>>;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  allowedRoles = [],
  fallback,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null; // This will be handled by the main App component
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              You don't have permission to access this resource. Please contact
              your administrator if you believe this is an error.
            </p>
            <div className="text-xs text-gray-400">
              Your role: {user.role.replace("_", " ").toUpperCase()}
            </div>
          </div>
        </div>
      )
    );
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const userPermissions = getRolePermissions(user.role, user);
    const hasRequiredPermissions = requiredPermissions.every(
      (permission) => userPermissions[permission] === true
    );

    if (!hasRequiredPermissions) {
      return (
        fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Insufficient Permissions
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                You don't have the required permissions to perform this action.
                Please contact your administrator for access.
              </p>
              <div className="text-xs text-gray-400">
                Required permissions: {requiredPermissions.join(", ")}
              </div>
            </div>
          </div>
        )
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

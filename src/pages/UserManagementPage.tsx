import React from "react";
import { useAuth } from "../context/AuthContext";
import UserManagement from "../components/users/UserManagement";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/layout/Layout";

const UserManagementPage: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={["canManageUsers"]}>
        <UserManagement />
      </ProtectedRoute>
    </Layout>
  );
};

export default UserManagementPage;

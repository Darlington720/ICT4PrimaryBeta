import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  CreateUserData,
  UpdateUserData,
  UserRole,
} from "../../types/auth";
import {
  getRoleDisplayName,
  getRoleDescription,
} from "../../utils/rolePermissions";
import Card from "../common/Card";
import PageHeader from "../common/PageHeader";
import UserForm from "./UserForm";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Shield,
  Mail,
  Calendar,
  MapPin,
  School,
  AlertCircle,
  CheckCircle,
  Clock,
  Key,
  Download,
} from "lucide-react";

const UserManagement: React.FC = () => {
  const {
    user: currentUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
  } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "">("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await createUser(userData);
      await loadUsers();
      setIsAddingUser(false);
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  };

  const handleUpdateUser = async (userId: string, userData: UpdateUserData) => {
    try {
      await updateUser(userId, userData);
      await loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(userId);
        await loadUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to reset this user's password? They will need to use the new password to log in."
      )
    ) {
      try {
        await resetPassword(userId, "password123"); // In production, generate a secure password
        alert(
          "Password has been reset to: password123\nPlease inform the user to change it after logging in."
        );
      } catch (error) {
        console.error("Failed to reset password:", error);
        alert("Failed to reset password. Please try again.");
      }
    }
  };

  const handleExportUsers = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Role",
        "District",
        "School",
        "Status",
        "Last Login",
        "Created",
      ].join(","),
      ...filteredUsers.map((user) =>
        [
          `${user.firstName} ${user.lastName}`,
          user.email,
          getRoleDisplayName(user.role),
          user.district || "N/A",
          user.schoolId || "N/A",
          user.isActive ? "Active" : "Inactive",
          user.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString()
            : "Never",
          new Date(user.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users_export.csv";
    link.click();
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !filterRole || user.role === filterRole;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "ministry_admin":
        return "bg-purple-100 text-purple-800";
      case "district_admin":
        return "bg-blue-100 text-blue-800";
      case "school_admin":
        return "bg-green-100 text-green-800";
      case "ict_coordinator":
        return "bg-amber-100 text-amber-800";
      case "data_analyst":
        return "bg-indigo-100 text-indigo-800";
      case "observer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isAddingUser) {
    return (
      <UserForm
        onSubmit={handleCreateUser}
        onCancel={() => setIsAddingUser(false)}
      />
    );
  }

  if (editingUser) {
    return (
      <UserForm
        user={editingUser}
        onSubmit={(userData) => handleUpdateUser(editingUser.id, userData)}
        onCancel={() => setEditingUser(null)}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        description={`Manage system users and their permissions (${users.length} total users)`}
        action={
          <div className="flex space-x-2">
            <button
              onClick={handleExportUsers}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => setIsAddingUser(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-48">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserRole | "")}
              >
                <option value="">All Roles</option>
                <option value="super_admin">Super Administrator</option>
                <option value="ministry_admin">Ministry Administrator</option>
                <option value="district_admin">District Administrator</option>
                <option value="school_admin">School Administrator</option>
                <option value="ict_coordinator">ICT Coordinator</option>
                <option value="data_analyst">Data Analyst</option>
                <option value="observer">Observer</option>
              </select>
            </div>

            <div className="w-full sm:w-32">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | "active" | "inactive"
                  )
                }
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Users List */}
        <Card>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location/School
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Login
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                            user.role
                          )}`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          {user.district && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {user.district}
                            </div>
                          )}
                          {user.schoolId && (
                            <div className="flex items-center">
                              <School className="h-3 w-3 mr-1" />
                              School ID: {user.schoolId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              setShowUserDetails(
                                showUserDetails === user.id ? null : user.id
                              )
                            }
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                            title="View Details"
                          >
                            {showUserDetails === user.id ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-50"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Reset Password"
                          >
                            <Key className="h-4 w-4" />
                          </button>
                          {currentUser?.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p>No users found matching your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* User Details */}
        {showUserDetails && (
          <Card title="User Details">
            {(() => {
              const user = users.find((u) => u.id === showUserDetails);
              if (!user) return null;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Personal Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Name:</strong> {user.firstName}{" "}
                          {user.lastName}
                        </div>
                        <div>
                          <strong>Email:</strong> {user.email}
                        </div>
                        <div>
                          <strong>Role:</strong> {getRoleDisplayName(user.role)}
                        </div>
                        <div>
                          <strong>Status:</strong>{" "}
                          {user.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Location & Access
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>District:</strong> {user.district || "N/A"}
                        </div>
                        <div>
                          <strong>Sub-County:</strong> {user.subCounty || "N/A"}
                        </div>
                        <div>
                          <strong>School ID:</strong> {user.schoolId || "N/A"}
                        </div>
                        <div>
                          <strong>Created:</strong>{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Last Login:</strong>{" "}
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : "Never"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Role Description
                    </h4>
                    <p className="text-sm text-gray-600">
                      {getRoleDescription(user.role)}
                    </p>
                  </div>
                </div>
              );
            })()}
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

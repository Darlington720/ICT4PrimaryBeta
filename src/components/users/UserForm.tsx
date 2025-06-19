import React, { useState } from "react";
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
import { useData } from "../../context/DataContext";
import Card from "../common/Card";
import PageHeader from "../common/PageHeader";
import {
  Save,
  X,
  ArrowLeft,
  User as UserIcon,
  Mail,
  Shield,
  MapPin,
  School,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
} from "lucide-react";

interface UserFormProps {
  user?: User;
  onSubmit: (userData: CreateUserData | UpdateUserData) => Promise<void>;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const { schools } = useData();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    role: user?.role || ("observer" as UserRole),
    district: user?.district || "",
    subCounty: user?.subCounty || "",
    schoolId: user?.schoolId || "",
    password: "",
    confirmPassword: "",
    isActive: user?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get unique districts from schools
  const districts = Array.from(
    new Set(schools.map((school) => school.district))
  );

  // Get schools in selected district
  const schoolsInDistrict = schools.filter(
    (school) => school.district === formData.district
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!user) {
      // Only validate password for new users
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Role-specific validations
    if (
      ["district_admin", "school_admin", "ict_coordinator"].includes(
        formData.role
      )
    ) {
      if (!formData.district) {
        newErrors.district = "District is required for this role";
      }
    }

    if (["school_admin", "ict_coordinator"].includes(formData.role)) {
      if (!formData.schoolId) {
        newErrors.schoolId = "School is required for this role";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const userData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        district: formData.district || undefined,
        subCounty: formData.subCounty || undefined,
        schoolId: formData.schoolId || undefined,
        isActive: formData.isActive,
        ...(user ? {} : { password: formData.password }), // Only include password for new users
      };

      await onSubmit(userData);
    } catch (error) {
      console.error("Failed to save user:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to save user",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
      // Clear district/school if not needed for the new role
      district: ["district_admin", "school_admin", "ict_coordinator"].includes(
        role
      )
        ? prev.district
        : "",
      schoolId: ["school_admin", "ict_coordinator"].includes(role)
        ? prev.schoolId
        : "",
    }));
  };

  const handleDistrictChange = (district: string) => {
    setFormData((prev) => ({
      ...prev,
      district,
      schoolId: "", // Clear school when district changes
    }));
  };

  return (
    <div>
      <PageHeader
        title={user ? "Edit User" : "Add New User"}
        description={
          user
            ? `Editing ${user.firstName} ${user.lastName}`
            : "Create a new user account"
        }
        action={
          <button
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                <UserIcon className="inline h-4 w-4 mr-1" />
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${
                  errors.firstName ? "border-red-500" : ""
                }`}
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
              />
              {errors.firstName && (
                <p className="form-error">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${
                  errors.lastName ? "border-red-500" : ""
                }`}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
              {errors.lastName && (
                <p className="form-error">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? "border-red-500" : ""}`}
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                />
                <span className="ml-2 text-sm text-gray-700">Active User</span>
              </label>
              <p className="form-hint">
                Inactive users cannot log in to the system
              </p>
            </div>
          </div>
        </Card>

        {/* Authentication */}
        {!user && (
          <Card title="Authentication">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-input pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="form-error">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                />
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Role & Permissions */}
        <Card title="Role & Permissions">
          <div className="space-y-6">
            <div>
              <label className="form-label">
                <Shield className="inline h-4 w-4 mr-1" />
                User Role <span className="text-red-500">*</span>
              </label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                required
              >
                <option value="observer">Observer</option>
                <option value="ict_coordinator">ICT Coordinator</option>
                <option value="school_admin">School Administrator</option>
                <option value="data_analyst">Data Analyst</option>
                <option value="district_admin">District Administrator</option>
                <option value="ministry_admin">Ministry Administrator</option>
                <option value="super_admin">Super Administrator</option>
              </select>

              {/* Role Description */}
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex">
                  <Info className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">
                      {getRoleDisplayName(formData.role)}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {getRoleDescription(formData.role)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Location & School Assignment */}
        {["district_admin", "school_admin", "ict_coordinator"].includes(
          formData.role
        ) && (
          <Card title="Location & School Assignment">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  className={`form-select ${
                    errors.district ? "border-red-500" : ""
                  }`}
                  value={formData.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  required
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="form-error">{errors.district}</p>
                )}
              </div>

              <div>
                <label className="form-label">Sub-County</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.subCounty}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subCounty: e.target.value,
                    }))
                  }
                  placeholder="Enter sub-county"
                />
              </div>

              {["school_admin", "ict_coordinator"].includes(formData.role) && (
                <div className="md:col-span-2">
                  <label className="form-label">
                    <School className="inline h-4 w-4 mr-1" />
                    School <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`form-select ${
                      errors.schoolId ? "border-red-500" : ""
                    }`}
                    value={formData.schoolId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        schoolId: e.target.value,
                      }))
                    }
                    required
                    disabled={!formData.district}
                  >
                    <option value="">Select School</option>
                    {schoolsInDistrict.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name} - {school.subCounty}
                      </option>
                    ))}
                  </select>
                  {errors.schoolId && (
                    <p className="form-error">{errors.schoolId}</p>
                  )}
                  {!formData.district && (
                    <p className="form-hint">Please select a district first</p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errors.submit}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : user ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

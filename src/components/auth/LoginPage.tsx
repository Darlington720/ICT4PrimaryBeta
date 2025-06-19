import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LoginCredentials } from "../../types/auth";
import {
  Computer,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader,
  School,
  BarChart3,
  Users,
  Globe,
  Monitor,
  Wifi,
  BookOpen,
  TrendingUp,
  MapPin,
  Shield,
  CheckCircle,
  Zap,
} from "lucide-react";

const LoginPage: React.FC = () => {
  const { login, isLoading, error, logingInUser } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!credentials.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!credentials.password.trim()) {
      errors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(credentials);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const quickLoginOptions = [
    {
      role: "Super Admin",
      email: "admin@education.ug",
      color: "from-red-500 to-red-600",
    },
    {
      role: "Ministry Admin",
      email: "ministry@education.ug",
      color: "from-purple-500 to-purple-600",
    },
    {
      role: "District Admin",
      email: "kampala@education.ug",
      color: "from-blue-500 to-blue-600",
    },
    {
      role: "School Admin",
      email: "principal@greenhill.ug",
      color: "from-green-500 to-green-600",
    },
  ];

  const features = [
    {
      icon: School,
      title: "School Management",
      description: "Comprehensive school data and profiles",
      color: "text-blue-600",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Real-time insights and periodic observations",
      color: "text-green-600",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Role-based access control",
      color: "text-purple-600",
    },
    {
      icon: Globe,
      title: "Geographic Mapping",
      description: "Interactive school location mapping",
      color: "text-amber-600",
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "ICT progress tracking over time",
      color: "text-indigo-600",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security",
      color: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Welcome Content */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            {/* Logo and Title */}
            <div className="flex items-center mb-8">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Computer className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">ICT4Primary</h1>
                <p className="text-blue-200">Primary Schools Monitoring</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-12">
              <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                Welcome to our
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  digital community
                </span>
              </h2>
              {/* <p className="text-xl text-blue-100 leading-relaxed">
                Empowering education through technology. Monitor, analyze, and
                improve ICT infrastructure across primary schools with our
                comprehensive observatory platform.
              </p> */}
            </div>

            {/* Community Stats */}
            <div className="flex items-center mb-12">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center border-2 border-white shadow-lg">
                  <School className="h-6 w-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center border-2 border-white shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center border-2 border-white shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center border-2 border-white shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-6">
                <p className="text-blue-100 text-lg">
                  <span className="font-semibold text-white">500+ schools</span>{" "}
                  already connected
                </p>
                <p className="text-blue-200 text-sm">
                  Join the digital transformation
                </p>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.slice(0, 4).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <IconComponent
                      className={`h-6 w-6 ${feature.color} mb-2`}
                    />
                    <h3 className="text-white font-medium text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-blue-200 text-xs">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Computer className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-white">ICT4Primary</h1>
                  <p className="text-blue-200 text-sm">
                    Primary Schools Monitoring
                  </p>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Sign In
                </h2>
                <p className="text-gray-600">Access your dashboard</p>
              </div>

              {/* Global Error */}
              {error && (
                <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Authentication Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 ${
                        validationErrors.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                      placeholder="Enter your email address"
                      value={credentials.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={isLoading || logingInUser}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className={`appearance-none block w-full pl-10 pr-12 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 ${
                        validationErrors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      disabled={isLoading || logingInUser}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading || logingInUser}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || logingInUser}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading || logingInUser ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick Login Options */}
              {/* <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Quick Demo Access
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to auto-fill credentials
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickLoginOptions.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setCredentials({
                          email: option.email,
                          password: "password123",
                        });
                      }}
                      className={`p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group hover:shadow-md`}
                      disabled={isLoading || logingInUser}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${option.color} mb-1`}
                      ></div>
                      <div className="text-xs font-medium text-gray-900">
                        {option.role}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {option.email}
                      </div>
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Additional Features */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="text-center p-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Secure</p>
                </div>
                <div className="text-center p-2">
                  <Monitor className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Real-time</p>
                </div>
                <div className="text-center p-2">
                  <Wifi className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Connected</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-blue-200">
                ICT Observatory System © 2025
              </p>
              <p className="text-xs text-blue-300 mt-1">
                Ministry of Education and Sports, Uganda
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

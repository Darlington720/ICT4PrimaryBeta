import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRolePermissions } from "../../utils/rolePermissions";
import {
  School,
  BarChart3,
  Map,
  LayoutDashboard,
  Users,
  Computer,
  FileText,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Activity,
  Database,
  PieChart,
  MapPin,
  UserCheck,
  BookOpen,
  Monitor,
  Wifi,
  Battery,
  Target,
  Eye,
  Plus,
} from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  if (!user) return null;

  const permissions = getRolePermissions(user.role, user);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Main navigation structure with submenus
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      show: true,
      description: "System Overview",
    },
    {
      name: "Schools",
      icon: School,
      show: permissions.canViewAllSchools || !!permissions.restrictedToSchool,
      description: "School Management",
      submenu: [
        {
          name: "All Schools",
          href: "/schools",
          icon: School,
          description: "View and manage schools",
          show: permissions.canViewAllSchools,
        },
        {
          name: "My School",
          href: `/schools/${permissions.restrictedToSchool}`,
          icon: School,
          description: "View your school details",
          show: !!permissions.restrictedToSchool,
        },
        // {
        //   name: "Add School",
        //   href: "/schools/add",
        //   icon: Plus,
        //   description: "Register new school",
        //   show: permissions.canEditAllSchools,
        // },
      ].filter((item) => item.show),
    },
    {
      name: "Analytics",
      icon: BarChart3,
      show: permissions.canViewAnalytics,
      description: "Data Analysis & Insights",
      submenu: [
        {
          name: "Reports",
          href: "/reports",
          icon: FileText,
          description: "Periodic observations",
          show:
            permissions.canViewAllReports || !!permissions.restrictedToSchool,
        },
        {
          name: "Compare Schools",
          href: "/compare",
          icon: TrendingUp,
          description: "School comparison",
          show: permissions.canViewAllSchools,
        },
        {
          name: "Geographic View",
          href: "/map",
          icon: MapPin,
          description: "Interactive map",
          show: permissions.canViewAllSchools,
        },
      ].filter((item) => item.show),
    },
    {
      name: "Administration",
      icon: Settings,
      show: permissions.canManageUsers,
      description: "System Administration",
      submenu: [
        {
          name: "User Management",
          href: "/users",
          icon: UserCheck,
          description: "Manage system users",
          show: permissions.canManageUsers,
        },
        {
          name: "System Settings",
          href: "/settings",
          icon: Settings,
          description: "Configure system",
          show: permissions.canManageUsers,
        },
      ].filter((item) => item.show),
    },
  ].filter(
    (item) => item.show && (item.submenu ? item.submenu.length > 0 : true)
  );

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const isDropdownActive = (submenu: any[]) => {
    return submenu.some((item) => isActive(item.href));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "from-red-500 to-red-600";
      case "ministry_admin":
        return "from-purple-500 to-purple-600";
      case "district_admin":
        return "from-blue-500 to-blue-600";
      case "school_admin":
        return "from-green-500 to-green-600";
      case "ict_coordinator":
        return "from-amber-500 to-amber-600";
      case "data_analyst":
        return "from-indigo-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const mockNotifications = [
    {
      id: 1,
      title: "New ICT Report",
      message: "Green Hills Primary submitted a new report",
      time: "2 min ago",
      type: "info",
    },
    {
      id: 2,
      title: "System Update",
      message: "Scheduled maintenance tonight at 11 PM",
      time: "1 hour ago",
      type: "warning",
    },
    {
      id: 3,
      title: "Achievement Unlocked",
      message: "50 schools now have internet access!",
      time: "3 hours ago",
      type: "success",
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-300/50 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-100/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ${
                      scrolled ? "shadow-blue-500/25" : ""
                    }`}
                  >
                    <Computer className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="ml-3 hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    ICT4Primary
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">
                    Primary Schools Monitoring
                  </p>
                </div>
              </Link>

              {/* Quick Stats (Desktop) */}
              <div className="hidden xl:flex items-center space-x-4 ml-8 pl-8 border-l border-gray-200">
                {/* <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Live</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">500+ Schools</span>
                </div> */}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const active = hasSubmenu
                  ? isDropdownActive(item.submenu!)
                  : isActive(item.href!);
                const isOpen = activeDropdown === item.name;

                if (hasSubmenu) {
                  return (
                    <div key={item.name} className="relative">
                      <button
                        onClick={() =>
                          setActiveDropdown(isOpen ? null : item.name)
                        }
                        className={`group relative flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                          active || isOpen
                            ? "text-blue-600 bg-blue-50 shadow-sm"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        <IconComponent
                          className={`h-4 w-4 mr-2 transition-transform duration-200 ${
                            active || isOpen
                              ? "scale-110"
                              : "group-hover:scale-105"
                          }`}
                        />
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />

                        {/* Active indicator */}
                        {active && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                          {item.submenu!.map((subItem) => {
                            const SubIconComponent = subItem.icon;
                            const subActive = isActive(subItem.href);
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                                  subActive
                                    ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                                    : "text-gray-700"
                                }`}
                              >
                                <SubIconComponent className="h-4 w-4 mr-3 text-gray-400" />
                                <div>
                                  <div className="font-medium">
                                    {subItem.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {subItem.description}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <Link
                      key={item.name}
                      to={item.href!}
                      className={`group relative flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                        active
                          ? "text-blue-600 bg-blue-50 shadow-sm"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent
                        className={`h-4 w-4 mr-2 transition-transform duration-200 ${
                          active ? "scale-110" : "group-hover:scale-105"
                        }`}
                      />
                      <span>{item.name}</span>

                      {/* Active indicator */}
                      {active && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                      )}
                    </Link>
                  );
                }
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Search (Desktop) */}
              {/* <div className="hidden xl:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Quick search..."
                    className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 hover:bg-white transition-colors duration-200"
                  />
                </div>
              </div>  */}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-start">
                            <div
                              className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 mr-3 ${
                                notification.type === "success"
                                  ? "bg-green-400"
                                  : notification.type === "warning"
                                  ? "bg-amber-400"
                                  : "bg-blue-400"
                              }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="hidden md:block text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.role.replace("_", " ").toUpperCase()}
                      </div>
                    </div>
                    <div className="relative">
                      <div
                        className={`h-10 w-10 rounded-xl bg-gradient-to-br ${getRoleColor(
                          user.role
                        )} flex items-center justify-center shadow-lg`}
                      >
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getRoleColor(
                            user.role
                          )} flex items-center justify-center shadow-lg`}
                        >
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                          <div className="flex items-center mt-1">
                            <Shield className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {user.role.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            24
                          </div>
                          <div className="text-xs text-blue-700">
                            Actions Today
                          </div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            98%
                          </div>
                          <div className="text-xs text-green-700">
                            System Health
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                        <User className="mr-3 h-4 w-4 text-gray-400" />
                        Profile Settings
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                        <Settings className="mr-3 h-4 w-4 text-gray-400" />
                        Preferences
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                        <Globe className="mr-3 h-4 w-4 text-gray-400" />
                        Language
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-gray-200 py-4 bg-white/95 backdrop-blur-sm">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const active = hasSubmenu
                    ? isDropdownActive(item.submenu!)
                    : isActive(item.href!);

                  if (hasSubmenu) {
                    return (
                      <div key={item.name}>
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.name ? null : item.name
                            )
                          }
                          className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                            active
                              ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center">
                            <IconComponent className="h-5 w-5 mr-3" />
                            <div>
                              <div>{item.name}</div>
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {activeDropdown === item.name && (
                          <div className="ml-4 mt-2 space-y-1">
                            {item.submenu!.map((subItem) => {
                              const SubIconComponent = subItem.icon;
                              const subActive = isActive(subItem.href);
                              return (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  onClick={() => {
                                    setShowMobileMenu(false);
                                    setActiveDropdown(null);
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                    subActive
                                      ? "text-blue-600 bg-blue-50"
                                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                  }`}
                                >
                                  <SubIconComponent className="h-4 w-4 mr-3" />
                                  <div>
                                    <div className="font-medium">
                                      {subItem.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {subItem.description}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <Link
                        key={item.name}
                        to={item.href!}
                        onClick={() => setShowMobileMenu(false)}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          active
                            ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mr-3" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  }
                })}
              </div>

              {/* Mobile Search */}
              <div className="mt-4 px-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Click outside to close menus */}
      {(showUserMenu ||
        showMobileMenu ||
        showNotifications ||
        activeDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(false);
            setShowNotifications(false);
            setActiveDropdown(null);
          }}
        />
      )}

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;

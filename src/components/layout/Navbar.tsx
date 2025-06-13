import React from 'react';
import { Link } from 'react-router-dom';
import { School, BarChart3, Map, LayoutDashboard, Users, Computer, FileText } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
              <Computer size={28} className="mr-2" />
              <span>ICT Observatory</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
              <LayoutDashboard size={16} className="mr-1" />
              Dashboard
            </Link>
            <Link to="/schools" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
              <School size={16} className="mr-1" />
              Schools
            </Link>
            <Link to="/reports" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
              <FileText size={16} className="mr-1" />
              ICT Reports
            </Link>
            <Link to="/compare" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
              <Users size={16} className="mr-1" />
              Compare Schools
            </Link>
            <Link to="/map" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
              <Map size={16} className="mr-1" />
              Map View
            </Link>
          </nav>

          <div className="md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-50">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
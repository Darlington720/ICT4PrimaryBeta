import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  PlusCircle, 
  Download,
  LayoutGrid,
  LayoutList,
  MapPin,
  Users,
  Mail,
  Phone,
  School as SchoolIcon,
  Loader,
  Filter,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { School, ICTReport } from '../../types';
import Card from '../common/Card';
import PageHeader from '../common/PageHeader';
import VirtualizedSchoolList from './VirtualizedSchoolList';
import { useData } from '../../context/DataContext';
import { calculateICTReadinessLevel, getLatestReport } from '../../utils/calculations';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { LOAD_SCHOOLS } from '../../gql/queries';
import { ADD_SCHOOL } from '../../gql/mutations';

interface SchoolListProps {
  onAddSchool: () => void;
  onEditSchool: (schoolId: string) => void;
  onDeleteSchool: (schoolId: string) => void;
}

const SCHOOLS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 25;

const SchoolList: React.FC<SchoolListProps> = ({ 
  onAddSchool,
  onEditSchool,
  onDeleteSchool
}) => {
  const { fetchSchools, loading, error, totalSchools, reports } = useData();
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [filterRegion, setFilterRegion] = useState<string>('');
  const [filterICTReadiness, setFilterICTReadiness] = useState<string>('');
  const [filterLocationType, setFilterLocationType] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [districts, setDistricts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [loadAllSchools, {data, loading: loadingQuery, error: errorQuery}] = useLazyQuery(LOAD_SCHOOLS);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  // useEffect(() => {
  //   const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
  //   return () => clearTimeout(timer);
  // }, [searchTerm]);

  // Reset to first page when filters change
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [debouncedSearch, filterDistrict, filterRegion, filterICTReadiness, filterLocationType, filterDateFrom, filterDateTo, pageSize]);

  // Uganda regions mapping
  const regionMapping: Record<string, string[]> = {
    'Central': ['Kampala', 'Wakiso', 'Mukono', 'Mpigi', 'Butambala', 'Gomba', 'Kalangala', 'Kalungu', 'Kyotera', 'Lwengo', 'Lyantonde', 'Masaka', 'Rakai', 'Sembabule', 'Bukomansimbi'],
    'Eastern': ['Jinja', 'Iganga', 'Kamuli', 'Bugiri', 'Mayuge', 'Luuka', 'Namutumba', 'Buyende', 'Kaliro', 'Mbale', 'Sironko', 'Manafwa', 'Bududa', 'Namisindwa', 'Bulambuli'],
    'Northern': ['Gulu', 'Kitgum', 'Pader', 'Agago', 'Amuru', 'Nwoya', 'Lamwo', 'Lira', 'Oyam', 'Kole', 'Alebtong', 'Otuke', 'Dokolo', 'Amolatar', 'Apac'],
    'Western': ['Mbarara', 'Ntungamo', 'Isingiro', 'Kiruhura', 'Ibanda', 'Bushenyi', 'Mitooma', 'Rubirizi', 'Sheema', 'Buhweju', 'Fort Portal', 'Kabarole', 'Kyenjojo', 'Kamwenge', 'Kyegegwa']
  };

  // Get region for a district
  const getRegion = (district: string): string => {
    for (const [region, districtList] of Object.entries(regionMapping)) {
      if (districtList.includes(district)) {
        return region;
      }
    }
    return 'Other';
  };

  // Get ICT readiness for a school
  const getSchoolICTReadiness = (school: School): { level: 'Low' | 'Medium' | 'High', score: number, lastReportDate?: string } => {
    const schoolReports = reports.filter(r => r.schoolId === school.id);
    const latestReport = getLatestReport(school.id, reports);
    const readiness = calculateICTReadinessLevel(schoolReports);
    
    return {
      ...readiness,
      lastReportDate: latestReport?.date
    };
  };

  // Fetch schools when page, search, or filters change
  useEffect(() => {
    const loadSchools = async () => {
      try {
        const res = await loadAllSchools()
        let filteredSchools = res.data?.schools;

        // Apply additional filters
        if (filterRegion) {
          filteredSchools = filteredSchools.filter(school => 
            getRegion(school.district) === filterRegion
          );
        }

        if (filterLocationType) {
          filteredSchools = filteredSchools.filter(school => 
            school.environment === filterLocationType
          );
        }

        if (filterICTReadiness) {
          filteredSchools = filteredSchools.filter(school => {
            const readiness = getSchoolICTReadiness(school);
            return readiness.level === filterICTReadiness;
          });
        }

        if (filterDateFrom || filterDateTo) {
          filteredSchools = filteredSchools.filter(school => {
            const latestReport = getLatestReport(school.id, reports);
            if (!latestReport) return false;
            
            const reportDate = new Date(latestReport.date);
            const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
            const toDate = filterDateTo ? new Date(filterDateTo) : null;
            
            if (fromDate && reportDate < fromDate) return false;
            if (toDate && reportDate > toDate) return false;
            
            return true;
          });
        }

        setSchools(filteredSchools);
        setFilteredTotal(filteredSchools.length);
        
        // Update districts list if not already populated
        if (districts.length === 0) {
          const uniqueDistricts = Array.from(
            new Set(response.data.map(school => school.district))
          );
          setDistricts(uniqueDistricts);
        }
      } catch (error) {
        console.error('Failed to fetch schools:', error);
      }
    };

    loadSchools();
  }, []);

  // [currentPage, pageSize, debouncedSearch, filterDistrict, filterRegion, filterICTReadiness, filterLocationType, filterDateFrom, filterDateTo, fetchSchools, reports]

  const totalPages = Math.ceil(filteredTotal / pageSize);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      setCurrentPage(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleExport = () => {
    // Create CSV content with enhanced data
    const headers = [
      'Name', 'District', 'Region', 'Sub-County', 'Type', 'Environment', 
      'Total Students', 'ICT Readiness Level', 'ICT Readiness Score', 
      'Last Report Date', 'Principal', 'Email', 'Phone'
    ];
    
    const rows = schools.map(school => {
      const readiness = getSchoolICTReadiness(school);
      return [
        school.name,
        school.district,
        getRegion(school.district),
        school.subCounty,
        school.type,
        school.environment,
        school.enrollmentData.totalStudents,
        readiness.level,
        readiness.score.toFixed(1),
        readiness.lastReportDate || 'No reports',
        school?.head_teacher_name,
        school.email,
        school.phone
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `schools_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearFilters = () => {
    setFilterDistrict('');
    setFilterRegion('');
    setFilterICTReadiness('');
    setFilterLocationType('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSearchTerm('');
  };

  const getReadinessColor = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getReadinessIcon = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High': return <CheckCircle className="h-4 w-4" />;
      case 'Medium': return <Clock className="h-4 w-4" />;
      case 'Low': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (errorQuery) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading schools: {errorQuery.message}</p>
        <button
          onClick={() => fetchSchools(currentPage, pageSize)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }


  return (
    <div>
      <PageHeader 
        title="Schools" 
        description={`Manage and view all registered schools (${totalSchools} total)`}
        action={
          <div className="flex space-x-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
            <button 
              onClick={onAddSchool}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add School
            </button>
          </div>
        }
      />

      <Card>
        {/* Search and Basic Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search schools..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-48">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-700 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${
                viewMode === 'table' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LayoutList className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                >
                  <option value="">All Regions</option>
                  <option value="Central">Central</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Northern">Northern</option>
                  <option value="Western">Western</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ICT Readiness</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterICTReadiness}
                  onChange={(e) => setFilterICTReadiness(e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="High">High Readiness</option>
                  <option value="Medium">Medium Readiness</option>
                  <option value="Low">Low Readiness</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterLocationType}
                  onChange={(e) => setFilterLocationType(e.target.value)}
                >
                  <option value="">All Locations</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Date From</label>
                <input
                  type="date"
                  className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Date To</label>
                <input
                  type="date"
                  className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Summary and Page Size Selector */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-700 mb-2 sm:mb-0">
            {loadingQuery ? (
              <div className="flex items-center">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Loading schools...
              </div>
            ) : (
              <>
                Showing {schools.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredTotal)} of {filteredTotal} schools
                {filteredTotal !== totalSchools && (
                  <span className="text-gray-500"> (filtered from {totalSchools} total)</span>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Show:</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {SCHOOLS_PER_PAGE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        </div>

        {loadingQuery ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col\" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        District
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ICT Readiness
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Report Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schools.map((school) => {
                      const readiness = getSchoolICTReadiness(school);
                      const region = getRegion(school.district);
                      
                      return (
                        <tr key={school.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{school.name}</div>
                                <div className="text-sm text-gray-500">{school.head_teacher_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{school.district}</div>
                            <div className="text-sm text-gray-500">{region} Region</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">{school.sub_county}</span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              school.location_type === 'Urban' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {school.location_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(readiness.level)}`}>
                                {getReadinessIcon(readiness.level)}
                                <span className="ml-1">{readiness.level}</span>
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Score: {readiness.score.toFixed(1)}/100</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {readiness.lastReportDate ? (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                {new Date(readiness.lastReportDate).toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">No reports</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">{school.total_enrollment}</span>
                            </div>
                            {/* <div className="text-xs text-gray-500">
                              {school.enrollmentData.maleStudents}M • {school.femaleStudents}F
                            </div> */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                to={`/schools/${school.id}`}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                                title="View Details"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => onEditSchool(school.id)}
                                className="text-amber-600 hover:text-amber-900 transition-colors duration-150"
                                title="Edit School"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => onDeleteSchool(school.id)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                title="Delete School"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((school) => {
                  const readiness = getSchoolICTReadiness(school);
                  const region = getRegion(school.district);
                  
                  return (
                    <div key={school.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{school.name}</h3>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {school.district}, {school.subCounty}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{region} Region</div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              school.type === 'Public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {school.type}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              school.environment === 'Urban' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {school.environment}
                            </span>
                          </div>
                        </div>

                        {/* ICT Readiness */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">ICT Readiness</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(readiness.level)}`}>
                              {getReadinessIcon(readiness.level)}
                              <span className="ml-1">{readiness.level}</span>
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            Score: {readiness.score.toFixed(1)}/100
                          </div>
                          {readiness.level === 'High' && (
                            <div className="mt-1 flex items-center text-xs text-green-600">
                              <Award className="h-3 w-3 mr-1" />
                              Top Performer
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">
                              {school.enrollmentData.totalStudents} Students
                            </span>
                            <span className="text-gray-400 text-xs ml-2">
                              ({school.enrollmentData.maleStudents}M, {school.enrollmentData.femaleStudents}F)
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">
                              {readiness.lastReportDate ? (
                                `Last Report: ${new Date(readiness.lastReportDate).toLocaleDateString()}`
                              ) : (
                                'No reports available'
                              )}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <a href={`mailto:${school.contactInfo.email}`} className="text-blue-600 hover:text-blue-800 truncate">
                              {school.contactInfo.email}
                            </a>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <a href={`tel:${school.contactInfo.phone}`} className="text-blue-600 hover:text-blue-800">
                              {school.contactInfo.phone}
                            </a>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-2">
                          <Link
                            to={`/schools/${school.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                          <button
                            onClick={() => onEditSchool(school.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-amber-600 hover:bg-amber-700"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteSchool(school.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                {/* Mobile pagination */}
                <div className="flex justify-between sm:hidden mb-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-700 self-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                {/* Desktop pagination */}
                <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
                  <div className="text-sm text-gray-700">
                    Showing page {currentPage} of {totalPages} ({filteredTotal} total schools)
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {/* First page */}
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1 || loading}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="First page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </button>

                    {/* Previous page */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page numbers */}
                    {generatePageNumbers().map((pageNum, index) => (
                      <React.Fragment key={index}>
                        {pageNum === '...' ? (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(pageNum as number)}
                            disabled={loading}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                              currentPage === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {pageNum}
                          </button>
                        )}
                      </React.Fragment>
                    ))}

                    {/* Next page */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Last page */}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages || loading}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Last page"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {schools.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <SchoolIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No schools found matching your search criteria.</p>
                <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default SchoolList;
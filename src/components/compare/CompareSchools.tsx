import React, { useState, useEffect } from 'react';
import { School, ICTReport } from '../../types';
import Card from '../common/Card';
import PageHeader from '../common/PageHeader';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getLatestReport } from '../../utils/calculations';
import { 
  Search, 
  X, 
  Filter, 
  Monitor, 
  Wifi, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings,
  Tablet,
  Projector,
  Printer,
  Battery,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CompareSchoolsProps {
  schools: School[];
  reports: ICTReport[];
}

type MetricCategory = 'infrastructure' | 'connectivity' | 'usage' | 'capacity' | 'software' | 'overall';
type InfrastructureMetric = 'computers' | 'tablets' | 'projectors' | 'printers' | 'functionalDevices';
type ConnectivityMetric = 'internetConnection' | 'internetSpeed' | 'powerBackup';
type UsageMetric = 'teacherUsage' | 'studentLiteracy' | 'weeklyHours';
type CapacityMetric = 'trainedTeachers' | 'supportStaff';

const CompareSchools: React.FC<CompareSchoolsProps> = ({ schools, reports }) => {
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory>('overall');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Metric definitions
  const metricCategories = {
    infrastructure: {
      label: 'Infrastructure',
      icon: Monitor,
      color: '#1976D2',
      metrics: {
        computers: { label: 'Computers', icon: Monitor },
        tablets: { label: 'Tablets', icon: Tablet },
        projectors: { label: 'Projectors', icon: Projector },
        printers: { label: 'Printers', icon: Printer },
        functionalDevices: { label: 'Functional Devices', icon: Settings }
      }
    },
    connectivity: {
      label: 'Connectivity',
      icon: Wifi,
      color: '#388E3C',
      metrics: {
        internetConnection: { label: 'Internet Connection', icon: Wifi },
        internetSpeed: { label: 'Internet Speed', icon: TrendingUp },
        powerBackup: { label: 'Power Backup', icon: Battery }
      }
    },
    usage: {
      label: 'Usage & Learning',
      icon: BookOpen,
      color: '#FFB300',
      metrics: {
        teacherUsage: { label: 'Teacher ICT Usage', icon: Users },
        studentLiteracy: { label: 'Student Digital Literacy', icon: GraduationCap },
        weeklyHours: { label: 'Weekly Lab Hours', icon: BookOpen }
      }
    },
    capacity: {
      label: 'Human Capacity',
      icon: Users,
      color: '#E53935',
      metrics: {
        trainedTeachers: { label: 'ICT-Trained Teachers', icon: Users },
        supportStaff: { label: 'Support Staff', icon: Settings }
      }
    },
    software: {
      label: 'Software & Content',
      icon: Settings,
      color: '#8E24AA',
      metrics: {}
    },
    overall: {
      label: 'Overall Performance',
      icon: TrendingUp,
      color: '#FF5722',
      metrics: {}
    }
  };

  // Filter schools based on search term
  const filteredSchools = schools.filter(school => 
    !selectedSchools.includes(school.id) && 
    (school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     school.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSchoolSelect = (schoolId: string) => {
    if (selectedSchools.length < 4) {
      setSelectedSchools(prev => [...prev, schoolId]);
      setSearchTerm('');
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveSchool = (schoolId: string) => {
    setSelectedSchools(prev => prev.filter(id => id !== schoolId));
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.school-search-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get selected school objects with their latest reports
  const selectedSchoolsData = selectedSchools.map(schoolId => {
    const school = schools.find(s => s.id === schoolId);
    const latestReport = getLatestReport(schoolId, reports);
    return { school, latestReport };
  }).filter(item => item.school && item.latestReport);

  // Get KPI status (traffic light system)
  const getKPIStatus = (value: number, thresholds: { good: number; fair: number }) => {
    if (value >= thresholds.good) return { status: 'good', color: '#22C55E', label: 'Good' };
    if (value >= thresholds.fair) return { status: 'fair', color: '#F59E0B', label: 'Fair' };
    return { status: 'poor', color: '#EF4444', label: 'Poor' };
  };

  // Calculate metric value for a school
  const getMetricValue = (school: School, report: ICTReport, metric: string) => {
    switch (metric) {
      case 'computers': return report.infrastructure.computers;
      case 'tablets': return report.infrastructure.tablets;
      case 'projectors': return report.infrastructure.projectors;
      case 'printers': return report.infrastructure.printers;
      case 'functionalDevices': return report.infrastructure.functionalDevices;
      case 'internetConnection': 
        const connectionMap = { 'None': 0, 'Slow': 25, 'Medium': 50, 'Fast': 100 };
        return connectionMap[report.infrastructure.internetConnection] || 0;
      case 'internetSpeed': return report.infrastructure.internetSpeedMbps;
      case 'powerBackup': return report.infrastructure.powerBackup ? 100 : 0;
      case 'teacherUsage': return (report.usage.teachersUsingICT / report.usage.totalTeachers) * 100;
      case 'studentLiteracy': return report.usage.studentDigitalLiteracyRate;
      case 'weeklyHours': return report.usage.weeklyComputerLabHours;
      case 'trainedTeachers': return (report.capacity.ictTrainedTeachers / report.usage.totalTeachers) * 100;
      case 'supportStaff': return report.capacity.supportStaff;
      default: return 0;
    }
  };

  // Prepare data for radar chart
  const prepareRadarData = () => {
    const metrics = selectedCategory === 'overall' ? [
      { name: 'Infrastructure', key: 'infrastructure', max: 100 },
      { name: 'Connectivity', key: 'connectivity', max: 100 },
      { name: 'Usage', key: 'usage', max: 100 },
      { name: 'Capacity', key: 'capacity', max: 100 }
    ] : selectedMetrics.length > 0 ? selectedMetrics.map(metric => ({
      name: metricCategories[selectedCategory]?.metrics[metric]?.label || metric,
      key: metric,
      max: ['teacherUsage', 'studentLiteracy', 'trainedTeachers', 'internetConnection', 'powerBackup'].includes(metric) ? 100 : 50
    })) : Object.entries(metricCategories[selectedCategory]?.metrics || {}).map(([key, config]) => ({
      name: config.label,
      key,
      max: ['teacherUsage', 'studentLiteracy', 'trainedTeachers', 'internetConnection', 'powerBackup'].includes(key) ? 100 : 50
    }));

    return metrics.map(metric => {
      const dataPoint: any = { name: metric.name };
      
      selectedSchools.forEach(schoolId => {
        const school = schools.find(s => s.id === schoolId);
        const latestReport = getLatestReport(schoolId, reports);
        
        if (school && latestReport) {
          let value = 0;
          
          if (selectedCategory === 'overall') {
            // Calculate aggregate scores for overall view
            if (metric.key === 'infrastructure') {
              value = (
                (latestReport.infrastructure.computers / 50 * 25) +
                (latestReport.infrastructure.functionalDevices / 50 * 25) +
                (latestReport.infrastructure.tablets / 20 * 25) +
                (latestReport.infrastructure.projectors / 10 * 25)
              );
            } else if (metric.key === 'connectivity') {
              const connectionScore = { 'None': 0, 'Slow': 25, 'Medium': 50, 'Fast': 100 }[latestReport.infrastructure.internetConnection] || 0;
              const speedScore = Math.min(100, (latestReport.infrastructure.internetSpeedMbps / 50) * 100);
              const powerScore = latestReport.infrastructure.powerBackup ? 100 : 0;
              value = (connectionScore + speedScore + powerScore) / 3;
            } else if (metric.key === 'usage') {
              const teacherUsage = (latestReport.usage.teachersUsingICT / latestReport.usage.totalTeachers) * 100;
              const studentLiteracy = latestReport.usage.studentDigitalLiteracyRate;
              const labHours = Math.min(100, (latestReport.usage.weeklyComputerLabHours / 25) * 100);
              value = (teacherUsage + studentLiteracy + labHours) / 3;
            } else if (metric.key === 'capacity') {
              const trainedTeachers = (latestReport.capacity.ictTrainedTeachers / latestReport.usage.totalTeachers) * 100;
              const supportStaff = Math.min(100, latestReport.capacity.supportStaff * 33.33);
              value = (trainedTeachers + supportStaff) / 2;
            }
          } else {
            value = getMetricValue(school, latestReport, metric.key);
          }
          
          dataPoint[school.name] = Math.min(metric.max, value);
        }
      });
      
      return dataPoint;
    });
  };

  // Prepare data for bar chart
  const prepareBarData = () => {
    if (selectedCategory === 'overall') return [];
    
    const metrics = selectedMetrics.length > 0 ? selectedMetrics : Object.keys(metricCategories[selectedCategory]?.metrics || {});
    
    return metrics.map(metric => {
      const dataPoint: any = { name: metricCategories[selectedCategory]?.metrics[metric]?.label || metric };
      
      selectedSchools.forEach(schoolId => {
        const school = schools.find(s => s.id === schoolId);
        const latestReport = getLatestReport(schoolId, reports);
        
        if (school && latestReport) {
          dataPoint[school.name] = getMetricValue(school, latestReport, metric);
        }
      });
      
      return dataPoint;
    });
  };

  // Prepare KPI data
  const prepareKPIData = () => {
    return selectedSchoolsData.map(({ school, latestReport }) => {
      if (!school || !latestReport) return null;

      const teacherUsage = (latestReport.usage.teachersUsingICT / latestReport.usage.totalTeachers) * 100;
      const trainedTeachers = (latestReport.capacity.ictTrainedTeachers / latestReport.usage.totalTeachers) * 100;
      const internetScore = { 'None': 0, 'Slow': 25, 'Medium': 50, 'Fast': 100 }[latestReport.infrastructure.internetConnection] || 0;

      return {
        school: school.name,
        kpis: {
          infrastructure: getKPIStatus(latestReport.infrastructure.functionalDevices, { good: 30, fair: 15 }),
          connectivity: getKPIStatus(internetScore, { good: 75, fair: 40 }),
          teacherUsage: getKPIStatus(teacherUsage, { good: 70, fair: 40 }),
          studentLiteracy: getKPIStatus(latestReport.usage.studentDigitalLiteracyRate, { good: 70, fair: 40 }),
          trainedTeachers: getKPIStatus(trainedTeachers, { good: 70, fair: 40 })
        }
      };
    }).filter(Boolean);
  };

  const kpiData = prepareKPIData();

  return (
    <div>
      <PageHeader 
        title="Compare Schools" 
        description="Select up to four schools to compare their ICT infrastructure and capabilities"
        action={
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="mr-2 h-4 w-4" />
            Comparison Filters
            {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </button>
        }
      />

      <div className="space-y-6">
        {/* School Selection */}
        <Card title="Select Schools to Compare (Max 4)">
          <div className="space-y-4">
            {/* Selected Schools */}
            <div className="flex flex-wrap gap-2">
              {selectedSchoolsData.map(({ school }) => (
                <div
                  key={school?.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800"
                >
                  <span>{school?.name}</span>
                  <button
                    onClick={() => handleRemoveSchool(school?.id || '')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* School Search */}
            {selectedSchools.length < 4 && (
              <div className="school-search-container relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search schools to compare..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                </div>

                {/* Dropdown */}
                {isDropdownOpen && searchTerm && (
                  <div 
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden"
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                  >
                    {filteredSchools.length > 0 ? (
                      filteredSchools.map((school) => (
                        <div
                          key={school.id}
                          className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                          onClick={() => handleSchoolSelect(school.id)}
                        >
                          <div className="font-medium">{school.name}</div>
                          <div className="text-sm text-gray-500">
                            {school.district} • {school.environment} • {school.type}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No schools found</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Comparison Filters */}
        {showFilters && selectedSchools.length > 0 && (
          <Card title="Comparison Filters">
            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Area
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {Object.entries(metricCategories).map(([key, category]) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedCategory(key as MetricCategory);
                          setSelectedMetrics([]);
                        }}
                        className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                          selectedCategory === key
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <div className="text-center">
                          <IconComponent className="h-5 w-5 mx-auto mb-1" />
                          <div className="text-xs font-medium">{category.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specific Metrics Selection */}
              {selectedCategory !== 'overall' && selectedCategory !== 'software' && Object.keys(metricCategories[selectedCategory]?.metrics || {}).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Metrics (optional - leave empty to show all)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {Object.entries(metricCategories[selectedCategory]?.metrics || {}).map(([key, metric]) => {
                      const IconComponent = metric.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => handleMetricToggle(key)}
                          className={`flex items-center p-2 rounded-lg border transition-all ${
                            selectedMetrics.includes(key)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          <span className="text-sm">{metric.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {selectedSchools.length > 0 && (
          <>
            {/* Traffic Light KPI Dashboard */}
            <Card title="Performance Overview (Traffic Light System)">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">School</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Infrastructure</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Connectivity</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Teacher Usage</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Student Literacy</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Trained Teachers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpiData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{item.school}</td>
                        {Object.entries(item.kpis).map(([kpi, status]) => (
                          <td key={kpi} className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center">
                              <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: status.color }}
                              ></div>
                              <span className="text-sm font-medium" style={{ color: status.color }}>
                                {status.label}
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* KPI Legend */}
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Good Performance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Fair Performance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Needs Improvement</span>
                </div>
              </div>
            </Card>

            {/* Visual Comparisons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card title={`${metricCategories[selectedCategory]?.label} Comparison`}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={prepareRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis />
                      {selectedSchoolsData.map((item, index) => (
                        <Radar
                          key={item.school?.id}
                          name={item.school?.name}
                          dataKey={item.school?.name}
                          stroke={['#1976D2', '#FFB300', '#388E3C', '#E53935'][index]}
                          fill={['#1976D2', '#FFB300', '#388E3C', '#E53935'][index]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Bar Chart */}
              {selectedCategory !== 'overall' && (
                <Card title={`${metricCategories[selectedCategory]?.label} Details`}>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareBarData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedSchoolsData.map((item, index) => (
                          <Bar
                            key={item.school?.id}
                            dataKey={item.school?.name}
                            fill={['#1976D2', '#FFB300', '#388E3C', '#E53935'][index]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
            </div>

            {/* Detailed Comparison Table */}
            <Card title="Detailed Comparison">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                      {selectedSchoolsData.map((item) => (
                        <th key={item.school?.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {item.school?.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">School Type</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.school?.type === 'Public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.school?.type}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Environment</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.school?.environment === 'Urban' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {item.school?.environment}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Students</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.school?.enrollmentData.totalStudents}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Functional Devices</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="mr-2">{item.latestReport?.infrastructure.functionalDevices}</span>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: getKPIStatus(
                                  item.latestReport?.infrastructure.functionalDevices || 0, 
                                  { good: 30, fair: 15 }
                                ).color 
                              }}
                            ></div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Internet Connection</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="mr-2">{item.latestReport?.infrastructure.internetConnection}</span>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: getKPIStatus(
                                  { 'None': 0, 'Slow': 25, 'Medium': 50, 'Fast': 100 }[item.latestReport?.infrastructure.internetConnection || 'None'] || 0,
                                  { good: 75, fair: 40 }
                                ).color 
                              }}
                            ></div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Internet Speed</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.latestReport?.infrastructure.internetConnection === 'None'
                            ? 'N/A'
                            : `${item.latestReport?.infrastructure.internetSpeedMbps} Mbps`}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Power Backup</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="mr-2">{item.latestReport?.infrastructure.powerBackup ? 'Yes' : 'No'}</span>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: item.latestReport?.infrastructure.powerBackup ? '#22C55E' : '#EF4444'
                              }}
                            ></div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Teachers Using ICT</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {item.latestReport?.usage.teachersUsingICT} of {item.latestReport?.usage.totalTeachers}
                              {' '}
                              ({Math.round((item.latestReport?.usage.teachersUsingICT || 0) / (item.latestReport?.usage.totalTeachers || 1) * 100)}%)
                            </span>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: getKPIStatus(
                                  (item.latestReport?.usage.teachersUsingICT || 0) / (item.latestReport?.usage.totalTeachers || 1) * 100,
                                  { good: 70, fair: 40 }
                                ).color 
                              }}
                            ></div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Student Digital Literacy</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="mr-2">{item.latestReport?.usage.studentDigitalLiteracyRate}%</span>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: getKPIStatus(
                                  item.latestReport?.usage.studentDigitalLiteracyRate || 0,
                                  { good: 70, fair: 40 }
                                ).color 
                              }}
                            ></div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ICT-Trained Teachers</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {item.latestReport?.capacity.ictTrainedTeachers} of {item.latestReport?.usage.totalTeachers}
                              {' '}
                              ({Math.round((item.latestReport?.capacity.ictTrainedTeachers || 0) / (item.latestReport?.usage.totalTeachers || 1) * 100)}%)
                            </span>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: getKPIStatus(
                                  (item.latestReport?.capacity.ictTrainedTeachers || 0) / (item.latestReport?.usage.totalTeachers || 1) * 100,
                                  { good: 70, fair: 40 }
                                ).color 
                              }}
                            ></div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Support Staff</td>
                      {selectedSchoolsData.map((item) => (
                        <td key={item.school?.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.latestReport?.capacity.supportStaff}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {selectedSchools.length === 0 && (
          <div className="mt-6 p-10 text-center bg-white rounded-lg shadow-sm border border-gray-100">
            <Monitor className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Search and select schools to compare using the search box above.</p>
            <p className="text-sm text-gray-400 mt-2">You can compare up to 4 schools at once and filter by specific metrics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareSchools;
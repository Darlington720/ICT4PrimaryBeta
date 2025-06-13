import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import PeriodicObservationForm from '../components/reports/PeriodicObservationForm';
import { School, ICTReport } from '../types';
import { exportReportToPDF } from '../utils/pdfExport';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Search, 
  Filter, 
  Download, 
  Laptop, 
  Wifi, 
  Users, 
  Battery, 
  BookOpen, 
  GraduationCap,
  School as SchoolIcon,
  Monitor,
  Tablet,
  Printer,
  Projector,
  Edit,
  X,
  Eye,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { schools, reports, loading, updateReport } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [filterPeriod, setFilterPeriod] = useState<string>('');
  const [editingReport, setEditingReport] = useState<ICTReport | null>(null);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  // Get unique districts and periods for filtering
  const districts = Array.from(new Set(schools.map(school => school.district)));
  const periods = Array.from(new Set(reports.map(report => report.period)));

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const school = schools.find(s => s.id === report.schoolId);
    if (!school) return false;

    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !filterDistrict || school.district === filterDistrict;
    const matchesPeriod = !filterPeriod || report.period === filterPeriod;

    return matchesSearch && matchesDistrict && matchesPeriod;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Handle report edit
  const handleEditReport = (report: ICTReport) => {
    setEditingReport(report);
  };

  const handleReportSubmit = async (reportData: ICTReport) => {
    await updateReport(reportData);
    setEditingReport(null);
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  // Prepare summary data for the selected period
  const prepareSummaryData = () => {
    if (!filterPeriod) return {
      totalDevices: 0,
      internetAccess: 0,
      avgSpeed: 0,
      teacherUsage: 0,
      studentLiteracy: 0,
      powerBackup: 0,
      deviceTypes: { computers: 0, tablets: 0, projectors: 0, printers: 0 },
      internetTypes: { none: 0, slow: 0, medium: 0, fast: 0 },
      totalSchools: 0
    };

    const periodReports = reports.filter(r => r.period === filterPeriod);
    let summary = {
      totalDevices: 0,
      internetAccess: 0,
      avgSpeed: 0,
      teacherUsage: 0,
      studentLiteracy: 0,
      powerBackup: 0,
      deviceTypes: { computers: 0, tablets: 0, projectors: 0, printers: 0 },
      internetTypes: { none: 0, slow: 0, medium: 0, fast: 0 },
      totalSchools: periodReports.length
    };

    periodReports.forEach(report => {
      // Device counts
      summary.deviceTypes.computers += report.infrastructure.computers;
      summary.deviceTypes.tablets += report.infrastructure.tablets;
      summary.deviceTypes.projectors += report.infrastructure.projectors;
      summary.deviceTypes.printers += report.infrastructure.printers;
      summary.totalDevices += report.infrastructure.functionalDevices;

      // Internet
      if (report.infrastructure.internetConnection !== 'None') {
        summary.internetAccess++;
        summary.avgSpeed += report.infrastructure.internetSpeedMbps;
      }
      summary.internetTypes[report.infrastructure.internetConnection.toLowerCase() as keyof typeof summary.internetTypes]++;

      // Teacher usage and student literacy
      summary.teacherUsage += (report.usage.teachersUsingICT / report.usage.totalTeachers) * 100;
      summary.studentLiteracy += report.usage.studentDigitalLiteracyRate;

      // Power backup
      if (report.infrastructure.powerBackup) summary.powerBackup++;
    });

    // Calculate averages
    if (summary.totalSchools > 0) {
      summary.avgSpeed = summary.avgSpeed / summary.internetAccess;
      summary.teacherUsage = summary.teacherUsage / summary.totalSchools;
      summary.studentLiteracy = summary.studentLiteracy / summary.totalSchools;
    }

    return summary;
  };

  const summary = prepareSummaryData();

  // Prepare data for charts
  const deviceDistributionData = [
    { name: 'Computers', value: summary.deviceTypes.computers },
    { name: 'Tablets', value: summary.deviceTypes.tablets },
    { name: 'Projectors', value: summary.deviceTypes.projectors },
    { name: 'Printers', value: summary.deviceTypes.printers }
  ];

  const COLORS = ['#1976D2', '#FFB300', '#388E3C', '#E53935'];

  // Get observation summary for a report
  const getObservationSummary = (report: ICTReport) => {
    const school = schools.find(s => s.id === report.schoolId);
    if (!school) return null;

    const teacherUsagePercent = Math.round((report.usage.teachersUsingICT / report.usage.totalTeachers) * 100);
    const trainedTeachersPercent = Math.round((report.capacity.ictTrainedTeachers / report.usage.totalTeachers) * 100);
    
    return {
      school,
      teacherUsagePercent,
      trainedTeachersPercent,
      hasInternet: report.infrastructure.internetConnection !== 'None',
      hasPowerBackup: report.infrastructure.powerBackup,
      functionalDevices: report.infrastructure.functionalDevices,
      studentLiteracy: report.usage.studentDigitalLiteracyRate
    };
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (editingReport) {
    const school = schools.find(s => s.id === editingReport.schoolId);
    if (!school) return null;

    return (
      <Layout>
        <PeriodicObservationForm
          school={school}
          report={editingReport}
          onSubmit={handleReportSubmit}
          onCancel={handleCancelEdit}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader 
        title="Periodic Observations" 
        description="View and analyze periodic observations across all schools"
        action={
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              alert('Export functionality coming soon!');
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Observations
          </button>
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
            
            <div className="w-full sm:w-48">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <option value="">All Periods</option>
                {periods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {filterPeriod && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
                    <Monitor className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-blue-100 text-sm font-medium">Total Devices</p>
                    <h3 className="text-2xl font-bold">{summary.totalDevices}</h3>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-400 bg-opacity-30">
                    <Wifi className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-amber-100 text-sm font-medium">Internet Access</p>
                    <h3 className="text-2xl font-bold">
                      {((summary.internetAccess / summary.totalSchools) * 100).toFixed(0)}%
                    </h3>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-400 bg-opacity-30">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-green-100 text-sm font-medium">Teacher ICT Usage</p>
                    <h3 className="text-2xl font-bold">{summary.teacherUsage.toFixed(1)}%</h3>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-400 bg-opacity-30">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-purple-100 text-sm font-medium">Student Literacy</p>
                    <h3 className="text-2xl font-bold">{summary.studentLiteracy.toFixed(1)}%</h3>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Device Distribution">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Internet Connection Types">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: 'Connection Types',
                          None: summary.internetTypes.none,
                          Slow: summary.internetTypes.slow,
                          Medium: summary.internetTypes.medium,
                          Fast: summary.internetTypes.fast
                        }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="None" fill="#E53935" />
                      <Bar dataKey="Slow" fill="#FFB300" />
                      <Bar dataKey="Medium" fill="#1976D2" />
                      <Bar dataKey="Fast" fill="#388E3C" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Detailed Observations */}
        <div className="space-y-6">
          {filteredReports.map((report) => {
            const observationSummary = getObservationSummary(report);
            if (!observationSummary) return null;

            const { school, teacherUsagePercent, trainedTeachersPercent, hasInternet, hasPowerBackup, functionalDevices, studentLiteracy } = observationSummary;
            const isExpanded = expandedReport === report.id;

            return (
              <Card key={report.id}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{school.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          {report.period}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {school.district}, {school.environment} • Observed on {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        title={isExpanded ? "Collapse Details" : "View Details"}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditReport(report)}
                        className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-50"
                        title="Edit Observation"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => exportReportToPDF(school, report)}
                        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                        title="Download PDF"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-blue-600">{functionalDevices}</div>
                      <div className="text-xs text-gray-600">Functional Devices</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center">
                        {hasInternet ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600">Internet</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center">
                        {hasPowerBackup ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600">Power Backup</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-amber-600">{teacherUsagePercent}%</div>
                      <div className="text-xs text-gray-600">Teacher ICT Usage</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-600">{studentLiteracy}%</div>
                      <div className="text-xs text-gray-600">Student Literacy</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-purple-600">{trainedTeachersPercent}%</div>
                      <div className="text-xs text-gray-600">Trained Teachers</div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Infrastructure Details */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Infrastructure Status</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Computers:</span>
                              <span className="font-medium">{report.infrastructure.computers}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Tablets:</span>
                              <span className="font-medium">{report.infrastructure.tablets}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Projectors:</span>
                              <span className="font-medium">{report.infrastructure.projectors}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Internet Speed:</span>
                              <span className="font-medium">
                                {report.infrastructure.internetConnection === 'None' 
                                  ? 'No Internet' 
                                  : `${report.infrastructure.internetSpeedMbps} Mbps`}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Power Sources:</span>
                              <span className="font-medium">{report.infrastructure.powerSource.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Teaching & Learning */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Teaching & Learning</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Teachers Using ICT:</span>
                              <span className="font-medium">
                                {report.usage.teachersUsingICT} of {report.usage.totalTeachers}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Weekly Lab Hours:</span>
                              <span className="font-medium">{report.usage.weeklyComputerLabHours}h</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Student Digital Literacy:</span>
                              <span className="font-medium">{report.usage.studentDigitalLiteracyRate}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>ICT-Trained Teachers:</span>
                              <span className="font-medium">
                                {report.capacity.ictTrainedTeachers} of {report.usage.totalTeachers}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Support Staff:</span>
                              <span className="font-medium">{report.capacity.supportStaff}</span>
                            </div>
                          </div>
                        </div>

                        {/* Software & Content */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Software & Content</h4>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-gray-600">Operating Systems:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {report.software.operatingSystems.map((os) => (
                                  <span key={os} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    {os}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Educational Software:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {report.software.educationalSoftware.length > 0 ? (
                                  report.software.educationalSoftware.map((software) => (
                                    <span key={software} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      {software}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-500">None reported</span>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Office Applications:</span>
                              <span className="font-medium">
                                {report.software.officeApplications ? 'Available' : 'Not Available'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No periodic observations found matching your search criteria.</p>
              <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
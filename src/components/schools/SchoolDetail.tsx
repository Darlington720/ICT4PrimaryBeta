import React, { useState } from 'react';
import { 
  Download,
  MapPin, 
  Mail, 
  Phone, 
  Users, 
  School as SchoolIcon,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Edit,
  X,
  Building,
  Wifi,
  Shield,
  GraduationCap,
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Zap,
  Lock,
  Car,
  Heart,
  BookOpen,
  Award,
  Calendar,
  FileText,
  Camera,
  Eye,
  TrendingUp,
  BarChart3,
  Monitor,
  Tablet,
  Projector,
  Printer,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { School, ICTReport } from '../../types';
import Card from '../common/Card';
import PageHeader from '../common/PageHeader';
import PeriodicObservationForm from '../reports/PeriodicObservationForm';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { exportReportToPDF } from '../../utils/pdfExport';
import { calculateICTReadinessLevel } from '../../utils/calculations';

interface SchoolDetailProps {
  school: School;
  reports: ICTReport[];
  onAddReport: () => void;
  onBack: () => void;
  onUpdateReport: (report: ICTReport) => Promise<void>;
}

type TabType = 'overview' | 'infrastructure' | 'connectivity' | 'governance' | 'observations' | 'trends';

const REPORTS_PER_PAGE = 5;

const formatter = new Intl.DateTimeFormat('en-UG', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const SchoolDetail: React.FC<SchoolDetailProps> = ({ 
  school, 
  reports, 
  onAddReport, 
  onBack,
  onUpdateReport
}) => {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [editingReport, setEditingReport] = useState<ICTReport | null>(null);
  const [expandedObservation, setExpandedObservation] = useState<string | null>(null);

  // Get unique periods
  const periods = Array.from(new Set(reports.map(report => report.period)));

  // Filter reports by period
  const filteredReports = selectedPeriod
    ? reports.filter(report => report.period === selectedPeriod)
    : reports;

  // Sort reports by date
  const sortedReports = [...filteredReports].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Pagination
  const totalPages = Math.ceil(sortedReports.length / REPORTS_PER_PAGE);
  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * REPORTS_PER_PAGE,
    currentPage * REPORTS_PER_PAGE
  );

  // Handle report edit
  const handleEditReport = (report: ICTReport) => {
    setEditingReport(report);
  };

  const handleReportSubmit = async (reportData: ICTReport) => {
    // console.log("report data", reportData)
    await onUpdateReport(reportData);
    setEditingReport(null);
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  // Prepare data for trends
  const trendData = reports.map(report => ({
    period: report?.period,
    computers: report?.infrastructure.computers,
    functionalDevices: report?.infrastructure.functional_devices,
    internetSpeed: report.infrastructure.internet_speed_mbps,
    teacherUsage: (report?.usage?.teachers_using_ict / report?.usage?.total_teachers) * 100,
    studentLiteracy: report?.usage?.student_digital_literacy_rate,
    trainedTeachers: (report?.capacity.ict_trained_teachers / report?.usage?.total_teachers) * 100,
    weeklyLabHours: report.usage.weekly_computer_lab_hours,
    readinessScore: calculateICTReadinessLevel([report]).score
  }));

  // Calculate ICT readiness
  const readinessLevel = calculateICTReadinessLevel(reports);

  // Prepare infrastructure comparison data
  const infrastructureComparisonData = reports.map(report => ({
    period: report?.period,
    computers: report?.infrastructure.computers,
    tablets: report?.infrastructure.tablets,
    projectors: report?.infrastructure.projectors,
    printers: report?.infrastructure.printers
  }));

  // Prepare connectivity trends
  const connectivityTrendData = reports.map(report => ({
    period: report?.period,
    hasInternet: report.infrastructure.internet_connection !== 'None' ? 1 : 0,
    internetSpeed: report.infrastructure.internet_speed_mbps,
    hasPowerBackup: report?.infrastructure.power_backup ? 1 : 0
  }));

  // Get observation summary
  const getObservationSummary = (report: ICTReport) => {
    const teacherUsagePercent = Math.round((report.usage.teachers_using_ict / report.usage.total_teachers) * 100);
    const trainedTeachersPercent = Math.round((report.capacity.ict_trained_teachers / report.usage.total_teachers) * 100);
    const deviceUtilization = Math.round((report.infrastructure.functional_devices / (report.infrastructure.computers + report.infrastructure.tablets)) * 100) || 0;
    
    return {
      teacherUsagePercent,
      trainedTeachersPercent,
      deviceUtilization,
      hasInternet: report.infrastructure.internet_connection !== 'None',
      hasPowerBackup: report.infrastructure.power_backup,
      functionalDevices: report.infrastructure.functional_devices,
      studentLiteracy: report.usage.student_digital_literacy_rate,
      weeklyLabHours: report.usage.weekly_computer_lab_hours,
      readinessScore: calculateICTReadinessLevel([report]).score
    };
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <SchoolIcon className="h-4 w-4" /> },
    { id: 'infrastructure', label: 'Infrastructure', icon: <Building className="h-4 w-4" /> },
    { id: 'connectivity', label: 'Connectivity', icon: <Wifi className="h-4 w-4" /> },
    { id: 'governance', label: 'Governance', icon: <Shield className="h-4 w-4" /> },
    { id: 'observations', label: 'Periodic Observations', icon: <Eye className="h-4 w-4" /> },
    { id: 'trends', label: 'Trends & Analytics', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  if (editingReport) {
    return (
      <PeriodicObservationForm 
        school={school}
        report={editingReport}
        onSubmit={handleReportSubmit}
        onCancel={handleCancelEdit}
      />
    );
  }

  const StatusBadge = ({ condition, trueText, falseText }: { condition: boolean; trueText: string; falseText: string }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      condition ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {condition ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
      {condition ? trueText : falseText}
    </span>
  );

  const COLORS = ['#1976D2', '#FFB300', '#388E3C', '#E53935', '#8E24AA', '#FB8C00'];

  return (
    <div>
      <PageHeader 
        title={school.name}
        description={
          <div className="space-y-2">
            <p>{school.type} school in {school.district}, {school.sub_county}</p>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                readinessLevel.level === 'High' ? 'bg-green-100 text-green-800' :
                readinessLevel.level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {readinessLevel.level} ICT Readiness
              </span>
              <span className="text-sm text-gray-500">
                Score: {readinessLevel.score.toFixed(1)}/100
              </span>
              {reports.length > 0 && (
                <span className="text-sm text-gray-500">
                  {reports.length} observation{reports.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        }
        action={
          <div className="space-x-2">
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Schools
            </button>
            <button
              onClick={onAddReport}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Add Periodic Observation
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-blue-100 text-sm font-medium">Total Students</p>
                  <h3 className="text-2xl font-bold">{school.total_students}</h3>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-400 bg-opacity-30">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-amber-100 text-sm font-medium">Total Teachers</p>
                  <h3 className="text-2xl font-bold">{school.total_teachers}</h3>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-400 bg-opacity-30">
                  <Laptop className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-green-100 text-sm font-medium">Student Computers</p>
                  <h3 className="text-2xl font-bold">{school.student_computers}</h3>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-400 bg-opacity-30">
                  <Wifi className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-purple-100 text-sm font-medium">Internet Speed</p>
                  <h3 className="text-2xl font-bold">{school.bandwidth_mbps} Mbps</h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="School Information">
              <div className="space-y-4">
                <div className="flex items-start">
                  <SchoolIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">School Details</h3>
                    <p className="text-base font-medium text-gray-900">{school.name}</p>
                    <p className="text-sm text-gray-600">{school.ownership_type} • {school.environment}</p>
                    {school.emis_number && (
                      <p className="text-sm text-gray-500">EMIS: {school.emis_number}</p>
                    )}
                    {school.upi_code && (
                      <p className="text-sm text-gray-500">UPI CODE: {school.upi_code}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="text-base text-gray-900">{school.district}, {school.sub_county}</p>
                    <p className="text-sm text-gray-600">
                      {parseFloat(school.latitude).toFixed(4)}, {parseFloat(school.longitude).toFixed(4)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Enrollment</h3>
                    <p className="text-base text-gray-900">{school.total_students} Students</p>
                    <p className="text-sm text-gray-600">
                      {school.male_students} Male • {school.female_students} Female
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Contact Information">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Head Teacher</h3>
                    <p className="text-base text-gray-900">{school.head_teacher}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-4 w-4 text-gray-400 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <a href={`mailto:${school.school_email}`} className="text-base text-blue-600 hover:text-blue-800">
                      {school.school_email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-4 w-4 text-gray-400 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <a href={`tel:${school.school_phone}`} className="text-base text-blue-600 hover:text-blue-800">
                      {school.school_phone}
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Latest Observation Summary */}
          {reports.length > 0 && (
            <Card title="Latest Observation Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                  const latestReport = sortedReports[0];
                  const summary = getObservationSummary(latestReport);
                  
                  return (
                    <>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{summary.functionalDevices}</div>
                        <div className="text-sm text-gray-600">Functional Devices</div>
                        <div className="text-xs text-gray-500">{latestReport.period}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{summary.teacherUsagePercent}%</div>
                        <div className="text-sm text-gray-600">Teacher ICT Usage</div>
                        <div className="text-xs text-gray-500">{latestReport?.usage?.teachers_using_ict || 0} of {latestReport?.usage?.total_teachers || 0}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{summary.studentLiteracy}%</div>
                        <div className="text-sm text-gray-600">Student Digital Literacy</div>
                        <div className="text-xs text-gray-500">Current level</div>
                      </div>
                      
                      <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">{summary.readinessScore.toFixed(0)}</div>
                        <div className="text-sm text-gray-600">ICT Readiness Score</div>
                        <div className="text-xs text-gray-500">Out of 100</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Infrastructure Tab */}
      {currentTab === 'infrastructure' && (
        <div className="space-y-6">
          <Card title="ICT Equipment">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Student Computers</h4>
                    <p className="text-3xl font-bold text-blue-600">{school.student_computers}</p>
                  </div>
                  <Laptop className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Teacher Computers</h4>
                    <p className="text-3xl font-bold text-green-600">{school.teacher_computers}</p>
                  </div>
                  <Laptop className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Projectors</h4>
                    <p className="text-3xl font-bold text-purple-600">{school.projectors}</p>
                  </div>
                  <Projector className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Smart Boards</h4>
                    <p className="text-3xl font-bold text-amber-600">{school.smart_boards || 0}</p>
                  </div>
                  <Monitor className="h-8 w-8 text-amber-500" />
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Tablets</h4>
                    <p className="text-3xl font-bold text-red-600">{school.tablets}</p>
                  </div>
                  <Tablet className="h-8 w-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Laptops</h4>
                    <p className="text-3xl font-bold text-indigo-600">{school.laptops}</p>
                  </div>
                  <Laptop className="h-8 w-8 text-indigo-500" />
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Facilities">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Computer Lab</span>
                  <StatusBadge condition={school.has_computer_lab} trueText="Available" falseText="Not Available" />
                </div>
                
                {school.has_computer_lab && school.lab_condition && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Lab Condition</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      school.lab_condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                      school.lab_condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                      school.lab_condition === 'Fair' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {school.lab_condition}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">ICT Room</span>
                  <StatusBadge condition={school.has_secure_room_for_ict} trueText="Available" falseText="Not Available" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Electricity</span>
                  <StatusBadge condition={school.has_electricity} trueText="Connected" falseText="Not Connected" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Secure Storage</span>
                  <StatusBadge condition={school.has_secure_room_for_ict} trueText="Available" falseText="Not Available" />
                </div>
              </div>
            </Card>

            <Card title="Power Infrastructure">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Power Backup Systems</h4>
                  <div className="flex flex-wrap gap-2">
                    {school.power_backup?.split(',').map((backup) => (
                      <span key={backup} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Zap className="h-3 w-3 mr-1" />
                        {backup}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Connectivity Tab */}
      {currentTab === 'connectivity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Internet Connection">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Connection Type</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    school.connection_type === 'Fiber' ? 'bg-green-100 text-green-800' :
                    school.connection_type === 'Mobile Broadband' ? 'bg-blue-100 text-blue-800' :
                    school.connection_type === 'Satellite' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {school.connection_type}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Bandwidth</span>
                  <span className="text-sm font-semibold text-gray-900">{school.bandwidth_mbps} Mbps</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Stability</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    school.stability === 'High' ? 'bg-green-100 text-green-800' :
                    school.stability === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {school.stability}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Usage Policy</span>
                  <StatusBadge condition={school.has_usage_policy} trueText="In Place" falseText="Not Available" />
                </div>
                
                {school.provider && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Provider</span>
                    <span className="text-sm font-semibold text-gray-900">{school.provider}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card title="WiFi Coverage">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Coverage Areas</h4>
                <div className="grid grid-cols-2 gap-2">
                  {school.wifi_coverage.split(',').map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      {school.wifi_coverage.includes(area as any) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card title="Software & Digital Resources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Learning Management System</span>
                  <StatusBadge condition={school.has_digital_content} trueText="Available" falseText="Not Available" />
                </div>
                
                {school.has_digital_content && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">LMS Platform</span>
                    <span className="text-sm font-semibold text-gray-900">{school.lms_name}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Licensed Software</span>
                  <StatusBadge condition={school.has_licensed_software} trueText="Available" falseText="Not Available" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Digital Library</span>
                  <StatusBadge condition={school.has_digital_library} trueText="Available" falseText="Not Available" />
                </div>
                
                {school.content_source && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Content Source</span>
                    <span className="text-sm font-semibold text-gray-900">{school.content_source}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {school.has_licensed_software && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Licensed Software</h4>
                    <div className="flex flex-wrap gap-2">
                      {school.licensed_software.split(',').map((software) => (
                        <span key={software} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {software}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Productivity Suites</h4>
                  <div className="flex flex-wrap gap-2">
                    {school.productivity_suite.split(',').map((suite) => (
                      <span key={suite} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {suite}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Governance Tab */}
      {currentTab === 'governance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="ICT Governance">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">ICT Policy</span>
                  <StatusBadge condition={school.has_ict_policy} trueText="In Place" falseText="Not Available" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">National Strategy Alignment</span>
                  <StatusBadge condition={school.aligned_with_national_strategy} trueText="Aligned" falseText="Not Aligned" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">ICT Committee</span>
                  <StatusBadge condition={school.has_ict_committee} trueText="Active" falseText="Not Active" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">ICT Budget</span>
                  <StatusBadge condition={school.has_ict_budget} trueText="Allocated" falseText="Not Allocated" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Monitoring System</span>
                  <StatusBadge condition={school.has_ict_budget} trueText="In Place" falseText="Not Available" />
                </div>
              </div>
            </Card>

            <Card title="Human Capacity">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">ICT Trained Teachers</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {school.ict_trained_teachers} / {school.total_teachers}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Support Staff</span>
                  <span className="text-sm font-semibold text-gray-900">{school.support_staff}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Monthly Trainings</span>
                  <span className="text-sm font-semibold text-gray-900">{school.monthly_trainings}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Teacher Competency Level</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    school.teacher_competency_level === 'Advanced' ? 'bg-green-100 text-green-800' :
                    school.teacher_competency_level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {school.teacher_competency_level}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Community Engagement">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Parent Portal</span>
                  <StatusBadge condition={school.has_parent_portal} trueText="Active" falseText="Not Available" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Community Outreach</span>
                  <StatusBadge condition={school.has_community_outreach} trueText="Active" falseText="Not Active" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Industry Partners</span>
                  <StatusBadge condition={school.has_industry_partners} trueText="Available" falseText="None" />
                </div>
              </div>
              
              {school.partner_organizations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Partner Organizations</h4>
                  <div className="flex flex-wrap gap-2">
                    {school.partner_organizations.split(',').map((partner) => (
                      <span key={partner} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card title="Student Engagement">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Computer Lab</span>
                  <StatusBadge condition={school.has_computer_lab} trueText="Active" falseText="Not Active" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Online Platforms Usage</span>
                  <StatusBadge condition={school.uses_online_platforms} trueText="Active" falseText="Not Used" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Digital Literacy Level</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    school.digital_literacy_level === 'Advanced' ? 'bg-green-100 text-green-800' :
                    school.digital_literacy_level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {school.digital_literacy_level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Student Feedback Rating</span>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900 mr-2">{school.student_feedback_rating}/5</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Award key={star} className={`h-4 w-4 ${
                          star <= school.student_feedback_rating ? 'text-yellow-400' : 'text-gray-300'
                        }`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">ICT Integrated Lessons</span>
                  <span className="text-sm font-semibold text-gray-900">{school.ict_integrated_lessons}/month</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">ICT Assessments</span>
                  <StatusBadge condition={school.uses_ict_assessments} trueText="Used" falseText="Not Used" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Student Projects</span>
                  <StatusBadge condition={school.has_student_projects} trueText="Active" falseText="None" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Blended Learning</span>
                  <StatusBadge condition={school.uses_blended_learning} trueText="Implemented" falseText="Not Used" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Periodic Observations Tab */}
      {currentTab === 'observations' && (
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div className="w-64">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedPeriod}
                  onChange={(e) => {
                    setSelectedPeriod(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Periods</option>
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                Showing {paginatedReports.length} of {sortedReports.length} observations
              </div>
            </div>

            <div className="space-y-4">
              {paginatedReports.map((report) => {
                const summary = getObservationSummary(report);
                const isExpanded = expandedObservation === report.id;
                
                return (
                  <div key={report.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">
                            Periodic Observation - {report?.period}
                          </h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            summary.readinessScore >= 70 ? 'bg-green-100 text-green-800' :
                            summary.readinessScore >= 40 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Score: {summary.readinessScore.toFixed(0)}/100
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Observed on {new Date(report?.date).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setExpandedObservation(isExpanded ? null : report.id)}
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
                          title="Download Report"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-lg font-semibold text-blue-600">{summary.functionalDevices}</div>
                        <div className="text-xs text-gray-600">Functional Devices</div>
                      </div>
                      
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="flex items-center justify-center">
                          {summary.hasInternet ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-600">Internet</div>
                      </div>
                      
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="flex items-center justify-center">
                          {summary.hasPowerBackup ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-600">Power Backup</div>
                      </div>
                      
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-lg font-semibold text-amber-600">{summary.teacherUsagePercent}%</div>
                        <div className="text-xs text-gray-600">Teacher ICT Usage</div>
                      </div>
                      
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-lg font-semibold text-green-600">{summary.studentLiteracy}%</div>
                        <div className="text-xs text-gray-600">Student Literacy</div>
                      </div>
                      
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-lg font-semibold text-purple-600">{summary.weeklyLabHours}h</div>
                        <div className="text-xs text-gray-600">Weekly Lab Hours</div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Infrastructure Details */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              Infrastructure Status
                            </h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Computers:</span>
                                <span className="font-medium">{report?.infrastructure.computers}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Tablets:</span>
                                <span className="font-medium">{report?.infrastructure.tablets || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Projectors:</span>
                                <span className="font-medium">{report?.infrastructure.projectors}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Printers:</span>
                                <span className="font-medium">{report?.infrastructure.printers || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Functional Devices:</span>
                                <span className="font-medium">{report?.infrastructure.functional_devices}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Internet Speed:</span>
                                <span className="font-medium">
                                  {report.infrastructure.internet_connection === 'None' 
                                    ? 'No Internet' 
                                    : `${report?.infrastructure.internet_speed_mbps} Mbps`}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Power Sources:</span>
                                <span className="font-medium">{report?.infrastructure.power_source?.join(', ')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Teaching & Learning */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <GraduationCap className="h-4 w-4 mr-2" />
                              Teaching & Learning
                            </h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Teachers Using ICT:</span>
                                <span className="font-medium">
                                  {report.usage.teachers_using_ict} of {report.usage.total_teachers}
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({summary.teacherUsagePercent}%)
                                  </span>
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Weekly Lab Hours:</span>
                                <span className="font-medium">{report.usage.weekly_computer_lab_hours}h</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Student Digital Literacy:</span>
                                <span className="font-medium">{report.usage.student_digital_literacy_rate}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>ICT-Trained Teachers:</span>
                                <span className="font-medium">
                                  {report.capacity.ictTrainedTeachers} of {report.usage.total_teachers}
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({summary.trainedTeachersPercent}%)
                                  </span>
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Support Staff:</span>
                                <span className="font-medium">{report.capacity.support_staff}</span>
                              </div>
                            </div>
                          </div>

                          {/* Software & Content */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <Monitor className="h-4 w-4 mr-2" />
                              Software & Content
                            </h5>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm text-gray-600">Operating Systems:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {report.software.operating_systems.map((os) => (
                                    <span key={os} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      {os}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Educational Software:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {report.software.educational_software.length > 0 ? (
                                    report.software.educational_software.map((software) => (
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
                                  {report.software.office_applications ? 'Available' : 'Not Available'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center text-sm text-gray-700 disabled:opacity-50 hover:text-blue-600"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center text-sm text-gray-700 disabled:opacity-50 hover:text-blue-600"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}

            {paginatedReports.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No periodic observations found for the selected period.</p>
                <p className="text-sm mt-2">Click "Add Periodic Observation" to create the first observation for this school.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Trends & Analytics Tab */}
      {currentTab === 'trends' && (
        <div className="space-y-6">
          {reports.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-500 mb-4">
                  Add periodic observations to see trends and analytics for this school.
                </p>
                <button
                  onClick={onAddReport}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Add First Observation
                </button>
              </div>
            </Card>
          ) : (
            <>
              {/* ICT Readiness Trend */}
              <Card title="ICT Readiness Score Trend">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}`, 'Readiness Score']} />
                      <Area 
                        type="monotone" 
                        dataKey="readinessScore" 
                        stroke="#1976D2" 
                        fill="#1976D2"
                        fillOpacity={0.3}
                        name="ICT Readiness Score"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Infrastructure Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Infrastructure Growth">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={infrastructureComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="computers" fill="#1976D2" name="Computers" />
                        <Bar dataKey="tablets" fill="#FFB300" name="Tablets" />
                        <Bar dataKey="projectors" fill="#388E3C" name="Projectors" />
                        <Bar dataKey="printers" fill="#E53935" name="Printers" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="Connectivity & Power Trends">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={connectivityTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'internetSpeed' ? `${value} Mbps` : value === 1 ? 'Yes' : 'No',
                            name === 'internetSpeed' ? 'Internet Speed' : 
                            name === 'hasInternet' ? 'Has Internet' : 'Has Power Backup'
                          ]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="internetSpeed" 
                          stroke="#1976D2" 
                          name="Internet Speed (Mbps)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="hasInternet" 
                          stroke="#388E3C" 
                          name="Internet Available"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="hasPowerBackup" 
                          stroke="#FFB300" 
                          name="Power Backup"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Usage Trends */}
              <Card title="Teaching & Learning Trends">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis unit="%" domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, '']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="teacherUsage" 
                        stroke="#FFB300" 
                        name="Teacher ICT Usage (%)"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="studentLiteracy" 
                        stroke="#E53935" 
                        name="Student Digital Literacy (%)"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="trainedTeachers" 
                        stroke="#8E24AA" 
                        name="ICT-Trained Teachers (%)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Device Utilization */}
              <Card title="Device Utilization Trend">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="computers" 
                        stackId="1"
                        stroke="#1976D2" 
                        fill="#1976D2"
                        name="Total Computers"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="functionalDevices" 
                        stackId="2"
                        stroke="#388E3C" 
                        fill="#388E3C"
                        name="Functional Devices"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Readiness Analysis by Period */}
              <Card title="ICT Readiness Analysis by Period">
                <div className="space-y-4">
                  {reports.map((report) => {
                    const readiness = calculateICTReadinessLevel([report]);
                    const summary = getObservationSummary(report);
                    
                    return (
                      <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-sm font-medium text-gray-900">{report.period}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              readiness.level === 'High' ? 'bg-green-100 text-green-800' :
                              readiness.level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {readiness.level} Readiness
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Score: {readiness.score.toFixed(1)}/100 • 
                            {summary.functionalDevices} devices • 
                            {summary.teacherUsagePercent}% teacher usage • 
                            {summary.studentLiteracy}% student literacy
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(report.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">Observation Date</div>
                          </div>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                readiness.level === 'High' ? 'bg-green-500' :
                                readiness.level === 'Medium' ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${readiness.score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Key Performance Indicators */}
              <Card title="Key Performance Indicators">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const latestReport = sortedReports[0];
                    const firstReport = sortedReports[sortedReports.length - 1];
                    
                    if (!latestReport || !firstReport) return null;
                    
                    const latestSummary = getObservationSummary(latestReport);
                    const firstSummary = getObservationSummary(firstReport);
                    
                    const deviceGrowth = latestSummary.functionalDevices - firstSummary.functionalDevices;
                    const teacherUsageGrowth = latestSummary.teacherUsagePercent - firstSummary.teacherUsagePercent;
                    const literacyGrowth = latestSummary.studentLiteracy - firstSummary.studentLiteracy;
                    const readinessGrowth = latestSummary.readinessScore - firstSummary.readinessScore;
                    
                    return (
                      <>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-2xl font-bold text-blue-600">{deviceGrowth > 0 ? '+' : ''}{deviceGrowth}</span>
                            {deviceGrowth > 0 ? (
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            ) : deviceGrowth < 0 ? (
                              <TrendingUp className="h-5 w-5 text-red-500 transform rotate-180" />
                            ) : (
                              <Activity className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">Device Growth</div>
                          <div className="text-xs text-gray-500">Since first observation</div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-2xl font-bold text-green-600">{teacherUsageGrowth > 0 ? '+' : ''}{teacherUsageGrowth.toFixed(1)}%</span>
                            {teacherUsageGrowth > 0 ? (
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            ) : teacherUsageGrowth < 0 ? (
                              <TrendingUp className="h-5 w-5 text-red-500 transform rotate-180" />
                            ) : (
                              <Activity className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">Teacher Usage Growth</div>
                          <div className="text-xs text-gray-500">Since first observation</div>
                        </div>
                        
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-2xl font-bold text-purple-600">{literacyGrowth > 0 ? '+' : ''}{literacyGrowth.toFixed(1)}%</span>
                            {literacyGrowth > 0 ? (
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            ) : literacyGrowth < 0 ? (
                              <TrendingUp className="h-5 w-5 text-red-500 transform rotate-180" />
                            ) : (
                              <Activity className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">Literacy Growth</div>
                          <div className="text-xs text-gray-500">Since first observation</div>
                        </div>
                        
                        <div className="text-center p-4 bg-amber-50 rounded-lg">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-2xl font-bold text-amber-600">{readinessGrowth > 0 ? '+' : ''}{readinessGrowth.toFixed(1)}</span>
                            {readinessGrowth > 0 ? (
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            ) : readinessGrowth < 0 ? (
                              <TrendingUp className="h-5 w-5 text-red-500 transform rotate-180" />
                            ) : (
                              <Activity className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">Readiness Score Growth</div>
                          <div className="text-xs text-gray-500">Since first observation</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolDetail;
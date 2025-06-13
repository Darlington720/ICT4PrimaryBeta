import React from 'react';
import { School, ICTReport } from '../../types';
import Card from '../common/Card';
import PageHeader from '../common/PageHeader';
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { calculateSummaryStats, calculateICTReadinessLevel, getLatestReport } from '../../utils/calculations';
import { 
  Laptop, 
  Wifi, 
  Users, 
  School as SchoolIcon, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Award,
  Calendar,
  MapPin,
  Monitor,
  Battery,
  BookOpen,
  GraduationCap,
  Settings
} from 'lucide-react';

interface DashboardProps {
  schools: School[];
  reports: ICTReport[];
}

const Dashboard: React.FC<DashboardProps> = ({ schools, reports }) => {
  const stats = calculateSummaryStats(schools, reports);

  // Get unique periods for trend analysis
  const periods = Array.from(new Set(reports.map(report => report.period))).sort();
  
  // Prepare data for district distribution
  const districtData = Object.entries(stats.districtDistribution).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / stats.totalSchools) * 100).toFixed(1)
  }));

  // Prepare data for environment distribution
  const environmentData = [
    { 
      name: 'Urban', 
      value: stats.environmentDistribution.urban,
      percentage: ((stats.environmentDistribution.urban / stats.totalSchools) * 100).toFixed(1)
    },
    { 
      name: 'Rural', 
      value: stats.environmentDistribution.rural,
      percentage: ((stats.environmentDistribution.rural / stats.totalSchools) * 100).toFixed(1)
    }
  ];

  // Prepare trend data for periodic observations
  const prepareTrendData = () => {
    return periods.map(period => {
      const periodReports = reports.filter(report => report.period === period);
      
      if (periodReports.length === 0) return null;

      const avgTeacherUsage = periodReports.reduce((sum, report) => 
        sum + (report.usage.teachersUsingICT / report.usage.totalTeachers) * 100, 0
      ) / periodReports.length;

      const avgStudentLiteracy = periodReports.reduce((sum, report) => 
        sum + report.usage.studentDigitalLiteracyRate, 0
      ) / periodReports.length;

      const avgFunctionalDevices = periodReports.reduce((sum, report) => 
        sum + report.infrastructure.functionalDevices, 0
      ) / periodReports.length;

      const internetAccessPercent = (periodReports.filter(report => 
        report.infrastructure.internetConnection !== 'None'
      ).length / periodReports.length) * 100;

      const powerBackupPercent = (periodReports.filter(report => 
        report.infrastructure.powerBackup
      ).length / periodReports.length) * 100;

      return {
        period,
        teacherUsage: Math.round(avgTeacherUsage),
        studentLiteracy: Math.round(avgStudentLiteracy),
        functionalDevices: Math.round(avgFunctionalDevices),
        internetAccess: Math.round(internetAccessPercent),
        powerBackup: Math.round(powerBackupPercent),
        totalObservations: periodReports.length
      };
    }).filter(Boolean);
  };

  const trendData = prepareTrendData();

  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    const latestPeriod = periods[periods.length - 1];
    const latestReports = reports.filter(report => report.period === latestPeriod);
    
    if (latestReports.length === 0) return null;

    // Infrastructure metrics
    const avgComputers = latestReports.reduce((sum, report) => sum + report.infrastructure.computers, 0) / latestReports.length;
    const avgFunctionalDevices = latestReports.reduce((sum, report) => sum + report.infrastructure.functionalDevices, 0) / latestReports.length;
    const internetAccessCount = latestReports.filter(report => report.infrastructure.internetConnection !== 'None').length;
    const powerBackupCount = latestReports.filter(report => report.infrastructure.powerBackup).length;

    // Usage metrics
    const avgTeacherUsage = latestReports.reduce((sum, report) => 
      sum + (report.usage.teachersUsingICT / report.usage.totalTeachers) * 100, 0
    ) / latestReports.length;
    const avgStudentLiteracy = latestReports.reduce((sum, report) => sum + report.usage.studentDigitalLiteracyRate, 0) / latestReports.length;
    const avgWeeklyHours = latestReports.reduce((sum, report) => sum + report.usage.weeklyComputerLabHours, 0) / latestReports.length;

    // Capacity metrics
    const avgTrainedTeachers = latestReports.reduce((sum, report) => 
      sum + (report.capacity.ictTrainedTeachers / report.usage.totalTeachers) * 100, 0
    ) / latestReports.length;
    const avgSupportStaff = latestReports.reduce((sum, report) => sum + report.capacity.supportStaff, 0) / latestReports.length;

    return {
      infrastructure: {
        avgComputers: Math.round(avgComputers),
        avgFunctionalDevices: Math.round(avgFunctionalDevices),
        internetAccessPercent: Math.round((internetAccessCount / latestReports.length) * 100),
        powerBackupPercent: Math.round((powerBackupCount / latestReports.length) * 100)
      },
      usage: {
        avgTeacherUsage: Math.round(avgTeacherUsage),
        avgStudentLiteracy: Math.round(avgStudentLiteracy),
        avgWeeklyHours: Math.round(avgWeeklyHours)
      },
      capacity: {
        avgTrainedTeachers: Math.round(avgTrainedTeachers),
        avgSupportStaff: Math.round(avgSupportStaff * 10) / 10
      },
      totalObservations: latestReports.length,
      period: latestPeriod
    };
  };

  const performanceMetrics = calculatePerformanceMetrics();

  // Prepare readiness level distribution
  const prepareReadinessDistribution = () => {
    const readinessLevels = { High: 0, Medium: 0, Low: 0 };
    
    schools.forEach(school => {
      const schoolReports = reports.filter(r => r.schoolId === school.id);
      const { level } = calculateICTReadinessLevel(schoolReports);
      readinessLevels[level]++;
    });

    return Object.entries(readinessLevels).map(([level, count]) => ({
      name: level,
      value: count,
      percentage: ((count / schools.length) * 100).toFixed(1)
    }));
  };

  const readinessData = prepareReadinessDistribution();

  // Prepare infrastructure comparison data
  const prepareInfrastructureComparison = () => {
    const categories = ['Computers', 'Tablets', 'Projectors', 'Printers'];
    
    return categories.map(category => {
      const dataPoint: any = { name: category };
      
      ['Urban', 'Rural'].forEach(environment => {
        const environmentSchools = schools.filter(school => school.environment === environment);
        const environmentReports = environmentSchools.map(school => 
          getLatestReport(school.id, reports)
        ).filter(Boolean);

        if (environmentReports.length > 0) {
          let total = 0;
          environmentReports.forEach(report => {
            if (report) {
              switch (category) {
                case 'Computers': total += report.infrastructure.computers; break;
                case 'Tablets': total += report.infrastructure.tablets; break;
                case 'Projectors': total += report.infrastructure.projectors; break;
                case 'Printers': total += report.infrastructure.printers; break;
              }
            }
          });
          dataPoint[environment] = Math.round(total / environmentReports.length);
        } else {
          dataPoint[environment] = 0;
        }
      });
      
      return dataPoint;
    });
  };

  const infrastructureComparison = prepareInfrastructureComparison();

  // Calculate alerts and recommendations
  const calculateAlerts = () => {
    const alerts = [];
    const latestPeriod = periods[periods.length - 1];
    const latestReports = reports.filter(report => report.period === latestPeriod);

    // Schools with no internet
    const noInternetSchools = latestReports.filter(report => 
      report.infrastructure.internetConnection === 'None'
    ).length;
    if (noInternetSchools > 0) {
      alerts.push({
        type: 'warning',
        title: 'Internet Connectivity',
        message: `${noInternetSchools} schools have no internet connection`,
        action: 'Review connectivity infrastructure'
      });
    }

    // Schools with low teacher ICT usage
    const lowUsageSchools = latestReports.filter(report => 
      (report.usage.teachersUsingICT / report.usage.totalTeachers) < 0.3
    ).length;
    if (lowUsageSchools > 0) {
      alerts.push({
        type: 'error',
        title: 'Low Teacher ICT Usage',
        message: `${lowUsageSchools} schools have less than 30% teacher ICT usage`,
        action: 'Implement teacher training programs'
      });
    }

    // Schools with few functional devices
    const lowDeviceSchools = latestReports.filter(report => 
      report.infrastructure.functionalDevices < 10
    ).length;
    if (lowDeviceSchools > 0) {
      alerts.push({
        type: 'warning',
        title: 'Limited Devices',
        message: `${lowDeviceSchools} schools have fewer than 10 functional devices`,
        action: 'Consider device procurement or repair'
      });
    }

    return alerts;
  };

  const alerts = calculateAlerts();

  // Colors for charts
  const COLORS = ['#1976D2', '#FFB300', '#388E3C', '#E53935', '#8E24AA', '#FB8C00'];

  return (
    <div>
      <PageHeader 
        title="ICT Observatory Dashboard" 
        description="Comprehensive overview of ICT infrastructure and periodic observations across primary schools"
      />

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
              <SchoolIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Total Schools</p>
              <h3 className="text-2xl font-bold">{stats.totalSchools}</h3>
              <p className="text-blue-200 text-xs">
                {performanceMetrics?.totalObservations || 0} recent observations
              </p>
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
                {performanceMetrics?.infrastructure.internetAccessPercent || stats.schoolsWithInternetPercent.toFixed(0)}%
              </h3>
              <p className="text-amber-200 text-xs">
                {performanceMetrics ? `${performanceMetrics.period} data` : 'Overall average'}
              </p>
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
              <h3 className="text-2xl font-bold">
                {performanceMetrics?.usage.avgTeacherUsage || 'N/A'}%
              </h3>
              <p className="text-green-200 text-xs">
                Average across schools
              </p>
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
              <h3 className="text-2xl font-bold">
                {performanceMetrics?.usage.avgStudentLiteracy || 'N/A'}%
              </h3>
              <p className="text-purple-200 text-xs">
                Digital literacy rate
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts and Recommendations */}
      {alerts.length > 0 && (
        <Card className="mb-6" title="Alerts & Recommendations">
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-start p-4 rounded-lg border-l-4 ${
                  alert.type === 'error' 
                    ? 'bg-red-50 border-red-400' 
                    : 'bg-amber-50 border-amber-400'
                }`}
              >
                <div className="flex-shrink-0">
                  {alert.type === 'error' ? (
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-400" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h4 className={`text-sm font-medium ${
                    alert.type === 'error' ? 'text-red-800' : 'text-amber-800'
                  }`}>
                    {alert.title}
                  </h4>
                  <p className={`text-sm ${
                    alert.type === 'error' ? 'text-red-700' : 'text-amber-700'
                  }`}>
                    {alert.message}
                  </p>
                  <p className={`text-xs mt-1 ${
                    alert.type === 'error' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    Recommended action: {alert.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Trend Analysis */}
      {trendData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="ICT Usage Trends Over Time">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="teacherUsage" 
                    stroke="#1976D2" 
                    name="Teacher ICT Usage (%)"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="studentLiteracy" 
                    stroke="#388E3C" 
                    name="Student Digital Literacy (%)"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="internetAccess" 
                    stroke="#FFB300" 
                    name="Internet Access (%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Infrastructure Development">
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
                    dataKey="functionalDevices" 
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8"
                    name="Avg Functional Devices"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="powerBackup" 
                    stackId="2"
                    stroke="#82ca9d" 
                    fill="#82ca9d"
                    name="Power Backup (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="ICT Readiness Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={readinessData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {readinessData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'High' ? '#22C55E' : entry.name === 'Medium' ? '#F59E0B' : '#EF4444'} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} schools`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Schools by District">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={districtData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} schools`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Urban vs Rural Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={environmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {environmentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'Urban' ? '#8B5CF6' : '#F97316'} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} schools`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Infrastructure Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Infrastructure: Urban vs Rural">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={infrastructureComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Urban" fill="#8B5CF6" name="Urban Schools" />
                <Bar dataKey="Rural" fill="#F97316" name="Rural Schools" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Performance Metrics Summary">
          {performanceMetrics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Monitor className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-700">Infrastructure</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-blue-600">
                      Avg Computers: {performanceMetrics.infrastructure.avgComputers}
                    </div>
                    <div className="text-xs text-blue-600">
                      Functional Devices: {performanceMetrics.infrastructure.avgFunctionalDevices}
                    </div>
                    <div className="text-xs text-blue-600">
                      Power Backup: {performanceMetrics.infrastructure.powerBackupPercent}%
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-700">Usage</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-green-600">
                      Teacher Usage: {performanceMetrics.usage.avgTeacherUsage}%
                    </div>
                    <div className="text-xs text-green-600">
                      Student Literacy: {performanceMetrics.usage.avgStudentLiteracy}%
                    </div>
                    <div className="text-xs text-green-600">
                      Weekly Hours: {performanceMetrics.usage.avgWeeklyHours}h
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-sm font-medium text-amber-700">Capacity</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-amber-600">
                      Trained Teachers: {performanceMetrics.capacity.avgTrainedTeachers}%
                    </div>
                    <div className="text-xs text-amber-600">
                      Support Staff: {performanceMetrics.capacity.avgSupportStaff}
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm font-medium text-purple-700">Latest Period</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-purple-600">
                      Period: {performanceMetrics.period}
                    </div>
                    <div className="text-xs text-purple-600">
                      Observations: {performanceMetrics.totalObservations}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No recent observations available</p>
              <p className="text-sm mt-2">Add periodic observations to see performance metrics</p>
            </div>
          )}
        </Card>
      </div>

      {/* Top Performing Schools */}
      <Card title="Top Performing Schools (ICT Readiness)">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Observation</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Readiness Level</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Strengths</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.slice(0, 5).map((school, index) => {
                const latestReport = getLatestReport(school.id, reports);
                const schoolReports = reports.filter(r => r.schoolId === school.id);
                const { level, score } = calculateICTReadinessLevel(schoolReports);
                
                const strengths = [];
                if (latestReport) {
                  if (latestReport.infrastructure.functionalDevices >= 20) strengths.push('Good Infrastructure');
                  if (latestReport.infrastructure.internetConnection !== 'None') strengths.push('Internet Access');
                  if ((latestReport.usage.teachersUsingICT / latestReport.usage.totalTeachers) >= 0.7) strengths.push('High Teacher Usage');
                  if (latestReport.usage.studentDigitalLiteracyRate >= 70) strengths.push('High Student Literacy');
                }

                return (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {index < 3 && <Award className="h-4 w-4 text-amber-500 mr-1" />}
                        #{index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{school.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.district}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        school.environment === 'Urban' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {school.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {latestReport ? latestReport.period : 'No observations'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          level === 'High' ? 'bg-green-100 text-green-800' :
                          level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {level}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">({score.toFixed(1)})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {strengths.length > 0 ? (
                          strengths.map((strength, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {strength}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No data available</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { School, ICTReport } from '../../types';
import Card from '../common/Card';
import PageHeader from '../common/PageHeader';
import { 
  Save, 
  X, 
  Calendar, 
  User, 
  Users, 
  BookOpen, 
  Monitor, 
  Wifi, 
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  FileText,
  Award,
  Star
} from 'lucide-react';

interface PeriodicObservationFormProps {
  school: School;
  report?: ICTReport;
  onSubmit: (report: ICTReport) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  // Section 1: School Snapshot
  schoolName: string;
  emisNumber: string;
  termQuarter: string;
  observationDate: string;
  observerName: string;
  observerContact: string;
  weatherContext: string;

  // Section 2: Enrollment & Attendance
  totalEnrollment: number;
  classAttendance: {
    p6Registered: number;
    p6Present: number;
    p6Notes: string;
    p7Registered: number;
    p7Present: number;
    p7Notes: string;
  };
  teacherAttendance: {
    totalAssigned: number;
    present: number;
    absentTeachers: string;
  };
  dropouts: {
    number: number;
    maleDropouts: number;
    femaleDropouts: number;
    reasons: string;
  };

  // Section 3: Teaching & Learning
  digitalSubjects: string;
  lessonFrequency: 'Daily' | '2-3 times a week' | 'Once a week' | 'Rarely/Never';
  teachersUsingDigital: string;
  goodLessonObserved: string;
  peerSupport: boolean;
  learnersEngaged: boolean;
  learnersUsingDevices: number;
  engagementLevel: 'Low' | 'Moderate' | 'High';
  challenges: string[];

  // Section 4: Infrastructure & Device Status
  devices: {
    laptopsTotal: number;
    laptopsWorking: number;
    laptopsNotWorking: number;
    laptopsNotes: string;
    projectorTotal: number;
    projectorWorking: number;
    projectorNotWorking: number;
    projectorNotes: string;
    routerTotal: number;
    routerWorking: number;
    routerNotWorking: number;
    routerNotes: string;
    solarTotal: number;
    solarWorking: number;
    solarNotWorking: number;
    solarNotes: string;
  };
  deviceStorage: boolean;
  signInRegister: boolean;
  powerAvailable: string[];

  // Section 5: Internet & Content
  internetStatus: 'Active and working' | 'Available but slow' | 'Not working' | 'Not available';
  contentSources: string;
  newContentIntroduced: boolean;
  learnerAccessLevels: 'Shared' | 'Individual' | 'Group Work';

  // Section 6: Management & Support
  headTeacherInvolved: boolean;
  ictCoordinator: boolean;
  ictSchedule: boolean;
  smcMeeting: boolean;
  ictDiscussions: boolean;
  communityEngagement: string[];

  // Section 7: Issues & Recommendations
  achievements: string;
  infrastructureChallenges: string;
  trainingChallenges: string;
  connectivityChallenges: string;
  contentChallenges: string;
  otherChallenges: string;
  immediateActions: string;
  capacityBuildingNeeds: string;
  supportRequests: string;

  // Section 8: Observer's Scorecard
  scores: {
    learnerAttendance: number;
    teacherAttendance: number;
    digitalToolsUse: number;
    infrastructureCondition: number;
    internetAvailability: number;
    managementSupport: number;
  };
  nextVisit: string;
}

const PeriodicObservationForm: React.FC<PeriodicObservationFormProps> = ({
  school,
  report,
  onSubmit,
  onCancel
}) => {
  // Generate current month period (e.g., "JAN 2025")
  const getCurrentPeriod = () => {
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const [formData, setFormData] = useState<FormData>({
    // Initialize with school data and existing report data if editing
    schoolName: school.name,
    emisNumber: school.emis_number || '',
    termQuarter: report?.period || getCurrentPeriod(),
    observationDate: report?.date || new Date().toISOString().split('T')[0],
    observerName: '',
    observerContact: '',
    weatherContext: '',

    totalEnrollment: school.total_enrollment,
    classAttendance: {
      p6Registered: 0,
      p6Present: 0,
      p6Notes: '',
      p7Registered: 0,
      p7Present: 0,
      p7Notes: ''
    },
    teacherAttendance: {
      totalAssigned: school.total_teachers,
      present: 0,
      absentTeachers: ''
    },
    dropouts: {
      number: 0,
      maleDropouts: 0,
      femaleDropouts: 0,
      reasons: ''
    },

    digitalSubjects: '',
    lessonFrequency: 'Rarely/Never',
    teachersUsingDigital: '',
    goodLessonObserved: '',
    peerSupport: false,
    learnersEngaged: false,
    learnersUsingDevices: 0,
    engagementLevel: 'Low',
    challenges: [],

    devices: {
      laptopsTotal: report?.infrastructure.computers || 0,
      laptopsWorking: 0,
      laptopsNotWorking: 0,
      laptopsNotes: '',
      projectorTotal: report?.infrastructure.projectors || 0,
      projectorWorking: 0,
      projectorNotWorking: 0,
      projectorNotes: '',
      routerTotal: 0,
      routerWorking: 0,
      routerNotWorking: 0,
      routerNotes: '',
      solarTotal: 0,
      solarWorking: 0,
      solarNotWorking: 0,
      solarNotes: ''
    },
    deviceStorage: false,
    signInRegister: false,
    powerAvailable: [],

    internetStatus: 'Not available',
    contentSources: '',
    newContentIntroduced: false,
    learnerAccessLevels: 'Shared',

    headTeacherInvolved: false,
    ictCoordinator: false,
    ictSchedule: false,
    smcMeeting: false,
    ictDiscussions: false,
    communityEngagement: [],

    achievements: '',
    infrastructureChallenges: '',
    trainingChallenges: '',
    connectivityChallenges: '',
    contentChallenges: '',
    otherChallenges: '',
    immediateActions: '',
    capacityBuildingNeeds: '',
    supportRequests: '',

    scores: {
      learnerAttendance: 3,
      teacherAttendance: 3,
      digitalToolsUse: 3,
      infrastructureCondition: 3,
      internetAvailability: 3,
      managementSupport: 3
    },
    nextVisit: ''
  });

  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData] as any,
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof FormData] as string[]).includes(value)
        ? (prev[field as keyof FormData] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof FormData] as string[]), value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert form data to ICTReport format
      const reportData: ICTReport = {
        id: report?.id || '',
        schoolId: school.id,
        date: formData.observationDate,
        period: formData.termQuarter,
        infrastructure: {
          computers: formData.devices.laptopsTotal,
          tablets: 0,
          projectors: formData.devices.projectorTotal,
          printers: 0,
          internetConnection: formData.internetStatus === 'Active and working' ? 'Fast' :
                            formData.internetStatus === 'Available but slow' ? 'Slow' : 'None',
          internetSpeedMbps: formData.internetStatus === 'Active and working' ? 25 : 
                            formData.internetStatus === 'Available but slow' ? 5 : 0,
          powerSource: formData.powerAvailable.includes('Solar') ? ['Solar'] : ['NationalGrid'],
          powerBackup: formData.powerAvailable.includes('Solar'),
          functionalDevices: formData.devices.laptopsWorking + formData.devices.projectorWorking
        },
        usage: {
          teachersUsingICT: Math.floor(formData.teacherAttendance.present * 0.8),
          totalTeachers: formData.teacherAttendance.totalAssigned,
          weeklyComputerLabHours: formData.lessonFrequency === 'Daily' ? 25 :
                                 formData.lessonFrequency === '2-3 times a week' ? 15 :
                                 formData.lessonFrequency === 'Once a week' ? 5 : 2,
          studentDigitalLiteracyRate: formData.engagementLevel === 'High' ? 80 : 
                                    formData.engagementLevel === 'Moderate' ? 50 : 20
        },
        software: {
          operatingSystems: ['Windows 10'],
          educationalSoftware: formData.contentSources ? [formData.contentSources] : [],
          officeApplications: true
        },
        capacity: {
          ictTrainedTeachers: Math.floor(formData.teacherAttendance.present * 0.7),
          supportStaff: formData.ictCoordinator ? 1 : 0
        }
      };

      // console.log("original form data", formData);

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting observation:', error);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    'School Snapshot',
    'Enrollment & Attendance',
    'Teaching & Learning',
    'Infrastructure & Devices',
    'Internet & Content',
    'Management & Support',
    'Issues & Recommendations',
    'Observer\'s Scorecard'
  ];

  const ScoreInput = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`p-1 rounded ${value >= score ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
        <span className="text-sm text-gray-600 ml-2">{value}/5</span>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader 
        title="Periodic Observation Form"
        description={`Recording routine monitoring and progress tracking for ${school.name}`}
        action={
          <div className="space-x-2">
            <button
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Observation'}
            </button>
          </div>
        }
      />

      {/* Section Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index + 1)}
              className={`flex-shrink-0 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentSection === index + 1
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {index + 1}. {section}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: School Snapshot */}
        {currentSection === 1 && (
          <Card title="📌 Section 1: School Snapshot">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">School Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMIS Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.emisNumber}
                  onChange={(e) => handleInputChange('emisNumber', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Term/Quarter</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., JAN 2025, FEB 2025"
                  value={formData.termQuarter}
                  onChange={(e) => handleInputChange('termQuarter', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Observation Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.observationDate}
                  onChange={(e) => handleInputChange('observationDate', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Observer Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.observerName}
                  onChange={(e) => handleInputChange('observerName', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Observer Contact</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Phone/Email"
                  value={formData.observerContact}
                  onChange={(e) => handleInputChange('observerContact', e.target.value)}
                />
              </div>

              <div className="form-group md:col-span-2">
                <label className="form-label">General Weather/Environment Context on Visit</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Optional but useful for context, especially in rural schools"
                  value={formData.weatherContext}
                  onChange={(e) => handleInputChange('weatherContext', e.target.value)}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Section 2: Enrollment & Attendance */}
        {currentSection === 2 && (
          <Card title="📌 Section 2: Enrollment & Attendance Tracking">
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Total Learner Enrollment This Term (P1–P7)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.totalEnrollment}
                  onChange={(e) => handleInputChange('totalEnrollment', parseInt(e.target.value))}
                />
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Class-by-Class Learner Attendance Today</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">P6</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="form-input w-20"
                            value={formData.classAttendance.p6Registered}
                            onChange={(e) => handleNestedInputChange('classAttendance', 'p6Registered', parseInt(e.target.value))}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="form-input w-20"
                            value={formData.classAttendance.p6Present}
                            onChange={(e) => handleNestedInputChange('classAttendance', 'p6Present', parseInt(e.target.value))}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            className="form-input"
                            value={formData.classAttendance.p6Notes}
                            onChange={(e) => handleNestedInputChange('classAttendance', 'p6Notes', e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">P7</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="form-input w-20"
                            value={formData.classAttendance.p7Registered}
                            onChange={(e) => handleNestedInputChange('classAttendance', 'p7Registered', parseInt(e.target.value))}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="form-input w-20"
                            value={formData.classAttendance.p7Present}
                            onChange={(e) => handleNestedInputChange('classAttendance', 'p7Present', parseInt(e.target.value))}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            className="form-input"
                            value={formData.classAttendance.p7Notes}
                            onChange={(e) => handleNestedInputChange('classAttendance', 'p7Notes', e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Teacher Attendance Today</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Total Teachers Assigned</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.teacherAttendance.totalAssigned}
                      onChange={(e) => handleNestedInputChange('teacherAttendance', 'totalAssigned', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Teachers Present</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.teacherAttendance.present}
                      onChange={(e) => handleNestedInputChange('teacherAttendance', 'present', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Absent Teachers (Name & Reason)</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.teacherAttendance.absentTeachers}
                      onChange={(e) => handleNestedInputChange('teacherAttendance', 'absentTeachers', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Notable Dropouts or Transfers</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Number of Dropouts</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.dropouts.number}
                      onChange={(e) => handleNestedInputChange('dropouts', 'number', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender Breakdown (Male/Female)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Male"
                        value={formData.dropouts.maleDropouts}
                        onChange={(e) => handleNestedInputChange('dropouts', 'maleDropouts', parseInt(e.target.value))}
                      />
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Female"
                        value={formData.dropouts.femaleDropouts}
                        onChange={(e) => handleNestedInputChange('dropouts', 'femaleDropouts', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="form-group md:col-span-2">
                    <label className="form-label">Possible Reasons</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.dropouts.reasons}
                      onChange={(e) => handleNestedInputChange('dropouts', 'reasons', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Section 3: Teaching & Learning */}
        {currentSection === 3 && (
          <Card title="📌 Section 3: Teaching & Learning Activity">
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Subjects Taught Using Digital Tools This Term</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="List subject and class e.g., 'P6 English, P5 Science'"
                  value={formData.digitalSubjects}
                  onChange={(e) => handleInputChange('digitalSubjects', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Digital Lesson Frequency</label>
                <select
                  className="form-select"
                  value={formData.lessonFrequency}
                  onChange={(e) => handleInputChange('lessonFrequency', e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="2-3 times a week">2–3 times a week</option>
                  <option value="Once a week">Once a week</option>
                  <option value="Rarely/Never">Rarely/Never</option>
                </select>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Teacher Observations</h4>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Teachers actively using digital content (Names)</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.teachersUsingDigital}
                      onChange={(e) => handleInputChange('teachersUsingDigital', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Good lesson observed using digital resources</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Describe briefly"
                      value={formData.goodLessonObserved}
                      onChange={(e) => handleInputChange('goodLessonObserved', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Peer support or internal mentoring visible</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="peerSupport"
                          checked={formData.peerSupport === true}
                          onChange={() => handleInputChange('peerSupport', true)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="peerSupport"
                          checked={formData.peerSupport === false}
                          onChange={() => handleInputChange('peerSupport', false)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Learner Observations</h4>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Learners engaged with digital content</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="learnersEngaged"
                          checked={formData.learnersEngaged === true}
                          onChange={() => handleInputChange('learnersEngaged', true)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="learnersEngaged"
                          checked={formData.learnersEngaged === false}
                          onChange={() => handleInputChange('learnersEngaged', false)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Number of Learners using devices today</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.learnersUsingDevices}
                      onChange={(e) => handleInputChange('learnersUsingDevices', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Level of engagement</label>
                    <select
                      className="form-select"
                      value={formData.engagementLevel}
                      onChange={(e) => handleInputChange('engagementLevel', e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Challenges in Digital Teaching</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    'Power',
                    'Devices not working',
                    'No content',
                    'Lack of confidence',
                    'Internet',
                    'Time constraints'
                  ].map((challenge) => (
                    <label key={challenge} className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formData.challenges.includes(challenge)}
                        onChange={() => handleArrayToggle('challenges', challenge)}
                      />
                      <span className="ml-2 text-sm">{challenge}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Other challenges..."
                    onBlur={(e) => {
                      if (e.target.value && !formData.challenges.includes(e.target.value)) {
                        handleArrayToggle('challenges', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Section 4: Infrastructure & Device Status */}
        {currentSection === 4 && (
          <Card title="📌 Section 4: Infrastructure & Device Status">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Digital Devices Available</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Working</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Not Working</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { key: 'laptops', label: 'Laptops/Tablets' },
                        { key: 'projector', label: 'Projector' },
                        { key: 'router', label: 'Router/Modem' },
                        { key: 'solar', label: 'Solar Setup' }
                      ].map((device) => (
                        <tr key={device.key}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {device.label}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              className="form-input w-20"
                              value={formData.devices[`${device.key}Total` as keyof typeof formData.devices]}
                              onChange={(e) => handleNestedInputChange('devices', `${device.key}Total`, parseInt(e.target.value))}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              className="form-input w-20"
                              value={formData.devices[`${device.key}Working` as keyof typeof formData.devices]}
                              onChange={(e) => handleNestedInputChange('devices', `${device.key}Working`, parseInt(e.target.value))}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              className="form-input w-20"
                              value={formData.devices[`${device.key}NotWorking` as keyof typeof formData.devices]}
                              onChange={(e) => handleNestedInputChange('devices', `${device.key}NotWorking`, parseInt(e.target.value))}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              className="form-input"
                              value={formData.devices[`${device.key}Notes` as keyof typeof formData.devices]}
                              onChange={(e) => handleNestedInputChange('devices', `${device.key}Notes`, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Device Storage & Security</h4>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Devices properly stored/locked</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="deviceStorage"
                          checked={formData.deviceStorage === true}
                          onChange={() => handleInputChange('deviceStorage', true)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="deviceStorage"
                          checked={formData.deviceStorage === false}
                          onChange={() => handleInputChange('deviceStorage', false)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sign-in/checkout register maintained</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="signInRegister"
                          checked={formData.signInRegister === true}
                          onChange={() => handleInputChange('signInRegister', true)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="signInRegister"
                          checked={formData.signInRegister === false}
                          onChange={() => handleInputChange('signInRegister', false)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Power Availability During Visit</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Grid', 'Solar', 'Power not available today'].map((power) => (
                    <label key={power} className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formData.powerAvailable.includes(power)}
                        onChange={() => handleArrayToggle('powerAvailable', power)}
                      />
                      <span className="ml-2 text-sm">{power}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Section 5: Internet & Content */}
        {currentSection === 5 && (
          <Card title="📌 Section 5: Internet & Content">
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Internet Status During Visit</label>
                <select
                  className="form-select"
                  value={formData.internetStatus}
                  onChange={(e) => handleInputChange('internetStatus', e.target.value)}
                >
                  <option value="Active and working">Active and working</option>
                  <option value="Available but slow">Available but slow</option>
                  <option value="Not working">Not working</option>
                  <option value="Not available">Not available</option>
                </select>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Digital Content Usage This Term</h4>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Content sources used (Kolibri, LMS, Local Videos, etc.)</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.contentSources}
                      onChange={(e) => handleInputChange('contentSources', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Any new content introduced?</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="newContentIntroduced"
                          checked={formData.newContentIntroduced === true}
                          onChange={() => handleInputChange('newContentIntroduced', true)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="newContentIntroduced"
                          checked={formData.newContentIntroduced === false}
                          onChange={() => handleInputChange('newContentIntroduced', false)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Learner access levels</label>
                    <select
                      className="form-select"
                      value={formData.learnerAccessLevels}
                      onChange={(e) => handleInputChange('learnerAccessLevels', e.target.value)}
                    >
                      <option value="Shared">Shared</option>
                      <option value="Individual">Individual</option>
                      <option value="Group Work">Group Work</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Section 6: Management & Support */}
        {currentSection === 6 && (
          <Card title="📌 Section 6: Management, Support & Community Involvement">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">School Leadership Support for Digital Learning</h4>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Head Teacher personally involved?</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="headTeacherInvolved"
                          checked={formData.headTeacherInvolved === true}
                          onChange={() => handleInputChange('headTeacherInvolved', true)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="headTeacherInvolved"
                          checked={formData.headTeacherInvolved === false}
                          onChange={() => handleInputChange('headTeacherInvolved', false)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ICT Coordinator appointed?</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="ictCoordinator"
                          checked={formData.ictCoordinator === true}
                          onChange={() => handleInputChange('ictCoordinator', true)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="ictCoordinator"
                          checked={formData.ictCoordinator === false}
                          onChange={() => handleInputChange('ictCoordinator', false)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ICT Schedule/Timetable developed?</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="ictSchedule"
                          checked={formData.ictSchedule === true}
                          onChange={() => handleInputChange('ictSchedule', true)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="ictSchedule"
                          checked={formData.ictSchedule === false}
                          onChange={() => handleInputChange('ictSchedule', false)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">SMC or PTA Meeting Held This Term?</h4>
                <div className="space-y-4">
                  <div className="form-group">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="smcMeeting"
                          checked={formData.smcMeeting === true}
                          onChange={() => handleInputChange('smcMeeting', true)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="smcMeeting"
                          checked={formData.smcMeeting === false}
                          onChange={() => handleInputChange('smcMeeting', false)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>

                  {formData.smcMeeting && (
                    <div className="form-group">
                      <label className="form-label">Did it address ICT-related discussions?</label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="form-radio"
                            name="ictDiscussions"
                            checked={formData.ictDiscussions === true}
                            onChange={() => handleInputChange('ictDiscussions', true)}
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="form-radio"
                            name="ictDiscussions"
                            checked={formData.ictDiscussions === false}
                            onChange={() => handleInputChange('ictDiscussions', false)}
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Community Engagement Observed</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Parents/Guardians visited school',
                    'Local Leaders involved',
                    'NGO/Partner engagement noted'
                  ].map((engagement) => (
                    <label key={engagement} className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formData.communityEngagement.includes(engagement)}
                        onChange={() => handleArrayToggle('communityEngagement', engagement)}
                      />
                      <span className="ml-2 text-sm">{engagement}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Section 7: Issues & Recommendations */}
        {currentSection === 7 && (
          <Card title="📌 Section 7: Issues, Recommendations, and Progress">
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Main Achievements This Term</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="E.g., 'All P5 teachers using tablets,' 'Reliable solar installed,' etc."
                  value={formData.achievements}
                  onChange={(e) => handleInputChange('achievements', e.target.value)}
                />
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Ongoing Challenges</h4>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Infrastructure</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.infrastructureChallenges}
                      onChange={(e) => handleInputChange('infrastructureChallenges', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Training</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.trainingChallenges}
                      onChange={(e) => handleInputChange('trainingChallenges', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Connectivity</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.connectivityChallenges}
                      onChange={(e) => handleInputChange('connectivityChallenges', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.contentChallenges}
                      onChange={(e) => handleInputChange('contentChallenges', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Other</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.otherChallenges}
                      onChange={(e) => handleInputChange('otherChallenges', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h4>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Immediate actions</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.immediateActions}
                      onChange={(e) => handleInputChange('immediateActions', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Capacity building needs</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.capacityBuildingNeeds}
                      onChange={(e) => handleInputChange('capacityBuildingNeeds', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Support requests to HQ/MoES/Partners</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.supportRequests}
                      onChange={(e) => handleInputChange('supportRequests', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Section 8: Observer's Scorecard */}
        {currentSection === 8 && (
          <Card title="📌 Section 8: Observer's Scorecard">
            <div className="space-y-6">
              <p className="text-sm text-gray-600">Rate each indicator on a scale of 1-5 (1 = Poor, 5 = Excellent)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreInput
                  label="Learner Attendance"
                  value={formData.scores.learnerAttendance}
                  onChange={(value) => handleNestedInputChange('scores', 'learnerAttendance', value)}
                />

                <ScoreInput
                  label="Teacher Attendance"
                  value={formData.scores.teacherAttendance}
                  onChange={(value) => handleNestedInputChange('scores', 'teacherAttendance', value)}
                />

                <ScoreInput
                  label="Use of Digital Tools"
                  value={formData.scores.digitalToolsUse}
                  onChange={(value) => handleNestedInputChange('scores', 'digitalToolsUse', value)}
                />

                <ScoreInput
                  label="Infrastructure Condition"
                  value={formData.scores.infrastructureCondition}
                  onChange={(value) => handleNestedInputChange('scores', 'infrastructureCondition', value)}
                />

                <ScoreInput
                  label="Internet Availability"
                  value={formData.scores.internetAvailability}
                  onChange={(value) => handleNestedInputChange('scores', 'internetAvailability', value)}
                />

                <ScoreInput
                  label="Management Support for ICT"
                  value={formData.scores.managementSupport}
                  onChange={(value) => handleNestedInputChange('scores', 'managementSupport', value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Next Planned Visit</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.nextVisit}
                  onChange={(e) => handleInputChange('nextVisit', e.target.value)}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
            disabled={currentSection === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>

          {currentSection < sections.length ? (
            <button
              type="button"
              onClick={() => setCurrentSection(Math.min(sections.length, currentSection + 1))}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Submit Observation'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PeriodicObservationForm;
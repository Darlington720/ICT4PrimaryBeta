import React, { useState, useEffect } from 'react';
import { School, ICTReport } from '../../types';
import Card from '../common/Card';

interface ReportFormProps {
  school: School;
  report?: ICTReport;
  onSubmit: (report: Omit<ICTReport, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ school, report, onSubmit, onCancel }) => {
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const currentYear = new Date().getFullYear();
  
  const initialFormData: Omit<ICTReport, 'id'> = {
    schoolId: school.id,
    date: today,
    period: `${currentMonth} ${currentYear}`,
    assessmentType: 'Quarterly',
    infrastructure: {
      functionalStudentComputers: school.infrastructure.studentComputers,
      functionalTeacherComputers: school.infrastructure.teacherComputers,
      functionalProjectors: school.infrastructure.projectors,
      functionalSmartBoards: school.infrastructure.smartBoards,
      functionalTablets: school.infrastructure.tablets,
      functionalLaptops: school.infrastructure.laptops,
      labCondition: school.infrastructure.labCondition,
      powerBackupStatus: school.infrastructure.powerBackup,
      ictRoomStatus: school.infrastructure.hasICTRoom ? 'Operational' : 'Not Available'
    },
    internet: {
      connectionStatus: 'Operational',
      actualBandwidthMbps: school.internet.bandwidthMbps,
      coverageStatus: school.internet.wifiCoverage,
      connectionStability: school.internet.stability,
      policyCompliance: school.internet.hasUsagePolicy ? 'Full' : 'None'
    },
    software: {
      lmsUsage: {
        isActive: school.software.hasLMS,
        usageRate: 0,
        challenges: []
      },
      softwareLicenses: school.software.licensedSoftware.map(name => ({
        name,
        status: 'Active',
        lastUpdated: today
      })),
      digitalContent: {
        availableSubjects: [],
        localContentCreated: 0,
        contentUtilization: 0
      }
    },
    humanCapacity: {
      activeICTTeachers: school.humanCapacity.ictTrainedTeachers,
      teacherTrainingHours: 0,
      supportStaffPerformance: 'Good',
      teacherCompetencyAssessment: {
        basic: 0,
        intermediate: 0,
        advanced: 0
      },
      trainingNeeds: []
    },
    pedagogicalUsage: {
      ictIntegratedLessons: {
        total: school.pedagogicalUsage.ictIntegratedLessons,
        bySubject: {}
      },
      assessmentMethods: [],
      studentProjects: {
        ongoing: 0,
        completed: 0,
        subjects: []
      },
      blendedLearningHours: 0,
      assistiveTechUsage: {
        studentsSupported: 0,
        technologiesUsed: []
      }
    },
    governance: {
      policyCompliance: school.governance.hasICTPolicy ? 'Full' : 'None',
      budgetUtilization: 0,
      committeeMeetings: 0,
      implementedRecommendations: 0,
      challenges: []
    },
    studentEngagement: {
      digitalLiteracyAssessment: {
        basic: 0,
        intermediate: 0,
        advanced: 0
      },
      ictClubProjects: 0,
      platformUsageStats: [],
      satisfactionSurvey: {
        respondents: 0,
        averageRating: 0,
        keyFeedback: []
      }
    },
    communityEngagement: {
      parentPortalStats: {
        activeUsers: 0,
        engagementRate: 0
      },
      outreachActivities: [],
      partnershipUpdates: school.communityEngagement.partnerOrganizations.map(partner => ({
        partner,
        contribution: '',
        status: 'Active'
      }))
    },
    recommendations: []
  };

  const [formData, setFormData] = useState<Omit<ICTReport, 'id'> & { id?: string }>(initialFormData);
  const [currentTab, setCurrentTab] = useState('basic');
  const [newChallenge, setNewChallenge] = useState('');
  const [newTrainingNeed, setNewTrainingNeed] = useState('');
  const [newFeedback, setNewFeedback] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newActivity, setNewActivity] = useState({
    name: '',
    participants: 0,
    date: today
  });

  useEffect(() => {
    if (report) {
      setFormData(report);
    }
  }, [report]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...prev[section as keyof typeof prev][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleArrayAdd = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: [...prev[section as keyof typeof prev][field], value]
      }
    }));
  };

  const handleArrayRemove = (section: string, field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: prev[section as keyof typeof prev][field].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'internet', label: 'Internet & Connectivity' },
    { id: 'software', label: 'Software & Digital Resources' },
    { id: 'capacity', label: 'Human Capacity' },
    { id: 'pedagogy', label: 'Pedagogical Usage' },
    { id: 'governance', label: 'Governance' },
    { id: 'engagement', label: 'Student & Community' },
    { id: 'recommendations', label: 'Recommendations' }
  ];

  return (
    <Card title={`ICT Assessment Report - ${school.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Basic Information */}
        <div className={currentTab === 'basic' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Assessment Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700">Assessment Period</label>
              <input
                type="text"
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="assessmentType" className="block text-sm font-medium text-gray-700">Assessment Type</label>
              <select
                id="assessmentType"
                name="assessmentType"
                value={formData.assessmentType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Initial">Initial Assessment</option>
                <option value="Quarterly">Quarterly Review</option>
                <option value="Annual">Annual Evaluation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Infrastructure Tab */}
        <div className={currentTab === 'infrastructure' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="infrastructure.functionalStudentComputers" className="block text-sm font-medium text-gray-700">
                  Functional Student Computers
                </label>
                <input
                  type="number"
                  id="infrastructure.functionalStudentComputers"
                  name="infrastructure.functionalStudentComputers"
                  value={formData.infrastructure.functionalStudentComputers}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="infrastructure.functionalTeacherComputers" className="block text-sm font-medium text-gray-700">
                  Functional Teacher Computers
                </label>
                <input
                  type="number"
                  id="infrastructure.functionalTeacherComputers"
                  name="infrastructure.functionalTeacherComputers"
                  value={formData.infrastructure.functionalTeacherComputers}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="infrastructure.functionalProjectors" className="block text-sm font-medium text-gray-700">
                  Functional Projectors
                </label>
                <input
                  type="number"
                  id="infrastructure.functionalProjectors"
                  name="infrastructure.functionalProjectors"
                  value={formData.infrastructure.functionalProjectors}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="infrastructure.functionalSmartBoards" className="block text-sm font-medium text-gray-700">
                  Functional Smart Boards
                </label>
                <input
                  type="number"
                  id="infrastructure.functionalSmartBoards"
                  name="infrastructure.functionalSmartBoards"
                  value={formData.infrastructure.functionalSmartBoards}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="infrastructure.functionalTablets" className="block text-sm font-medium text-gray-700">
                  Functional Tablets
                </label>
                <input
                  type="number"
                  id="infrastructure.functionalTablets"
                  name="infrastructure.functionalTablets"
                  value={formData.infrastructure.functionalTablets}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="infrastructure.functionalLaptops" className="block text-sm font-medium text-gray-700">
                  Functional Laptops
                </label>
                <input
                  type="number"
                  id="infrastructure.functionalLaptops"
                  name="infrastructure.functionalLaptops"
                  value={formData.infrastructure.functionalLaptops}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="infrastructure.labCondition" className="block text-sm font-medium text-gray-700">
                  Computer Lab Condition
                </label>
                <select
                  id="infrastructure.labCondition"
                  name="infrastructure.labCondition"
                  value={formData.infrastructure.labCondition}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label htmlFor="infrastructure.ictRoomStatus" className="block text-sm font-medium text-gray-700">
                  ICT Room Status
                </label>
                <select
                  id="infrastructure.ictRoomStatus"
                  name="infrastructure.ictRoomStatus"
                  value={formData.infrastructure.ictRoomStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Power Backup Status</label>
              <div className="mt-2 space-y-2">
                {['Solar', 'Generator', 'UPS'].map((source) => (
                  <div key={source} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`powerBackup-${source}`}
                      checked={formData.infrastructure.powerBackupStatus.includes(source as any)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayAdd('infrastructure', 'powerBackupStatus', source);
                        } else {
                          const index = formData.infrastructure.powerBackupStatus.indexOf(source as any);
                          handleArrayRemove('infrastructure', 'powerBackupStatus', index);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`powerBackup-${source}`} className="ml-2 block text-sm text-gray-900">
                      {source}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Internet Tab */}
        <div className={currentTab === 'internet' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="internet.connectionStatus" className="block text-sm font-medium text-gray-700">
                  Connection Status
                </label>
                <select
                  id="internet.connectionStatus"
                  name="internet.connectionStatus"
                  value={formData.internet.connectionStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Operational">Operational</option>
                  <option value="Limited">Limited</option>
                  <option value="Down">Down</option>
                </select>
              </div>

              <div>
                <label htmlFor="internet.actualBandwidthMbps" className="block text-sm font-medium text-gray-700">
                  Actual Bandwidth (Mbps)
                </label>
                <input
                  type="number"
                  id="internet.actualBandwidthMbps"
                  name="internet.actualBandwidthMbps"
                  value={formData.internet.actualBandwidthMbps}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="internet.connectionStability" className="block text-sm font-medium text-gray-700">
                  Connection Stability
                </label>
                <select
                  id="internet.connectionStability"
                  name="internet.connectionStability"
                  value={formData.internet.connectionStability}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label htmlFor="internet.policyCompliance" className="block text-sm font-medium text-gray-700">
                  Usage Policy Compliance
                </label>
                <select
                  id="internet.policyCompliance"
                  name="internet.policyCompliance"
                  value={formData.internet.policyCompliance}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Full">Full</option>
                  <option value="Partial">Partial</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">WiFi Coverage Areas</label>
              <div className="mt-2 space-y-2">
                {['Administration', 'Classrooms', 'Library', 'Dormitories'].map((area) => (
                  <div key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`coverage-${area}`}
                      checked={formData.internet.coverageStatus.includes(area as any)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayAdd('internet', 'coverageStatus', area);
                        } else {
                          const index = formData.internet.coverageStatus.indexOf(area as any);
                          handleArrayRemove('internet', 'coverageStatus', index);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`coverage-${area}`} className="ml-2 block text-sm text-gray-900">
                      {area}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Software Tab */}
        <div className={currentTab === 'software' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">LMS Usage</label>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="software.lmsUsage.isActive"
                      checked={formData.software.lmsUsage.isActive}
                      onChange={(e) => handleNestedChange('software', 'lmsUsage', 'isActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="software.lmsUsage.isActive" className="ml-2 block text-sm text-gray-900">
                      LMS is Active
                    </label>
                  </div>

                  <div>
                    <label htmlFor="software.lmsUsage.usageRate" className="block text-sm font-medium text-gray-700">
                      Usage Rate (%)
                    </label>
                    <input
                      type="number"
                      id="software.lmsUsage.usageRate"
                      value={formData.software.lmsUsage.usageRate}
                      onChange={(e) => handleNestedChange('software', 'lmsUsage', 'usageRate', Number(e.target.value))}
                      min="0"
                      max="100"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">LMS Challenges</label>
                    <div className="mt-1 flex space-x-2">
                      <input
                        type="text"
                        value={newChallenge}
                        onChange={(e) => setNewChallenge(e.target.value)}
                        placeholder="Enter challenge"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newChallenge.trim()) {
                            handleArrayAdd('software', 'lmsUsage.challenges', newChallenge.trim());
                            setNewChallenge('');
                          }
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {formData.software.lmsUsage.challenges.map((challenge, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-700">{challenge}</span>
                          <button
                            type="button"
                            onClick={() => handleArrayRemove('software', 'lmsUsage.challenges', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Digital Content</label>
                <div className="mt-2 space-y-4">
                  <div>
                    <label htmlFor="newSubject" className="block text-sm font-medium text-gray-700">
                      Available Subjects
                    </label>
                    <div className="mt-1 flex space-x-2">
                      <input
                        type="text"
                        id="newSubject"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Enter subject"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSubject.trim()) {
                            handleArrayAdd('software', 'digitalContent.availableSubjects', newSubject.trim());
                            setNewSubject('');
                          }
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {formData.software.digitalContent.availableSubjects.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-700">{subject}</span>
                          <button
                            type="button"
                            onClick={() => handleArrayRemove('software', 'digitalContent.availableSubjects', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="software.digitalContent.localContentCreated" className="block text-sm font-medium text-gray-700">
                      New Local Content Items
                    </label>
                    <input
                      type="number"
                      id="software.digitalContent.localContentCreated"
                      value={formData.software.digitalContent.localContentCreated}
                      onChange={(e) => handleNestedChange('software', 'digitalContent', 'localContentCreated', Number(e.target.value))}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="software.digitalContent.contentUtilization" className="block text-sm font-medium text-gray-700">
                      Content Utilization Rate (%)
                    </label>
                    <input
                      type="number"
                      id="software.digitalContent.contentUtilization"
                      value={formData.software.digitalContent.contentUtilization}
                      onChange={(e) => handleNestedChange('software', 'digitalContent', 'contentUtilization', Number(e.target.value))}
                      min="0"
                      max="100"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Software Licenses</label>
              <div className="mt-2 space-y-4">
                {formData.software.softwareLicenses.map((license, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Name</label>
                      <input
                        type="text"
                        value={license.name}
                        onChange={(e) => {
                          const updatedLicenses = [...formData.software.softwareLicenses];
                          updatedLicenses[index] = { ...license, name: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            software: {
                              ...prev.software,
                              softwareLicenses: updatedLicenses
                            }
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Status</label>
                      <select
                        value={license.status}
                        onChange={(e) => {
                          const updatedLicenses = [...formData.software.softwareLicenses];
                          updatedLicenses[index] = { ...license, status: e.target.value as any };
                          setFormData(prev => ({
                            ...prev,
                            software: {
                              ...prev.software,
                              softwareLicenses: updatedLicenses
                            }
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                        <option value="Renewal Needed">Renewal Needed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Last Updated</label>
                      <input
                        type="date"
                        value={license.lastUpdated}
                        onChange={(e) => {
                          const updatedLicenses = [...formData.software.softwareLicenses];
                          updatedLicenses[index] = { ...license, lastUpdated: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            software: {
                              ...prev.software,
                              softwareLicenses: updatedLicenses
                            }
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newLicense = {
                      name: '',
                      status: 'Active' as const,
                      lastUpdated: today
                    };
                    handleArrayAdd('software', 'softwareLicenses', newLicense);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add License
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Human Capacity Tab */}
        <div className={currentTab === 'capacity' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="humanCapacity.activeICTTeachers" className="block text-sm font-medium text-gray-700">
                  Active ICT Teachers
                </label>
                <input
                  type="number"
                  id="humanCapacity.activeICTTeachers"
                  name="humanCapacity.activeICTTeachers"
                  value={formData.humanCapacity.activeICTTeachers}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="humanCapacity.teacherTrainingHours" className="block text-sm font-medium text-gray-700">
                  Teacher Training Hours
                </label>
                <input
                  type="number"
                  id="humanCapacity.teacherTrainingHours"
                  name="humanCapacity.teacherTrainingHours"
                  value={formData.humanCapacity.teacherTrainingHours}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="humanCapacity.supportStaffPerformance" className="block text-sm font-medium text-gray-700">
                  Support Staff Performance
                </label>
                <select
                  id="humanCapacity.supportStaffPerformance"
                  name="humanCapacity.supportStaffPerformance"
                  value={formData.humanCapacity.supportStaffPerformance}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teacher Competency Assessment</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="humanCapacity.teacherCompetencyAssessment.basic" className="block text-sm text-gray-700">
                    Basic Level
                  </label>
                  <input
                    type="number"
                    id="humanCapacity.teacherCompetencyAssessment.basic"
                    value={formData.humanCapacity.teacherCompetencyAssessment.basic}
                    onChange={(e) => handleNestedChange('humanCapacity', 'teacherCompetencyAssessment', 'basic', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="humanCapacity.teacherCompetencyAssessment.intermediate" className="block text-sm text-gray-700">
                    Intermediate Level
                  </label>
                  <input
                    type="number"
                    id="humanCapacity.teacherCompetencyAssessment.intermediate"
                    value={formData.humanCapacity.teacherCompetencyAssessment.intermediate}
                    onChange={(e) => handleNestedChange('humanCapacity', 'teacherCompetencyAssessment', 'intermediate', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="humanCapacity.teacherCompetencyAssessment.advanced" className="block text-sm text-gray-700">
                    Advanced Level
                  </label>
                  <input
                    type="number"
                    id="humanCapacity.teacherCompetencyAssessment.advanced"
                    value={formData.humanCapacity.teacherCompetencyAssessment.advanced}
                    onChange={(e) => handleNestedChange('humanCapacity', 'teacherCompetencyAssessment', 'advanced', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Training Needs</label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  value={newTrainingNeed}
                  onChange={(e) => setNewTrainingNeed(e.target.value)}
                  placeholder="Enter training need"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTrainingNeed.trim()) {
                      handleArrayAdd('humanCapacity', 'trainingNeeds', newTrainingNeed.trim());
                      setNewTrainingNeed('');
                    }
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {formData.humanCapacity.trainingNeeds.map((need, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <span className="text-sm text-gray-700">{need}</span>
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('humanCapacity', 'trainingNeeds', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pedagogical Usage Tab */}
        <div className={currentTab === 'pedagogy' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">ICT Integrated Lessons</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pedagogicalUsage.ictIntegratedLessons.total" className="block text-sm text-gray-700">
                    Total Lessons
                  </label>
                  <input
                    type="number"
                    id="pedagogicalUsage.ictIntegratedLessons.total"
                    value={formData.pedagogicalUsage.ictIntegratedLessons.total}
                    onChange={(e) => handleNestedChange('pedagogicalUsage', 'ictIntegratedLessons', 'total', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Assessment Methods</label>
              <div className="mt-2 space-y-2">
                {['Online Quiz', 'Digital Portfolio', 'Interactive Assignments'].map((method) => (
                  <div key={method} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`assessment-${method}`}
                      checked={formData.pedagogicalUsage.assessmentMethods.includes(method as any)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayAdd('pedagogicalUsage', 'assessmentMethods', method);
                        } else {
                          const index = formData.pedagogicalUsage.assessmentMethods.indexOf(method as any);
                          handleArrayRemove('pedagogicalUsage', 'assessmentMethods', index);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`assessment-${method}`} className="ml-2 block text-sm text-gray-900">
                      {method}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Student Projects</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pedagogicalUsage.studentProjects.ongoing" className="block text-sm text-gray-700">
                    Ongoing Projects
                  </label>
                  <input
                    type="number"
                    id="pedagogicalUsage.studentProjects.ongoing"
                    value={formData.pedagogicalUsage.studentProjects.ongoing}
                    onChange={(e) => handleNestedChange('pedagogicalUsage', 'studentProjects', 'ongoing', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="pedagogicalUsage.studentProjects.completed" className="block text-sm text-gray-700">
                    Completed Projects
                  </label>
                  <input
                    type="number"
                    id="pedagogicalUsage.studentProjects.completed"
                    value={formData.pedagogicalUsage.studentProjects.completed}
                    onChange={(e) => handleNestedChange('pedagogicalUsage', 'studentProjects', 'completed', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="pedagogicalUsage.blendedLearningHours" className="block text-sm font-medium text-gray-700">
                Blended Learning Hours
              </label>
              <input
                type="number"
                id="pedagogicalUsage.blendedLearningHours"
                name="pedagogicalUsage.blendedLearningHours"
                value={formData.pedagogicalUsage.blendedLearningHours}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Assistive Technology Usage</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pedagogicalUsage.assistiveTechUsage.studentsSupported" className="block text-sm text-gray-700">
                    Students Supported
                  </label>
                  <input
                    type="number"
                    id="pedagogicalUsage.assistiveTechUsage.studentsSupported"
                    value={formData.pedagogicalUsage.assistiveTechUsage.studentsSupported}
                    onChange={(e) => handleNestedChange('pedagogicalUsage', 'assistiveTechUsage', 'studentsSupported', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">Technologies Used</label>
                  <div className="mt-1 flex space-x-2">
                    <input
                      type="text"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="Enter technology"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTechnology.trim()) {
                          handleArrayAdd('pedagogicalUsage', 'assistiveTechUsage.technologiesUsed', newTechnology.trim());
                          setNewTechnology('');
                        }
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {formData.pedagogicalUsage.assistiveTechUsage.technologiesUsed.map((tech, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <span className="text-sm text-gray-700">{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleArrayRemove('pedagogicalUsage', 'assistiveTechUsage.technologiesUsed', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Governance Tab */}
        <div className={currentTab === 'governance' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="governance.policyCompliance" className="block text-sm font-medium text-gray-700">
                  Policy Compliance
                </label>
                <select
                  id="governance.policyCompliance"
                  name="governance.policyCompliance"
                  value={formData.governance.policyCompliance}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Full">Full</option>
                  <option value="Partial">Partial</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div>
                <label htmlFor="governance.budgetUtilization" className="block text-sm font-medium text-gray-700">
                  Budget Utilization (%)
                </label>
                <input
                  type="number"
                  id="governance.budgetUtilization"
                  name="governance.budgetUtilization"
                  value={formData.governance.budgetUtilization}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="governance.committeeMeetings" className="block text-sm font-medium text-gray-700">
                  Committee Meetings
                </label>
                <input
                  type="number"
                  id="governance.committeeMeetings"
                  name="governance.committeeMeetings"
                  value={formData.governance.committeeMeetings}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="governance.implementedRecommendations" className="block text-sm font-medium text-gray-700">
                  Implemented Recommendations
                </label>
                <input
                  type="number"
                  id="governance.implementedRecommendations"
                  name="governance.implementedRecommendations"
                  value={formData.governance.implementedRecommendations}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Challenges</label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  placeholder="Enter challenge"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newChallenge.trim()) {
                      handleArrayAdd('governance', 'challenges', newChallenge.trim());
                      setNewChallenge('');
                    }
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {formData.governance.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <span className="text-sm text-gray-700">{challenge}</span>
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('governance', 'challenges', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Student & Community Engagement Tab */}
        <div className={currentTab === 'engagement' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Digital Literacy Assessment</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="studentEngagement.digitalLiteracyAssessment.basic" className="block text-sm text-gray-700">
                    Basic Level
                  </label>
                  <input
                    type="number"
                    id="studentEngagement.digitalLiteracyAssessment.basic"
                    value={formData.studentEngagement.digitalLiteracyAssessment.basic}
                    onChange={(e) => handleNestedChange('studentEngagement', 'digitalLiteracyAssessment', 'basic', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="studentEngagement.digitalLiteracyAssessment.intermediate" className="block text-sm text-gray-700">
                    Intermediate Level
                  </label>
                  <input
                    type="number"
                    id="studentEngagement.digitalLiteracyAssessment.intermediate"
                    value={formData.studentEngagement.digitalLiteracyAssessment.intermediate}
                    onChange={(e) => handleNestedChange('studentEngagement', 'digitalLiteracyAssessment', 'intermediate', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="studentEngagement.digitalLiteracyAssessment.advanced" className="block text-sm text-gray-700">
                    Advanced Level
                  </label>
                  <input
                    type="number"
                    id="studentEngagement.digitalLiteracyAssessment.advanced"
                    value={formData.studentEngagement.digitalLiteracyAssessment.advanced}
                    onChange={(e) => handleNestedChange('studentEngagement', 'digitalLiteracyAssessment', 'advanced', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="studentEngagement.ictClubProjects" className="block text-sm font-medium text-gray-700">
                ICT Club Projects
              </label>
              <input
                type="number"
                id="studentEngagement.ictClubProjects"
                name="studentEngagement.ictClubProjects"
                value={formData.studentEngagement.ictClubProjects}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Platform Usage Statistics</label>
              <div className="mt-2 space-y-4">
                {formData.studentEngagement.platformUsageStats.map((stat, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Platform</label>
                      <input
                        type="text"
                        value={stat.platform}
                        onChange={(e) => {
                          const updatedStats = [...formData.studentEngagement.platformUsageStats];
                          updatedStats[index] = { ...stat, platform: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            studentEngagement: {
                              ...prev.studentEngagement,
                              platformUsageStats: updatedStats
                            }
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500">Active Users</label>
                      <input
                        type="number"
                        value={stat.activeUsers}
                        onChange={(e) => {
                          const updatedStats = [...formData.studentEngagement.platformUsageStats];
                          updatedStats[index] = { ...stat, activeUsers: Number(e.target.value) };
                          setFormData(prev => ({
                            ...prev,
                            studentEngagement: {
                              ...prev.studentEngagement,
                              platformUsageStats: updatedStats
                            }
                          }));
                        }}
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500">Average Hours/Week</label>
                      <input
                        type="number"
                        value={stat.averageHoursPerWeek}
                        onChange={(e) => {
                          const updatedStats = [...formData.studentEngagement.platformUsageStats];
                          updatedStats[index] = { ...stat, averageHoursPerWeek: Number(e.target.value) };
                          setFormData(prev => ({
                            ...prev,
                            studentEngagement: {
                              ...prev.studentEngagement,
                              platformUsageStats: updatedStats
                            }
                          }));
                        }}
                        min="0"
                        step="0.1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newStat = {
                      platform: '',
                      activeUsers: 0,
                      averageHoursPerWeek: 0
                    };
                    handleArrayAdd('studentEngagement', 'platformUsageStats', newStat);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Platform
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Satisfaction Survey</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentEngagement.satisfactionSurvey.respondents" className="block text-sm text-gray-700">
                    Number of Respondents
                  </label>
                  <input
                    type="number"
                    id="studentEngagement.satisfactionSurvey.respondents"
                    value={formData.studentEngagement.satisfactionSurvey.respondents}
                    onChange={(e) => handleNestedChange('studentEngagement', 'satisfactionSurvey', 'respondents', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="studentEngagement.satisfactionSurvey.averageRating" className="block text-sm text-gray-700">
                    Average Rating
                  </label>
                  <input
                    type="number"
                    id="studentEngagement.satisfactionSurvey.averageRating"
                    value={formData.studentEngagement.satisfactionSurvey.averageRating}
                    onChange={(e) => handleNestedChange('studentEngagement', 'satisfaction Survey', 'averageRating', Number(e.target.value))}
                    min="1"
                    max="5"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Key Feedback</label>
                <div className="mt-1 flex space-x-2">
                  <input
                    type="text"
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    placeholder="Enter feedback"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFeedback.trim()) {
                        handleArrayAdd('studentEngagement', 'satisfactionSurvey.keyFeedback', newFeedback.trim());
                        setNewFeedback('');
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.studentEngagement.satisfactionSurvey.keyFeedback.map((feedback, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span className="text-sm text-gray-700">{feedback}</span>
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('studentEngagement', 'satisfactionSurvey.keyFeedback', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Portal Statistics</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="communityEngagement.parentPortalStats.activeUsers" className="block text-sm text-gray-700">
                    Active Users
                  </label>
                  <input
                    type="number"
                    id="communityEngagement.parentPortalStats.activeUsers"
                    value={formData.communityEngagement.parentPortalStats.activeUsers}
                    onChange={(e) => handleNestedChange('communityEngagement', 'parentPortalStats', 'activeUsers', Number(e.target.value))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="communityEngagement.parentPortalStats.engagementRate" className="block text-sm text-gray-700">
                    Engagement Rate (%)
                  </label>
                  <input
                    type="number"
                    id="communityEngagement.parentPortalStats.engagementRate"
                    value={formData.communityEngagement.parentPortalStats.engagementRate}
                    onChange={(e) => handleNestedChange('communityEngagement', 'parentPortalStats', 'engagementRate', Number(e.target.value))}
                    min="0"
                    max="100"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Outreach Activities</label>
              <div className="mt-2 space-y-4">
                {formData.communityEngagement.outreachActivities.map((activity, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Activity Name</label>
                      <input
                        type="text"
                        value={activity.name}
                        onChange={(e) => {
                          const updatedActivities = [...formData.communityEngagement.outreachActivities];
                          updatedActivities[index] = { ...activity, name: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            communityEngagement: {
                              ...prev.communityEngagement,
                              outreachActivities: updatedActivities
                            }
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500">Participants</label>
                      <input
                        type="number"
                        value={activity.participants}
                        onChange={(e) => {
                          const updatedActivities = [...formData.communityEngagement.outreachActivities];
                          updatedActivities[index] = { ...activity, participants: Number(e.target.value) };
                          setFormData(prev => ({
                            ...prev,
                            communityEngagement: {
                              ...prev.communityEngagement,
                              outreachActivities: updatedActivities
                            }
                          }));
                        }}
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500">Date</label>
                      <input
                        type="date"
                        value={activity.date}
                        onChange={(e) => {
                          const updatedActivities = [...formData.communityEngagement.outreachActivities];
                          updatedActivities[index] = { ...activity, date: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            communityEngagement: {
                              ...prev.communityEngagement,
                              outreachActivities: updatedActivities
                            }
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newActivity = {
                      name: '',
                      participants: 0,
                      date: today
                    };
                    handleArrayAdd('communityEngagement', 'outreachActivities', newActivity);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Activity
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Partnership Updates</label>
              <div className="mt-2 space-y-4">
                {formData.communityEngagement.partnershipUpdates.map((partnership, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Partner</label>
                      <input
                        type="text"
                        value={partnership.partner}
                        onChange={(e) => {
                          const updatedPartnerships = [...formData.communityEngagement.partnershipUpdates];
                          updatedPartnerships[index] = { ...partnership, partner: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            communityEngagement: {
                              ...prev.communityEngagement,
                              partnershipUpdates: updatedPartnerships
                            }
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500">Contribution</label>
                      <input
                        type="text"
                        value={partnership.contribution}
                        onChange={(e) => {
                          const updatedPartnerships = [...formData.communityEngagement.partnershipUpdates];
                          updatedPartnerships[index] = { ...partnership, contribution: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            communityEngagement: {
                              ...prev.communityEngagement,
                              partnershipUpdates: updatedPartnerships
                            }
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500">Status</label>
                      <select
                        value={partnership.status}
                        onChange={(e) => {
                          const updatedPartnerships = [...formData.communityEngagement.partnershipUpdates];
                          updatedPartnerships[index] = { ...partnership, status: e.target.value as any };
                          setFormData(prev => ({
                            ...prev,
                            communityEngagement: {
                              ...prev.communityEngagement,
                              partnershipUpdates: updatedPartnerships
                            }
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Planned">Planned</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newPartnership = {
                      partner: '',
                      contribution: '',
                      status: 'Planned' as const
                    };
                    handleArrayAdd('communityEngagement', 'partnershipUpdates', newPartnership);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Partnership
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Tab */}
        <div className={currentTab === 'recommendations' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {formData.recommendations.map((recommendation, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={recommendation.priority}
                      onChange={(e) => {
                        const updatedRecommendations = [...formData.recommendations];
                        updatedRecommendations[index] = { ...recommendation, priority: e.target.value as any };
                        setFormData(prev => ({
                          ...prev,
                          recommendations: updatedRecommendations
                        }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={recommendation.category}
                      onChange={(e) => {
                        const updatedRecommendations = [...formData.recommendations];
                        updatedRecommendations[index] = { ...recommendation, category: e.target.value as any };
                        setFormData(prev => ({
                          ...prev,
                          recommendations: updatedRecommendations
                        }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Training">Training</option>
                      <option value="Software">Software</option>
                      <option value="Policy">Policy</option>
                      <option value="Community">Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timeline</label>
                    <input
                      type="text"
                      value={recommendation.timeline}
                      onChange={(e) => {
                        const updatedRecommendations = [...formData.recommendations];
                        updatedRecommendations[index] = { ...recommendation, timeline: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          recommendations: updatedRecommendations
                        }));
                      }}
                      placeholder="e.g., Q2 2024"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={recommendation.description}
                    onChange={(e) => {
                      const updatedRecommendations = [...formData.recommendations];
                      updatedRecommendations[index] = { ...recommendation, description: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        recommendations: updatedRecommendations
                      }));
                    }}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimated Cost (Optional)</label>
                  <input
                    type="number"
                    value={recommendation.estimatedCost || ''}
                    onChange={(e) => {
                      const updatedRecommendations = [...formData.recommendations];
                      updatedRecommendations[index] = { ...recommendation, estimatedCost: e.target.value ? Number(e.target.value) : undefined };
                      setFormData(prev => ({
                        ...prev,
                        recommendations: updatedRecommendations
                      }));
                    }}
                    min="0"
                    placeholder="Enter amount"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const updatedRecommendations = formData.recommendations.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        recommendations: updatedRecommendations
                      }));
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newRecommendation = {
                  priority: 'Medium' as const,
                  category: 'Infrastructure' as const,
                  description: '',
                  timeline: '',
                };
                handleArrayAdd('recommendations', '', newRecommendation);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Recommendation
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t">
          <div className="flex space-x-2">
            <button
              type="button"
              disabled={currentTab === tabs[0].id}
              onClick={() => {
                const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
                if (currentIndex > 0) {
                  setCurrentTab(tabs[currentIndex - 1].id);
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              type="button"
              disabled={currentTab === tabs[tabs.length - 1].id}
              onClick={() => {
                const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
                if (currentIndex < tabs.length - 1) {
                  setCurrentTab(tabs[currentIndex + 1].id);
                }
              }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {report ? 'Update Report' : 'Save Report'}
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ReportForm;
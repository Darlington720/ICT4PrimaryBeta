import React, { useState } from 'react';
import { School, ICTReport } from '../../types';
import Card from '../common/Card';
import PageHeader from '../common/PageHeader';
import { 
  Save, 
  X, 
  ArrowLeft, 
  Monitor, 
  Wifi, 
  Users, 
  Battery, 
  BookOpen, 
  GraduationCap,
  Settings,
  Tablet,
  Printer,
  Projector,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface PeriodicObservationFormProps {
  school: School;
  report?: ICTReport;
  onSubmit: (report: ICTReport) => void;
  onCancel: () => void;
}

const PeriodicObservationForm: React.FC<PeriodicObservationFormProps> = ({
  school,
  report,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<ICTReport, 'id'>>({
    schoolId: school.id,
    date: report?.date ?? new Date().toISOString().split('T')[0],
    period: report?.period || '',
    infrastructure: {
      computers: report?.infrastructure.computers || 0,
      tablets: report?.infrastructure.tablets || 0,
      projectors: report?.infrastructure.projectors || 0,
      printers: report?.infrastructure.printers || 0,
      internetConnection: report?.infrastructure.internet_connection || 'None',
      internetSpeedMbps: report?.infrastructure.internet_speed_mbps || 0,
      powerSource: report?.infrastructure.power_source || [],
      powerBackup: report?.infrastructure.power_backup || false,
      functionalDevices: report?.infrastructure.functional_devices || 0
    },
    usage: {
      teachersUsingICT: report?.usage.teachers_using_ict || 0,
      totalTeachers: report?.usage.total_teachers || school?.total_teachers || 0,
      weeklyComputerLabHours: report?.usage.weekly_computer_lab_hours || 0,
      studentDigitalLiteracyRate: report?.usage.student_digital_literacy_rate || 0
    },
    software: {
      operatingSystems: report?.software.operating_systems || [],
      educationalSoftware: report?.software.educational_software || [],
      officeApplications: report?.software.office_applications || false
    },
    capacity: {
      ictTrainedTeachers: report?.capacity.ict_trained_teachers || 0,
      supportStaff: report?.capacity.support_staff || 0
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newOS, setNewOS] = useState('');
  const [newSoftware, setNewSoftware] = useState('');

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.period.trim()) {
      newErrors.period = 'Period is required';
    }

    if (formData.usage.teachersUsingICT > formData.usage.totalTeachers) {
      newErrors.teachersUsingICT = 'Cannot exceed total teachers';
    }

    if (formData.capacity.ictTrainedTeachers > formData.usage.totalTeachers) {
      newErrors.ictTrainedTeachers = 'Cannot exceed total teachers';
    }

    if (formData.usage.studentDigitalLiteracyRate < 0 || formData.usage.studentDigitalLiteracyRate > 100) {
      newErrors.studentDigitalLiteracyRate = 'Must be between 0 and 100';
    }

    if (formData.infrastructure.internetConnection !== 'None' && formData.infrastructure.internetSpeedMbps <= 0) {
      newErrors.internetSpeedMbps = 'Speed must be greater than 0 for internet connections';
    }

    const totalDevices = formData.infrastructure.computers + formData.infrastructure.tablets + 
                        formData.infrastructure.projectors + formData.infrastructure.printers;
    if (formData.infrastructure.functionalDevices > totalDevices) {
      newErrors.functionalDevices = 'Cannot exceed total devices';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const reportData: ICTReport = {
      id: report?.id || null,
      ...formData
    };

    // console.log("report data", reportData)

    onSubmit(reportData);
  };

  const updateInfrastructure = (field: keyof typeof formData.infrastructure, value: any) => {
    setFormData(prev => ({
      ...prev,
      infrastructure: {
        ...prev.infrastructure,
        [field]: value
      }
    }));
  };

  const updateUsage = (field: keyof typeof formData.usage, value: any) => {
    setFormData(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        [field]: value
      }
    }));
  };

  const updateSoftware = (field: keyof typeof formData.software, value: any) => {
    setFormData(prev => ({
      ...prev,
      software: {
        ...prev.software,
        [field]: value
      }
    }));
  };

  const updateCapacity = (field: keyof typeof formData.capacity, value: any) => {
    setFormData(prev => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [field]: value
      }
    }));
  };

  const handlePowerSourceChange = (source: 'NationalGrid' | 'Solar' | 'Generator', checked: boolean) => {
    const currentSources = formData.infrastructure.powerSource;
    if (checked) {
      updateInfrastructure('powerSource', [...currentSources, source]);
    } else {
      updateInfrastructure('powerSource', currentSources.filter(s => s !== source));
    }
  };

  const addOperatingSystem = () => {
    if (newOS.trim() && !formData.software.operatingSystems.includes(newOS.trim())) {
      updateSoftware('operatingSystems', [...formData.software.operatingSystems, newOS.trim()]);
      setNewOS('');
    }
  };

  const removeOperatingSystem = (os: string) => {
    updateSoftware('operatingSystems', formData.software.operatingSystems.filter(item => item !== os));
  };

  const addEducationalSoftware = () => {
    if (newSoftware.trim() && !formData.software.educationalSoftware.includes(newSoftware.trim())) {
      updateSoftware('educationalSoftware', [...formData.software.educationalSoftware, newSoftware.trim()]);
      setNewSoftware('');
    }
  };

  const removeEducationalSoftware = (software: string) => {
    updateSoftware('educationalSoftware', formData.software.educationalSoftware.filter(item => item !== software));
  };

  // Calculate totals and percentages for display
  const totalDevices = formData.infrastructure.computers + formData.infrastructure.tablets + 
                      formData.infrastructure.projectors + formData.infrastructure.printers;
  const teacherUsagePercent = formData.usage.totalTeachers > 0 ? 
    Math.round((formData.usage.teachersUsingICT / formData.usage.totalTeachers) * 100) : 0;
  const trainedTeachersPercent = formData.usage.totalTeachers > 0 ? 
    Math.round((formData.capacity.ictTrainedTeachers / formData.usage.totalTeachers) * 100) : 0;

  return (
    <div>
      <PageHeader 
        title={report ? 'Edit Periodic Observation' : 'New Periodic Observation'}
        description={`${school.name} - ${school.district}, ${school.environment}`}
        action={
          <button
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to School
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card title="Observation Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                Observation Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="form-label">
                Period <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.period ? 'border-red-500' : ''}`}
                placeholder="e.g., Jan 2024, Q1 2024"
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                required
              />
              {errors.period && <p className="form-error">{errors.period}</p>}
            </div>
          </div>
        </Card>

        {/* Infrastructure Section */}
        <Card>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Monitor className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Infrastructure & Devices</h3>
              <p className="text-sm text-gray-500">Record the current status of ICT infrastructure</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Device Counts */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Device Inventory</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">
                    <Monitor className="inline h-4 w-4 mr-1" />
                    Computers
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.infrastructure.computers}
                    onChange={(e) => updateInfrastructure('computers', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="form-label">
                    <Tablet className="inline h-4 w-4 mr-1" />
                    Tablets
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.infrastructure.tablets}
                    onChange={(e) => updateInfrastructure('tablets', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="form-label">
                    <Projector className="inline h-4 w-4 mr-1" />
                    Projectors
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.infrastructure.projectors}
                    onChange={(e) => updateInfrastructure('projectors', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="form-label">
                    <Printer className="inline h-4 w-4 mr-1" />
                    Printers
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.infrastructure.printers}
                    onChange={(e) => updateInfrastructure('printers', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total Devices:</span>
                  <span className="font-medium">{totalDevices}</span>
                </div>
              </div>
            </div>

            {/* Functional Devices */}
            <div>
              <label className="form-label">
                Functional Devices <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max={totalDevices}
                className={`form-input ${errors.functionalDevices ? 'border-red-500' : ''}`}
                value={formData.infrastructure.functionalDevices}
                onChange={(e) => updateInfrastructure('functionalDevices', parseInt(e.target.value) || 0)}
                required
              />
              <p className="form-hint">Number of devices that are currently working (max: {totalDevices})</p>
              {errors.functionalDevices && <p className="form-error">{errors.functionalDevices}</p>}
            </div>

            {/* Internet Connectivity */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Internet Connectivity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    <Wifi className="inline h-4 w-4 mr-1" />
                    Connection Type
                  </label>
                  <select
                    className="form-select"
                    value={formData.infrastructure.internetConnection}
                    onChange={(e) => updateInfrastructure('internetConnection', e.target.value as any)}
                  >
                    <option value="None">No Internet</option>
                    <option value="Slow">Slow (1-5 Mbps)</option>
                    <option value="Medium">Medium (6-20 Mbps)</option>
                    <option value="Fast">Fast (21+ Mbps)</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Internet Speed (Mbps)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className={`form-input ${errors.internetSpeedMbps ? 'border-red-500' : ''}`}
                    value={formData.infrastructure.internetSpeedMbps}
                    onChange={(e) => updateInfrastructure('internetSpeedMbps', parseFloat(e.target.value) || 0)}
                    disabled={formData.infrastructure.internetConnection === 'None'}
                  />
                  {errors.internetSpeedMbps && <p className="form-error">{errors.internetSpeedMbps}</p>}
                </div>
              </div>
            </div>

            {/* Power Sources */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Power Infrastructure</h4>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Power Sources (select all that apply)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {(['NationalGrid', 'Solar', 'Generator'] as const).map((source) => (
                      <label key={source} className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={formData.infrastructure.powerSource.includes(source)}
                          onChange={(e) => handlePowerSourceChange(source, e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {source === 'NationalGrid' ? 'National Grid' : source}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={formData.infrastructure.powerBackup}
                      onChange={(e) => updateInfrastructure('powerBackup', e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      <Battery className="inline h-4 w-4 mr-1" />
                      Has Power Backup System
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Teaching & Learning Section */}
        <Card>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Teaching & Learning Activity</h3>
              <p className="text-sm text-gray-500">Record ICT usage in teaching and learning</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Teacher Usage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  <Users className="inline h-4 w-4 mr-1" />
                  Total Teachers <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.usage.totalTeachers}
                  onChange={(e) => updateUsage('totalTeachers', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div>
                <label className="form-label">
                  Teachers Using ICT <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.usage.totalTeachers}
                  className={`form-input ${errors.teachersUsingICT ? 'border-red-500' : ''}`}
                  value={formData.usage.teachersUsingICT}
                  onChange={(e) => updateUsage('teachersUsingICT', parseInt(e.target.value) || 0)}
                  required
                />
                <p className="form-hint">Usage rate: {teacherUsagePercent}%</p>
                {errors.teachersUsingICT && <p className="form-error">{errors.teachersUsingICT}</p>}
              </div>
            </div>

            {/* Student Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  Weekly Computer Lab Hours
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.usage.weeklyComputerLabHours}
                  onChange={(e) => updateUsage('weeklyComputerLabHours', parseInt(e.target.value) || 0)}
                />
                <p className="form-hint">Total hours per week students use computer lab</p>
              </div>
              
              <div>
                <label className="form-label">
                  <GraduationCap className="inline h-4 w-4 mr-1" />
                  Student Digital Literacy Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className={`form-input ${errors.studentDigitalLiteracyRate ? 'border-red-500' : ''}`}
                  value={formData.usage.studentDigitalLiteracyRate}
                  onChange={(e) => updateUsage('studentDigitalLiteracyRate', parseFloat(e.target.value) || 0)}
                />
                <p className="form-hint">Percentage of students with basic digital skills</p>
                {errors.studentDigitalLiteracyRate && <p className="form-error">{errors.studentDigitalLiteracyRate}</p>}
              </div>
            </div>
          </div>
        </Card>

        {/* Human Capacity Section */}
        <Card>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Human Capacity</h3>
              <p className="text-sm text-gray-500">Record ICT training and support staff</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                ICT-Trained Teachers
              </label>
              <input
                type="number"
                min="0"
                max={formData.usage.totalTeachers}
                className={`form-input ${errors.ictTrainedTeachers ? 'border-red-500' : ''}`}
                value={formData.capacity.ictTrainedTeachers}
                onChange={(e) => updateCapacity('ictTrainedTeachers', parseInt(e.target.value) || 0)}
              />
              <p className="form-hint">Training rate: {trainedTeachersPercent}%</p>
              {errors.ictTrainedTeachers && <p className="form-error">{errors.ictTrainedTeachers}</p>}
            </div>
            
            <div>
              <label className="form-label">
                <Settings className="inline h-4 w-4 mr-1" />
                ICT Support Staff
              </label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={formData.capacity.supportStaff}
                onChange={(e) => updateCapacity('supportStaff', parseInt(e.target.value) || 0)}
              />
              <p className="form-hint">Dedicated ICT support personnel</p>
            </div>
          </div>
        </Card>

        {/* Software & Content Section */}
        <Card>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-amber-100 rounded-lg mr-3">
              <Settings className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Software & Content</h3>
              <p className="text-sm text-gray-500">Record available software and digital content</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Operating Systems */}
            <div>
              <label className="form-label">Operating Systems</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="form-input flex-1"
                    placeholder="e.g., Windows 10, Ubuntu, macOS"
                    value={newOS}
                    onChange={(e) => setNewOS(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOperatingSystem())}
                  />
                  <button
                    type="button"
                    onClick={addOperatingSystem}
                    className="btn-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.software.operatingSystems.map((os) => (
                    <span key={os} className="tag-blue flex items-center">
                      {os}
                      <button
                        type="button"
                        onClick={() => removeOperatingSystem(os)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Educational Software */}
            <div>
              <label className="form-label">Educational Software</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="form-input flex-1"
                    placeholder="e.g., Math Learning App, Language Lab Software"
                    value={newSoftware}
                    onChange={(e) => setNewSoftware(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducationalSoftware())}
                  />
                  <button
                    type="button"
                    onClick={addEducationalSoftware}
                    className="btn-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.software.educationalSoftware.map((software) => (
                    <span key={software} className="tag-green flex items-center">
                      {software}
                      <button
                        type="button"
                        onClick={() => removeEducationalSoftware(software)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Office Applications */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={formData.software.officeApplications}
                  onChange={(e) => updateSoftware('officeApplications', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Office Applications Available (Word, Excel, PowerPoint, etc.)
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Summary Card */}
        <Card title="Observation Summary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formData.infrastructure.functionalDevices}</div>
              <div className="text-sm text-blue-700">Functional Devices</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{teacherUsagePercent}%</div>
              <div className="text-sm text-green-700">Teacher ICT Usage</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formData.usage.studentDigitalLiteracyRate}%</div>
              <div className="text-sm text-purple-700">Student Literacy</div>
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{trainedTeachersPercent}%</div>
              <div className="text-sm text-amber-700">Trained Teachers</div>
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            <Save className="mr-2 h-4 w-4" />
            {report ? 'Update Observation' : 'Save Observation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PeriodicObservationForm;
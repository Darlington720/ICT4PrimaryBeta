import React, { useState } from 'react';
import { School } from '../../types';
import Card from '../common/Card';
import PageHeader from '../common/PageHeader';
import { 
  Save, 
  X, 
  MapPin, 
  Users, 
  Building, 
  Wifi, 
  Shield, 
  GraduationCap,
  Home,
  FileText,
  Camera,
  CheckCircle
} from 'lucide-react';

interface SchoolFormProps {
  school?: School;
  onSubmit: (school: Omit<School, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

interface FormData {
  // Section 1: Basic Information
  name: string;
  emisNumber: string;
  upiCode: string;
  ownershipType: 'government' | 'government-aided' | 'community';
  schoolCategory: 'mixed' | 'girls' | 'boys' | 'special_needs';
  signatureProgram: string;
  yearEstablished: string;
  headTeacherName: string;
  headTeacherContact: string;
  district: string;
  subCounty: string;
  parish: string;
  latitude: string;
  longitude: string;
  distanceFromHQ: string;
  totalEnrollment: string;
  totalTeachers: string;
  maleTeachers: string;
  femaleTeachers: string;
  p5p7Staff: string;
  region: string;
  locationType: string;
  
  // Section 2: Infrastructure
  hasElectricity: boolean;
  electricityPlanned: boolean;
  hasSecureRoom: boolean;
  hasComputerLab: boolean;
  hasFurniture: boolean;
  computers: string;
  tablets: string;
  smartphones: string;
  projectors: string;
  interactiveWhiteboards: string;
  otherDevices: string;
  
  // Section 3: Connectivity
  hasInternet: boolean;
  connectionTypes: string[];
  isConnectionStable: boolean;
  internetProvider: string;
  willingToSubscribe: boolean;
  
  // Section 4: Security & Safety
  isFenced: boolean;
  hasSecurityGuard: boolean;
  hasTheftIncidents: boolean;
  theftDetails: string;
  hasToilets: boolean;
  hasWaterSource: boolean;
  
  // Section 5: Accessibility
  within30km: boolean;
  accessibleAllYear: boolean;
  isInclusive: string[];
  servesSpecialNeeds: boolean;
  
  // Section 6: Digital Readiness
  ictTrainedTeachers: string;
  digitalToolUsage: 'daily' | 'weekly' | 'rarely' | 'never';
  hasDigitalContent: boolean;
  contentSource: string;
  hasPeerSupport: boolean;
  ongoingCapacityBuilding: string;
  
  // Section 7: Environment & Governance
  permanentClassrooms: string;
  semiPermanentClassrooms: string;
  temporaryClassrooms: string;
  pupilClassroomRatio: string;
  boysToilets: string;
  girlsToilets: string;
  staffToilets: string;
  waterAccess: string[];
  securityInfrastructure: string[];
  schoolAccessibility: 'All-Weather' | 'Seasonal' | 'Remote';
  nearbyHealthFacility: string;
  hasActiveSMC: boolean;
  hasActivePTA: boolean;
  engagementWithDEO: boolean;
  ngoSupport: string;
  communityContributions: string;
  plePassRate: string;
  literacyTrends: string;
  digitalContentUsers: string;
  innovations: string;
  
  // Final Assessment
  assessorNotes: string;
  // assessedBy: string;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ school, onSubmit, onCancel }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Initialize with school data if editing, otherwise empty
    name: school?.name || '',
    emisNumber: '',
    upiCode: '',
    ownershipType: 'government',
    schoolCategory: 'mixed',
    signatureProgram: '',
    yearEstablished: '',
    headTeacherName: school?.contactInfo.principalName || '',
    headTeacherContact: school?.contactInfo.email || '',
    district: school?.district || '',
    subCounty: school?.subCounty || '',
    parish: '',
    latitude: school?.location.latitude.toString() || '',
    longitude: school?.location.longitude.toString() || '',
    distanceFromHQ: '',
    totalEnrollment: school?.enrollmentData.totalStudents.toString() || '',
    totalTeachers: '',
    maleTeachers: '',
    femaleTeachers: '',
    p5p7Staff: '',
    
    region: "central",
    locationType: "urban",
    hasElectricity: false,
    electricityPlanned: false,
    hasSecureRoom: false,
    hasComputerLab: false,
    hasFurniture: false,
    computers: '',
    tablets: '',
    smartphones: '',
    projectors: '',
    interactiveWhiteboards: '',
    otherDevices: '',
    
    hasInternet: false,
    connectionTypes: [],
    isConnectionStable: false,
    internetProvider: '',
    willingToSubscribe: false,
    
    isFenced: false,
    hasSecurityGuard: false,
    hasTheftIncidents: false,
    theftDetails: '',
    hasToilets: false,
    hasWaterSource: false,
    
    within30km: false,
    accessibleAllYear: false,
    isInclusive: [],
    servesSpecialNeeds: false,
    
    ictTrainedTeachers: '',
    digitalToolUsage: 'never',
    hasDigitalContent: false,
    contentSource: '',
    hasPeerSupport: false,
    ongoingCapacityBuilding: '',
    
    permanentClassrooms: '',
    semiPermanentClassrooms: '',
    temporaryClassrooms: '',
    pupilClassroomRatio: '',
    boysToilets: '',
    girlsToilets: '',
    staffToilets: '',
    waterAccess: [],
    securityInfrastructure: [],
    schoolAccessibility: 'All-Weather',
    nearbyHealthFacility: '',
    hasActiveSMC: false,
    hasActivePTA: false,
    engagementWithDEO: false,
    ngoSupport: '',
    communityContributions: '',
    plePassRate: '',
    literacyTrends: '',
    digitalContentUsers: '',
    innovations: '',
    
    assessorNotes: '',
    // assessedBy: ''
  });

  const sections = [
    { id: 1, title: 'School Identification & Basic Information', icon: Building },
    { id: 2, title: 'Infrastructure Readiness', icon: Home },
    { id: 3, title: 'Connectivity', icon: Wifi },
    { id: 4, title: 'Security & Safety', icon: Shield },
    { id: 5, title: 'Accessibility & Inclusion', icon: MapPin },
    { id: 6, title: 'Digital Pedagogical Readiness', icon: GraduationCap },
    { id: 7, title: 'School Environment & Governance', icon: Users },
    { id: 8, title: 'Final Assessment', icon: FileText }
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("current", currentSection)
    onSubmit(formData);
  };

  const nextSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSection1 = () => (
    <div className="form-section">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Building className="h-5 w-5 mr-2 text-blue-600" />
        School Identification & Basic Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">School Name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
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
          <label className="form-label">UPI Code</label>
          <input
            type="text"
            className="form-input"
            value={formData.upiCode}
            onChange={(e) => handleInputChange('upiCode', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ownership Type *</label>
          <select
            className="form-select"
            value={formData.ownershipType}
            onChange={(e) => handleInputChange('ownershipType', e.target.value)}
            required
          >
            <option value="government">Government</option>
            <option value="government-aided">Government-aided</option>
            <option value="community">Community</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">School Category *</label>
          <select
            className="form-select"
            value={formData.schoolCategory}
            onChange={(e) => handleInputChange('schoolCategory', e.target.value)}
            required
          >
            <option value="mixed">Mixed</option>
            <option value="girls">Girls</option>
            <option value="boys">Boys</option>
            <option value="special_needs">Special Needs</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Year Established</label>
          <input
            type="number"
            className="form-input"
            value={formData.yearEstablished}
            onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Head Teacher Name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.headTeacherName}
            onChange={(e) => handleInputChange('headTeacherName', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Head Teacher Contact *</label>
          <input
            type="text"
            className="form-input"
            value={formData.headTeacherContact}
            onChange={(e) => handleInputChange('headTeacherContact', e.target.value)}
            placeholder="Phone/Email"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">District *</label>
          <input
            type="text"
            className="form-input"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Sub-county / Town Council *</label>
          <input
            type="text"
            className="form-input"
            value={formData.subCounty}
            onChange={(e) => handleInputChange('subCounty', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Parish / Village</label>
          <input
            type="text"
            className="form-input"
            value={formData.parish}
            onChange={(e) => handleInputChange('parish', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Distance from Anchor District HQ (km)</label>
          <input
            type="number"
            className="form-input"
            value={formData.distanceFromHQ}
            onChange={(e) => handleInputChange('distanceFromHQ', e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Region</label>
          <select
            className="form-select"
            value={formData.region}
            onChange={(e) => handleInputChange('region', e.target.value)}
            required
          >
            <option value="central">Central</option>
            <option value="eastern">Eastern</option>
            <option value="northern">Northern</option>
            <option value="western">Western</option>
            <option value="west_nile">West Nile</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Location Type</label>
          <select
            className="form-select"
            value={formData.locationType}
            onChange={(e) => handleInputChange('locationType', e.target.value)}
            required
          >
            <option value="rural">Rural</option>
            <option value="urban">Urban</option>
            <option value="suburban">Sub Urban</option>
         
          </select>
        </div>
      </div>

      <div className="form-divider" />

      <h4 className="text-md font-medium text-gray-800 mb-4">GPS Coordinates</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">Latitude *</label>
          <input
            type="number"
            step="any"
            className="form-input"
            value={formData.latitude}
            onChange={(e) => handleInputChange('latitude', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Longitude *</label>
          <input
            type="number"
            step="any"
            className="form-input"
            value={formData.longitude}
            onChange={(e) => handleInputChange('longitude', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-divider" />

      <h4 className="text-md font-medium text-gray-800 mb-4">Enrollment & Staff</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">Total UPE Enrollment (P1–P7) *</label>
          <input
            type="number"
            className="form-input"
            value={formData.totalEnrollment}
            onChange={(e) => handleInputChange('totalEnrollment', e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Number of Teachers *</label>
          <input
            type="number"
            className="form-input"
            value={formData.totalTeachers}
            onChange={(e) => handleInputChange('totalTeachers', e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Male Teachers</label>
          <input
            type="number"
            className="form-input"
            value={formData.maleTeachers}
            onChange={(e) => handleInputChange('maleTeachers', e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Female Teachers</label>
          <input
            type="number"
            className="form-input"
            value={formData.femaleTeachers}
            onChange={(e) => handleInputChange('femaleTeachers', e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Number of Staff in P5–P7</label>
          <input
            type="number"
            className="form-input"
            value={formData.p5p7Staff}
            onChange={(e) => handleInputChange('p5p7Staff', e.target.value)}
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Signature Program/Unique Feature</label>
        <textarea
          className="form-input"
          rows={3}
          value={formData.signatureProgram}
          onChange={(e) => handleInputChange('signatureProgram', e.target.value)}
          placeholder="Describe any unique programs or features of the school"
        />
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="form-section">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Home className="h-5 w-5 mr-2 text-blue-600" />
        Infrastructure Readiness
      </h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Is the school connected to electricity?</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="hasElectricity"
                  checked={formData.hasElectricity}
                  onChange={() => handleInputChange('hasElectricity', true)}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="hasElectricity"
                  checked={!formData.hasElectricity}
                  onChange={() => handleInputChange('hasElectricity', false)}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          {!formData.hasElectricity && (
            <div className="form-group">
              <label className="form-label">Is an electricity connection planned?</label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="electricityPlanned"
                    checked={formData.electricityPlanned}
                    onChange={() => handleInputChange('electricityPlanned', true)}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="electricityPlanned"
                    checked={!formData.electricityPlanned}
                    onChange={() => handleInputChange('electricityPlanned', false)}
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.hasSecureRoom}
                onChange={(e) => handleInputChange('hasSecureRoom', e.target.checked)}
              />
              <span className="ml-2">Secure, lockable room for ICT use</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.hasComputerLab}
                onChange={(e) => handleInputChange('hasComputerLab', e.target.checked)}
              />
              <span className="ml-2">Dedicated computer lab (15+ capacity)</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.hasFurniture}
                onChange={(e) => handleInputChange('hasFurniture', e.target.checked)}
              />
              <span className="ml-2">Furniture available in ICT area</span>
            </label>
          </div>
        </div>

        <div className="form-divider" />

        <h4 className="text-md font-medium text-gray-800 mb-4">ICT Digital Devices Available</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="form-label">Computers</label>
            <input
              type="number"
              className="form-input"
              value={formData.computers}
              onChange={(e) => handleInputChange('computers', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tablets</label>
            <input
              type="number"
              className="form-input"
              value={formData.tablets}
              onChange={(e) => handleInputChange('tablets', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Smartphones</label>
            <input
              type="number"
              className="form-input"
              value={formData.smartphones}
              onChange={(e) => handleInputChange('smartphones', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Projectors</label>
            <input
              type="number"
              className="form-input"
              value={formData.projectors}
              onChange={(e) => handleInputChange('projectors', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Interactive Whiteboards</label>
            <input
              type="number"
              className="form-input"
              value={formData.interactiveWhiteboards}
              onChange={(e) => handleInputChange('interactiveWhiteboards', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Other Devices</label>
            <input
              type="text"
              className="form-input"
              value={formData.otherDevices}
              onChange={(e) => handleInputChange('otherDevices', e.target.value)}
              placeholder="Specify other devices"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="form-section">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Wifi className="h-5 w-5 mr-2 text-blue-600" />
        Connectivity
      </h3>

      <div className="space-y-6">
        <div className="form-group">
          <label className="form-label">Is there any form of internet connectivity at the school?</label>
          <div className="flex items-center space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="hasInternet"
                checked={formData.hasInternet}
                onChange={() => handleInputChange('hasInternet', true)}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="hasInternet"
                checked={!formData.hasInternet}
                onChange={() => handleInputChange('hasInternet', false)}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {formData.hasInternet && (
          <>
            <div className="form-group">
              <label className="form-label">Type of internet connection (select all that apply)</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {['Mobile Data', 'Wi-Fi', 'Fiber', 'Satellite'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={formData.connectionTypes.includes(type)}
                      onChange={(e) => handleArrayChange('connectionTypes', type, e.target.checked)}
                    />
                    <span className="ml-2">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Is the connection stable and reliable?</label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="isConnectionStable"
                      checked={formData.isConnectionStable}
                      onChange={() => handleInputChange('isConnectionStable', true)}
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="isConnectionStable"
                      checked={!formData.isConnectionStable}
                      onChange={() => handleInputChange('isConnectionStable', false)}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Internet Provider</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.internetProvider}
                  onChange={(e) => handleInputChange('internetProvider', e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">Is the school willing to subscribe or co-maintain internet?</label>
          <div className="flex items-center space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="willingToSubscribe"
                checked={formData.willingToSubscribe}
                onChange={() => handleInputChange('willingToSubscribe', true)}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="willingToSubscribe"
                checked={!formData.willingToSubscribe}
                onChange={() => handleInputChange('willingToSubscribe', false)}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="form-section">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Shield className="h-5 w-5 mr-2 text-blue-600" />
        Security & Safety
      </h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.isFenced}
                onChange={(e) => handleInputChange('isFenced', e.target.checked)}
              />
              <span className="ml-2">School is fenced or gated</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.hasSecurityGuard}
                onChange={(e) => handleInputChange('hasSecurityGuard', e.target.checked)}
              />
              <span className="ml-2">Security guard at the school</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.hasToilets}
                onChange={(e) => handleInputChange('hasToilets', e.target.checked)}
              />
              <span className="ml-2">Toilet facilities available</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.hasWaterSource}
                onChange={(e) => handleInputChange('hasWaterSource', e.target.checked)}
              />
              <span className="ml-2">Water sources available</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Any recent theft/vandalism incidents?</label>
          <div className="flex items-center space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="hasTheftIncidents"
                checked={formData.hasTheftIncidents}
                onChange={() => handleInputChange('hasTheftIncidents', true)}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="hasTheftIncidents"
                checked={!formData.hasTheftIncidents}
                onChange={() => handleInputChange('hasTheftIncidents', false)}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {formData.hasTheftIncidents && (
          <div className="form-group">
            <label className="form-label">Please explain the incidents</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.theftDetails}
              onChange={(e) => handleInputChange('theftDetails', e.target.value)}
              placeholder="Describe the theft/vandalism incidents"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="form-section">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
        Accessibility & Inclusion
      </h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.within30km}
                onChange={(e) => handleInputChange('within30km', e.target.checked)}
              />
              <span className="ml-2">Within 30 km from anchor district HQ</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.accessibleAllYear}
                onChange={(e) => handleInputChange('accessibleAllYear', e.target.checked)}
              />
              <span className="ml-2">Accessible by road all year round</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.servesSpecialNeeds}
                onChange={(e) => handleInputChange('servesSpecialNeeds', e.target.checked)}
              />
              <span className="ml-2">Serves PWDs or is the only school in the area</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">School is inclusive for (select all that apply)</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {['Boys', 'Girls', 'PWDs', 'Refugees'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={formData.isInclusive.includes(type)}
                  onChange={(e) => handleArrayChange('isInclusive', type, e.target.checked)}
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection6 = () => (
    <div className="form-section">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
        Digital Pedagogical Readiness
      </h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Number of teachers trained in ICT integration</label>
            <input
              type="number"
              className="form-input"
              value={formData.ictTrainedTeachers}
              onChange={(e) => handleInputChange('ictTrainedTeachers', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Frequency of digital tool usage in classrooms</label>
            <select
              className="form-select"
              value={formData.digitalToolUsage}
              onChange={(e) => handleInputChange('digitalToolUsage', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="rarely">Rarely</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Access to digital content</label>
          <div className="flex items-center space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="hasDigitalContent"
                checked={formData.hasDigitalContent}
                onChange={() => handleInputChange('hasDigitalContent', true)}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="hasDigitalContent"
                checked={!formData.hasDigitalContent}
                onChange={() => handleInputChange('hasDigitalContent', false)}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {formData.hasDigitalContent && (
          <div className="form-group">
            <label className="form-label">Content Source</label>
            <input
              type="text"
              className="form-input"
              value={formData.contentSource}
              onChange={(e) => handleInputChange('contentSource', e.target.value)}
              placeholder="e.g., MoES LMS, Kolibri, RACHEL, etc."
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Peer Support Networks / Teacher Clusters</label>
          <div className="flex items-center space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="hasPeerSupport"
                checked={formData.hasPeerSupport}
                onChange={() => handleInputChange('hasPeerSupport', true)}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="hasPeerSupport"
                checked={!formData.hasPeerSupport}
                onChange={() => handleInputChange('hasPeerSupport', false)}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Any ongoing capacity-building initiatives?</label>
          <textarea
            className="form-input"
            rows={3}
            value={formData.ongoingCapacityBuilding}
            onChange={(e) => handleInputChange('ongoingCapacityBuilding', e.target.value)}
            placeholder="Describe any ongoing training or capacity building programs"
          />
        </div>
      </div>
    </div>
  );

  const renderSection7 = () => (
    <div className="form-section">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Users className="h-5 w-5 mr-2 text-blue-600" />
        School Environment & Governance
      </h3>

      <div className="space-y-6">
        <h4 className="text-md font-medium text-gray-800">Classrooms</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="form-group">
            <label className="form-label">Permanent</label>
            <input
              type="number"
              className="form-input"
              value={formData.permanentClassrooms}
              onChange={(e) => handleInputChange('permanentClassrooms', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Semi-Permanent</label>
            <input
              type="number"
              className="form-input"
              value={formData.semiPermanentClassrooms}
              onChange={(e) => handleInputChange('semiPermanentClassrooms', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Temporary</label>
            <input
              type="number"
              className="form-input"
              value={formData.temporaryClassrooms}
              onChange={(e) => handleInputChange('temporaryClassrooms', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pupil-Classroom Ratio</label>
            <input
              type="number"
              className="form-input"
              value={formData.pupilClassroomRatio}
              onChange={(e) => handleInputChange('pupilClassroomRatio', e.target.value)}
              min="0"
            />
          </div>
        </div>

        <div className="form-divider" />

        <h4 className="text-md font-medium text-gray-800">Sanitation Facilities</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="form-label">Boys Toilets</label>
            <input
              type="number"
              className="form-input"
              value={formData.boysToilets}
              onChange={(e) => handleInputChange('boysToilets', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Girls Toilets</label>
            <input
              type="number"
              className="form-input"
              value={formData.girlsToilets}
              onChange={(e) => handleInputChange('girlsToilets', e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Staff Toilets</label>
            <input
              type="number"
              className="form-input"
              value={formData.staffToilets}
              onChange={(e) => handleInputChange('staffToilets', e.target.value)}
              min="0"
            />
          </div>
        </div>

        <div className="form-divider" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Water Access (select all that apply)</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {['Borehole', 'Tap', 'Rainwater', 'None'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.waterAccess.includes(type)}
                    onChange={(e) => handleArrayChange('waterAccess', type, e.target.checked)}
                  />
                  <span className="ml-2">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Security Infrastructure (select all that apply)</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {['Perimeter Wall', 'Fence', 'Guard', 'None'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.securityInfrastructure.includes(type)}
                    onChange={(e) => handleArrayChange('securityInfrastructure', type, e.target.checked)}
                  />
                  <span className="ml-2">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">School Accessibility</label>
            <select
              className="form-select"
              value={formData.schoolAccessibility}
              onChange={(e) => handleInputChange('schoolAccessibility', e.target.value)}
            >
              <option value="All-Weather">All-Weather</option>
              <option value="Seasonal">Seasonal</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nearby Health Facility (Name/Distance)</label>
            <input
              type="text"
              className="form-input"
              value={formData.nearbyHealthFacility}
              onChange={(e) => handleInputChange('nearbyHealthFacility', e.target.value)}
            />
          </div>
        </div>

        <div className="form-divider" />

        <h4 className="text-md font-medium text-gray-800">Governance & Community</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.hasActiveSMC}
                onChange={(e) => handleInputChange('hasActiveSMC', e.target.checked)}
              />
              <span className="ml-2">Active School Management Committee (SMC)</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.hasActivePTA}
                onChange={(e) => handleInputChange('hasActivePTA', e.target.checked)}
              />
              <span className="ml-2">Active PTA</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={formData.engagementWithDEO}
                onChange={(e) => handleInputChange('engagementWithDEO', e.target.checked)}
              />
              <span className="ml-2">Engagement with DEO or Local Leaders</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Support from NGOs or Partners</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.ngoSupport}
              onChange={(e) => handleInputChange('ngoSupport', e.target.value)}
              placeholder="List names and areas of support"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Community Contributions to ICT</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.communityContributions}
              onChange={(e) => handleInputChange('communityContributions', e.target.value)}
              placeholder="Equipment, internet, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">PLE Pass Rate (last 3 years)</label>
            <input
              type="text"
              className="form-input"
              value={formData.plePassRate}
              onChange={(e) => handleInputChange('plePassRate', e.target.value)}
              placeholder="e.g., 85%, 90%, 88%"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of learners using digital content</label>
            <input
              type="number"
              className="form-input"
              value={formData.digitalContentUsers}
              onChange={(e) => handleInputChange('digitalContentUsers', e.target.value)}
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Literacy/Numeracy Trends</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.literacyTrends}
              onChange={(e) => handleInputChange('literacyTrends', e.target.value)}
              placeholder="Describe trends in literacy and numeracy"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Innovations or unique achievements</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.innovations}
              onChange={(e) => handleInputChange('innovations', e.target.value)}
              placeholder="Describe any innovations or achievements"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection8 = () => (
    <div className="form-section">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2 text-blue-600" />
        Final Assessment
      </h3>

      <div className="space-y-6">
        <div className="form-group">
          <label className="form-label">Final Recommendation Comments</label>
          <textarea
            className="form-input"
            rows={5}
            value={formData.assessorNotes}
            onChange={(e) => handleInputChange('assessorNotes', e.target.value)}
            placeholder="Field officer or assessor notes on readiness, concerns, or priorities"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assessed By</label>
          <input
            type="text"
            className="form-input"
            value={formData.assessedBy}
            onChange={(e) => handleInputChange('assessedBy', e.target.value)}
            placeholder="Name of assessor"
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            Attachments Required
          </h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>☐ MoU / Letter of Commitment</li>
            <li>☐ Infrastructure Map or Sketch</li>
            <li>☐ Photos of ICT Room, School Environment, Device Storage</li>
            <li>☐ Copy of Internet Contract (if available)</li>
          </ul>
          <p className="text-xs text-amber-600 mt-2">
            Note: File upload functionality will be implemented in the next phase
          </p>
        </div>
      </div>
    </div>
  );

  const currentSectionData = sections.find(s => s.id === currentSection);

  return (
    <div>
      <PageHeader 
        title={school ? 'Edit School' : 'Add New School'}
        description="INITIAL SCHOOL DATA COLLECTION FORM"
      />

      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Section {currentSection} of {sections.length}
            </h2>
            <span className="text-sm text-gray-500">
              {Math.round((currentSection / sections.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-1 overflow-x-auto pb-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    currentSection === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {section.title}
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current Section Content */}
          <Card>
            {currentSection === 1 && renderSection1()}
            {currentSection === 2 && renderSection2()}
            {currentSection === 3 && renderSection3()}
            {currentSection === 4 && renderSection4()}
            {currentSection === 5 && renderSection5()}
            {currentSection === 6 && renderSection6()}
            {currentSection === 7 && renderSection7()}
            {currentSection === 8 && renderSection8()}
          </Card>

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <div>
              {currentSection > 1 && (
                <button
                  type="button"
                  onClick={prevSection}
                  className="btn-secondary"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                {/* <X className="h-4 w-4 mr-2" /> */}
                Cancel
              </button>

              {currentSection < sections.length ? (
                <button
                  type="button"
                  onClick={nextSection}
                  className="btn-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-success"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {school ? 'Update School' : 'Save School'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolForm;
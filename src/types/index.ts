export interface School {
  id: string;
  name: string;
  district: string;
  subCounty: string;
  location: {
    latitude: number;
    longitude: number;
  };
  type: 'Public' | 'Private';
  environment: 'Urban' | 'Rural';
  
  // Basic Information
  emisNumber?: string;
  upiCode?: string;
  ownershipType?: 'Government' | 'Government-aided' | 'Community';
  schoolCategory?: 'Mixed' | 'Girls' | 'Boys' | 'Special Needs';
  signatureProgram?: string;
  yearEstablished?: number;
  
  enrollmentData: {
    totalStudents: number;
    maleStudents: number;
    femaleStudents: number;
  };
  contactInfo: {
    principalName: string;
    email: string;
    phone: string;
  };
  
  // Infrastructure
  infrastructure: {
    studentComputers: number;
    teacherComputers: number;
    projectors: number;
    smartBoards: number;
    tablets: number;
    laptops: number;
    hasComputerLab: boolean;
    labCondition?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    powerBackup: ('Solar' | 'Generator' | 'UPS')[];
    hasICTRoom: boolean;
    hasElectricity: boolean;
    hasSecureRoom: boolean;
    hasFurniture: boolean;
  };
  
  // Connectivity
  internet: {
    connectionType: 'None' | 'Fiber' | 'Mobile Broadband' | 'Satellite';
    bandwidthMbps: number;
    wifiCoverage: ('Administration' | 'Classrooms' | 'Library' | 'Dormitories')[];
    stability: 'High' | 'Medium' | 'Low';
    hasUsagePolicy: boolean;
    provider?: string;
    isStable: boolean;
  };
  
  // Software
  software: {
    hasLMS: boolean;
    lmsName?: string;
    hasLicensedSoftware: boolean;
    licensedSoftware: string[];
    hasProductivitySuite: boolean;
    productivitySuite: ('Microsoft Office' | 'Google Workspace' | 'Other')[];
    hasDigitalLibrary: boolean;
    hasLocalContent: boolean;
    contentSource?: string;
  };
  
  // Human Capacity
  humanCapacity: {
    ictTrainedTeachers: number;
    totalTeachers: number;
    maleTeachers: number;
    femaleTeachers: number;
    p5ToP7Teachers: number;
    supportStaff: number;
    monthlyTrainings: number;
    teacherCompetencyLevel: 'Basic' | 'Intermediate' | 'Advanced';
    hasCapacityBuilding: boolean;
  };
  
  // Pedagogical Usage
  pedagogicalUsage: {
    ictIntegratedLessons: number;
    usesICTAssessments: boolean;
    hasStudentProjects: boolean;
    usesBlendedLearning: boolean;
    hasAssistiveTech: boolean;
    digitalToolUsageFrequency: 'Daily' | 'Weekly' | 'Rarely' | 'Never';
    hasDigitalContent: boolean;
    hasPeerSupport: boolean;
  };
  
  // Governance
  governance: {
    hasICTPolicy: boolean;
    alignedWithNationalStrategy: boolean;
    hasICTCommittee: boolean;
    hasICTBudget: boolean;
    hasMonitoringSystem: boolean;
    hasActiveSMC: boolean;
    hasActivePTA: boolean;
    hasLocalLeaderEngagement: boolean;
  };
  
  // Student Engagement
  studentEngagement: {
    digitalLiteracyLevel: 'Basic' | 'Intermediate' | 'Advanced';
    hasICTClub: boolean;
    usesOnlinePlatforms: boolean;
    studentFeedbackRating: 1 | 2 | 3 | 4 | 5;
    studentsUsingDigitalContent: number;
  };
  
  // Community Engagement
  communityEngagement: {
    hasParentPortal: boolean;
    hasCommunityOutreach: boolean;
    hasIndustryPartners: boolean;
    partnerOrganizations: string[];
    ngoSupport: string[];
    communityContributions: string[];
  };
  
  // Security & Safety
  security: {
    isFenced: boolean;
    hasSecurityGuard: boolean;
    hasRecentIncidents: boolean;
    incidentDetails?: string;
    hasToilets: boolean;
    hasWaterSource: boolean;
  };
  
  // Accessibility
  accessibility: {
    distanceFromHQ: number;
    isAccessibleAllYear: boolean;
    isInclusive: boolean;
    servesGirls: boolean;
    servesPWDs: boolean;
    servesRefugees: boolean;
    isOnlySchoolInArea: boolean;
  };
  
  // Environment & Facilities
  environment: {
    permanentClassrooms: number;
    semiPermanentClassrooms: number;
    temporaryClassrooms: number;
    pupilClassroomRatio: number;
    boysToilets: number;
    girlsToilets: number;
    staffToilets: number;
    waterAccess: 'Borehole' | 'Tap' | 'Rainwater' | 'None';
    securityInfrastructure: ('Perimeter Wall' | 'Fence' | 'Guard' | 'None')[];
    schoolAccessibility: 'All-Weather' | 'Seasonal' | 'Remote';
    nearbyHealthFacility?: string;
    healthFacilityDistance?: number;
  };
  
  // Performance
  performance: {
    plePassRateYear1?: number;
    plePassRateYear2?: number;
    plePassRateYear3?: number;
    literacyTrends?: string;
    numeracyTrends?: string;
    innovations?: string;
    uniqueAchievements?: string;
  };
}

export interface ICTReport {
  id: string;
  schoolId: string;
  date: string;
  period: string;
  infrastructure: {
    computers: number;
    tablets: number;
    projectors: number;
    printers: number;
    internetConnection: 'None' | 'Slow' | 'Medium' | 'Fast';
    internetSpeedMbps: number;
    powerSource: ('NationalGrid' | 'Solar' | 'Generator')[];
    powerBackup: boolean;
    functionalDevices: number;
  };
  usage: {
    teachersUsingICT: number;
    totalTeachers: number;
    weeklyComputerLabHours: number;
    studentDigitalLiteracyRate: number;
  };
  software: {
    operatingSystems: string[];
    educationalSoftware: string[];
    officeApplications: boolean;
  };
  capacity: {
    ictTrainedTeachers: number;
    supportStaff: number;
  };
}

export interface ICTReadinessLevel {
  schoolId: string;
  level: 'Low' | 'Medium' | 'High';
  score: number;
}

export interface ComparisonData {
  schools: School[];
  reports: ICTReport[];
}
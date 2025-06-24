import React, { useState, useEffect } from "react";
import { School } from "../../types";
import Card from "../common/Card";
import PageHeader from "../common/PageHeader";
import {
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Monitor,
  Wifi,
  Settings,
  Users,
  BookOpen,
  Shield,
  Globe,
  GraduationCap,
  Building,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  School as SchoolIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SchoolFormProps {
  school?: School;
  onSubmit: (school: Omit<School, "id"> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  // Basic Information
  id: string;
  name: string;
  region: string;
  district: string;
  subCounty: string;
  latitude: number;
  longitude: number;
  type: "Public" | "Private";
  environment: "Urban" | "Rural";
  emisNumber: string;
  upiCode: string;
  ownershipType: "Government" | "Government-aided" | "Community" | "Private";
  schoolCategory: "Mixed" | "Girls" | "Boys" | "Special Needs";
  signatureProgram: string;
  yearEstablished: number;
  headTeacher: string;
  email: string;
  phone: string;
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;

  // ICT Infrastructure
  studentComputers: number;
  teacherComputers: number;
  projectors: number;
  smartBoards: number;
  tablets: number;
  laptops: number;
  hasComputerLab: boolean;
  labCondition: "Excellent" | "Good" | "Fair" | "Poor";
  powerBackup: string[];
  hasICTRoom: boolean;
  hasElectricity: boolean;
  hasSecureRoom: boolean;
  hasFurniture: boolean;

  // Internet Connectivity
  connectionType: "None" | "Fiber" | "Mobile Broadband" | "Satellite";
  bandwidthMbps: number;
  wifiCoverage: string[];
  stability: "High" | "Medium" | "Low";
  hasUsagePolicy: boolean;
  provider: string;
  isStable: boolean;

  // ICT Software and Digital Resources
  hasLMS: boolean;
  lmsName: string;
  hasLicensedSoftware: boolean;
  licensedSoftware: string[];
  hasProductivitySuite: boolean;
  productivitySuite: string[];
  hasDigitalLibrary: boolean;
  hasLocalContent: boolean;
  contentSource: string;

  // Human Capacity and ICT Competency
  ictTrainedTeachers: number;
  totalTeachers: number;
  maleTeachers: number;
  femaleTeachers: number;
  p5ToP7Teachers: number;
  supportStaff: number;
  monthlyTrainings: number;
  teacherCompetencyLevel: "Basic" | "Intermediate" | "Advanced";
  hasCapacityBuilding: boolean;

  // Pedagogical ICT Usage
  ictIntegratedLessons: number;
  usesICTAssessments: boolean;
  hasStudentProjects: boolean;
  usesBlendedLearning: boolean;
  hasAssistiveTech: boolean;
  digitalToolUsageFrequency: "Daily" | "Weekly" | "Rarely" | "Never";
  hasDigitalContent: boolean;
  hasPeerSupport: boolean;

  // ICT Governance and Policy
  hasICTPolicy: boolean;
  alignedWithNationalStrategy: boolean;
  hasICTCommittee: boolean;
  hasICTBudget: boolean;
  hasMonitoringSystem: boolean;
  hasActiveSMC: boolean;
  hasActivePTA: boolean;
  hasLocalLeaderEngagement: boolean;

  // Students' Digital Literacy and Engagement
  digitalLiteracyLevel: "Basic" | "Intermediate" | "Advanced";
  hasICTClub: boolean;
  usesOnlinePlatforms: boolean;
  studentFeedbackRating: 1 | 2 | 3 | 4 | 5;
  studentsUsingDigitalContent: number;

  // Community and Parental Engagement
  hasParentPortal: boolean;
  hasCommunityOutreach: boolean;
  hasIndustryPartners: boolean;
  partnerOrganizations: string[];
  ngoSupport: string[];
  communityContributions: string[];

  // Security & Safety
  isFenced: boolean;
  hasSecurityGuard: boolean;
  hasRecentIncidents: boolean;
  incidentDetails: string;
  hasToilets: boolean;
  hasWaterSource: boolean;

  // Accessibility
  distanceFromHQ: number;
  isAccessibleAllYear: boolean;
  isInclusive: boolean;
  servesGirls: boolean;
  servesPWDs: boolean;
  servesRefugees: boolean;
  isOnlySchoolInArea: boolean;

  // School Facilities & Environment
  permanentClassrooms: number;
  semiPermanentClassrooms: number;
  temporaryClassrooms: number;
  pupilClassroomRatio: number;
  boysToilets: number;
  girlsToilets: number;
  staffToilets: number;
  waterAccess: "Borehole" | "Tap" | "Rainwater" | "None";
  securityInfrastructure: string[];
  schoolAccessibility: "All-Weather" | "Seasonal" | "Remote";
  nearbyHealthFacility: string;
  healthFacilityDistance: number;

  // Performance
  plePassRateYear1: number;
  plePassRateYear2: number;
  plePassRateYear3: number;
  literacyTrends: string;
  numeracyTrends: string;
  innovations: string;
  uniqueAchievements: string;
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  school,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basic: true,
    infrastructure: false,
    connectivity: false,
    software: false,
    humanCapacity: false,
    pedagogical: false,
    governance: false,
    studentEngagement: false,
    community: false,
    security: false,
    accessibility: false,
    facilities: false,
    performance: false,
  });

  const [formData, setFormData] = useState<FormData>({
    // Basic Information
    name: "",
    region: "central",
    district: "",
    subCounty: "",
    latitude: 0,
    longitude: 0,
    type: "Public",
    environment: "Urban",
    emisNumber: "",
    upiCode: "",
    ownershipType: "Government",
    schoolCategory: "Mixed",
    signatureProgram: "",
    yearEstablished: new Date().getFullYear(),

    // Enrollment
    totalStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,

    // Contact Information
    headTeacher: "",
    email: "",
    phone: "",

    // ICT Infrastructure
    studentComputers: 0,
    teacherComputers: 0,
    projectors: 0,
    smartBoards: 0,
    tablets: 0,
    laptops: 0,
    hasComputerLab: false,
    labCondition: "Fair",
    powerBackup: [],
    hasICTRoom: false,
    hasElectricity: false,
    hasSecureRoom: false,
    hasFurniture: false,

    // Internet Connectivity
    connectionType: "None",
    bandwidthMbps: 0,
    wifiCoverage: [],
    stability: "Low",
    hasUsagePolicy: false,
    provider: "",
    isStable: false,

    // ICT Software and Digital Resources
    hasLMS: false,
    lmsName: "",
    hasLicensedSoftware: false,
    licensedSoftware: [],
    hasProductivitySuite: false,
    productivitySuite: [],
    hasDigitalLibrary: false,
    hasLocalContent: false,
    contentSource: "",

    // Human Capacity and ICT Competency
    ictTrainedTeachers: 0,
    totalTeachers: 0,
    maleTeachers: 0,
    femaleTeachers: 0,
    p5ToP7Teachers: 0,
    supportStaff: 0,
    monthlyTrainings: 0,
    teacherCompetencyLevel: "Basic",
    hasCapacityBuilding: false,

    // Pedagogical ICT Usage
    ictIntegratedLessons: 0,
    usesICTAssessments: false,
    hasStudentProjects: false,
    usesBlendedLearning: false,
    hasAssistiveTech: false,
    digitalToolUsageFrequency: "Never",
    hasDigitalContent: false,
    hasPeerSupport: false,

    // ICT Governance and Policy
    hasICTPolicy: false,
    alignedWithNationalStrategy: true,
    hasICTCommittee: false,
    hasICTBudget: false,
    hasMonitoringSystem: false,
    hasActiveSMC: false,
    hasActivePTA: false,
    hasLocalLeaderEngagement: false,

    // Students' Digital Literacy and Engagement
    digitalLiteracyLevel: "Basic",
    hasICTClub: false,
    usesOnlinePlatforms: false,
    studentFeedbackRating: 3,
    studentsUsingDigitalContent: 0,

    // Community and Parental Engagement
    hasParentPortal: false,
    hasCommunityOutreach: false,
    hasIndustryPartners: false,
    partnerOrganizations: [],
    ngoSupport: [],
    communityContributions: [],

    // Security & Safety
    isFenced: false,
    hasSecurityGuard: false,
    hasRecentIncidents: false,
    incidentDetails: "",
    hasToilets: false,
    hasWaterSource: false,

    // Accessibility
    distanceFromHQ: 0,
    isAccessibleAllYear: false,
    isInclusive: false,
    servesGirls: true,
    servesPWDs: false,
    servesRefugees: false,
    isOnlySchoolInArea: false,

    // School Facilities & Environment
    permanentClassrooms: 0,
    semiPermanentClassrooms: 0,
    temporaryClassrooms: 0,
    pupilClassroomRatio: 0,
    boysToilets: 0,
    girlsToilets: 0,
    staffToilets: 0,
    waterAccess: "None",
    securityInfrastructure: [],
    schoolAccessibility: "All-Weather",
    nearbyHealthFacility: "",
    healthFacilityDistance: 0,

    // Performance
    plePassRateYear1: 0,
    plePassRateYear2: 0,
    plePassRateYear3: 0,
    literacyTrends: "",
    numeracyTrends: "",
    innovations: "",
    uniqueAchievements: "",
  });

  // Initialize form with existing school data
  useEffect(() => {
    if (school) {
      setFormData({
        // Basic Information
        id: school.id,
        name: school.name,
        region: school.region,
        district: school.district,
        subCounty: school.sub_county,
        latitude: school.latitude,
        longitude: school.longitude,
        type: school.type,
        environment: school.environment,
        emisNumber: school.emis_number,
        upiCode: school.upi_code,
        ownershipType: school.ownership_type,
        schoolCategory: school.school_category,
        signatureProgram: school.signature_program,
        yearEstablished: school.year_established,

        // Enrollment
        totalStudents: school.total_students,
        maleStudents: school.male_students,
        femaleStudents: school.female_students,

        // Contact Information
        headTeacher: school.head_teacher,
        email: school.school_email,
        phone: school.school_phone,

        // ICT Infrastructure
        studentComputers: school.student_computers,
        teacherComputers: school.teacher_computers,
        projectors: school.projectors,
        smartBoards: school.smart_boards,
        tablets: school.tablets,
        laptops: school.laptops,
        hasComputerLab: school.has_computer_lab,
        labCondition: school.lab_condition,
        powerBackup: school.power_backup,
        hasICTRoom: school.has_ict_room,
        hasElectricity: school.has_electricity,
        hasSecureRoom: school.has_secure_room,
        hasFurniture: school.has_furniture,

        // Internet Connectivity
        connectionType: school.connection_type,
        bandwidthMbps: school.bandwidth_mbps,
        wifiCoverage: school.wifi_coverage,
        stability: school.stability,
        hasUsagePolicy: school.has_usage_policy,
        provider: school.provider,
        isStable: school.is_stable,

        // ICT Software and Digital Resources
        hasLMS: school.has_lms,
        lmsName: school.lms_name,
        hasLicensedSoftware: school.has_licensed_software,
        licensedSoftware: school.licensed_software,
        hasProductivitySuite: school.has_productivity_suite,
        productivitySuite: school.productivity_suite,
        hasDigitalLibrary: school.has_digital_library,
        hasLocalContent: school.has_local_content,
        contentSource: school.content_source,

        // Human Capacity and ICT Competency
        ictTrainedTeachers: school.ict_trained_teachers,
        totalTeachers: school.total_teachers,
        maleTeachers: school.male_teachers,
        femaleTeachers: school.female_teachers,
        p5ToP7Teachers: school.p5_to_p7_teachers,
        supportStaff: school.support_staff,
        monthlyTrainings: school.monthly_trainings,
        teacherCompetencyLevel: school.teacher_competency_level,
        hasCapacityBuilding: school.has_capacity_building,

        // Pedagogical ICT Usage
        ictIntegratedLessons: school.ict_integrated_lessons,
        usesICTAssessments: school.uses_ict_assessments,
        hasStudentProjects: school.has_student_projects,
        usesBlendedLearning: school.uses_blended_learning,
        hasAssistiveTech: school.has_assistive_tech,
        digitalToolUsageFrequency: school.digital_tool_usage_frequency,
        hasDigitalContent: school.has_digital_content,
        hasPeerSupport: school.has_peer_support,

        // ICT Governance and Policy
        hasICTPolicy: school.has_ict_policy,
        alignedWithNationalStrategy: school.aligned_with_national_strategy,
        hasICTCommittee: school.has_ict_committee,
        hasICTBudget: school.has_ict_budget,
        hasMonitoringSystem: school.has_monitoring_system,
        hasActiveSMC: school.has_active_smc,
        hasActivePTA: school.has_active_pta,
        hasLocalLeaderEngagement: school.has_local_leader_engagement,

        // Students' Digital Literacy and Engagement
        digitalLiteracyLevel: school.digital_literacy_level,
        hasICTClub: school.has_ict_club,
        usesOnlinePlatforms: school.uses_online_platforms,
        studentFeedbackRating: school.student_feedback_rating,
        studentsUsingDigitalContent: school.students_using_digital_content,

        // Community and Parental Engagement
        hasParentPortal: school.has_parent_portal,
        hasCommunityOutreach: school.has_community_outreach,
        hasIndustryPartners: school.has_industry_partners,
        partnerOrganizations: school.partner_organizations,
        ngoSupport: school.ngo_support,
        communityContributions: school.community_contributions,

        // Security & Safety
        isFenced: school.is_fenced,
        hasSecurityGuard: school.has_security_guard,
        hasRecentIncidents: school.has_recent_incidents,
        incidentDetails: school.incident_details,
        hasToilets: school.has_toilets,
        hasWaterSource: school.has_water_source,

        // Accessibility
        distanceFromHQ: school.distance_from_hq,
        isAccessibleAllYear: school.is_accessible_all_year,
        isInclusive: school.is_inclusive,
        servesGirls: school.serves_girls,
        servesPWDs: school.serves_pwds,
        servesRefugees: school.serves_refugees,
        isOnlySchoolInArea: school.is_only_school_in_area,

        // School Facilities & Environment
        permanentClassrooms: school.permanent_classrooms,
        semiPermanentClassrooms: school.semi_permanent_classrooms,
        temporaryClassrooms: school.temporary_classrooms,
        pupilClassroomRatio: school.pupil_classroom_ratio,
        boysToilets: school.boys_toilets,
        girlsToilets: school.girls_toilets,
        staffToilets: school.staff_toilets,
        waterAccess: school.water_access,
        securityInfrastructure: school.security_infrastructure,
        schoolAccessibility: school.school_accessibility,
        nearbyHealthFacility: school.nearby_health_facility,
        healthFacilityDistance: school.health_facility_distance,

        // Performance
        plePassRateYear1: school.ple_pass_rate_year1,
        plePassRateYear2: school.ple_pass_rate_year2,
        plePassRateYear3: school.ple_pass_rate_year3,
        literacyTrends: school.literacy_trends,
        numeracyTrends: school.numeracy_trends,
        innovations: school.innovations,
        uniqueAchievements: school.unique_achievements,
      });
    }
  }, [school]);

  // Auto-calculate total students
  useEffect(() => {
    const total = formData.maleStudents + formData.femaleStudents;
    if (total !== formData.totalStudents) {
      setFormData((prev) => ({ ...prev, totalStudents: total }));
    }
  }, [formData.maleStudents, formData.femaleStudents]);

  // Auto-calculate total teachers
  useEffect(() => {
    const total = formData.maleTeachers + formData.femaleTeachers;
    if (total !== formData.totalTeachers) {
      setFormData((prev) => ({ ...prev, totalTeachers: total }));
    }
  }, [formData.maleTeachers, formData.femaleTeachers]);

  // Auto-calculate pupil classroom ratio
  useEffect(() => {
    const totalClassrooms =
      formData.permanentClassrooms +
      formData.semiPermanentClassrooms +
      formData.temporaryClassrooms;
    if (totalClassrooms > 0 && formData.totalStudents > 0) {
      const ratio =
        Math.round((formData.totalStudents / totalClassrooms) * 10) / 10;
      if (ratio !== formData.pupilClassroomRatio) {
        setFormData((prev) => ({ ...prev, pupilClassroomRatio: ratio }));
      }
    }
  }, [
    formData.totalStudents,
    formData.permanentClassrooms,
    formData.semiPermanentClassrooms,
    formData.temporaryClassrooms,
  ]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: keyof FormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      }
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const schoolData: Omit<School, "id"> & { id?: string } = {
        ...(school?.id && { id: school.id }),
        id: formData.id,
        name: formData.name,
        region: formData.region,
        district: formData.district,
        subCounty: formData.subCounty,
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        type: formData.type,
        environment: formData.environment,
        emisNumber: formData.emisNumber,
        upiCode: formData.upiCode,
        ownershipType: formData.ownershipType,
        schoolCategory: formData.schoolCategory,
        signatureProgram: formData.signatureProgram,
        yearEstablished: formData.yearEstablished,
        enrollmentData: {
          totalStudents: formData.totalStudents,
          maleStudents: formData.maleStudents,
          femaleStudents: formData.femaleStudents,
        },
        contactInfo: {
          headTeacher: formData.headTeacher,
          email: formData.email,
          phone: formData.phone,
        },
        infrastructure: {
          studentComputers: formData.studentComputers,
          teacherComputers: formData.teacherComputers,
          projectors: formData.projectors,
          smartBoards: formData.smartBoards,
          tablets: formData.tablets,
          laptops: formData.laptops,
          hasComputerLab: formData.hasComputerLab,
          labCondition: formData.labCondition,
          powerBackup: formData.powerBackup,
          hasICTRoom: formData.hasICTRoom,
          hasElectricity: formData.hasElectricity,
          hasSecureRoom: formData.hasSecureRoom,
          hasFurniture: formData.hasFurniture,
        },
        internet: {
          connectionType: formData.connectionType,
          bandwidthMbps: formData.bandwidthMbps,
          wifiCoverage: formData.wifiCoverage,
          stability: formData.stability,
          hasUsagePolicy: formData.hasUsagePolicy,
          provider: formData.provider,
          isStable: formData.isStable,
        },
        software: {
          hasLMS: formData.hasLMS,
          lmsName: formData.lmsName,
          hasLicensedSoftware: formData.hasLicensedSoftware,
          licensedSoftware: formData.licensedSoftware,
          hasProductivitySuite: formData.hasProductivitySuite,
          productivitySuite: formData.productivitySuite,
          hasDigitalLibrary: formData.hasDigitalLibrary,
          hasLocalContent: formData.hasLocalContent,
          contentSource: formData.contentSource,
        },
        humanCapacity: {
          ictTrainedTeachers: formData.ictTrainedTeachers,
          totalTeachers: formData.totalTeachers,
          maleTeachers: formData.maleTeachers,
          femaleTeachers: formData.femaleTeachers,
          p5ToP7Teachers: formData.p5ToP7Teachers,
          supportStaff: formData.supportStaff,
          monthlyTrainings: formData.monthlyTrainings,
          teacherCompetencyLevel: formData.teacherCompetencyLevel,
          hasCapacityBuilding: formData.hasCapacityBuilding,
        },
        pedagogicalUsage: {
          ictIntegratedLessons: formData.ictIntegratedLessons,
          usesICTAssessments: formData.usesICTAssessments,
          hasStudentProjects: formData.hasStudentProjects,
          usesBlendedLearning: formData.usesBlendedLearning,
          hasAssistiveTech: formData.hasAssistiveTech,
          digitalToolUsageFrequency: formData.digitalToolUsageFrequency,
          hasDigitalContent: formData.hasDigitalContent,
          hasPeerSupport: formData.hasPeerSupport,
        },
        governance: {
          hasICTPolicy: formData.hasICTPolicy,
          alignedWithNationalStrategy: formData.alignedWithNationalStrategy,
          hasICTCommittee: formData.hasICTCommittee,
          hasICTBudget: formData.hasICTBudget,
          hasMonitoringSystem: formData.hasMonitoringSystem,
          hasActiveSMC: formData.hasActiveSMC,
          hasActivePTA: formData.hasActivePTA,
          hasLocalLeaderEngagement: formData.hasLocalLeaderEngagement,
        },
        studentEngagement: {
          digitalLiteracyLevel: formData.digitalLiteracyLevel,
          hasICTClub: formData.hasICTClub,
          usesOnlinePlatforms: formData.usesOnlinePlatforms,
          studentFeedbackRating: formData.studentFeedbackRating,
          studentsUsingDigitalContent: formData.studentsUsingDigitalContent,
        },
        communityEngagement: {
          hasParentPortal: formData.hasParentPortal,
          hasCommunityOutreach: formData.hasCommunityOutreach,
          hasIndustryPartners: formData.hasIndustryPartners,
          partnerOrganizations: formData.partnerOrganizations,
          ngoSupport: formData.ngoSupport,
          communityContributions: formData.communityContributions,
        },
        security: {
          isFenced: formData.isFenced,
          hasSecurityGuard: formData.hasSecurityGuard,
          hasRecentIncidents: formData.hasRecentIncidents,
          incidentDetails: formData.incidentDetails,
          hasToilets: formData.hasToilets,
          hasWaterSource: formData.hasWaterSource,
        },
        accessibility: {
          distanceFromHQ: formData.distanceFromHQ,
          isAccessibleAllYear: formData.isAccessibleAllYear,
          isInclusive: formData.isInclusive,
          servesGirls: formData.servesGirls,
          servesPWDs: formData.servesPWDs,
          servesRefugees: formData.servesRefugees,
          isOnlySchoolInArea: formData.isOnlySchoolInArea,
        },
        schoolFacilities: {
          permanentClassrooms: formData.permanentClassrooms,
          semiPermanentClassrooms: formData.semiPermanentClassrooms,
          temporaryClassrooms: formData.temporaryClassrooms,
          pupilClassroomRatio: formData.pupilClassroomRatio,
          boysToilets: formData.boysToilets,
          girlsToilets: formData.girlsToilets,
          staffToilets: formData.staffToilets,
          waterAccess: formData.waterAccess,
          securityInfrastructure: formData.securityInfrastructure,
          schoolAccessibility: formData.schoolAccessibility,
          nearbyHealthFacility: formData.nearbyHealthFacility,
          healthFacilityDistance: formData.healthFacilityDistance,
        },
        performance: {
          plePassRateYear1: formData.plePassRateYear1,
          plePassRateYear2: formData.plePassRateYear2,
          plePassRateYear3: formData.plePassRateYear3,
          literacyTrends: formData.literacyTrends,
          numeracyTrends: formData.numeracyTrends,
          innovations: formData.innovations,
          uniqueAchievements: formData.uniqueAchievements,
        },
        lastUpdated: new Date().toISOString(),
        lastModifiedBy: user?.id || null,
      };

      // console.log("school data", schoolData);
      await onSubmit(schoolData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (
    key: string,
    title: string,
    icon: React.ComponentType<any>,
    children: React.ReactNode
  ) => {
    const IconComponent = icon;
    const isExpanded = expandedSections[key];

    return (
      <Card key={key} className="mb-6">
        <button
          type="button"
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        >
          <div className="flex items-center">
            <IconComponent className="h-5 w-5 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children}
            </div>
          </div>
        )}
      </Card>
    );
  };

  const renderInput = (
    label: string,
    field: keyof FormData,
    type: string = "text",
    options?: { value: string; label: string }[],
    required: boolean = false,
    placeholder?: string,
    min?: number,
    max?: number,
    step?: number,
    read_only: boolean = false
  ) => {
    const value = formData[field];

    if (type === "select" && options) {
      return (
        <div className="form-group">
          <label className="form-label">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <select
            className="form-select"
            value={value as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            required={required}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === "checkbox") {
      return (
        <div className="form-group">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={value as boolean}
              onChange={(e) => handleInputChange(field, e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">{label}</span>
          </label>
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <div className="form-group lg:col-span-3">
          <label className="form-label">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            className="form-input"
            value={value as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={3}
          />
        </div>
      );
    }

    return (
      <div className="form-group">
        <label className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          className="form-input"
          value={value as string | number}
          onChange={(e) => {
            const newValue =
              type === "number" ? Number(e.target.value) : e.target.value;
            handleInputChange(field, newValue);
          }}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          readOnly={read_only}
        />
      </div>
    );
  };

  const renderCheckboxGroup = (
    label: string,
    field: keyof FormData,
    options: string[]
  ) => {
    const selectedValues = formData[field] as string[];

    return (
      <div className="form-group lg:col-span-3">
        <label className="form-label">{label}</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {options.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedValues.includes(option)}
                onChange={(e) =>
                  handleArrayChange(field, option, e.target.checked)
                }
              />
              <span className="ml-2 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title={school ? "Edit School" : "Add New School"}
        description="Complete school information based on ICT Observatory indicators"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        {renderSection(
          "basic",
          "Basic Information",
          SchoolIcon,
          <>
            {renderInput(
              "School Name",
              "name",
              "text",
              undefined,
              true,
              "Enter school name"
            )}
            {renderInput(
              "Region",
              "region",
              "select",
              [
                { value: "central", label: "Central" },
                { value: "western", label: "Western" },
                { value: "eastern", label: "Eastern" },
                { value: "northern", label: "Northern" },
                { value: "west_nile", label: "West Nile" },
              ],
              true,
              "Enter region"
            )}
            {renderInput(
              "District",
              "district",
              "text",
              undefined,
              true,
              "Enter district"
            )}
            {renderInput(
              "Sub-County",
              "subCounty",
              "text",
              undefined,
              true,
              "Enter sub-county"
            )}
            {renderInput(
              "EMIS Number",
              "emisNumber",
              "text",
              undefined,
              false,
              "Enter EMIS number"
            )}
            {renderInput(
              "UPI Code",
              "upiCode",
              "text",
              undefined,
              false,
              "Enter UPI code"
            )}
            {renderInput(
              "School Type",
              "type",
              "select",
              [
                { value: "Public", label: "Public" },
                { value: "Private", label: "Private" },
              ],
              true
            )}
            {renderInput(
              "Environment",
              "environment",
              "select",
              [
                { value: "Urban", label: "Urban" },
                { value: "Rural", label: "Rural" },
              ],
              true
            )}
            {renderInput("Ownership Type", "ownershipType", "select", [
              { value: "Government", label: "Government" },
              { value: "Government-aided", label: "Government-aided" },
              { value: "Community", label: "Community" },
              { value: "Private", label: "Private" },
            ])}
            {renderInput("School Category", "schoolCategory", "select", [
              { value: "Mixed", label: "Mixed" },
              { value: "Girls", label: "Girls Only" },
              { value: "Boys", label: "Boys Only" },
              { value: "Special Needs", label: "Special Needs" },
            ])}
            {renderInput(
              "Year Established",
              "yearEstablished",
              "number",
              undefined,
              false,
              undefined,
              1900,
              new Date().getFullYear()
            )}
            {renderInput(
              "Signature Program",
              "signatureProgram",
              "text",
              undefined,
              false,
              "Special programs or focus areas"
            )}
            {renderInput(
              "Latitude",
              "latitude",
              "number",
              undefined,
              true,
              undefined,
              -90,
              90,
              0.000001
            )}
            {renderInput(
              "Longitude",
              "longitude",
              "number",
              undefined,
              true,
              undefined,
              -180,
              180,
              0.000001
            )}
            {renderInput(
              "Male Students",
              "maleStudents",
              "number",
              undefined,
              true,
              undefined,
              0
            )}
            {renderInput(
              "Female Students",
              "femaleStudents",
              "number",
              undefined,
              true,
              undefined,
              0
            )}
            {renderInput(
              "Total Students (Auto Calculated)",
              "totalStudents",
              "number",
              undefined,
              false,
              "Auto-calculated",
              0,
              undefined,
              undefined,
              true
            )}
            {renderInput(
              "Head Teacher",
              "headTeacher",
              "text",
              undefined,
              true,
              "Enter head teacher name"
            )}
            {renderInput(
              "Email",
              "email",
              "email",
              undefined,
              true,
              "Enter school email"
            )}
            {renderInput(
              "Phone",
              "phone",
              "tel",
              undefined,
              true,
              "Enter school phone number"
            )}
          </>
        )}

        {/* ICT Infrastructure */}
        {renderSection(
          "infrastructure",
          "ICT Infrastructure",
          Monitor,
          <>
            {renderInput(
              "Student Computers",
              "studentComputers",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Teacher Computers",
              "teacherComputers",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Multimedia Projectors",
              "projectors",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Smart Boards",
              "smartBoards",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Tablets",
              "tablets",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Laptops",
              "laptops",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Has Computer Laboratory",
              "hasComputerLab",
              "checkbox"
            )}
            {renderInput("Lab Condition", "labCondition", "select", [
              { value: "Excellent", label: "Excellent" },
              { value: "Good", label: "Good" },
              { value: "Fair", label: "Fair" },
              { value: "Poor", label: "Poor" },
            ])}
            {renderInput("Has Dedicated ICT Room", "hasICTRoom", "checkbox")}
            {renderInput("Has Electricity", "hasElectricity", "checkbox")}
            {renderInput(
              "Has Secure Storage Room",
              "hasSecureRoom",
              "checkbox"
            )}
            {renderInput(
              "Has Appropriate Furniture",
              "hasFurniture",
              "checkbox"
            )}
            {renderCheckboxGroup("Power Backup Solutions", "powerBackup", [
              "Solar",
              "Generator",
              "UPS",
            ])}
          </>
        )}

        {/* Internet Connectivity */}
        {renderSection(
          "connectivity",
          "Internet Connectivity",
          Wifi,
          <>
            {renderInput("Connection Type", "connectionType", "select", [
              { value: "None", label: "No Internet" },
              { value: "Fiber", label: "Fiber Optic" },
              { value: "Mobile Broadband", label: "Mobile Broadband" },
              { value: "Satellite", label: "Satellite" },
            ])}
            {renderInput(
              "Bandwidth (Mbps)",
              "bandwidthMbps",
              "number",
              undefined,
              false,
              undefined,
              0,
              undefined,
              0.1
            )}
            {renderInput("Connection Stability", "stability", "select", [
              { value: "High", label: "High" },
              { value: "Medium", label: "Medium" },
              { value: "Low", label: "Low" },
            ])}
            {renderInput(
              "Internet Service Provider",
              "provider",
              "text",
              undefined,
              false,
              "Enter ISP name"
            )}
            {renderInput("Connection is Stable", "isStable", "checkbox")}
            {renderInput(
              "Has Internet Usage Policy",
              "hasUsagePolicy",
              "checkbox"
            )}
            {renderCheckboxGroup("Wi-Fi Coverage Areas", "wifiCoverage", [
              "Administration",
              "Classrooms",
              "Library",
              "Dormitories",
              "Staff Room",
              "Computer Lab",
            ])}
          </>
        )}

        {/* ICT Software and Digital Resources */}
        {renderSection(
          "software",
          "ICT Software and Digital Resources",
          Settings,
          <>
            {renderInput(
              "Has Learning Management System",
              "hasLMS",
              "checkbox"
            )}
            {renderInput(
              "LMS Name",
              "lmsName",
              "text",
              undefined,
              false,
              "e.g., Moodle, Google Classroom"
            )}
            {renderInput(
              "Has Licensed Educational Software",
              "hasLicensedSoftware",
              "checkbox"
            )}
            {renderInput(
              "Has Productivity Software Suite",
              "hasProductivitySuite",
              "checkbox"
            )}
            {renderInput(
              "Has Digital Library",
              "hasDigitalLibrary",
              "checkbox"
            )}
            {renderInput(
              "Has Local Digital Content",
              "hasLocalContent",
              "checkbox"
            )}
            {renderInput(
              "Content Source",
              "contentSource",
              "textarea",
              undefined,
              false,
              "Describe sources of digital content"
            )}
            {renderCheckboxGroup("Licensed Software", "licensedSoftware", [
              "Microsoft Office 365",
              "Adobe Creative Cloud",
              "Educational Games Suite",
              "Language Lab Software",
              "STEM Learning Suite",
              "Typing Tutor",
              "Digital Science Lab",
            ])}
            {renderCheckboxGroup("Productivity Suites", "productivitySuite", [
              "Microsoft Office",
              "Google Workspace",
              "LibreOffice",
              "Other",
            ])}
          </>
        )}

        {/* Human Capacity and ICT Competency */}
        {renderSection(
          "humanCapacity",
          "Human Capacity and ICT Competency",
          Users,
          <>
            {renderInput(
              "ICT-Trained Teachers",
              "ictTrainedTeachers",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Male Teachers",
              "maleTeachers",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Female Teachers",
              "femaleTeachers",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Total Teachers",
              "totalTeachers",
              "number",
              undefined,
              false,
              "Auto-calculated",
              0
            )}
            {renderInput(
              "P5-P7 Teachers",
              "p5ToP7Teachers",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "ICT Support Staff",
              "supportStaff",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Monthly ICT Training Sessions",
              "monthlyTrainings",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Teacher ICT Competency Level",
              "teacherCompetencyLevel",
              "select",
              [
                { value: "Basic", label: "Basic" },
                { value: "Intermediate", label: "Intermediate" },
                { value: "Advanced", label: "Advanced" },
              ]
            )}
            {renderInput(
              "Has Ongoing Capacity Building",
              "hasCapacityBuilding",
              "checkbox"
            )}
          </>
        )}

        {/* Pedagogical ICT Usage */}
        {renderSection(
          "pedagogical",
          "Pedagogical ICT Usage",
          BookOpen,
          <>
            {renderInput(
              "ICT-Integrated Lessons per Week",
              "ictIntegratedLessons",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Uses ICT for Assessments",
              "usesICTAssessments",
              "checkbox"
            )}
            {renderInput(
              "Students Create ICT Projects",
              "hasStudentProjects",
              "checkbox"
            )}
            {renderInput(
              "Uses Blended Learning",
              "usesBlendedLearning",
              "checkbox"
            )}
            {renderInput(
              "Has Assistive Technology",
              "hasAssistiveTech",
              "checkbox"
            )}
            {renderInput(
              "Digital Tool Usage Frequency",
              "digitalToolUsageFrequency",
              "select",
              [
                { value: "Daily", label: "Daily" },
                { value: "Weekly", label: "Weekly" },
                { value: "Rarely", label: "Rarely" },
                { value: "Never", label: "Never" },
              ]
            )}
            {renderInput(
              "Has Digital Learning Content",
              "hasDigitalContent",
              "checkbox"
            )}
            {renderInput(
              "Has Teacher Peer Support",
              "hasPeerSupport",
              "checkbox"
            )}
          </>
        )}

        {/* ICT Governance and Policy */}
        {renderSection(
          "governance",
          "ICT Governance and Policy",
          Shield,
          <>
            {renderInput("Has School ICT Policy", "hasICTPolicy", "checkbox")}
            {renderInput(
              "Aligned with National ICT Strategy",
              "alignedWithNationalStrategy",
              "checkbox"
            )}
            {renderInput(
              "Has ICT Committee/Coordinator",
              "hasICTCommittee",
              "checkbox"
            )}
            {renderInput(
              "Has ICT Budget Allocation",
              "hasICTBudget",
              "checkbox"
            )}
            {renderInput(
              "Has ICT Monitoring System",
              "hasMonitoringSystem",
              "checkbox"
            )}
            {renderInput(
              "Has Active School Management Committee",
              "hasActiveSMC",
              "checkbox"
            )}
            {renderInput(
              "Has Active Parent-Teacher Association",
              "hasActivePTA",
              "checkbox"
            )}
            {renderInput(
              "Has Local Leader Engagement",
              "hasLocalLeaderEngagement",
              "checkbox"
            )}
          </>
        )}

        {/* Students' Digital Literacy and Engagement */}
        {renderSection(
          "studentEngagement",
          "Students' Digital Literacy and Engagement",
          GraduationCap,
          <>
            {renderInput(
              "Student Digital Literacy Level",
              "digitalLiteracyLevel",
              "select",
              [
                { value: "Basic", label: "Basic" },
                { value: "Intermediate", label: "Intermediate" },
                { value: "Advanced", label: "Advanced" },
              ]
            )}
            {renderInput("Has ICT Club", "hasICTClub", "checkbox")}
            {renderInput(
              "Students Use Online Platforms",
              "usesOnlinePlatforms",
              "checkbox"
            )}
            {renderInput(
              "Student Feedback Rating (1-5)",
              "studentFeedbackRating",
              "number",
              undefined,
              false,
              undefined,
              1,
              5
            )}
            {renderInput(
              "Students Using Digital Content",
              "studentsUsingDigitalContent",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
          </>
        )}

        {/* Community and Parental Engagement */}
        {renderSection(
          "community",
          "Community and Parental Engagement",
          Globe,
          <>
            {renderInput(
              "Has Parent Digital Portal",
              "hasParentPortal",
              "checkbox"
            )}
            {renderInput(
              "Has Community ICT Outreach",
              "hasCommunityOutreach",
              "checkbox"
            )}
            {renderInput(
              "Has Industry Partnerships",
              "hasIndustryPartners",
              "checkbox"
            )}
            {renderInput(
              "Partner Organizations",
              "partnerOrganizations",
              "textarea",
              undefined,
              false,
              "List partner organizations (one per line)"
            )}
            {renderInput(
              "NGO Support",
              "ngoSupport",
              "textarea",
              undefined,
              false,
              "List supporting NGOs (one per line)"
            )}
            {renderInput(
              "Community Contributions",
              "communityContributions",
              "textarea",
              undefined,
              false,
              "Describe community contributions"
            )}
          </>
        )}

        {/* Security & Safety */}
        {/* {renderSection('security', 'Security & Safety', Shield, (
          <>
            {renderInput('School is Fenced', 'isFenced', 'checkbox')}
            {renderInput('Has Security Guard', 'hasSecurityGuard', 'checkbox')}
            {renderInput('Has Recent Security Incidents', 'hasRecentIncidents', 'checkbox')}
            {renderInput('Incident Details', 'incidentDetails', 'textarea', undefined, false, 'Describe any security incidents')}
            {renderInput('Has Adequate Toilets', 'hasToilets', 'checkbox')}
            {renderInput('Has Water Source', 'hasWaterSource', 'checkbox')}
          </>
        ))} */}

        {/* Accessibility */}
        {renderSection(
          "accessibility",
          "Accessibility",
          MapPin,
          <>
            {renderInput(
              "Distance from HQ (km)",
              "distanceFromHQ",
              "number",
              undefined,
              false,
              undefined,
              0,
              undefined,
              0.1
            )}
            {renderInput(
              "Accessible All Year",
              "isAccessibleAllYear",
              "checkbox"
            )}
            {renderInput("Is Inclusive School", "isInclusive", "checkbox")}
            {renderInput("Serves Girls", "servesGirls", "checkbox")}
            {renderInput(
              "Serves Persons with Disabilities",
              "servesPWDs",
              "checkbox"
            )}
            {renderInput("Serves Refugees", "servesRefugees", "checkbox")}
            {renderInput(
              "Only School in Area",
              "isOnlySchoolInArea",
              "checkbox"
            )}
          </>
        )}

        {/* School Facilities & Environment */}
        {renderSection(
          "facilities",
          "School Facilities & Environment",
          Building,
          <>
            {renderInput(
              "Permanent Classrooms",
              "permanentClassrooms",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Semi-Permanent Classrooms",
              "semiPermanentClassrooms",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Temporary Classrooms",
              "temporaryClassrooms",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Pupil-Classroom Ratio",
              "pupilClassroomRatio",
              "number",
              undefined,
              false,
              "Auto-calculated",
              0,
              undefined,
              0.1
            )}
            {renderInput(
              "Boys Toilets",
              "boysToilets",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Girls Toilets",
              "girlsToilets",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput(
              "Staff Toilets",
              "staffToilets",
              "number",
              undefined,
              false,
              undefined,
              0
            )}
            {renderInput("Water Access", "waterAccess", "select", [
              { value: "None", label: "No Water Access" },
              { value: "Borehole", label: "Borehole" },
              { value: "Tap", label: "Tap Water" },
              { value: "Rainwater", label: "Rainwater Harvesting" },
            ])}
            {renderInput(
              "School Accessibility",
              "schoolAccessibility",
              "select",
              [
                { value: "All-Weather", label: "All-Weather Road" },
                { value: "Seasonal", label: "Seasonal Access" },
                { value: "Remote", label: "Remote/Difficult Access" },
              ]
            )}
            {renderInput(
              "Nearby Health Facility",
              "nearbyHealthFacility",
              "text",
              undefined,
              false,
              "Name of nearest health facility"
            )}
            {renderInput(
              "Health Facility Distance (km)",
              "healthFacilityDistance",
              "number",
              undefined,
              false,
              undefined,
              0,
              undefined,
              0.1
            )}
            {renderCheckboxGroup(
              "Security Infrastructure",
              "securityInfrastructure",
              [
                "Perimeter Wall",
                "Fence",
                "Security Guard",
                "CCTV",
                "Lighting",
                "None",
              ]
            )}
          </>
        )}

        {/* Performance */}
        {renderSection(
          "performance",
          "Performance",
          TrendingUp,
          <>
            {renderInput(
              "PLE Pass Rate Year 1 (%)",
              "plePassRateYear1",
              "number",
              undefined,
              false,
              undefined,
              0,
              100,
              0.1
            )}
            {renderInput(
              "PLE Pass Rate Year 2 (%)",
              "plePassRateYear2",
              "number",
              undefined,
              false,
              undefined,
              0,
              100,
              0.1
            )}
            {renderInput(
              "PLE Pass Rate Year 3 (%)",
              "plePassRateYear3",
              "number",
              undefined,
              false,
              undefined,
              0,
              100,
              0.1
            )}
            {renderInput(
              "Literacy Trends",
              "literacyTrends",
              "textarea",
              undefined,
              false,
              "Describe literacy performance trends"
            )}
            {renderInput(
              "Numeracy Trends",
              "numeracyTrends",
              "textarea",
              undefined,
              false,
              "Describe numeracy performance trends"
            )}
            {renderInput(
              "Innovations",
              "innovations",
              "textarea",
              undefined,
              false,
              "Describe school innovations and initiatives"
            )}
            {renderInput(
              "Unique Achievements",
              "uniqueAchievements",
              "textarea",
              undefined,
              false,
              "Describe unique achievements and awards"
            )}
          </>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {school ? "Update School" : "Create School"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchoolForm;

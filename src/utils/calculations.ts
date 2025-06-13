/**
 * Utility functions for ICT Observatory calculations
 */

import { School, ICTReport } from '../types';

/**
 * Calculates ICT readiness level based on the latest ICT report
 * @param reports Array of ICT reports for a school
 * @returns An object containing the readiness level and score
 */
export const calculateICTReadinessLevel = (reports: ICTReport[]): { level: 'Low' | 'Medium' | 'High', score: number } => {
  if (!reports || reports.length === 0) {
    return { level: 'Low', score: 0 };
  }

  // Get the most recent report
  const sortedReports = [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestReport = sortedReports[0];

  // Calculate a score based on various factors (simplified scoring system)
  let score = 0;
  
  // Infrastructure score (0-40 points)
  const computerRatio = latestReport.infrastructure.computers / 100; // Assuming ideal is 100 computers
  score += Math.min(15, Math.round(computerRatio * 15)); // Max 15 points for computers
  
  // Internet score (0-10 points)
  if (latestReport.infrastructure.internetConnection === 'Fast') score += 10;
  else if (latestReport.infrastructure.internetConnection === 'Medium') score += 7;
  else if (latestReport.infrastructure.internetConnection === 'Slow') score += 3;
  
  // Power backup (0-5 points)
  if (latestReport.infrastructure.powerBackup) score += 5;
  
  // Usage score (0-25 points)
  const teacherICTRatio = latestReport.usage.teachersUsingICT / latestReport.usage.totalTeachers;
  score += Math.min(10, Math.round(teacherICTRatio * 10)); // Max 10 points for teacher ICT usage
  
  score += Math.min(5, Math.round(latestReport.usage.weeklyComputerLabHours / 10)); // Max 5 points for lab hours
  
  score += Math.min(10, Math.round(latestReport.usage.studentDigitalLiteracyRate / 10)); // Max 10 points for literacy rate
  
  // Capacity score (0-20 points)
  const teacherTrainingRatio = latestReport.capacity.ictTrainedTeachers / latestReport.usage.totalTeachers;
  score += Math.min(15, Math.round(teacherTrainingRatio * 15)); // Max 15 points for trained teachers
  
  score += Math.min(5, latestReport.capacity.supportStaff * 2.5); // 2.5 points per support staff, max 5 points

  // Determine level based on score
  let level: 'Low' | 'Medium' | 'High';
  if (score < 30) level = 'Low';
  else if (score < 60) level = 'Medium';
  else level = 'High';
  
  return { level, score };
};

/**
 * Gets the latest ICT report for a school
 * @param schoolId The school ID
 * @param reports Array of all ICT reports
 * @returns The latest ICT report for the school or undefined if none exists
 */
export const getLatestReport = (schoolId: string, reports: ICTReport[]): ICTReport | undefined => {
  const schoolReports = reports.filter(report => report.schoolId === schoolId);
  if (schoolReports.length === 0) return undefined;
  
  return schoolReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
};

/**
 * Gets all reports for a school
 * @param schoolId The school ID
 * @param reports Array of all ICT reports
 * @returns Array of ICT reports for the school
 */
export const getSchoolReports = (schoolId: string, reports: ICTReport[]): ICTReport[] => {
  return reports
    .filter(report => report.schoolId === schoolId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates summary statistics for all schools
 */
export const calculateSummaryStats = (schools: School[], reports: ICTReport[]) => {
  const latestReportsMap = new Map<string, ICTReport>();
  
  // Get latest report for each school
  schools.forEach(school => {
    const latestReport = getLatestReport(school.id, reports);
    if (latestReport) {
      latestReportsMap.set(school.id, latestReport);
    }
  });
  
  // Calculate statistics
  const totalSchools = schools.length;
  let schoolsWithInternet = 0;
  let totalComputers = 0;
  const schoolReadinessScores: { schoolId: string; name: string; score: number }[] = [];
  
  // District distribution
  const districtDistribution = new Map<string, number>();
  const environmentDistribution = { urban: 0, rural: 0 };
  
  schools.forEach(school => {
    const report = latestReportsMap.get(school.id);
    
    // Internet access
    if (report && report.infrastructure.internetConnection !== 'None') {
      schoolsWithInternet++;
    }
    
    // Total computers
    if (report) {
      totalComputers += report.infrastructure.computers;
    }
    
    // Readiness scores
    const { score } = calculateICTReadinessLevel(reports.filter(r => r.schoolId === school.id));
    schoolReadinessScores.push({
      schoolId: school.id,
      name: school.name,
      score
    });
    
    // District distribution
    if (districtDistribution.has(school.district)) {
      districtDistribution.set(
        school.district,
        districtDistribution.get(school.district)! + 1
      );
    } else {
      districtDistribution.set(school.district, 1);
    }
    
    // Environment distribution
    if (school.environment === 'Urban') {
      environmentDistribution.urban++;
    } else {
      environmentDistribution.rural++;
    }
  });
  
  // Sort schools by readiness score
  const topSchools = [...schoolReadinessScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  return {
    totalSchools,
    schoolsWithInternetPercent: (schoolsWithInternet / totalSchools) * 100,
    averageComputers: totalSchools > 0 ? totalComputers / totalSchools : 0,
    topSchools,
    districtDistribution: Object.fromEntries(districtDistribution),
    environmentDistribution
  };
};
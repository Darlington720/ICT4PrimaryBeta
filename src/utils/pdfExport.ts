import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { School, ICTReport } from '../types';

export const exportReportToPDF = (school: School, report: ICTReport) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text('Periodic Observation Report', 20, 25);

  // School Information
  doc.setFontSize(14);
  doc.text('School Information', 20, 45);
  doc.setFontSize(10);
  doc.text(`School Name: ${school.name}`, 20, 55);
  doc.text(`District: ${school.district}`, 20, 62);
  doc.text(`Sub-County: ${school.subCounty}`, 20, 69);
  doc.text(`Type: ${school.type}`, 20, 76);
  doc.text(`Environment: ${school.environment}`, 20, 83);
  doc.text(`Observation Period: ${report.period}`, 20, 90);
  doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 20, 97);

  // Section 1: School Snapshot
  doc.setFontSize(12);
  doc.text('Section 1: School Snapshot', 20, 115);
  
  const snapshotData = [
    ['Field', 'Value'],
    ['EMIS Number', school.emisNumber || 'N/A'],
    ['Total Enrollment', school.enrollmentData.totalStudents.toString()],
    ['Total Teachers', school.humanCapacity.totalTeachers.toString()],
    ['Observation Date', new Date(report.date).toLocaleDateString()],
    ['Period', report.period]
  ];

  autoTable(doc, {
    startY: 120,
    head: [snapshotData[0]],
    body: snapshotData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 20, right: 20 }
  });

  // Section 2: Infrastructure Status
  doc.setFontSize(12);
  doc.text('Section 2: Infrastructure & Device Status', 20, doc.lastAutoTable.finalY + 15);

  const infrastructureData = [
    ['Device Type', 'Total Available', 'Working', 'Status'],
    ['Computers/Laptops', report.infrastructure.computers.toString(), 
     report.infrastructure.functionalDevices.toString(), 
     report.infrastructure.functionalDevices > 0 ? 'Operational' : 'Needs Attention'],
    ['Projectors', report.infrastructure.projectors.toString(), 
     report.infrastructure.projectors.toString(), 'Operational'],
    ['Internet Connection', report.infrastructure.internetConnection, 
     report.infrastructure.internetConnection !== 'None' ? 'Available' : 'Not Available',
     report.infrastructure.internetConnection !== 'None' ? 'Working' : 'Not Working'],
    ['Power Backup', report.infrastructure.powerBackup ? 'Yes' : 'No', 
     report.infrastructure.powerBackup ? 'Available' : 'Not Available',
     report.infrastructure.powerBackup ? 'Functional' : 'Not Available']
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [infrastructureData[0]],
    body: infrastructureData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 20, right: 20 }
  });

  // Section 3: Teaching & Learning Activity
  doc.setFontSize(12);
  doc.text('Section 3: Teaching & Learning Activity', 20, doc.lastAutoTable.finalY + 15);

  const teachingData = [
    ['Metric', 'Value', 'Assessment'],
    ['Teachers Using ICT', `${report.usage.teachersUsingICT} of ${report.usage.totalTeachers}`,
     `${Math.round((report.usage.teachersUsingICT / report.usage.totalTeachers) * 100)}%`],
    ['Weekly Computer Lab Hours', report.usage.weeklyComputerLabHours.toString(), 
     report.usage.weeklyComputerLabHours >= 10 ? 'Good' : 'Needs Improvement'],
    ['Student Digital Literacy Rate', `${report.usage.studentDigitalLiteracyRate}%`,
     report.usage.studentDigitalLiteracyRate >= 60 ? 'Good' : 'Needs Improvement'],
    ['ICT-Trained Teachers', `${report.capacity.ictTrainedTeachers} of ${report.usage.totalTeachers}`,
     `${Math.round((report.capacity.ictTrainedTeachers / report.usage.totalTeachers) * 100)}%`],
    ['Support Staff', report.capacity.supportStaff.toString(),
     report.capacity.supportStaff > 0 ? 'Available' : 'Not Available']
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [teachingData[0]],
    body: teachingData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 20, right: 20 }
  });

  // Section 4: Internet & Content
  doc.setFontSize(12);
  doc.text('Section 4: Internet & Content', 20, doc.lastAutoTable.finalY + 15);

  const internetData = [
    ['Category', 'Status', 'Details'],
    ['Internet Connection', report.infrastructure.internetConnection,
     report.infrastructure.internetConnection !== 'None' ? 
     `${report.infrastructure.internetSpeedMbps} Mbps` : 'No internet access'],
    ['Content Sources', report.software.educationalSoftware.length > 0 ? 
     report.software.educationalSoftware.join(', ') : 'No educational software reported',
     report.software.educationalSoftware.length > 0 ? 'Available' : 'Limited'],
    ['Office Applications', report.software.officeApplications ? 'Available' : 'Not Available',
     report.software.officeApplications ? 'Functional' : 'Needs Installation'],
    ['Operating Systems', report.software.operatingSystems.join(', '), 'Installed']
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [internetData[0]],
    body: internetData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 20, right: 20 }
  });

  // Add new page if needed
  if (doc.lastAutoTable.finalY > 250) {
    doc.addPage();
  }

  // Section 5: Key Observations & Recommendations
  const currentY = doc.lastAutoTable.finalY > 250 ? 30 : doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text('Section 5: Key Observations & Recommendations', 20, currentY);

  // Calculate ICT readiness score
  const calculateReadinessScore = () => {
    let score = 0;
    
    // Infrastructure (40 points)
    score += Math.min(15, (report.infrastructure.computers / 50) * 15);
    score += report.infrastructure.internetConnection !== 'None' ? 10 : 0;
    score += report.infrastructure.powerBackup ? 5 : 0;
    score += Math.min(10, (report.infrastructure.functionalDevices / 30) * 10);
    
    // Usage (35 points)
    score += Math.min(15, (report.usage.teachersUsingICT / report.usage.totalTeachers) * 15);
    score += Math.min(10, (report.usage.weeklyComputerLabHours / 25) * 10);
    score += Math.min(10, (report.usage.studentDigitalLiteracyRate / 100) * 10);
    
    // Capacity (25 points)
    score += Math.min(20, (report.capacity.ictTrainedTeachers / report.usage.totalTeachers) * 20);
    score += Math.min(5, report.capacity.supportStaff * 2.5);
    
    return Math.round(score);
  };

  const readinessScore = calculateReadinessScore();
  const readinessLevel = readinessScore >= 70 ? 'High' : readinessScore >= 40 ? 'Medium' : 'Low';

  const observationsData = [
    ['Assessment Area', 'Score/Status', 'Recommendation'],
    ['Overall ICT Readiness', `${readinessScore}/100 (${readinessLevel})`,
     readinessLevel === 'High' ? 'Maintain current standards' :
     readinessLevel === 'Medium' ? 'Focus on teacher training and device maintenance' :
     'Urgent need for infrastructure improvement and teacher training'],
    ['Infrastructure Status', 
     `${report.infrastructure.functionalDevices} functional devices`,
     report.infrastructure.functionalDevices < 10 ? 'Increase device availability' : 'Maintain current equipment'],
    ['Teacher ICT Usage', 
     `${Math.round((report.usage.teachersUsingICT / report.usage.totalTeachers) * 100)}%`,
     report.usage.teachersUsingICT / report.usage.totalTeachers < 0.5 ? 
     'Increase teacher training and support' : 'Continue current training programs'],
    ['Student Digital Literacy', 
     `${report.usage.studentDigitalLiteracyRate}%`,
     report.usage.studentDigitalLiteracyRate < 50 ? 
     'Implement structured digital literacy program' : 'Expand current programs'],
    ['Internet Connectivity', 
     report.infrastructure.internetConnection,
     report.infrastructure.internetConnection === 'None' ? 
     'Establish internet connection' : 'Maintain and improve connection stability']
  ];

  autoTable(doc, {
    startY: currentY + 5,
    head: [observationsData[0]],
    body: observationsData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 20, right: 20 },
    styles: { fontSize: 9 }
  });

  // Section 6: Next Steps
  doc.setFontSize(12);
  doc.text('Section 6: Immediate Action Items', 20, doc.lastAutoTable.finalY + 15);

  const actionItems = [];
  
  if (report.infrastructure.functionalDevices < 10) {
    actionItems.push(['High Priority', 'Infrastructure', 'Repair or replace non-functional devices', '30 days']);
  }
  
  if (report.usage.teachersUsingICT / report.usage.totalTeachers < 0.5) {
    actionItems.push(['High Priority', 'Training', 'Conduct teacher ICT training workshop', '60 days']);
  }
  
  if (report.infrastructure.internetConnection === 'None') {
    actionItems.push(['Medium Priority', 'Connectivity', 'Establish internet connection', '90 days']);
  }
  
  if (report.usage.studentDigitalLiteracyRate < 50) {
    actionItems.push(['Medium Priority', 'Curriculum', 'Implement digital literacy program', '120 days']);
  }
  
  if (report.capacity.supportStaff === 0) {
    actionItems.push(['Low Priority', 'Staffing', 'Assign ICT support staff', '180 days']);
  }

  if (actionItems.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Priority', 'Category', 'Action Required', 'Timeline']],
      body: actionItems,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 20, right: 20 }
    });
  } else {
    doc.setFontSize(10);
    doc.text('No immediate action items identified. School is performing well in all areas.', 20, doc.lastAutoTable.finalY + 20);
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10);
    doc.text(`Periodic Observation Report - ${school.name}`, 20, doc.internal.pageSize.height - 5);
  }

  // Save the PDF
  doc.save(`${school.name}_Periodic_Observation_${report.period.replace(' ', '_')}.pdf`);
};
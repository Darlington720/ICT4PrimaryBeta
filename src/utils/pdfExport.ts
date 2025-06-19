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
  doc.text(`Sub-County: ${school.sub_county}`, 20, 69);
  doc.text(`Type: ${school.type}`, 20, 76);
  doc.text(`Environment: ${school.environment}`, 20, 83);
  doc.text(`Observation Period: ${report.period}`, 20, 90);
  doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 20, 97);

  // Section 1: School Snapshot
  doc.setFontSize(12);
  doc.text('Section 1: School Snapshot', 20, 115);
  
  const snapshotData = [
    ['Field', 'Value'],
    ['EMIS Number', school.emis_number || 'N/A'],
    ['Total Enrollment', school.total_students.toString()],
    ['Total Teachers', school.total_teachers.toString()],
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
     report.infrastructure.functional_devices.toString(), 
     report.infrastructure.functional_devices > 0 ? 'Operational' : 'Needs Attention'],
    ['Projectors', report.infrastructure.projectors.toString(), 
     report.infrastructure.projectors.toString(), 'Operational'],
    ['Internet Connection', report.infrastructure.internet_connection, 
     report.infrastructure.internet_connection !== 'None' ? 'Available' : 'Not Available',
     report.infrastructure.internet_connection !== 'None' ? 'Working' : 'Not Working'],
    ['Power Backup', report.infrastructure.power_backup ? 'Yes' : 'No', 
     report.infrastructure.power_backup ? 'Available' : 'Not Available',
     report.infrastructure.power_backup ? 'Functional' : 'Not Available']
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
    ['Teachers Using ICT', `${report.usage.teachers_using_ict} of ${report.usage.total_teachers}`,
     `${Math.round((report.usage.teachers_using_ict / report.usage.total_teachers) * 100)}%`],
    ['Weekly Computer Lab Hours', report.usage.weekly_computer_lab_hours.toString(), 
     report.usage.weekly_computer_lab_hours >= 10 ? 'Good' : 'Needs Improvement'],
    ['Student Digital Literacy Rate', `${report.usage.student_digital_literacy_rate}%`,
     report.usage.student_digital_literacy_rate >= 60 ? 'Good' : 'Needs Improvement'],
    ['ICT-Trained Teachers', `${report.capacity.ict_trained_teachers} of ${report.usage.total_teachers}`,
     `${Math.round((report.capacity.ict_trained_teachers / report.usage.total_teachers) * 100)}%`],
    ['Support Staff', report.capacity.support_staff.toString(),
     report.capacity.support_staff > 0 ? 'Available' : 'Not Available']
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
    ['Internet Connection', report.infrastructure.internet_connection,
     report.infrastructure.internet_connection !== 'None' ? 
     `${report.infrastructure.internet_speed_mbps} Mbps` : 'No internet access'],
    ['Content Sources', report.software.educational_software.length > 0 ? 
     report.software.educational_software.join(', ') : 'No educational software reported',
     report.software.educational_software.length > 0 ? 'Available' : 'Limited'],
    ['Office Applications', report.software.office_applications ? 'Available' : 'Not Available',
     report.software.office_applications ? 'Functional' : 'Needs Installation'],
    ['Operating Systems', report.software.operating_systems.join(', '), 'Installed']
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
    score += report.infrastructure.internet_connection !== 'None' ? 10 : 0;
    score += report.infrastructure.power_backup ? 5 : 0;
    score += Math.min(10, (report.infrastructure.functional_devices / 30) * 10);
    
    // Usage (35 points)
    score += Math.min(15, (report.usage.teachers_using_ict / report.usage.total_teachers) * 15);
    score += Math.min(10, (report.usage.weekly_computer_lab_hours / 25) * 10);
    score += Math.min(10, (report.usage.student_digital_literacy_rate / 100) * 10);
    
    // Capacity (25 points)
    score += Math.min(20, (report.capacity.ict_trained_teachers / report.usage.total_teachers) * 20);
    score += Math.min(5, report.capacity.support_staff * 2.5);
    
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
     `${report.infrastructure.functional_devices} functional devices`,
     report.infrastructure.functional_devices < 10 ? 'Increase device availability' : 'Maintain current equipment'],
    ['Teacher ICT Usage', 
     `${Math.round((report.usage.teachers_using_ict / report.usage.total_teachers) * 100)}%`,
     report.usage.teachers_using_ict / report.usage.total_teachers < 0.5 ? 
     'Increase teacher training and support' : 'Continue current training programs'],
    ['Student Digital Literacy', 
     `${report.usage.student_digital_literacy_rate}%`,
     report.usage.student_digital_literacy_rate < 50 ? 
     'Implement structured digital literacy program' : 'Expand current programs'],
    ['Internet Connectivity', 
     report.infrastructure.internet_connection,
     report.infrastructure.internet_connection === 'None' ? 
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
  
  if (report.infrastructure.functional_devices < 10) {
    actionItems.push(['High Priority', 'Infrastructure', 'Repair or replace non-functional devices', '30 days']);
  }
  
  if (report.usage.teachers_using_ict / report.usage.total_teachers < 0.5) {
    actionItems.push(['High Priority', 'Training', 'Conduct teacher ICT training workshop', '60 days']);
  }
  
  if (report.infrastructure.internet_connection === 'None') {
    actionItems.push(['Medium Priority', 'Connectivity', 'Establish internet connection', '90 days']);
  }
  
  if (report.usage.student_digital_literacy_rate < 50) {
    actionItems.push(['Medium Priority', 'Curriculum', 'Implement digital literacy program', '120 days']);
  }
  
  if (report.capacity.support_staff === 0) {
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project, User } from '../types';
import { calculateMaterialCost, calculateLaborCost, calculateTotalCost, calculatePhaseCost } from '../utils/calculations';
import { formatCurrency, formatDate } from '../utils/formatters';

export const generateProjectReport = (project: Project, projectManager: User) => {
  const doc = new jsPDF();
  const totalCost = calculateTotalCost(project);
  const budgetStatus = totalCost <= project.budget ? 'Within Budget' : 'Over Budget';
  
  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CiviCost - Project Cost Report', 14, 22);
  
  // Company Logo Placeholder
  doc.setDrawColor(224, 224, 224); // light gray
  doc.rect(160, 15, 35, 15);
  doc.setTextColor(150);
  doc.setFontSize(10);
  doc.text('Company Logo', 163, 24);
  doc.setTextColor(0);


  // Project Details
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(project.name, 14, 40);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project Manager: ${projectManager.name}`, 14, 48);
  doc.text(`Date Range: ${formatDate(project.startDate)} to ${formatDate(project.endDate)}`, 14, 53);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 58);


  // Summary Table
  autoTable(doc, {
    startY: 65,
    head: [['Summary', 'Amount']],
    body: [
      ['Total Budget', formatCurrency(project.budget)],
      ['Total Estimated Cost', formatCurrency(totalCost)],
      ['Remaining Budget', formatCurrency(project.budget - totalCost)],
      ['Budget Status', budgetStatus],
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  });


  // Cost Breakdown per Phase
  project.phases.forEach((phase) => {
    const lastTableY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Phase: ${phase.name}`, 14, lastTableY + 15);

    const materialData = phase.materials.map(m => [m.name, m.quantity, formatCurrency(m.unitPrice), formatCurrency(m.quantity * m.unitPrice)]);
    const laborData = phase.labor.map(l => [l.role, `${l.hours} hrs`, formatCurrency(l.rate), formatCurrency(l.hours * l.rate)]);
    
    if (materialData.length > 0) {
        autoTable(doc, {
            startY: lastTableY + 20,
            head: [['Material', 'Quantity', 'Unit Price', 'Total']],
            body: materialData,
            theme: 'striped',
            headStyles: { fillColor: [96, 165, 250] }
        });
    }

    if (laborData.length > 0) {
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 2,
            head: [['Labor Role', 'Hours', 'Hourly Rate', 'Total']],
            body: laborData,
            theme: 'striped',
            headStyles: { fillColor: [52, 211, 153] }
        });
    }
  });


  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
    doc.text(`CiviCost Report | ${project.name}`, 14, 287);
  }

  doc.save(`${project.name}_Cost_Report.pdf`);
};
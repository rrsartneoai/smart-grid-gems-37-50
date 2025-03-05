import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Company } from '@/types';

export const generatePdf = async (company: Company) => {
  const data = document.querySelector('#company-details');
  if (!data) {
    console.error('Company details element not found');
    return;
  }

  const canvas = await html2canvas(data, {
    scale: 2, // Increase scale for better resolution
  });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`${company.name}-details.pdf`);
};

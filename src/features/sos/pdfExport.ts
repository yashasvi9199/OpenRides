import { jsPDF } from 'jspdf';
import { UserProfile } from '../../shared/types';
import { formatDate } from '../../shared/utils/formatters';

/**
 * Generates and downloads a high-contrast Medical Emergency Rider Card PDF
 */
export const exportEmergencyCardPDF = (user: UserProfile): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [105, 148], // A6 pocket emergency card format
  });

  // Background Header
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(0, 0, 105, 148, 'F');

  // Emergency Top Banner
  doc.setFillColor(220, 38, 38); // Red-600
  doc.rect(0, 0, 105, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('MOTOGUARD EMERGENCY MEDICAL CARD', 52.5, 8, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('KEEP THIS SHEET IN TANK BAG / WALLET FOR FIRST RESPONDERS', 52.5, 14, { align: 'center' });

  // Rider Name & Blood Group Box
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.roundedRect(6, 22, 93, 20, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('RIDER NAME', 10, 27);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(user.name, 10, 33);

  doc.setFontSize(7);
  doc.setTextColor(56, 189, 248);
  doc.text(`${user.bikeModel} • ${user.bikeNumber}`, 10, 38);

  // Blood Group Badge (Red Box)
  doc.setFillColor(239, 68, 68);
  doc.roundedRect(68, 24, 28, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('BLOOD TYPE', 82, 28, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(user.bloodGroup.split(' ')[0] || 'O+', 82, 36, { align: 'center' });

  // Medical Section
  let y = 48;
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(6, y, 93, 36, 2, 2, 'F');

  doc.setTextColor(251, 191, 36); // Amber
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CRITICAL MEDICAL INFO', 10, y + 5);

  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.text('Known Allergies:', 10, y + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(248, 113, 113); // Red light
  doc.text(user.allergies.length > 0 ? user.allergies.join(', ') : 'None Reported', 34, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Conditions:', 10, y + 17);
  doc.text(user.medicalConditions.length > 0 ? user.medicalConditions.join(', ') : 'None', 28, y + 17);

  doc.text('Medications:', 10, y + 23);
  doc.text(user.medications.length > 0 ? user.medications.join(', ') : 'None', 30, y + 23);

  doc.text('Organ Donor:', 10, y + 29);
  doc.setTextColor(52, 211, 153);
  doc.setFont('helvetica', 'bold');
  doc.text(user.organDonor ? 'YES (Verified Donor)' : 'No', 30, y + 29);

  // Emergency Contacts Section
  y = 88;
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(6, y, 93, 40, 2, 2, 'F');

  doc.setTextColor(56, 189, 248); // Cyan
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('IN CASE OF EMERGENCY (I.C.E.) CONTACTS', 10, y + 5);

  let contactY = y + 11;
  user.emergencyContacts.slice(0, 3).forEach((contact, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`${idx + 1}. ${contact.name} (${contact.relationship})`, 10, contactY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(56, 189, 248);
    doc.text(`Phone: ${contact.phone}`, 14, contactY + 4);
    contactY += 9;
  });

  // Insurance & Footer
  y = 132;
  doc.setFillColor(15, 23, 42);
  doc.rect(6, y, 93, 12, 'F');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Insurance: ${user.insuranceCompany} | Policy: ${user.insurancePolicyNumber}`, 52.5, y + 4, { align: 'center' });
  doc.text(`Generated on ${formatDate(Date.now())} • Scan helmet QR for digital live profile`, 52.5, y + 8, { align: 'center' });

  // Save the PDF
  doc.save(`MotoGuard_Emergency_Card_${user.name.replace(/\s+/g, '_')}.pdf`);
};

import jsPDF from 'jspdf';
import {
  GENERAL_MEDICAL_QUESTIONS,
  MUSCULOSKELETAL_REGIONS,
  HEARING_QUESTIONS,
  VISION_QUESTIONS,
  DENTAL_QUESTIONS,
  PTSD_QUESTIONS,
  SERVICES,
  COMPONENTS,
  DUTY_STATUS,
  EXAM_PURPOSE,
  CLAIM_TYPES
} from './shaDbqQuestions';

const PAGE_CONFIG = {
  width: 210,
  height: 297,
  margin: 15,
  headerHeight: 20,
  footerHeight: 12
};

const FONT_SIZES = {
  title: 14,
  sectionHeader: 11,
  subsectionHeader: 10,
  question: 9,
  response: 9,
  footer: 7
};

export function exportShaDbqPdf(formData, sensitiveData, signature, signatureDate, veteranName) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let yPos = PAGE_CONFIG.margin;
  let currentPage = 1;
  const totalPages = 16;

  // Helper: Add header to each page
  const addHeader = () => {
    doc.setFontSize(FONT_SIZES.question);
    doc.setFont('helvetica', 'bold');
    doc.text('NAME', PAGE_CONFIG.margin, 10);
    doc.setFont('helvetica', 'normal');
    const name = formData?.identification?.identifier?.name || veteranName || '';
    doc.text(name || '_____________________', PAGE_CONFIG.margin + 15, 10);

    doc.setFont('helvetica', 'bold');
    doc.text('DOD ID NUMBER', PAGE_CONFIG.width - PAGE_CONFIG.margin - 45, 10);
    doc.setFont('helvetica', 'normal');
    doc.text(sensitiveData?.dodId || '_____________________', PAGE_CONFIG.width - PAGE_CONFIG.margin - 20, 10);

    doc.setDrawColor(0);
    doc.line(PAGE_CONFIG.margin, 13, PAGE_CONFIG.width - PAGE_CONFIG.margin, 13);
  };

  // Helper: Add footer
  const addFooter = () => {
    doc.setFontSize(FONT_SIZES.footer);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Separation Health Assessment (SHA) Disability Benefits Questionnaire - Part A',
      PAGE_CONFIG.margin,
      PAGE_CONFIG.height - 8
    );
    doc.text(
      `Updated on: ${new Date().toISOString().split('T')[0]}`,
      PAGE_CONFIG.width / 2,
      PAGE_CONFIG.height - 8,
      { align: 'center' }
    );
    doc.text(
      `Page ${currentPage} of ${totalPages}`,
      PAGE_CONFIG.width - PAGE_CONFIG.margin,
      PAGE_CONFIG.height - 8,
      { align: 'right' }
    );
  };

  // Helper: Check page break
  const checkPageBreak = (heightNeeded = 10) => {
    if (yPos + heightNeeded > PAGE_CONFIG.height - PAGE_CONFIG.footerHeight - 5) {
      addFooter();
      doc.addPage();
      currentPage++;
      addHeader();
      yPos = PAGE_CONFIG.headerHeight + 5;
      return true;
    }
    return false;
  };

  // Helper: Add section header
  const addSectionHeader = (title) => {
    checkPageBreak(12);
    doc.setFillColor(230, 230, 230);
    doc.rect(PAGE_CONFIG.margin, yPos - 3, PAGE_CONFIG.width - 2 * PAGE_CONFIG.margin, 7, 'F');
    doc.setFontSize(FONT_SIZES.sectionHeader);
    doc.setFont('helvetica', 'bold');
    doc.text(title, PAGE_CONFIG.margin + 2, yPos + 1);
    yPos += 10;
  };

  // Helper: Add subsection header
  const addSubsectionHeader = (title) => {
    checkPageBreak(8);
    doc.setFontSize(FONT_SIZES.subsectionHeader);
    doc.setFont('helvetica', 'bold');
    doc.text(title, PAGE_CONFIG.margin, yPos);
    yPos += 6;
  };

  // Helper: Add table row
  const addTableRow = (num, label, value) => {
    checkPageBreak(6);
    doc.setFontSize(FONT_SIZES.question);
    doc.setFont('helvetica', 'normal');
    if (num) {
      doc.text(String(num), PAGE_CONFIG.margin, yPos);
      doc.text(label, PAGE_CONFIG.margin + 8, yPos);
    } else {
      doc.text(label, PAGE_CONFIG.margin, yPos);
    }
    doc.text(value || '', PAGE_CONFIG.margin + 70, yPos);
    yPos += 5;
  };

  // Helper: Add yes/no question
  const addYesNoQuestion = (num, question, answer, explanation) => {
    checkPageBreak(answer === true ? 15 : 8);
    doc.setFontSize(FONT_SIZES.question);
    doc.setFont('helvetica', 'normal');

    const questionWidth = PAGE_CONFIG.width - 2 * PAGE_CONFIG.margin - 50;
    const lines = doc.splitTextToSize(question, questionWidth);

    doc.text(String(num), PAGE_CONFIG.margin, yPos);
    lines.forEach((line, i) => {
      doc.text(line, PAGE_CONFIG.margin + 8, yPos + (i * 4));
    });

    const checkX = PAGE_CONFIG.width - PAGE_CONFIG.margin - 35;
    doc.rect(checkX, yPos - 3, 3, 3);
    if (answer === true) doc.text('X', checkX + 0.7, yPos - 0.5);
    doc.text('Yes', checkX + 5, yPos);

    doc.rect(checkX + 18, yPos - 3, 3, 3);
    if (answer === false) doc.text('X', checkX + 18.7, yPos - 0.5);
    doc.text('No', checkX + 23, yPos);

    yPos += Math.max(lines.length * 4, 5);

    if (answer === true && explanation) {
      doc.setFont('helvetica', 'italic');
      doc.text('If yes, explain:', PAGE_CONFIG.margin + 8, yPos);
      yPos += 4;
      doc.setFont('helvetica', 'normal');
      const explainLines = doc.splitTextToSize(explanation, PAGE_CONFIG.width - 2 * PAGE_CONFIG.margin - 15);
      explainLines.forEach(line => {
        checkPageBreak(4);
        doc.text(line, PAGE_CONFIG.margin + 10, yPos);
        yPos += 3.5;
      });
    }
    yPos += 2;
  };

  // Helper: Get label from value
  const getLabel = (options, value) => {
    const option = options.find(o => o.value === value);
    return option ? option.label : value || '';
  };

  // === PAGE 1: Title and Privacy Act ===
  addHeader();

  doc.setFontSize(FONT_SIZES.title);
  doc.setFont('helvetica', 'bold');
  doc.text('SEPARATION HEALTH ASSESSMENT', PAGE_CONFIG.width / 2, yPos + 5, { align: 'center' });
  yPos += 12;

  doc.setFontSize(FONT_SIZES.subsectionHeader);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIVACY ACT STATEMENT', PAGE_CONFIG.margin, yPos);
  yPos += 5;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const privacyText = 'This statement serves to inform you of the purpose for collecting personal information. Information provided is voluntary and used to assist DoD and VA clinical examiners in assessing health status.';
  const privacyLines = doc.splitTextToSize(privacyText, PAGE_CONFIG.width - 2 * PAGE_CONFIG.margin);
  privacyLines.forEach(line => {
    doc.text(line, PAGE_CONFIG.margin, yPos);
    yPos += 3;
  });
  yPos += 5;

  // Section I - Identification
  addSectionHeader('PART A - SERVICE MEMBER IDENTIFICATION AND SELF-ASSESSMENT');
  addSectionHeader('SECTION I - IDENTIFICATION');

  // Identifier
  addSubsectionHeader('IDENTIFIER');
  const id = formData?.identification?.identifier || {};
  addTableRow(1, 'Name', id.name || veteranName || '');
  addTableRow(2, 'SSN (Social Security Number)', sensitiveData?.ssn ? `***-**-${sensitiveData.ssn.slice(-4)}` : '');
  addTableRow(3, 'DoD ID Number', sensitiveData?.dodId || '');
  addTableRow(4, 'Today\'s Date', id.assessmentDate || '');
  yPos += 3;

  // Contact Information
  addSubsectionHeader('1. CONTACT INFORMATION');
  const contact = formData?.identification?.contact || {};
  addTableRow(1, 'Current Address', contact.currentAddress || '');
  addTableRow(2, 'Work Telephone Number', contact.workPhone || '');
  addTableRow(3, 'Personal Telephone Number', contact.personalPhone || '');
  addTableRow(4, 'Government Email', contact.govEmail || '');
  addTableRow(5, 'Personal Email', contact.personalEmail || '');
  addTableRow(6, 'Preferred method(s) of contact', (contact.preferredContact || []).join(', ') || '');
  yPos += 3;

  // Personal Information
  addSubsectionHeader('2. PERSONAL INFORMATION');
  const personal = formData?.identification?.personal || {};
  addTableRow(1, 'Date of Birth (DoB)', personal.dateOfBirth || '');
  addTableRow(2, 'Age', personal.age || '');
  addTableRow(3, 'Race and Ethnicity', (personal.raceEthnicity || []).join(', ') || '');
  addTableRow(4, 'Birth Sex', personal.birthSex === 'female' ? 'Female' : personal.birthSex === 'male' ? 'Male' : '');
  yPos += 3;

  // Occupational Information
  checkPageBreak(40);
  addSubsectionHeader('3. OCCUPATIONAL INFORMATION');
  const occ = formData?.identification?.occupational || {};
  addTableRow(1, 'Service', getLabel(SERVICES, occ.service));
  addTableRow(2, 'Component', getLabel(COMPONENTS, occ.component));
  addTableRow(3, 'Duty Status', getLabel(DUTY_STATUS, occ.dutyStatus));
  addTableRow(4, 'Usual Occupation', occ.occupation || '');
  addTableRow(5, 'Military occupational code', occ.mosCode || '');
  yPos += 3;

  // Examination Information
  checkPageBreak(50);
  addSubsectionHeader('4. EXAMINATION INFORMATION');
  const exam = formData?.identification?.examination || {};
  addTableRow(1, 'Exam Date', exam.examDate || '');
  addTableRow(2, 'Purpose of Exam', getLabel(EXAM_PURPOSE, exam.purposeOfExam));
  addTableRow(3, 'Release from Active Duty Date', exam.releaseDate || '');
  addTableRow(4, 'Intend to file VA claim?', exam.intendToFile === true ? 'Yes' : exam.intendToFile === false ? 'No' : '');
  addTableRow(5, 'Claim type', getLabel(CLAIM_TYPES, exam.claimType));
  addTableRow(6, 'Filed disability claim before?', exam.hasFiledBefore === true ? 'Yes' : exam.hasFiledBefore === false ? 'No' : '');

  // === SECTION II - MEDICAL HISTORY ===
  checkPageBreak(20);
  addSectionHeader('SECTION II - REPORT OF MEDICAL HISTORY');

  // General Medical Review
  addSubsectionHeader('1. GENERAL MEDICAL REVIEW');
  const gm = formData?.medicalHistory?.generalMedical || {};

  addTableRow(1, 'Current medications', gm.currentMedications || '');
  yPos += 2;
  addTableRow(null, 'Last assessment date', gm.lastAssessmentDate || '');
  addTableRow(2, 'Overall health compared to last exam', gm.overallHealthCompared || '');
  if (gm.overallHealthExplain) {
    doc.text(`   Explanation: ${gm.overallHealthExplain}`, PAGE_CONFIG.margin + 8, yPos);
    yPos += 4;
  }
  addTableRow(3, 'Health during past month', gm.pastMonthHealth || '');

  // Add all general medical questions
  GENERAL_MEDICAL_QUESTIONS.forEach(q => {
    const answer = gm[q.id];
    if (answer) {
      addYesNoQuestion(q.num, q.text, answer.answer, answer.explanation);
    } else {
      addYesNoQuestion(q.num, q.text, null, '');
    }
  });

  // Musculoskeletal
  checkPageBreak(20);
  addSubsectionHeader('2. JOINT, SPINE, & MUSCULO-SKELETAL SYSTEM');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('During qualifying military service, have you ever experienced pain and/or injury in the following:', PAGE_CONFIG.margin, yPos);
  yPos += 5;

  const msk = formData?.medicalHistory?.musculoskeletal || {};
  MUSCULOSKELETAL_REGIONS.forEach(r => {
    const answer = msk[r.id];
    addYesNoQuestion(r.num, r.text, answer?.answer, answer?.explanation);
  });

  // Health & Wellness
  checkPageBreak(20);
  addSubsectionHeader('3. HEALTH & WELLNESS');
  const hw = formData?.medicalHistory?.healthWellness || {};
  addYesNoQuestion(1, 'Do you currently use tobacco products?', hw.usesTobacco?.answer, hw.usesTobacco?.explanation);
  addYesNoQuestion(2, 'Have you smoked at least 100 cigarettes in your entire life?', hw.smoked100Cigarettes, '');
  addTableRow(5, 'Secondhand smoke exposure', hw.secondhandSmokeExposure || '');
  addYesNoQuestion(6, 'Ongoing health concerns with drug use?', hw.drugConcerns?.answer, hw.drugConcerns?.explanation);

  // Hearing
  checkPageBreak(20);
  addSubsectionHeader('4. HEARING');
  const hearing = formData?.medicalHistory?.hearing || {};
  HEARING_QUESTIONS.forEach(q => {
    const answer = hearing[q.id];
    addYesNoQuestion(q.num, q.text, answer?.answer, answer?.explanation);
  });

  // Vision
  checkPageBreak(20);
  addSubsectionHeader('5. VISION');
  const vision = formData?.medicalHistory?.vision || {};
  VISION_QUESTIONS.forEach(q => {
    const answer = vision[q.id];
    addYesNoQuestion(q.num, q.text, answer?.answer, answer?.explanation);
  });

  // Head Injury
  checkPageBreak(20);
  addSubsectionHeader('6. HEAD INJURY');
  const hi = formData?.medicalHistory?.headInjury || {};
  addYesNoQuestion(1, 'Did you receive a jolt or blow to your head that immediately resulted in symptoms?', hi.headBlow?.answer, hi.headBlow?.explanation);
  addTableRow(2, 'Total times head injury', hi.totalHeadBlows || '');
  addYesNoQuestion(3, 'Have you experienced TBI/concussion?', hi.tbiDiagnosis?.answer, hi.tbiDiagnosis?.explanation);
  addYesNoQuestion(4, 'Prolonged symptoms not resolved?', hi.prolongedSymptoms?.answer, hi.prolongedSymptoms?.explanation);

  // Environmental/Occupational
  checkPageBreak(20);
  addSubsectionHeader('7. ENVIRONMENTAL/OCCUPATIONAL');
  const env = formData?.medicalHistory?.environmental || {};
  addYesNoQuestion(1, 'Were you exposed to occupational/environmental hazards?', env.hazardExposure?.answer === 'yes', env.hazardExposure?.explanation);
  addYesNoQuestion(2, 'Based at location with open burn pit?', env.burnPitExposure?.answer === 'yes', env.burnPitExposure?.explanation);
  addYesNoQuestion(3, 'Exposed to toxic airborne chemicals?', env.toxicAirborne?.answer === 'yes', env.toxicAirborne?.explanation);
  addYesNoQuestion(10, 'Experienced a blast or explosion?', env.blastExplosion?.answer, env.blastExplosion?.explanation);
  addYesNoQuestion(11, 'Vehicular accident/crash?', env.vehicularAccident?.answer, env.vehicularAccident?.explanation);
  addYesNoQuestion(12, 'Fragment or bullet wound?', env.fragmentWound?.answer, env.fragmentWound?.explanation);

  // Dental
  checkPageBreak(20);
  addSubsectionHeader('8. DENTAL');
  const dental = formData?.medicalHistory?.dental || {};
  DENTAL_QUESTIONS.forEach(q => {
    const answer = dental[q.id];
    addYesNoQuestion(q.num, q.text, answer?.answer, answer?.explanation);
  });

  // Women's Health (if applicable)
  const wh = formData?.medicalHistory?.womensHealth || {};
  if (!wh.notApplicable) {
    checkPageBreak(20);
    addSubsectionHeader('9. WOMEN\'S HEALTH / FEMALE REPRODUCTIVE ORGANS');
    if (wh.disorders?.length > 0) {
      addTableRow(1, 'Diagnosed disorders', wh.disorders.join(', '));
    }
    if (wh.surgeries?.length > 0) {
      addTableRow(3, 'Surgeries/injuries', wh.surgeries.join(', '));
    }
  }

  // Mental Health Screening
  checkPageBreak(30);
  addSubsectionHeader('10. MENTAL HEALTH SCREENING QUESTIONNAIRES');

  // PTSD Screen
  doc.setFontSize(FONT_SIZES.question);
  doc.setFont('helvetica', 'bold');
  doc.text('10.1. POST-TRAUMATIC STRESS DISORDER (PTSD) SCREEN', PAGE_CONFIG.margin, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'italic');
  doc.text('In the past month, have you...', PAGE_CONFIG.margin, yPos);
  yPos += 4;

  const ptsd = formData?.medicalHistory?.mentalHealth?.ptsd || {};
  PTSD_QUESTIONS.forEach((q, i) => {
    addYesNoQuestion(i + 1, q.text, ptsd[q.id], '');
  });

  // Depression Screen
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.text('10.2. DEPRESSION SCREEN', PAGE_CONFIG.margin, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'italic');
  doc.text('Over the last 2 weeks, how often have you been bothered by:', PAGE_CONFIG.margin, yPos);
  yPos += 4;

  const dep = formData?.medicalHistory?.mentalHealth?.depression || {};
  addTableRow(1, 'Little interest or pleasure in doing things?', dep.littleInterest || '');
  addTableRow(2, 'Feeling down, depressed, or hopeless?', dep.feelingDown || '');

  // Alcohol Screen
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.text('10.3. ALCOHOL USE SCREEN', PAGE_CONFIG.margin, yPos);
  yPos += 5;

  const alc = formData?.medicalHistory?.mentalHealth?.alcohol || {};
  addTableRow(1, 'How often drink alcohol in past year?', alc.drinkFrequency || '');
  addTableRow(2, 'Typical drinks per day?', alc.typicalDrinks || '');

  // Signature section
  checkPageBreak(30);
  yPos += 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Before submitting, please review your responses to ensure they are accurate and complete.', PAGE_CONFIG.margin, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.text('Signature of Service member:', PAGE_CONFIG.margin, yPos);
  doc.text(signature || '________________________________', PAGE_CONFIG.margin + 45, yPos);
  yPos += 8;
  doc.text('Date of signature:', PAGE_CONFIG.margin, yPos);
  doc.text(signatureDate || '________________________________', PAGE_CONFIG.margin + 45, yPos);

  addFooter();

  // Save the PDF
  const filename = `SHA-DBQ-PartA-${(veteranName || 'Veteran').replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

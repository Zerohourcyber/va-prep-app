// SHA DBQ Part A - Complete Question Structure
// Based on VA Separation Health Assessment DBQ Part A Self-Assessment form

export const SERVICES = [
  { value: 'army', label: 'Army' },
  { value: 'navy', label: 'Navy' },
  { value: 'marine_corps', label: 'Marine Corps' },
  { value: 'air_force', label: 'Air Force' },
  { value: 'space_force', label: 'Space Force' },
  { value: 'coast_guard', label: 'Coast Guard' },
  { value: 'other', label: 'Other' }
];

export const COMPONENTS = [
  { value: 'active_duty', label: 'Active Duty' },
  { value: 'reserve', label: 'Reserve' },
  { value: 'national_guard', label: 'National Guard' }
];

export const DUTY_STATUS = [
  { value: 'active_component', label: 'Active Component' },
  { value: 'active_duty_agr', label: 'Active Duty - Active Guard Reserve' },
  { value: 'active_duty_non_agr', label: 'Active Duty - Non-Active Guard Reserve' },
  { value: 'not_active', label: 'Not on active duty' }
];

export const EXAM_PURPOSE = [
  { value: 'separation_active', label: 'Separation from period of active service' },
  { value: 'separation_military', label: 'Separation from military service' },
  { value: 'medical_board', label: 'Medical Board' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'other', label: 'Other' }
];

export const CLAIM_TYPES = [
  { value: 'fdc', label: 'FDC (Fully Developed Claim) Program' },
  { value: 'ides', label: 'IDES (Integrated Disability Evaluation System)' },
  { value: 'bdd', label: 'BDD (Benefits Delivery at Discharge)' },
  { value: 'standard', label: 'Standard Claim Process' },
  { value: 'not_sure', label: 'Not sure' }
];

export const RACE_ETHNICITY = [
  { value: 'american_indian', label: 'American Indian or Alaska Native' },
  { value: 'asian', label: 'Asian' },
  { value: 'black', label: 'Black or African American' },
  { value: 'hispanic', label: 'Hispanic or Latino' },
  { value: 'middle_eastern', label: 'Middle Eastern or North African' },
  { value: 'native_hawaiian', label: 'Native Hawaiian or Other Pacific Islander' },
  { value: 'white', label: 'White' },
  { value: 'other', label: 'Other' },
  { value: 'choose_not', label: 'Choose not to answer' }
];

export const HEALTH_COMPARISON = [
  { value: 'same', label: 'The Same' },
  { value: 'better', label: 'Better' },
  { value: 'worse', label: 'Worse' }
];

export const FREQUENCY_OPTIONS = [
  { value: 'not_at_all', label: 'Not At All' },
  { value: 'several_days', label: 'Several Days' },
  { value: 'more_than_half', label: 'More Than Half the Days' },
  { value: 'nearly_every_day', label: 'Nearly Every Day' }
];

export const ALCOHOL_FREQUENCY = [
  { value: 'never', label: 'Never' },
  { value: 'monthly_or_less', label: 'Monthly or less' },
  { value: '2_4_monthly', label: '2-4 times a month' },
  { value: '2_3_weekly', label: '2-3 times per week' },
  { value: '4_more_weekly', label: '4 or more times a week' }
];

export const ALCOHOL_DRINKS = [
  { value: '1_2', label: '1 or 2' },
  { value: '3_4', label: '3 or 4' },
  { value: '5_6', label: '5 or 6' },
  { value: '7_9', label: '7 to 9' },
  { value: '10_more', label: '10 or more' }
];

export const BINGE_FREQUENCY = [
  { value: 'never', label: 'Never' },
  { value: 'less_than_monthly', label: 'Less than monthly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily, or almost daily' },
  { value: 'not_applicable', label: 'Not Applicable' }
];

export const SMOKE_EXPOSURE = [
  { value: 'daily', label: 'Daily' },
  { value: 'less_than_daily', label: 'Less than daily' },
  { value: 'not_at_all', label: 'Not at all' }
];

// General Medical Review Questions (Section II.1)
export const GENERAL_MEDICAL_QUESTIONS = [
  { id: 'q4_physicalProblems', num: 4, text: 'During the PAST MONTH, did you have physical health problems (illness or injury) that made it difficult for you to do your work or other regular daily activities?' },
  { id: 'q5_medicalEquipment', num: 5, text: 'Do you currently require hearing aids, special medical supplies, Continuous Positive Airway Pressure (CPAP), adaptive equipment, assistive technology devices, and/or other special accommodations?' },
  { id: 'q6_surgery', num: 6, text: 'Have you had any surgery since your last health assessment/exam? (Include privately paid elective surgeries.)' },
  { id: 'q7_surgeryRecommended', num: 7, text: 'Since your last health assessment/exam, has a health care provider recommended surgery(s) that you have not had (whether you are planning to have it or not)?' },
  { id: 'q8_civilianCare', num: 8, text: 'Since your last health assessment/exam, have you received care or treatment for any medical and/or mental health condition(s) from a CIVILIAN or NON-MILITARY facility?' },
  { id: 'q9_untreatedInjury', num: 9, text: 'Have you suffered from any injury or illness while on active duty for which you did not seek medical care (to include mental health)?' },
  { id: 'q10_allergies', num: 10, text: 'Allergies, including environmental and occupational allergies, and adverse reaction to serum, food, insect stings, or medicine.' },
  { id: 'q11_cholesterol', num: 11, text: 'High or bad cholesterol' },
  { id: 'q12_tuberculosis', num: 12, text: 'Tuberculosis' },
  { id: 'q13_coughingBlood', num: 13, text: 'Coughing up blood' },
  { id: 'q14_asthma', num: 14, text: 'Asthma' },
  { id: 'q15_bronchitis', num: 15, text: 'Bronchitis' },
  { id: 'q16_chronicCough', num: 16, text: 'Chronic cough or cough at night' },
  { id: 'q17_breathingDifficulty', num: 17, text: 'Wheezing, shortness of breath, or difficulty breathing (other than asthma)' },
  { id: 'q18_lungProblems', num: 18, text: 'Other lung problems (for example: Chronic Obstructive Pulmonary Disease (COPD), chronic bronchitis, pneumonia, emphysema)' },
  { id: 'q19_sinusitis', num: 19, text: 'Sinusitis' },
  { id: 'q20_thyroid', num: 20, text: 'Thyroid trouble or goiter' },
  { id: 'q21_entTrouble', num: 21, text: 'Ear, nose, or throat trouble' },
  { id: 'q22_heartburn', num: 22, text: 'Frequent indigestion or heartburn (reflux)' },
  { id: 'q23_stomachProblems', num: 23, text: 'Stomach or intestinal problems (for example: ulcer)' },
  { id: 'q24_kidneyProblems', num: 24, text: 'Kidney problems (for example: stones, infection)' },
  { id: 'q25_liverProblems', num: 25, text: 'Liver problems (for example: hepatitis, cirrhosis)' },
  { id: 'q26_bowelProblems', num: 26, text: 'Constipation, loose bowels, or diarrhea' },
  { id: 'q27_gallbladder', num: 27, text: 'Gallbladder trouble or gallstones' },
  { id: 'q28_hernia', num: 28, text: 'Hernia' },
  { id: 'q29_rectalDisease', num: 29, text: 'Rectal disease, hemorrhoids, or blood from rectum' },
  { id: 'q30_urinaryProblems', num: 30, text: 'Frequent or painful urination or blood in urine' },
  { id: 'q31_bloodSugar', num: 31, text: 'High or low blood sugar' },
  { id: 'q32_sugarProteinUrine', num: 32, text: 'Sugar or protein in urine' },
  { id: 'q33_diabetes', num: 33, text: 'Diabetes' },
  { id: 'q34_weightChange', num: 34, text: 'Recent unexplained gain or loss of weight' },
  { id: 'q35_headInjury', num: 35, text: 'A head injury, memory loss, or amnesia' },
  { id: 'q36_headaches', num: 36, text: 'Recurring headaches/migraines; frequent or severe headaches' },
  { id: 'q37_dizziness', num: 37, text: 'Periods of dizziness, fainting, or loss of consciousness' },
  { id: 'q38_mentalHealth', num: 38, text: 'Mental health problems (for example: depression, anxiety, Post-Traumatic Stress Disorder (PTSD), worry, or other mental health diagnosis)' },
  { id: 'q39_neurological', num: 39, text: 'Neurological problems (for example: stroke, seizures, convulsions, epilepsy, fits, tremor)' },
  { id: 'q40_paralysis', num: 40, text: 'Paralysis' },
  { id: 'q41_meningitis', num: 41, text: 'Meningitis, encephalitis, or other neurological infection or disorder' },
  { id: 'q42_rheumaticFever', num: 42, text: 'Rheumatic fever' },
  { id: 'q43_prolongedBleeding', num: 43, text: 'Prolonged bleeding' },
  { id: 'q44_bloodProblems', num: 44, text: 'Blood problems (for example: hemophilia, sickle cell disease)' },
  { id: 'q45_immuneProblems', num: 45, text: 'Immune system problems (for example: HIV, chemotherapy, radiation)' },
  { id: 'q46_angina', num: 46, text: 'Angina, also called angina pectoris' },
  { id: 'q47_heartFailure', num: 47, text: 'Congestive Heart Failure' },
  { id: 'q48_chestPain', num: 48, text: 'Pain, pressure, or discomfort in your chest' },
  { id: 'q49_palpitations', num: 49, text: 'Palpitations, pounding heart, or abnormal heartbeat' },
  { id: 'q50_heartMurmur', num: 50, text: 'Heart murmur or valve problem (for example: mitral valve prolapse)' },
  { id: 'q51_coronaryDisease', num: 51, text: 'Coronary heart disease' },
  { id: 'q52_heartAttack', num: 52, text: 'Heart attack (also called myocardial infarction)' },
  { id: 'q53_highBloodPressure', num: 53, text: 'High blood pressure' },
  { id: 'q54_lowBloodPressure', num: 54, text: 'Low blood pressure' },
  { id: 'q55_skinDisease', num: 55, text: 'Skin diseases (other than cancer)' },
  { id: 'q56_cancer', num: 56, text: 'Cancer (other than skin)' },
  { id: 'q57_skinCancer', num: 57, text: 'Skin cancer' }
];

// Musculoskeletal regions (Section II.2)
export const MUSCULOSKELETAL_REGIONS = [
  { id: 'headNeck', num: 1, text: 'Head and Neck' },
  { id: 'backChest', num: 2, text: 'Back and Chest' },
  { id: 'shoulderArm', num: 3, text: 'Shoulder/Arm' },
  { id: 'elbowForearm', num: 4, text: 'Elbow/Forearm' },
  { id: 'wristHandFingers', num: 5, text: 'Wrist/Hand/Fingers' },
  { id: 'hipThigh', num: 6, text: 'Hip/Thigh' },
  { id: 'legKnee', num: 7, text: 'Leg/Knee' },
  { id: 'ankleFootToes', num: 8, text: 'Ankle/Foot/Toes' }
];

// Hearing questions (Section II.4)
export const HEARING_QUESTIONS = [
  { id: 'persistentNoises', num: 1, text: 'During qualifying military service have you ever had, or do you now have, persistent or recurring noises in your head or ears? (for example: ringing, buzzing, humming)' },
  { id: 'hearingChange', num: 2, text: 'During qualifying military service have you ever had, or do you now have, a change in your hearing that impacts duty performance?' },
  { id: 'hearingAid', num: 3, text: 'Do you currently, or have you ever worn, a hearing aid?' },
  { id: 'loudNoiseExposure', num: 4, text: 'During your deployment or during military training, were you exposed to loud noises, to include blasts, that resulted in a temporary or permanent decrease in hearing and/or ringing, humming, buzzing sounds in your ears or head?' }
];

// Vision questions (Section II.5)
export const VISION_QUESTIONS = [
  { id: 'correctiveLenses', num: 1, text: 'Do you wear corrective lenses (glasses or contacts)?' },
  { id: 'eyeDisorder', num: 2, text: 'Eye disorder or trouble' },
  { id: 'visionSurgery', num: 3, text: 'Surgery to correct vision' },
  { id: 'visionLoss', num: 4, text: 'Loss of vision in either eye' },
  { id: 'doubleVision', num: 5, text: 'Double vision (diplopia)' },
  { id: 'visionChangeImpact', num: 6, text: 'Change in your vision that impacts your duty performance' }
];

// Head Injury questions (Section II.6)
export const HEAD_INJURY_QUESTIONS = [
  { id: 'headBlow', num: 1, text: 'As a result of any injury or event, did you receive a jolt or blow to your head that IMMEDIATELY resulted in losing consciousness; losing memory of events before or after the injury; or seeing stars, becoming disoriented, functioning differently, or nearly blacking out?' },
  { id: 'totalHeadBlows', num: 2, text: 'How many total times did you receive a jolt or blow to your head?' },
  { id: 'tbiDiagnosis', num: 3, text: 'Have you ever experienced a head injury, concussion, or Traumatic Brain Injury (TBI)?' },
  { id: 'prolongedSymptoms', num: 4, text: 'Have you had prolonged symptoms that have not resolved?' }
];

export const HEAD_BLOW_SYMPTOMS = [
  { value: 'lost_consciousness', label: 'Losing consciousness ("knocked out")?' },
  { value: 'memory_loss', label: 'Losing memory of events before or after the injury?' },
  { value: 'seeing_stars', label: 'Seeing stars, becoming disoriented, functioning differently, or nearly blacking out?' }
];

// Environmental/Occupational questions (Section II.7)
export const ENVIRONMENTAL_QUESTIONS = [
  { id: 'hazardExposure', num: 1, text: 'Were you potentially exposed to any occupational/environmental hazards while in a qualifying military duty service?' },
  { id: 'burnPitExposure', num: 2, text: 'Have you been based or stationed at a location where an open burn pit was used?' },
  { id: 'toxicAirborne', num: 3, text: 'Have you been potentially exposed to toxic airborne chemicals or other airborne contaminants?' },
  { id: 'burnPitRegistry', num: 4, text: 'If 2 or 3 is "Yes" or "Unsure," have you enrolled in the Airborne Hazards and Open Burn Pit Registry?' },
  { id: 'deploymentHazards', num: 6, text: 'While deployed, were you potentially exposed to other deployment-related hazards?' },
  { id: 'occupationalExams', num: 9, text: 'Are you currently participating in any specialty occupational exposure examinations?' },
  { id: 'blastExplosion', num: 10, text: 'A blast or explosion?' },
  { id: 'vehicularAccident', num: 11, text: 'A vehicular accident/crash (any vehicle including aircraft)?' },
  { id: 'fragmentWound', num: 12, text: 'A fragment wound or bullet wound?' }
];

export const EXPOSURE_TYPES = [
  { value: 'malaria_meds', label: 'Medications to prevent malaria/malaria prophylaxis, including Mefloquine' },
  { value: 'vaccine_complication', label: 'A vaccine with a possible complication' },
  { value: 'firefighting_foam', label: 'Firefighting foam' },
  { value: 'solvents_chemicals', label: 'Solvents or other chemicals that may have caused skin reactions, breathing problems, or other concerns' },
  { value: 'fuels', label: 'Fuels' },
  { value: 'contaminated_water', label: 'Contaminated water' },
  { value: 'radiation', label: 'Radiation (include any possible exposure to depleted uranium)' },
  { value: 'other_exposures', label: 'Other exposures of possible concern not listed here' },
  { value: 'embedded_shrapnel', label: 'Embedded shrapnel' },
  { value: 'unsure', label: 'Unsure' }
];

// Dental questions (Section II.8)
export const DENTAL_QUESTIONS = [
  { id: 'dentalProblems', num: 1, text: 'Do you currently have any dental problems that need to be evaluated?' },
  { id: 'oralCancer', num: 2, text: 'Have you ever been diagnosed or treated for oral cancer?' },
  { id: 'tmjProblem', num: 3, text: 'A dental examination where you were told you had a Temporomandibular Disorder (TMD) or Temporomandibular Joint (TMJ) problem?' },
  { id: 'jawLocked', num: 4, text: 'Your jaw locked open and you could not close the jaw?' },
  { id: 'boneLoss', num: 5, text: 'Loss of a portion of the bone in your upper or lower jaw due to trauma or disease such as osteomyelitis or necrosis?' },
  { id: 'teethLossTrauma', num: 6, text: 'Loss of any teeth because of service-related trauma?' },
  { id: 'mouthInjury', num: 7, text: 'Physical (anatomical) loss or injury to your mouth, lips, or tongue?' }
];

// Women's Health disorders (Section II.9)
export const WOMENS_HEALTH_DISORDERS = [
  { value: 'fibroids', label: 'Fibroids (leiomyomas)' },
  { value: 'endometriosis', label: 'Endometriosis' },
  { value: 'rectocele_cystocele', label: 'Rectocele or cystocele' },
  { value: 'pcos', label: 'Polycystic Ovarian Syndrome (PCOS)' },
  { value: 'infertility', label: 'Infertility/difficulty getting pregnant' },
  { value: 'recurrent_miscarriage', label: 'Recurrent miscarriage (2 or more pregnancy losses)' },
  { value: 'ovarian_cancer', label: 'Ovarian cancer' },
  { value: 'cervical_cancer', label: 'Cervical cancer' },
  { value: 'uterine_cancer', label: 'Uterine/endometrial cancer' },
  { value: 'breast_cancer', label: 'Breast cancer' },
  { value: 'bone_loss', label: 'Bone loss or osteoporosis' },
  { value: 'frequent_uti', label: 'Frequent urinary tract infections' },
  { value: 'incontinence', label: 'Urinary or fecal incontinence (leaking urine or stool)' }
];

export const WOMENS_HEALTH_SURGERIES = [
  { value: 'breast_surgery', label: 'Breast surgery or breast biopsy' },
  { value: 'hysterectomy', label: 'Hysterectomy (uterus removed)' },
  { value: 'other_uterine', label: 'Other uterine surgery (C-section, D&C, endometrial ablation, removal of fibroids)' },
  { value: 'oophorectomy_one', label: 'Oophorectomy - One ovary removed' },
  { value: 'oophorectomy_both', label: 'Oophorectomy - Both ovaries removed' },
  { value: 'other_ovarian', label: 'Other ovarian surgery' },
  { value: 'ovarian_cyst', label: 'Removal of ovarian cyst' },
  { value: 'ovarian_torsion', label: 'Treatment of ovarian torsion (twisting)' },
  { value: 'tubal_surgery', label: 'Tubal surgery including tubal ligation' },
  { value: 'incontinence_surgery', label: 'Surgery for urinary/fecal incontinence' },
  { value: 'leep_biopsy', label: 'LEEP or cervical cone biopsy' },
  { value: 'vaginal_vulvar', label: 'Vaginal/vulvar surgery or injury' }
];

export const WOMENS_SYMPTOMS = [
  { value: 'pelvic_pain', label: 'Pelvic pain' },
  { value: 'genital_lesions', label: 'Current or recent genital lesions' },
  { value: 'pelvic_disease', label: 'Pelvic inflammatory disease, uterus prolapse, or displacement' },
  { value: 'pain_intercourse', label: 'Pain during intercourse' },
  { value: 'urine_leakage', label: 'Leakage of urine affecting work/social activities' },
  { value: 'stool_leakage', label: 'Leakage of stool' },
  { value: 'low_libido', label: 'Low libido (reduced interest in sex)' },
  { value: 'bleeding_menopause', label: 'Bleeding after menopause' }
];

export const MENSES_REASONS = [
  { value: 'postmenopausal', label: 'Postmenopausal (no periods for 12 months or more)' },
  { value: 'hormonal', label: 'Hormonal suppression (pills/ring/patch/shot/IUD)' },
  { value: 'lactating', label: 'Lactating (breastfeeding)' },
  { value: 'hysterectomy', label: 'Hysterectomy' },
  { value: 'pregnant', label: 'Pregnant' },
  { value: 'unsure', label: 'Unsure' },
  { value: 'other', label: 'Other' }
];

// Initial empty state for the SHA DBQ form
export const getInitialShaDbqState = () => ({
  // Section I - Identification
  identification: {
    identifier: {
      name: '',
      assessmentDate: new Date().toISOString().split('T')[0]
    },
    contact: {
      currentAddress: '',
      workPhone: '',
      personalPhone: '',
      govEmail: '',
      personalEmail: '',
      preferredContact: []
    },
    personal: {
      dateOfBirth: '',
      age: '',
      raceEthnicity: [],
      birthSex: ''
    },
    occupational: {
      service: '',
      component: '',
      dutyStatus: '',
      occupation: '',
      mosCode: ''
    },
    examination: {
      examDate: '',
      purposeOfExam: '',
      purposeOther: '',
      releaseDate: '',
      intendToFile: null,
      claimType: '',
      hasFiledBefore: null,
      hadPhysicalWithin12Months: null,
      physicalExamDate: '',
      physicalExamType: '',
      wantsExamReviewed: null
    }
  },

  // Section II - Medical History
  medicalHistory: {
    // 1. General Medical Review
    generalMedical: {
      currentMedications: '',
      lastAssessmentDate: '',
      overallHealthCompared: '',
      overallHealthExplain: '',
      pastMonthHealth: '',
      pastMonthHealthExplain: '',
      // All yes/no questions will be stored as { answer: null, explanation: '' }
      ...Object.fromEntries(
        GENERAL_MEDICAL_QUESTIONS.map(q => [q.id, { answer: null, explanation: '' }])
      )
    },

    // 2. Musculoskeletal
    musculoskeletal: Object.fromEntries(
      MUSCULOSKELETAL_REGIONS.map(r => [r.id, { answer: null, explanation: '' }])
    ),

    // 3. Health & Wellness
    healthWellness: {
      usesTobacco: { answer: null, explanation: '' },
      smoked100Cigarettes: null,
      triedToStopSmoking: '',
      triedToStopExplain: '',
      smokingHealthProblem: { answer: null, explanation: '' },
      secondhandSmokeExposure: '',
      drugConcerns: { answer: null, explanation: '' }
    },

    // 4. Hearing
    hearing: Object.fromEntries(
      HEARING_QUESTIONS.map(q => [q.id, { answer: null, explanation: '' }])
    ),

    // 5. Vision
    vision: Object.fromEntries(
      VISION_QUESTIONS.map(q => [q.id, { answer: null, explanation: '' }])
    ),

    // 6. Head Injury
    headInjury: {
      headBlow: { answer: null, symptoms: [], explanation: '' },
      totalHeadBlows: '',
      tbiDiagnosis: { answer: null, explanation: '' },
      prolongedSymptoms: { answer: null, explanation: '' },
      currentProlongedSymptoms: { answer: null, explanation: '' }
    },

    // 7. Environmental/Occupational
    environmental: {
      hazardExposure: { answer: '', explanation: '' },
      burnPitExposure: { answer: '', explanation: '' },
      toxicAirborne: { answer: '', explanation: '' },
      burnPitRegistry: '',
      burnPitRegistryChoice: '',
      deploymentHazards: { answer: '', explanation: '' },
      specificExposures: [],
      exposureDetails: '',
      occupationalExams: { answer: null, explanation: '' },
      blastExplosion: { answer: null, explanation: '' },
      vehicularAccident: { answer: null, explanation: '' },
      fragmentWound: { answer: null, explanation: '' }
    },

    // 8. Dental
    dental: Object.fromEntries(
      DENTAL_QUESTIONS.map(q => [q.id, { answer: null, explanation: '' }])
    ),

    // 9. Women's Health (optional)
    womensHealth: {
      notApplicable: true,
      disorders: [],
      endometriosisDate: '',
      endometriosisLaparoscopy: '',
      disordersDetails: '',
      surgeries: [],
      surgeriesDetails: '',
      pregnancies: [],
      mammogram: {
        hadScreening: null,
        lastDate: '',
        abnormal: null,
        abnormalDate: '',
        abnormalResult: '',
        treatmentDate: '',
        treatment: ''
      },
      cervicalScreening: {
        hadScreening: null,
        lastDate: '',
        abnormal: null,
        abnormalDate: '',
        abnormalResult: '',
        treatmentDate: '',
        treatment: ''
      },
      currentMenses: '',
      lastMenstrualPeriod: '',
      notHavingMensesReason: [],
      currentSymptoms: [],
      symptomsExplain: ''
    },

    // 10. Mental Health Screening
    mentalHealth: {
      // PTSD Screen (5 questions)
      ptsd: {
        nightmares: null,
        avoidance: null,
        onGuard: null,
        numb: null,
        guilt: null
      },
      // Depression Screen (PHQ-2)
      depression: {
        littleInterest: '',
        feelingDown: ''
      },
      // Alcohol Use Screen (AUDIT-C)
      alcohol: {
        drinkFrequency: '',
        typicalDrinks: '',
        sixOrMoreMen: '',
        fourOrMoreWomen: ''
      }
    }
  },

  // Metadata
  metadata: {
    lastModified: null,
    completionPercentage: 0,
    autoFillApplied: [],
    additionalNotes: ''
  }
});

// PTSD Screen questions
export const PTSD_QUESTIONS = [
  { id: 'nightmares', text: 'Had nightmares about the event(s) or thought about the event(s) when you did not want to?' },
  { id: 'avoidance', text: 'Tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?' },
  { id: 'onGuard', text: 'Been constantly on guard, watchful, or easily startled?' },
  { id: 'numb', text: 'Felt numb or detached from people, activities, or your surroundings?' },
  { id: 'guilt', text: 'Felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?' }
];

// Depression Screen questions (PHQ-2)
export const DEPRESSION_QUESTIONS = [
  { id: 'littleInterest', text: 'Little interest or pleasure in doing things?' },
  { id: 'feelingDown', text: 'Feeling down, depressed, or hopeless?' }
];

// Alcohol Screen questions (AUDIT-C)
export const ALCOHOL_QUESTIONS = [
  { id: 'drinkFrequency', text: 'How often did you have a drink containing alcohol in the past year?' },
  { id: 'typicalDrinks', text: 'How many drinks containing alcohol did you have on a typical day when you were drinking in the past year?' },
  { id: 'sixOrMoreMen', text: 'For men: How often did you have six or more drinks on one occasion in the past year?' },
  { id: 'fourOrMoreWomen', text: 'For women: How often did you have four or more drinks on one occasion in the past year?' }
];

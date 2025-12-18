// Auto-fill mappings from medical entries and conditions to SHA DBQ questions

// Keyword mappings for General Medical Review questions
export const GENERAL_MEDICAL_MAPPINGS = {
  q5_medicalEquipment: {
    keywords: ['cpap', 'hearing aid', 'prosthetic', 'brace', 'wheelchair', 'cane', 'walker', 'bipap', 'oxygen'],
    bodySystems: ['sleep', 'hearing']
  },
  q10_allergies: {
    keywords: ['allergy', 'allergic', 'reaction', 'anaphylaxis', 'serum', 'insect sting', 'food allergy', 'hay fever', 'hives'],
    bodySystems: ['respiratory', 'skin']
  },
  q11_cholesterol: {
    keywords: ['cholesterol', 'hyperlipidemia', 'lipid', 'triglyceride', 'statin'],
    bodySystems: ['cardiovascular']
  },
  q14_asthma: {
    keywords: ['asthma', 'inhaler', 'bronchodilator', 'albuterol', 'nebulizer', 'rescue inhaler'],
    bodySystems: ['respiratory']
  },
  q15_bronchitis: {
    keywords: ['bronchitis', 'bronchial'],
    bodySystems: ['respiratory']
  },
  q16_chronicCough: {
    keywords: ['cough', 'chronic cough', 'night cough'],
    bodySystems: ['respiratory']
  },
  q17_breathingDifficulty: {
    keywords: ['shortness of breath', 'dyspnea', 'wheezing', 'breathing difficulty', 'breathless'],
    bodySystems: ['respiratory']
  },
  q18_lungProblems: {
    keywords: ['copd', 'emphysema', 'pneumonia', 'lung', 'pulmonary'],
    bodySystems: ['respiratory']
  },
  q19_sinusitis: {
    keywords: ['sinus', 'sinusitis', 'nasal congestion', 'nasal polyp'],
    bodySystems: ['respiratory']
  },
  q20_thyroid: {
    keywords: ['thyroid', 'hypothyroid', 'hyperthyroid', 'goiter', 'hashimoto', 'graves'],
    bodySystems: ['endocrine']
  },
  q21_entTrouble: {
    keywords: ['ear infection', 'throat', 'tonsil', 'adenoid', 'ear pain', 'otitis'],
    bodySystems: ['hearing']
  },
  q22_heartburn: {
    keywords: ['gerd', 'reflux', 'heartburn', 'indigestion', 'acid reflux', 'esophag'],
    bodySystems: ['digestive']
  },
  q23_stomachProblems: {
    keywords: ['ulcer', 'gastritis', 'stomach', 'gi bleed', 'peptic'],
    bodySystems: ['digestive']
  },
  q24_kidneyProblems: {
    keywords: ['kidney', 'renal', 'stone', 'nephro', 'uti', 'urinary tract infection'],
    bodySystems: ['genitourinary']
  },
  q25_liverProblems: {
    keywords: ['liver', 'hepatitis', 'cirrhosis', 'hepatic', 'fatty liver'],
    bodySystems: ['digestive']
  },
  q26_bowelProblems: {
    keywords: ['constipation', 'diarrhea', 'ibs', 'irritable bowel', 'loose stool', 'bowel'],
    bodySystems: ['digestive']
  },
  q27_gallbladder: {
    keywords: ['gallbladder', 'gallstone', 'cholecystitis'],
    bodySystems: ['digestive']
  },
  q28_hernia: {
    keywords: ['hernia', 'inguinal', 'umbilical', 'hiatal'],
    bodySystems: ['digestive', 'musculoskeletal']
  },
  q29_rectalDisease: {
    keywords: ['hemorrhoid', 'rectal', 'anal', 'fissure', 'fistula'],
    bodySystems: ['digestive']
  },
  q30_urinaryProblems: {
    keywords: ['urinary', 'bladder', 'frequent urination', 'painful urination', 'hematuria', 'incontinence'],
    bodySystems: ['genitourinary']
  },
  q31_bloodSugar: {
    keywords: ['blood sugar', 'glucose', 'hypoglycemia', 'hyperglycemia', 'a1c'],
    bodySystems: ['endocrine']
  },
  q33_diabetes: {
    keywords: ['diabetes', 'diabetic', 'insulin', 'metformin', 'type 2', 'type 1'],
    bodySystems: ['endocrine']
  },
  q35_headInjury: {
    keywords: ['head injury', 'concussion', 'tbi', 'traumatic brain', 'memory loss', 'amnesia'],
    bodySystems: ['neurological']
  },
  q36_headaches: {
    keywords: ['headache', 'migraine', 'cephalgia', 'tension headache', 'cluster headache'],
    bodySystems: ['neurological']
  },
  q37_dizziness: {
    keywords: ['dizziness', 'vertigo', 'fainting', 'syncope', 'lightheaded', 'loss of consciousness'],
    bodySystems: ['neurological', 'cardiovascular']
  },
  q38_mentalHealth: {
    keywords: ['depression', 'anxiety', 'ptsd', 'stress', 'psychiatric', 'mental health', 'counseling', 'therapy', 'bipolar', 'panic', 'ocd'],
    bodySystems: ['mental']
  },
  q39_neurological: {
    keywords: ['stroke', 'seizure', 'epilepsy', 'convulsion', 'tremor', 'parkinson', 'neuropathy'],
    bodySystems: ['neurological']
  },
  q40_paralysis: {
    keywords: ['paralysis', 'paralyzed', 'paraplegia', 'quadriplegia', 'hemiplegia'],
    bodySystems: ['neurological']
  },
  q46_angina: {
    keywords: ['angina', 'chest pain cardiac', 'coronary pain'],
    bodySystems: ['cardiovascular']
  },
  q47_heartFailure: {
    keywords: ['heart failure', 'chf', 'congestive', 'cardiomyopathy'],
    bodySystems: ['cardiovascular']
  },
  q48_chestPain: {
    keywords: ['chest pain', 'chest pressure', 'chest discomfort'],
    bodySystems: ['cardiovascular', 'respiratory']
  },
  q49_palpitations: {
    keywords: ['palpitation', 'arrhythmia', 'irregular heartbeat', 'afib', 'tachycardia', 'bradycardia'],
    bodySystems: ['cardiovascular']
  },
  q50_heartMurmur: {
    keywords: ['murmur', 'valve', 'mitral', 'aortic', 'tricuspid'],
    bodySystems: ['cardiovascular']
  },
  q51_coronaryDisease: {
    keywords: ['coronary', 'cad', 'atherosclerosis', 'blocked artery'],
    bodySystems: ['cardiovascular']
  },
  q52_heartAttack: {
    keywords: ['heart attack', 'myocardial infarction', 'mi', 'stent', 'bypass'],
    bodySystems: ['cardiovascular']
  },
  q53_highBloodPressure: {
    keywords: ['hypertension', 'high blood pressure', 'htn', 'elevated bp'],
    bodySystems: ['cardiovascular']
  },
  q54_lowBloodPressure: {
    keywords: ['hypotension', 'low blood pressure', 'orthostatic'],
    bodySystems: ['cardiovascular']
  },
  q55_skinDisease: {
    keywords: ['eczema', 'psoriasis', 'dermatitis', 'rash', 'skin condition', 'acne', 'hives'],
    bodySystems: ['skin']
  },
  q56_cancer: {
    keywords: ['cancer', 'tumor', 'malignant', 'oncology', 'chemotherapy', 'radiation therapy'],
    bodySystems: []
  },
  q57_skinCancer: {
    keywords: ['melanoma', 'basal cell', 'squamous cell', 'skin cancer', 'mohs'],
    bodySystems: ['skin']
  }
};

// Musculoskeletal region mappings
export const MUSCULOSKELETAL_MAPPINGS = {
  headNeck: {
    keywords: ['neck', 'cervical', 'c-spine', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'whiplash'],
    partialMatch: true
  },
  backChest: {
    keywords: ['back', 'lumbar', 'thoracic', 'spine', 'disc', 'l1', 'l2', 'l3', 'l4', 'l5', 's1', 'sciatica', 'chest wall', 'rib'],
    partialMatch: true
  },
  shoulderArm: {
    keywords: ['shoulder', 'rotator cuff', 'arm', 'bicep', 'tricep', 'deltoid', 'labrum', 'impingement'],
    partialMatch: true
  },
  elbowForearm: {
    keywords: ['elbow', 'tennis elbow', 'golfer elbow', 'forearm', 'ulnar', 'epicondylitis'],
    partialMatch: true
  },
  wristHandFingers: {
    keywords: ['wrist', 'carpal', 'hand', 'finger', 'thumb', 'trigger finger', 'de quervain'],
    partialMatch: true
  },
  hipThigh: {
    keywords: ['hip', 'thigh', 'femur', 'groin', 'labral', 'trochanteric'],
    partialMatch: true
  },
  legKnee: {
    keywords: ['knee', 'leg', 'patella', 'meniscus', 'acl', 'mcl', 'pcl', 'lcl', 'patellar'],
    partialMatch: true
  },
  ankleFootToes: {
    keywords: ['ankle', 'foot', 'toe', 'plantar', 'achilles', 'bunion', 'heel spur', 'tarsal'],
    partialMatch: true
  }
};

// Hearing mappings
export const HEARING_MAPPINGS = {
  persistentNoises: {
    keywords: ['tinnitus', 'ringing', 'buzzing', 'humming', 'ear noise'],
    bodySystems: ['hearing']
  },
  hearingChange: {
    keywords: ['hearing loss', 'deaf', 'hearing impair', 'audiogram', 'hard of hearing'],
    bodySystems: ['hearing']
  },
  hearingAid: {
    keywords: ['hearing aid'],
    bodySystems: ['hearing']
  },
  loudNoiseExposure: {
    keywords: ['blast', 'explosion', 'loud noise', 'noise exposure', 'gunfire', 'artillery'],
    bodySystems: ['hearing']
  }
};

// Vision mappings
export const VISION_MAPPINGS = {
  correctiveLenses: {
    keywords: ['glasses', 'contacts', 'corrective lens', 'myopia', 'hyperopia', 'astigmatism'],
    bodySystems: ['vision']
  },
  eyeDisorder: {
    keywords: ['eye', 'optic', 'glaucoma', 'macular', 'cataract', 'retina'],
    bodySystems: ['vision']
  },
  visionSurgery: {
    keywords: ['lasik', 'prk', 'eye surgery', 'cataract surgery'],
    bodySystems: ['vision']
  },
  visionLoss: {
    keywords: ['blind', 'vision loss', 'visual impairment'],
    bodySystems: ['vision']
  },
  doubleVision: {
    keywords: ['diplopia', 'double vision'],
    bodySystems: ['vision']
  }
};

// Head Injury / TBI mappings
export const HEAD_INJURY_MAPPINGS = {
  headBlow: {
    keywords: ['head injury', 'concussion', 'tbi', 'traumatic brain', 'knocked out', 'loss of consciousness', 'blast'],
    bodySystems: ['neurological']
  },
  tbiDiagnosis: {
    keywords: ['tbi', 'traumatic brain injury', 'concussion', 'brain injury', 'closed head'],
    bodySystems: ['neurological']
  }
};

// Main auto-fill function
export function generateAutoFillSuggestions(medicalEntries, conditions, sectionType) {
  const suggestions = {};
  let mappings;

  switch (sectionType) {
    case 'generalMedical':
      mappings = GENERAL_MEDICAL_MAPPINGS;
      break;
    case 'musculoskeletal':
      mappings = MUSCULOSKELETAL_MAPPINGS;
      break;
    case 'hearing':
      mappings = HEARING_MAPPINGS;
      break;
    case 'vision':
      mappings = VISION_MAPPINGS;
      break;
    case 'headInjury':
      mappings = HEAD_INJURY_MAPPINGS;
      break;
    default:
      return suggestions;
  }

  if (!mappings) return suggestions;

  Object.entries(mappings).forEach(([questionKey, mapping]) => {
    const matchingEntries = [];
    const matchingConditions = [];

    // Search medical entries
    medicalEntries?.forEach(entry => {
      const searchText = `${entry.issue || ''} ${entry.diagnosis || ''} ${entry.treatment || ''} ${entry.notes || ''}`.toLowerCase();

      // Check keyword matches
      const keywordMatch = mapping.keywords.some(kw => searchText.includes(kw.toLowerCase()));

      // Check body system matches
      const systemMatch = mapping.bodySystems?.includes(entry.bodySystem);

      if (keywordMatch || systemMatch) {
        matchingEntries.push(entry);
      }
    });

    // Search conditions
    conditions?.forEach(condition => {
      const conditionText = `${condition.name || ''} ${condition.evidence || ''} ${condition.notes || ''}`.toLowerCase();

      const keywordMatch = mapping.keywords.some(kw => conditionText.includes(kw.toLowerCase()));
      if (keywordMatch) {
        matchingConditions.push(condition);
      }
    });

    // If we found matches, create a suggestion
    const totalMatches = matchingEntries.length + matchingConditions.length;
    if (totalMatches > 0) {
      // Build explanation from matched data
      const explanationParts = [];

      matchingEntries.forEach(e => {
        const datePart = e.date ? `${e.date}: ` : '';
        const diagnosisPart = e.diagnosis || e.issue || '';
        const treatmentPart = e.treatment ? ` - ${e.treatment}` : '';
        if (diagnosisPart) {
          explanationParts.push(`${datePart}${diagnosisPart}${treatmentPart}`);
        }
      });

      matchingConditions.forEach(c => {
        const evidencePart = c.evidence ? ` - ${c.evidence}` : '';
        explanationParts.push(`${c.name}${evidencePart}`);
      });

      suggestions[questionKey] = {
        suggestedAnswer: true,
        suggestedExplanation: explanationParts.slice(0, 3).join('; '),
        sourceEntries: matchingEntries.map(e => e.id),
        sourceConditions: matchingConditions.map(c => c.id),
        confidence: totalMatches >= 3 ? 'high' : totalMatches >= 2 ? 'medium' : 'low',
        matchCount: totalMatches
      };
    }
  });

  return suggestions;
}

// Count total auto-fill suggestions across all sections
export function countAllAutoFillSuggestions(medicalEntries, conditions) {
  const sections = ['generalMedical', 'musculoskeletal', 'hearing', 'vision', 'headInjury'];
  let total = 0;

  sections.forEach(section => {
    const suggestions = generateAutoFillSuggestions(medicalEntries, conditions, section);
    total += Object.keys(suggestions).length;
  });

  return total;
}

// Get suggestions for a specific section
export function getSectionAutoFillCount(medicalEntries, conditions, sectionType) {
  const suggestions = generateAutoFillSuggestions(medicalEntries, conditions, sectionType);
  return Object.keys(suggestions).length;
}

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import YesNoQuestion from './components/YesNoQuestion';
import MultiSelectQuestion, { RadioQuestion, SelectQuestion, TextQuestion, DateQuestion } from './components/MultiSelectQuestion';
import AutoFillBadge, { SectionProgress } from './components/AutoFillBadge';
import {
  SERVICES, COMPONENTS, DUTY_STATUS, EXAM_PURPOSE, CLAIM_TYPES, RACE_ETHNICITY,
  HEALTH_COMPARISON, FREQUENCY_OPTIONS, ALCOHOL_FREQUENCY, ALCOHOL_DRINKS, BINGE_FREQUENCY,
  SMOKE_EXPOSURE, GENERAL_MEDICAL_QUESTIONS, MUSCULOSKELETAL_REGIONS, HEARING_QUESTIONS,
  VISION_QUESTIONS, HEAD_INJURY_QUESTIONS, HEAD_BLOW_SYMPTOMS, ENVIRONMENTAL_QUESTIONS,
  EXPOSURE_TYPES, DENTAL_QUESTIONS, WOMENS_HEALTH_DISORDERS, WOMENS_HEALTH_SURGERIES,
  WOMENS_SYMPTOMS, MENSES_REASONS, PTSD_QUESTIONS, DEPRESSION_QUESTIONS, ALCOHOL_QUESTIONS
} from './utils/shaDbqQuestions';

const CONTACT_METHODS = [
  { value: 'mail', label: 'Mail' },
  { value: 'workPhone', label: 'Work Phone' },
  { value: 'personalPhone', label: 'Personal Phone' },
  { value: 'govEmail', label: 'Government Email' },
  { value: 'personalEmail', label: 'Personal Email' }
];

// Collapsible section wrapper
function FormSection({ title, children, isOpen, onToggle, progress, autoFillCount }) {
  return (
    <div className="border border-slate-700/50 rounded-lg bg-slate-800/30 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          <span className="font-semibold text-slate-100">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {autoFillCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              {autoFillCount}
            </span>
          )}
          {progress && <SectionProgress filled={progress.filled} total={progress.total} />}
        </div>
      </button>
      {isOpen && <div className="p-4 pt-0 border-t border-slate-700/50">{children}</div>}
    </div>
  );
}

export default function ShaDbqForm({ formData, setFormData, autoFillSuggestions, veteranName }) {
  const [openSections, setOpenSections] = useState({
    identification: true,
    generalMedical: false,
    musculoskeletal: false,
    healthWellness: false,
    hearing: false,
    vision: false,
    headInjury: false,
    environmental: false,
    dental: false,
    womensHealth: false,
    mentalHealth: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper to update nested form data
  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Get nested value
  const getValue = (path) => {
    const keys = path.split('.');
    let current = formData;
    for (const key of keys) {
      if (!current) return undefined;
      current = current[key];
    }
    return current;
  };

  // Count filled fields in a section
  const countFilled = (obj) => {
    if (!obj) return { filled: 0, total: 0 };
    let filled = 0;
    let total = 0;
    Object.values(obj).forEach(val => {
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        if ('answer' in val) {
          total++;
          if (val.answer !== null && val.answer !== undefined && val.answer !== '') filled++;
        }
      } else if (val !== null && val !== undefined && val !== '' && (!Array.isArray(val) || val.length > 0)) {
        total++;
        filled++;
      } else {
        total++;
      }
    });
    return { filled, total };
  };

  const identification = formData?.identification || {};
  const medicalHistory = formData?.medicalHistory || {};

  return (
    <div className="space-y-4">
      {/* Section I: Identification */}
      <FormSection
        title="Section I: Identification"
        isOpen={openSections.identification}
        onToggle={() => toggleSection('identification')}
        progress={countFilled(identification.identifier)}
      >
        <div className="space-y-6">
          {/* Identifier */}
          <div>
            <h4 className="text-sm font-semibold text-amber-500 mb-3">IDENTIFIER</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextQuestion
                label="1. Name"
                value={getValue('identification.identifier.name') || veteranName}
                onChange={(v) => updateField('identification.identifier.name', v)}
              />
              <DateQuestion
                label="4. Today's Date (self-assessment date)"
                value={getValue('identification.identifier.assessmentDate')}
                onChange={(v) => updateField('identification.identifier.assessmentDate', v)}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Note: SSN and DoD ID are entered only at PDF export for security.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-amber-500 mb-3">1. CONTACT INFORMATION</h4>
            <div className="space-y-3">
              <TextQuestion
                label="Current Address"
                value={getValue('identification.contact.currentAddress')}
                onChange={(v) => updateField('identification.contact.currentAddress', v)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextQuestion
                  label="Work Telephone Number"
                  value={getValue('identification.contact.workPhone')}
                  onChange={(v) => updateField('identification.contact.workPhone', v)}
                />
                <TextQuestion
                  label="Personal Telephone Number"
                  value={getValue('identification.contact.personalPhone')}
                  onChange={(v) => updateField('identification.contact.personalPhone', v)}
                />
                <TextQuestion
                  label="Government Email"
                  type="email"
                  value={getValue('identification.contact.govEmail')}
                  onChange={(v) => updateField('identification.contact.govEmail', v)}
                />
                <TextQuestion
                  label="Personal Email"
                  type="email"
                  value={getValue('identification.contact.personalEmail')}
                  onChange={(v) => updateField('identification.contact.personalEmail', v)}
                />
              </div>
              <MultiSelectQuestion
                label="Preferred method(s) of contact"
                options={CONTACT_METHODS}
                value={getValue('identification.contact.preferredContact') || []}
                onChange={(v) => updateField('identification.contact.preferredContact', v)}
                columns={3}
              />
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h4 className="text-sm font-semibold text-amber-500 mb-3">2. PERSONAL INFORMATION</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateQuestion
                label="Date of Birth"
                value={getValue('identification.personal.dateOfBirth')}
                onChange={(v) => updateField('identification.personal.dateOfBirth', v)}
              />
              <TextQuestion
                label="Age"
                value={getValue('identification.personal.age')}
                onChange={(v) => updateField('identification.personal.age', v)}
              />
            </div>
            <MultiSelectQuestion
              label="Race and Ethnicity (mark all that apply)"
              options={RACE_ETHNICITY}
              value={getValue('identification.personal.raceEthnicity') || []}
              onChange={(v) => updateField('identification.personal.raceEthnicity', v)}
              columns={3}
            />
            <RadioQuestion
              label="Birth Sex (biological sex)"
              options={[{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]}
              value={getValue('identification.personal.birthSex')}
              onChange={(v) => updateField('identification.personal.birthSex', v)}
              name="birthSex"
              inline
            />
          </div>

          {/* Occupational Information */}
          <div>
            <h4 className="text-sm font-semibold text-amber-500 mb-3">3. OCCUPATIONAL INFORMATION</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectQuestion
                label="Service"
                options={SERVICES}
                value={getValue('identification.occupational.service')}
                onChange={(v) => updateField('identification.occupational.service', v)}
              />
              <SelectQuestion
                label="Component"
                options={COMPONENTS}
                value={getValue('identification.occupational.component')}
                onChange={(v) => updateField('identification.occupational.component', v)}
              />
              <SelectQuestion
                label="Duty Status"
                options={DUTY_STATUS}
                value={getValue('identification.occupational.dutyStatus')}
                onChange={(v) => updateField('identification.occupational.dutyStatus', v)}
              />
              <TextQuestion
                label="Usual Occupation (most recent day-to-day job)"
                value={getValue('identification.occupational.occupation')}
                onChange={(v) => updateField('identification.occupational.occupation', v)}
              />
              <TextQuestion
                label="Military occupational code (MOS, AOC, AFSC, NEC)"
                value={getValue('identification.occupational.mosCode')}
                onChange={(v) => updateField('identification.occupational.mosCode', v)}
              />
            </div>
          </div>

          {/* Examination Information */}
          <div>
            <h4 className="text-sm font-semibold text-amber-500 mb-3">4. EXAMINATION INFORMATION</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateQuestion
                label="Exam Date (if known)"
                value={getValue('identification.examination.examDate')}
                onChange={(v) => updateField('identification.examination.examDate', v)}
              />
              <SelectQuestion
                label="Purpose of Exam"
                options={EXAM_PURPOSE}
                value={getValue('identification.examination.purposeOfExam')}
                onChange={(v) => updateField('identification.examination.purposeOfExam', v)}
              />
              <DateQuestion
                label="Date or anticipated date of release from Active Duty"
                value={getValue('identification.examination.releaseDate')}
                onChange={(v) => updateField('identification.examination.releaseDate', v)}
              />
            </div>
            <RadioQuestion
              label="Do you intend to file a claim for disability compensation with the VA?"
              options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
              value={getValue('identification.examination.intendToFile')}
              onChange={(v) => updateField('identification.examination.intendToFile', v)}
              name="intendToFile"
              inline
            />
            {getValue('identification.examination.intendToFile') === true && (
              <SelectQuestion
                label="Select the type of claim program/process"
                options={CLAIM_TYPES}
                value={getValue('identification.examination.claimType')}
                onChange={(v) => updateField('identification.examination.claimType', v)}
              />
            )}
            <RadioQuestion
              label="Have you ever filed a disability claim with the VA?"
              options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
              value={getValue('identification.examination.hasFiledBefore')}
              onChange={(v) => updateField('identification.examination.hasFiledBefore', v)}
              name="hasFiledBefore"
              inline
            />
          </div>
        </div>
      </FormSection>

      {/* Section II.1: General Medical Review */}
      <FormSection
        title="Section II.1: General Medical Review"
        isOpen={openSections.generalMedical}
        onToggle={() => toggleSection('generalMedical')}
        progress={countFilled(medicalHistory.generalMedical)}
        autoFillCount={Object.keys(autoFillSuggestions?.generalMedical || {}).length}
      >
        <div className="space-y-4">
          <TextQuestion
            label="1. List your current medications, including supplements"
            value={getValue('medicalHistory.generalMedical.currentMedications')}
            onChange={(v) => updateField('medicalHistory.generalMedical.currentMedications', v)}
            multiline
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateQuestion
              label="Date of most recent military service medical assessment"
              value={getValue('medicalHistory.generalMedical.lastAssessmentDate')}
              onChange={(v) => updateField('medicalHistory.generalMedical.lastAssessmentDate', v)}
            />
            <SelectQuestion
              label="2. Compared to your last exam, your overall health is:"
              options={HEALTH_COMPARISON}
              value={getValue('medicalHistory.generalMedical.overallHealthCompared')}
              onChange={(v) => updateField('medicalHistory.generalMedical.overallHealthCompared', v)}
            />
          </div>

          <p className="text-xs text-slate-400 border-t border-slate-700 pt-4 mt-4">
            During qualifying military service, have you ever experienced:
          </p>

          {GENERAL_MEDICAL_QUESTIONS.map(q => (
            <YesNoQuestion
              key={q.id}
              number={q.num}
              question={q.text}
              value={getValue(`medicalHistory.generalMedical.${q.id}`)}
              onChange={(v) => updateField(`medicalHistory.generalMedical.${q.id}`, v)}
              autoFillSuggestion={autoFillSuggestions?.generalMedical?.[q.id]}
              onAcceptAutoFill={() => {}}
            />
          ))}
        </div>
      </FormSection>

      {/* Section II.2: Musculoskeletal */}
      <FormSection
        title="Section II.2: Joint, Spine & Musculoskeletal"
        isOpen={openSections.musculoskeletal}
        onToggle={() => toggleSection('musculoskeletal')}
        progress={countFilled(medicalHistory.musculoskeletal)}
        autoFillCount={Object.keys(autoFillSuggestions?.musculoskeletal || {}).length}
      >
        <p className="text-xs text-slate-400 mb-4">
          During qualifying military service, have you ever experienced pain and/or injury in the following:
        </p>
        {MUSCULOSKELETAL_REGIONS.map(r => (
          <YesNoQuestion
            key={r.id}
            number={r.num}
            question={r.text}
            value={getValue(`medicalHistory.musculoskeletal.${r.id}`)}
            onChange={(v) => updateField(`medicalHistory.musculoskeletal.${r.id}`, v)}
            autoFillSuggestion={autoFillSuggestions?.musculoskeletal?.[r.id]}
            onAcceptAutoFill={() => {}}
          />
        ))}
      </FormSection>

      {/* Section II.3: Health & Wellness */}
      <FormSection
        title="Section II.3: Health & Wellness"
        isOpen={openSections.healthWellness}
        onToggle={() => toggleSection('healthWellness')}
        progress={countFilled(medicalHistory.healthWellness)}
      >
        <YesNoQuestion
          number={1}
          question="Do you currently use tobacco products (cigarettes, cigars, pipes, e-cigarettes, vape, smokeless tobacco)?"
          value={getValue('medicalHistory.healthWellness.usesTobacco')}
          onChange={(v) => updateField('medicalHistory.healthWellness.usesTobacco', v)}
        />
        <RadioQuestion
          label="2. Have you smoked at least 100 cigarettes in your entire life?"
          options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
          value={getValue('medicalHistory.healthWellness.smoked100Cigarettes')}
          onChange={(v) => updateField('medicalHistory.healthWellness.smoked100Cigarettes', v)}
          name="smoked100"
          inline
        />
        <SelectQuestion
          label="5. During the past 12 months, how often were you exposed to secondhand smoke indoors?"
          options={SMOKE_EXPOSURE}
          value={getValue('medicalHistory.healthWellness.secondhandSmokeExposure')}
          onChange={(v) => updateField('medicalHistory.healthWellness.secondhandSmokeExposure', v)}
        />
        <YesNoQuestion
          number={6}
          question="Do you have any ongoing health concerns with past use of recreational drugs or misuse of prescription drugs?"
          value={getValue('medicalHistory.healthWellness.drugConcerns')}
          onChange={(v) => updateField('medicalHistory.healthWellness.drugConcerns', v)}
        />
      </FormSection>

      {/* Section II.4: Hearing */}
      <FormSection
        title="Section II.4: Hearing"
        isOpen={openSections.hearing}
        onToggle={() => toggleSection('hearing')}
        progress={countFilled(medicalHistory.hearing)}
        autoFillCount={Object.keys(autoFillSuggestions?.hearing || {}).length}
      >
        {HEARING_QUESTIONS.map(q => (
          <YesNoQuestion
            key={q.id}
            number={q.num}
            question={q.text}
            value={getValue(`medicalHistory.hearing.${q.id}`)}
            onChange={(v) => updateField(`medicalHistory.hearing.${q.id}`, v)}
            autoFillSuggestion={autoFillSuggestions?.hearing?.[q.id]}
            onAcceptAutoFill={() => {}}
          />
        ))}
      </FormSection>

      {/* Section II.5: Vision */}
      <FormSection
        title="Section II.5: Vision"
        isOpen={openSections.vision}
        onToggle={() => toggleSection('vision')}
        progress={countFilled(medicalHistory.vision)}
        autoFillCount={Object.keys(autoFillSuggestions?.vision || {}).length}
      >
        {VISION_QUESTIONS.map(q => (
          <YesNoQuestion
            key={q.id}
            number={q.num}
            question={q.text}
            value={getValue(`medicalHistory.vision.${q.id}`)}
            onChange={(v) => updateField(`medicalHistory.vision.${q.id}`, v)}
            autoFillSuggestion={autoFillSuggestions?.vision?.[q.id]}
            onAcceptAutoFill={() => {}}
          />
        ))}
      </FormSection>

      {/* Section II.6: Head Injury */}
      <FormSection
        title="Section II.6: Head Injury"
        isOpen={openSections.headInjury}
        onToggle={() => toggleSection('headInjury')}
        progress={countFilled(medicalHistory.headInjury)}
        autoFillCount={Object.keys(autoFillSuggestions?.headInjury || {}).length}
      >
        <YesNoQuestion
          number={1}
          question="As a result of any injury or event, did you receive a jolt or blow to your head that IMMEDIATELY resulted in losing consciousness; losing memory of events before or after the injury; or seeing stars, becoming disoriented, functioning differently, or nearly blacking out?"
          value={getValue('medicalHistory.headInjury.headBlow')}
          onChange={(v) => updateField('medicalHistory.headInjury.headBlow', v)}
          autoFillSuggestion={autoFillSuggestions?.headInjury?.headBlow}
          onAcceptAutoFill={() => {}}
        />
        <TextQuestion
          label="2. How many total times did you receive a jolt or blow to your head?"
          value={getValue('medicalHistory.headInjury.totalHeadBlows')}
          onChange={(v) => updateField('medicalHistory.headInjury.totalHeadBlows', v)}
        />
        <YesNoQuestion
          number={3}
          question="Have you ever experienced a head injury, concussion, or Traumatic Brain Injury (TBI)?"
          value={getValue('medicalHistory.headInjury.tbiDiagnosis')}
          onChange={(v) => updateField('medicalHistory.headInjury.tbiDiagnosis', v)}
          autoFillSuggestion={autoFillSuggestions?.headInjury?.tbiDiagnosis}
          onAcceptAutoFill={() => {}}
        />
        <YesNoQuestion
          number={4}
          question="Have you had prolonged symptoms that have not resolved?"
          value={getValue('medicalHistory.headInjury.prolongedSymptoms')}
          onChange={(v) => updateField('medicalHistory.headInjury.prolongedSymptoms', v)}
        />
      </FormSection>

      {/* Section II.7: Environmental/Occupational */}
      <FormSection
        title="Section II.7: Environmental/Occupational"
        isOpen={openSections.environmental}
        onToggle={() => toggleSection('environmental')}
        progress={countFilled(medicalHistory.environmental)}
      >
        <YesNoQuestion
          number={1}
          question="Were you potentially exposed to any occupational/environmental hazards while in a qualifying military duty service?"
          value={getValue('medicalHistory.environmental.hazardExposure')}
          onChange={(v) => updateField('medicalHistory.environmental.hazardExposure', v)}
          threeWay
        />
        <YesNoQuestion
          number={2}
          question="Have you been based or stationed at a location where an open burn pit was used?"
          value={getValue('medicalHistory.environmental.burnPitExposure')}
          onChange={(v) => updateField('medicalHistory.environmental.burnPitExposure', v)}
          threeWay
        />
        <YesNoQuestion
          number={3}
          question="Have you been potentially exposed to toxic airborne chemicals or other airborne contaminants?"
          value={getValue('medicalHistory.environmental.toxicAirborne')}
          onChange={(v) => updateField('medicalHistory.environmental.toxicAirborne', v)}
          threeWay
        />
        <MultiSelectQuestion
          label="7. During any part of your qualifying military service, were you exposed to any of the following?"
          options={EXPOSURE_TYPES}
          value={getValue('medicalHistory.environmental.specificExposures') || []}
          onChange={(v) => updateField('medicalHistory.environmental.specificExposures', v)}
        />
        <YesNoQuestion
          number={10}
          question="A blast or explosion?"
          value={getValue('medicalHistory.environmental.blastExplosion')}
          onChange={(v) => updateField('medicalHistory.environmental.blastExplosion', v)}
        />
        <YesNoQuestion
          number={11}
          question="A vehicular accident/crash (any vehicle including aircraft)?"
          value={getValue('medicalHistory.environmental.vehicularAccident')}
          onChange={(v) => updateField('medicalHistory.environmental.vehicularAccident', v)}
        />
        <YesNoQuestion
          number={12}
          question="A fragment wound or bullet wound?"
          value={getValue('medicalHistory.environmental.fragmentWound')}
          onChange={(v) => updateField('medicalHistory.environmental.fragmentWound', v)}
        />
      </FormSection>

      {/* Section II.8: Dental */}
      <FormSection
        title="Section II.8: Dental"
        isOpen={openSections.dental}
        onToggle={() => toggleSection('dental')}
        progress={countFilled(medicalHistory.dental)}
      >
        {DENTAL_QUESTIONS.map(q => (
          <YesNoQuestion
            key={q.id}
            number={q.num}
            question={q.text}
            value={getValue(`medicalHistory.dental.${q.id}`)}
            onChange={(v) => updateField(`medicalHistory.dental.${q.id}`, v)}
          />
        ))}
      </FormSection>

      {/* Section II.9: Women's Health */}
      <FormSection
        title="Section II.9: Women's Health / Female Reproductive Organs"
        isOpen={openSections.womensHealth}
        onToggle={() => toggleSection('womensHealth')}
        progress={countFilled(medicalHistory.womensHealth)}
      >
        <label className="flex items-center gap-2 p-2 mb-4 bg-slate-700/30 rounded">
          <input
            type="checkbox"
            checked={getValue('medicalHistory.womensHealth.notApplicable') !== false}
            onChange={(e) => updateField('medicalHistory.womensHealth.notApplicable', e.target.checked)}
            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500"
          />
          <span className="text-sm text-slate-300">Not Applicable (skip this section)</span>
        </label>

        {getValue('medicalHistory.womensHealth.notApplicable') === false && (
          <>
            <MultiSelectQuestion
              label="1. Have you been diagnosed with and/or treated for any of the following disorders?"
              options={WOMENS_HEALTH_DISORDERS}
              value={getValue('medicalHistory.womensHealth.disorders') || []}
              onChange={(v) => updateField('medicalHistory.womensHealth.disorders', v)}
            />
            <MultiSelectQuestion
              label="3. Have you had any of the following surgeries or injuries?"
              options={WOMENS_HEALTH_SURGERIES}
              value={getValue('medicalHistory.womensHealth.surgeries') || []}
              onChange={(v) => updateField('medicalHistory.womensHealth.surgeries', v)}
            />
            <MultiSelectQuestion
              label="11. Are you currently experiencing any of the following?"
              options={WOMENS_SYMPTOMS}
              value={getValue('medicalHistory.womensHealth.currentSymptoms') || []}
              onChange={(v) => updateField('medicalHistory.womensHealth.currentSymptoms', v)}
            />
          </>
        )}
      </FormSection>

      {/* Section II.10: Mental Health Screening */}
      <FormSection
        title="Section II.10: Mental Health Screening"
        isOpen={openSections.mentalHealth}
        onToggle={() => toggleSection('mentalHealth')}
        progress={countFilled(medicalHistory.mentalHealth)}
      >
        {/* PTSD Screen */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-amber-500 mb-2">10.1 POST-TRAUMATIC STRESS DISORDER (PTSD) SCREEN</h4>
          <p className="text-xs text-slate-400 mb-4">
            Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. In the past month, have you...
          </p>
          {PTSD_QUESTIONS.map((q, i) => (
            <YesNoQuestion
              key={q.id}
              number={i + 1}
              question={q.text}
              value={{ answer: getValue(`medicalHistory.mentalHealth.ptsd.${q.id}`), explanation: '' }}
              onChange={(v) => updateField(`medicalHistory.mentalHealth.ptsd.${q.id}`, v.answer)}
              showExplanation={false}
            />
          ))}
        </div>

        {/* Depression Screen */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-amber-500 mb-2">10.2 DEPRESSION SCREEN</h4>
          <p className="text-xs text-slate-400 mb-4">
            Over the last 2 weeks, how often have you been bothered by any of the following problems?
          </p>
          <SelectQuestion
            label="1. Little interest or pleasure in doing things?"
            options={FREQUENCY_OPTIONS}
            value={getValue('medicalHistory.mentalHealth.depression.littleInterest')}
            onChange={(v) => updateField('medicalHistory.mentalHealth.depression.littleInterest', v)}
          />
          <SelectQuestion
            label="2. Feeling down, depressed, or hopeless?"
            options={FREQUENCY_OPTIONS}
            value={getValue('medicalHistory.mentalHealth.depression.feelingDown')}
            onChange={(v) => updateField('medicalHistory.mentalHealth.depression.feelingDown', v)}
          />
        </div>

        {/* Alcohol Screen */}
        <div>
          <h4 className="text-sm font-semibold text-amber-500 mb-2">10.3 ALCOHOL USE SCREEN</h4>
          <SelectQuestion
            label="1. How often did you have a drink containing alcohol in the past year?"
            options={ALCOHOL_FREQUENCY}
            value={getValue('medicalHistory.mentalHealth.alcohol.drinkFrequency')}
            onChange={(v) => updateField('medicalHistory.mentalHealth.alcohol.drinkFrequency', v)}
          />
          {getValue('medicalHistory.mentalHealth.alcohol.drinkFrequency') !== 'never' && (
            <>
              <SelectQuestion
                label="2. How many drinks on a typical day when drinking?"
                options={ALCOHOL_DRINKS}
                value={getValue('medicalHistory.mentalHealth.alcohol.typicalDrinks')}
                onChange={(v) => updateField('medicalHistory.mentalHealth.alcohol.typicalDrinks', v)}
              />
              <SelectQuestion
                label="3. For men: How often did you have six or more drinks on one occasion?"
                options={BINGE_FREQUENCY}
                value={getValue('medicalHistory.mentalHealth.alcohol.sixOrMoreMen')}
                onChange={(v) => updateField('medicalHistory.mentalHealth.alcohol.sixOrMoreMen', v)}
              />
              <SelectQuestion
                label="4. For women: How often did you have four or more drinks on one occasion?"
                options={BINGE_FREQUENCY}
                value={getValue('medicalHistory.mentalHealth.alcohol.fourOrMoreWomen')}
                onChange={(v) => updateField('medicalHistory.mentalHealth.alcohol.fourOrMoreWomen', v)}
              />
            </>
          )}
        </div>
      </FormSection>
    </div>
  );
}

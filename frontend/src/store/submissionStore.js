// ifqe-portal-frontend5/src/store/submissionStore.js

import { create } from 'zustand';
import { fetchAllIndicators } from '../services/indicatorService';
import apiClient from '../api/axiosConfig';
import toast from 'react-hot-toast';

const calculateScores = (submission) => {
    let selfAssessedScore = 0;
    let reviewScore = 0;
    submission?.partB?.criteria?.forEach(criterion => {
        criterion.subCriteria?.forEach(sc => {
            sc.indicators?.forEach(ind => {
                let indSelf = ind.selfAssessedScore;
                const is23 = sc.subCriteriaCode === '2.3' || ind.indicatorCode?.startsWith('2.3.');
                if (is23) {
                    const hasBreakdown = ind.selfAssessedScoreGovt !== undefined || 
                                         ind.selfAssessedScoreNonGovt !== undefined || 
                                         ind.selfAssessedScoreInstitutional !== undefined;
                    if (hasBreakdown) {
                        indSelf = (ind.selfAssessedScoreGovt ?? 0) + 
                                  (ind.selfAssessedScoreNonGovt ?? 0) + 
                                  (ind.selfAssessedScoreInstitutional ?? 0);
                        ind.selfAssessedScore = indSelf;
                    }
                } else if (ind.indicatorCode === '4.2.1') {
                    const has421Breakdown = ind.selfAssessedScoreWorkshopTraining !== undefined ||
                                            ind.selfAssessedScoreConferences !== undefined ||
                                            ind.selfAssessedScoreSeminar !== undefined ||
                                            ind.selfAssessedScoreFDP !== undefined;
                    if (has421Breakdown) {
                        indSelf = (ind.selfAssessedScoreWorkshopTraining ?? 0) +
                                  (ind.selfAssessedScoreConferences ?? 0) +
                                  (ind.selfAssessedScoreSeminar ?? 0) +
                                  (ind.selfAssessedScoreFDP ?? 0);
                        ind.selfAssessedScore = indSelf;
                    }
                }
                if (typeof indSelf === 'number') {
                    selfAssessedScore += indSelf;
                }
                const scoreToUse = typeof ind.reviewScore === 'number' ? ind.reviewScore : indSelf;
                if (typeof scoreToUse === 'number') {
                    reviewScore += scoreToUse;
                }
            });
        });
    });
    return { selfAssessedScore, reviewScore };
};

const useSubmissionStore = create((set, get) => ({
  indicators: [],
  submission: null,
  totalSelfAssessedScore: 0,
  totalReviewScore: 0,
  isLoading: true,
  isAutoSaving: false,
  lastSavedAt: null,
  error: null,

  initializeForm: async (submissionId) => {
    set({ isLoading: true, error: null, submission: null });
    try {
      const indicatorsPromise = fetchAllIndicators();
      const submissionPromise = apiClient.get(`/submissions/${submissionId}`);
      const [indicatorsData, submissionResponse] = await Promise.all([indicatorsPromise, submissionPromise]);
      
      const scores = calculateScores(submissionResponse.data);
      set({
        indicators: indicatorsData,
        submission: submissionResponse.data,
        totalSelfAssessedScore: scores.selfAssessedScore,
        totalReviewScore: scores.reviewScore,
        lastSavedAt: new Date(),
        isLoading: false,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load submission data.';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  updateIndicatorFileKey: (criterionCode, subCriteriaCode, indicatorCode, fileKey) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const indicator = newSubmission.partB.criteria
          .find(c => c.criteriaCode === criterionCode)?.subCriteria
          .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
          .find(i => i.indicatorCode === indicatorCode);
      if (indicator) {
        indicator.fileKey = fileKey;
      }
      return { submission: newSubmission };
    });
  },

  updateIndicatorEvidenceLinkFileKey: (criterionCode, subCriteriaCode, indicatorCode, fileKey) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const indicator = newSubmission.partB.criteria
          .find(c => c.criteriaCode === criterionCode)?.subCriteria
          .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
          .find(i => i.indicatorCode === indicatorCode);
      if (indicator) {
        indicator.evidenceLinkFileKey = fileKey;
      }
      return { submission: newSubmission };
    });
  },

  // Add a new evidence file key to the array
  addEvidenceFileKey: (criterionCode, subCriteriaCode, indicatorCode, fileKey) => {
    set((state) => {
      if (!state.submission) return {};
      // Deep clone the submission state
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      
      let indicator = null;

      // 1. Try direct path lookup
      const criterion = newSubmission.partB.criteria.find(c => c.criteriaCode == criterionCode);
      const subCriterion = criterion?.subCriteria.find(sc => sc.subCriteriaCode == subCriteriaCode);
      indicator = subCriterion?.indicators.find(i => i.indicatorCode == indicatorCode);

      // 2. Fallback: Scan entire structure if direct path fails
      if (!indicator && newSubmission.partB && newSubmission.partB.criteria) {
        console.warn(`[Store] Direct lookup failed for ${indicatorCode}. Scanning all criteria...`);
        for (const c of newSubmission.partB.criteria) {
            for (const sc of c.subCriteria) {
                const found = sc.indicators.find(i => i.indicatorCode == indicatorCode);
                if (found) {
                    indicator = found;
                    break;
                }
            }
            if (indicator) break;
        }
      }

      if (indicator) {
        if (!Array.isArray(indicator.evidenceFileKeys)) {
          indicator.evidenceFileKeys = [];
        }
        // Prevent duplicates
        if (!indicator.evidenceFileKeys.includes(fileKey)) {
             indicator.evidenceFileKeys.push(fileKey);
             console.log(`[Store] Added fileKey ${fileKey} to indicator ${indicatorCode}`);
        } else {
             console.log(`[Store] FileKey ${fileKey} already exists in indicator ${indicatorCode}`);
        }
      } else {
        const msg = `Could not find indicator ${indicatorCode} to add file. Please refresh the page.`;
        console.error(`[Store] ${msg}`);
        toast.error(msg);
      }
      
      return { submission: newSubmission };
    });
  },

  // Remove a specific evidence file key from the array
  removeEvidenceFileKey: (criterionCode, subCriteriaCode, indicatorCode, fileKey) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      
      let indicator = null;
      
      // Try direct path lookup with loose equality
      const criterion = newSubmission.partB.criteria.find(c => c.criteriaCode == criterionCode);
      const subCriterion = criterion?.subCriteria.find(sc => sc.subCriteriaCode == subCriteriaCode);
      indicator = subCriterion?.indicators.find(i => i.indicatorCode == indicatorCode);
      
      // Fallback: Scan entire structure if direct path fails
      if (!indicator && newSubmission.partB && newSubmission.partB.criteria) {
        for (const c of newSubmission.partB.criteria) {
          for (const sc of c.subCriteria) {
            const found = sc.indicators.find(i => i.indicatorCode == indicatorCode);
            if (found) {
              indicator = found;
              break;
            }
          }
          if (indicator) break;
        }
      }
      
      if (indicator && indicator.evidenceFileKeys) {
        indicator.evidenceFileKeys = indicator.evidenceFileKeys.filter(key => key !== fileKey);
        console.log(`[Store] Removed fileKey ${fileKey} from indicator ${indicatorCode}`);
      }
      return { submission: newSubmission };
    });
  },

  updateIndicatorSelfScore: (criterionCode, subCriteriaCode, indicatorCode, score, category) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const indicator = newSubmission.partB.criteria
          .find(c => c.criteriaCode === criterionCode)?.subCriteria
          .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
          .find(i => i.indicatorCode === indicatorCode);
      if (indicator) {
        const newScore = parseInt(score, 10);
        const parsedScore = isNaN(newScore) ? undefined : newScore;

        if (category === 'govt') {
          indicator.selfAssessedScoreGovt = parsedScore;
        } else if (category === 'nonGovt') {
          indicator.selfAssessedScoreNonGovt = parsedScore;
        } else if (category === 'institutional') {
          indicator.selfAssessedScoreInstitutional = parsedScore;
        } else if (category === 'workshopTraining') {
          indicator.selfAssessedScoreWorkshopTraining = parsedScore;
        } else if (category === 'conferences') {
          indicator.selfAssessedScoreConferences = parsedScore;
        } else if (category === 'seminar') {
          indicator.selfAssessedScoreSeminar = parsedScore;
        } else if (category === 'fdp') {
          indicator.selfAssessedScoreFDP = parsedScore;
        } else {
          indicator.selfAssessedScore = parsedScore;
        }

        const is23 = subCriteriaCode === '2.3' || indicator.indicatorCode?.startsWith('2.3.');
        const is421 = indicator.indicatorCode === '4.2.1';
        if (is23) {
          const g = indicator.selfAssessedScoreGovt;
          const ng = indicator.selfAssessedScoreNonGovt;
          const inst = indicator.selfAssessedScoreInstitutional;
          if (g !== undefined || ng !== undefined || inst !== undefined) {
            indicator.selfAssessedScore = (g ?? 0) + (ng ?? 0) + (inst ?? 0);
          } else {
            indicator.selfAssessedScore = undefined;
          }
        } else if (is421) {
          const wt = indicator.selfAssessedScoreWorkshopTraining;
          const conf = indicator.selfAssessedScoreConferences;
          const sem = indicator.selfAssessedScoreSeminar;
          const fdp = indicator.selfAssessedScoreFDP;
          if (wt !== undefined || conf !== undefined || sem !== undefined || fdp !== undefined) {
            indicator.selfAssessedScore = (wt ?? 0) + (conf ?? 0) + (sem ?? 0) + (fdp ?? 0);
          } else {
            indicator.selfAssessedScore = undefined;
          }
        }
      }
      const scores = calculateScores(newSubmission);
      return { 
        submission: newSubmission, 
        totalSelfAssessedScore: scores.selfAssessedScore,
        totalReviewScore: scores.reviewScore
      };
    });
  },

  updateIndicatorReviewScore: (criterionCode, subCriteriaCode, indicatorCode, score) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const indicator = newSubmission.partB.criteria
          .find(c => c.criteriaCode === criterionCode)?.subCriteria
          .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
          .find(i => i.indicatorCode === indicatorCode);
      if (indicator) {
        const newScore = parseInt(score, 10);
        indicator.reviewScore = isNaN(newScore) ? undefined : newScore;
      }
      const scores = calculateScores(newSubmission);
      return { submission: newSubmission, totalReviewScore: scores.reviewScore };
    });
  },

  updatePartASummaryFileKey: (fileKey) => {
    set((state) => {
        if (!state.submission) return {};
        const newSubmission = JSON.parse(JSON.stringify(state.submission));
        if (!newSubmission.partA) {
            newSubmission.partA = {};
        }
        newSubmission.partA.summaryFileKey = fileKey;
        return { submission: newSubmission };
    });
  },

  updateSubCriterionRemark: (criterionCode, subCriteriaCode, remark) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const criterion = newSubmission.partB.criteria.find(c => c.criteriaCode === criterionCode);
      const subCriterion = criterion?.subCriteria.find(sc => sc.subCriteriaCode === subCriteriaCode);
      if (subCriterion) {
        subCriterion.remark = remark;
      }
      return { submission: newSubmission };
    });
  },

  updateCriterionScore: (criterionCode, score) => {
    set((state) => {
        if (!state.submission) return {};
        const newSubmission = JSON.parse(JSON.stringify(state.submission));
        const criterion = newSubmission.partB.criteria.find(c => c.criteriaCode === criterionCode);
        if (criterion) {
            const newScore = parseInt(score, 10);
            criterion.reviewScore = isNaN(newScore) ? 0 : newScore;
        }
        return { submission: newSubmission };
    });
  },

  saveDraft: async () => {
    const { submission } = get();
    if (!submission) throw new Error("No submission data to save.");
    set({ isAutoSaving: true });
    try {
      const { data } = await apiClient.put(`/submissions/${submission._id}`, {
        partA: submission.partA,
        partB: submission.partB,
      });
      set({ submission: data, isAutoSaving: false, lastSavedAt: new Date() }); 
      return data;
    } catch (err) {
      set({ isAutoSaving: false });
      throw new Error(err.response?.data?.message || 'Failed to save draft.');
    }
  },

  submitForReview: async () => {
    const { submission } = get();
    if (!submission) throw new Error("No submission data to submit.");
    try {
        const { data } = await apiClient.put(`/submissions/${submission._id}`, {
            partA: submission.partA,
            partB: submission.partB,
            status: 'Under Review',
        });
        set({ submission: data });
        return data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to submit for review.');
    }
  },
  
  reset: () => set({
    indicators: [],
    submission: null,
    totalSelfAssessedScore: 0,
    totalReviewScore: 0,
    isLoading: true,
    error: null,
  }),
}));

export default useSubmissionStore;
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSecureDownloader from '../../hooks/useSecureDownloader';
import Spinner from '../../components/shared/Spinner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Alert from '../../components/shared/Alert';
import Button from '../../components/shared/Button';
import { Download, FileText, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import toast from 'react-hot-toast';

interface Indicator {
    indicatorCode: string;
    title: string;
    fileKey?: string;
    evidenceLinkFileKey?: string;
    selfAssessedScore?: number;
    reviewScore?: number;
    reviewRemark?: string;
}

interface SubCriterion {
    subCriteriaCode: string;
    title: string;
    remark?: string;
    indicators: Indicator[];
}

interface Criterion {
    criteriaCode: string;
    title: string;
    reviewScore?: number;
    subCriteria: SubCriterion[];
}

interface Submission {
    _id: string;
    title: string;
    academicYear: string;
    status: string;
    department: { name: string };
    partA: { summaryFileKey?: string };
    partB: { criteria: Criterion[] };
}

const SaveStatusIndicator = ({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) => {
    if (status === 'idle') return <div className="w-40" />;
    const config = {
        saving: { text: 'Saving...', icon: <Spinner size="sm" />, color: 'text-muted-foreground' },
        saved: { text: 'All changes saved', icon: <CheckCircle size={16} />, color: 'text-green-600' },
        error: { text: 'Save failed', icon: <AlertTriangle size={16} />, color: 'text-destructive' },
    };
    const current = config[status];
    return (
        <div className={`flex items-center justify-end w-40 gap-2 text-sm transition-opacity duration-300 ${current.color}`}>
            {current.icon}
            <span>{current.text}</span>
        </div>
    );
};

const ReviewSubmission: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { downloadFile, isDownloading } = useSecureDownloader();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const initialLoad = useRef(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    // --- FIX START: Create a helper function to apply default scores ---
    const getSubmissionWithDefaults = (sub: Submission): Submission => {
        const subWithDefaults = JSON.parse(JSON.stringify(sub)); // Deep clone
        subWithDefaults.partB.criteria.forEach((criterion: Criterion) => {
            criterion.subCriteria.forEach((subCriterion: SubCriterion) => {
                subCriterion.indicators.forEach((indicator: Indicator) => {
                    // If reviewScore is null or undefined, default it to selfAssessedScore
                    if (indicator.reviewScore == null && indicator.selfAssessedScore != null) {
                        indicator.reviewScore = indicator.selfAssessedScore;
                    }
                });
            });
        });
        return subWithDefaults;
    };
    // --- FIX END ---

    useEffect(() => {
        const fetchSubmission = async () => {
            setIsLoading(true);
            initialLoad.current = true;
            try {
                const { data } = await apiClient.get(`/submissions/${id}`);
                setSubmission(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
                setTimeout(() => { initialLoad.current = false; }, 500);
            }
        };
        fetchSubmission();
    }, [id]);

    useEffect(() => {
        if (initialLoad.current || saveStatus === 'saving' || isLoading) {
            return;
        }
        const handler = setTimeout(() => {
            const saveChanges = async () => {
                if (!submission) return;
                setSaveStatus('saving');
                try {
                    // --- FIX: Apply defaults before autosaving ---
                    const submissionToSave = getSubmissionWithDefaults(submission);
                    const payload = { partB: submissionToSave.partB };
                    await apiClient.put(`/submissions/${id}`, payload);
                    setSaveStatus('saved');
                } catch (err) {
                    console.error("Autosave failed:", err);
                    setSaveStatus('error');
                }
            };
            saveChanges();
        }, 2000);
        return () => {
            clearTimeout(handler);
        };
    }, [submission, id, isLoading, saveStatus]);

    const handleStateChange = (path: (string | number)[], value: any) => {
        setSaveStatus('idle');
        setSubmission(prev => {
            if (!prev) return null;
            const newState = JSON.parse(JSON.stringify(prev));
            let current: any = newState;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newState;
        });
    };
    
   


     const handleSendForApproval = async () => {
    if (saveStatus === 'saving') {
      toast('Please wait for the current changes to finish saving.', {
        icon: '⏳',
      });
      return;
    }
    setConfirmDialogOpen(true); // open confirmation modal
  };

  // ✅ runs only after confirm dialog "Yes"
  const confirmSendForApproval = async () => {
    setConfirmDialogOpen(false);
    setIsSubmitting(true);
    try {
      if (!submission) throw new Error('Submission data is missing.');
      const submissionWithDefaults = getSubmissionWithDefaults(submission);
      const reviewData = {
        status: 'Pending Final Approval',
        partB: submissionWithDefaults.partB,
      };
      await apiClient.put(`/submissions/${id}`, reviewData);
      toast.success('Submission sent for final approval!');
      navigate('/app/qaa/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send for final approval.');
    } finally {
      setIsSubmitting(false);
    }
  };

    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    if (error) return <Alert message={error} type="error" />;
    if (!submission) return <Alert message="Submission data not found." />;

    return (
        <>
        <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 sticky top-0 z-20 border border-border">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Reviewing: {submission.department.name} ({submission.academicYear})</h1>
                    <p className="text-muted-foreground">Status: <span className="font-semibold">{submission.status}</span></p>
                </div>
                <div className="flex items-center gap-4">
                    <SaveStatusIndicator status={saveStatus} />
                    <Button onClick={handleSendForApproval} isLoading={isSubmitting}>Send for Final Approval</Button>
                </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground flex items-center"><FileText size={22} className="mr-3 text-muted-foreground"/> Part A: Executive Summary</h2>
                </div>
                <div className="p-4">
                    {submission.partA.summaryFileKey ? (
                        <Button onClick={() => downloadFile(submission.partA.summaryFileKey)} variant="secondary" isLoading={isDownloading}>
                            <Download size={16} className="mr-2" /> View Summary Document
                        </Button>
                    ) : (
                        <span className="text-sm text-muted-foreground italic">No summary document submitted</span>
                    )}
                </div>
            </div>

            {submission.partB.criteria.map((criterion, critIndex) => (
                <div key={criterion.criteriaCode} className="bg-card rounded-lg shadow-sm border border-border">
                    <div className="p-4 border-b border-border">
                        <h2 className="text-xl font-bold text-foreground">Criterion {criterion.criteriaCode}: {criterion.title}</h2>
                    </div>

                    {criterion.subCriteria.map((sc, scIndex) => (
                        <div key={sc.subCriteriaCode} className="border-t border-border">
                            <h3 className="text-lg font-semibold bg-secondary p-3 text-secondary-foreground">{sc.subCriteriaCode}: {sc.title}</h3>
                            <div className="p-4">
                                <div className="divide-y divide-border">
                                    {sc.indicators.map((ind, indIndex) => (
                                        <div key={ind.indicatorCode} className="py-4">
                                            <p className="text-sm font-semibold text-foreground mb-2">{ind.indicatorCode}: {ind.title}</p>
                                            <div className="flex items-center space-x-2 mb-3">
                                                {ind.fileKey && <Button onClick={() => downloadFile(ind.fileKey)} size="sm" variant="outline" isLoading={isDownloading}>View Main Doc</Button>}
                                                {ind.evidenceLinkFileKey && <Button onClick={() => downloadFile(ind.evidenceLinkFileKey)} size="sm" variant="outline" isLoading={isDownloading}>View Evidence Doc</Button>}
                                                {!ind.fileKey && !ind.evidenceLinkFileKey && <span className="text-xs text-muted-foreground italic">No documents submitted</span>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-center">
                                                        <label className="block text-xs font-medium text-muted-foreground">Dept. Score</label>
                                                        <p className="text-2xl font-bold text-foreground">{ind.selfAssessedScore ?? 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">Review Score</label>
                                                        <select
                                                            className="w-full p-2 border border-input rounded-md bg-card focus:ring-ring focus:border-ring"
                                                            value={ind.reviewScore ?? ind.selfAssessedScore ?? ''}
                                                            onChange={(e) => handleStateChange(['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'indicators', indIndex, 'reviewScore'], e.target.value === '' ? null : Number(e.target.value))}
                                                        >
                                                            <option value="">Set score...</option>
                                                            {[4,3,2,1,0].map(v => <option key={v} value={v}>{v}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-1">Indicator Remark</label>
                                                    <textarea 
                                                      rows={2} 
                                                      placeholder="Add specific remark for this indicator..." 
                                                      className="w-full p-2 border border-input rounded-md bg-card focus:ring-ring"
                                                      value={ind.reviewRemark || ''}
                                                      onChange={(e) => handleStateChange(['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'indicators', indIndex, 'reviewRemark'], e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 mt-4 border-t border-border">
                                    <label className="flex items-center text-sm font-medium text-foreground mb-1"><MessageSquare size={16} className="mr-2"/>Overall Remarks for this Sub-Criterion</label>
                                    <textarea 
                                      rows={2} 
                                      placeholder="Add summary comments..." 
                                      className="w-full p-2 border border-input rounded-md bg-card focus:ring-ring" 
                                      value={sc.remark || ''} 
                                      onChange={(e) => handleStateChange(['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'remark'], e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}



                </div>

                
            ))}


            
                  
        </div>
           <ConfirmDialog
        isOpen={confirmDialogOpen}
        title="Send for Final Approval"
        message="Are you sure you want to send this submission for final approval? Once submitted, no further edits can be made."
        confirmLabel="Yes, Send"
        cancelLabel="Cancel"
        onConfirm={confirmSendForApproval}
        onCancel={() => setConfirmDialogOpen(false)}
      />

        </>
             
    );
};

export default ReviewSubmission;
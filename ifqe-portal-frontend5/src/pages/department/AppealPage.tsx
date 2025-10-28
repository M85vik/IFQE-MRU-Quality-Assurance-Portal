// src/pages/department/AppealPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { submitAppeal } from '../../services/submissionService';
import useSecureDownloader from '../../hooks/useSecureDownloader';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { Send, Download, MessageSquare } from 'lucide-react';

// Define a more specific type for our submission data
interface Indicator {
    _id: string;
    indicatorCode: string;
    title: string;
    fileKey?: string;
    evidenceLinkFileKey?: string;
    finalScore?: number;
    reviewScore?: number;
    reviewRemark?: string;
    superuserRemark?: string;
}

interface SubCriterion {
    _id: string;
    indicators: Indicator[];
}

interface Criterion {
    _id: string;
    subCriteria: SubCriterion[];
}

interface Submission {
    _id: string;
    title: string;
    status: string;
    hasAppealed: boolean;
    partB: {
        criteria: Criterion[];
    };
}


const AppealPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState('');
    const [appealedIndicators, setAppealedIndicators] = useState<Record<string, string>>({});
    const { downloadFile, isDownloading } = useSecureDownloader();

    useEffect(() => {
        const fetchSubmission = async () => {
            setIsLoading(true);
            try {
                const { data } = await apiClient.get(`/submissions/${id}`);
                if (data.status !== 'Completed' || data.hasAppealed) {
                    navigate('/app/department/dashboard');
                    return;
                }
                setSubmission(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmission();
    }, [id, navigate]);

    const handleToggleAppeal = (indicatorCode: string) => {
        setAppealedIndicators(prev => {
            const newAppealed = { ...prev };
            if (newAppealed[indicatorCode] !== undefined) {
                delete newAppealed[indicatorCode];
            } else {
                newAppealed[indicatorCode] = ''; 
            }
            return newAppealed;
        });
    };
    
    const handleCommentChange = (indicatorCode: string, comment: string) => {
        setAppealedIndicators(prev => ({ ...prev, [indicatorCode]: comment }));
    };

    const handleSubmitAppeal = async () => {
        const appealData = Object.entries(appealedIndicators)
            .filter(([, comment]) => comment.trim() !== '')
            .map(([indicatorCode, departmentComment]) => ({ indicatorCode, departmentComment }));

        if (appealData.length === 0 || appealData.length !== Object.keys(appealedIndicators).length) {
            setModalError('You must select at least one indicator and provide a justification comment for each selection to submit an appeal.');
            return;
        }

        if (!window.confirm(`You are about to appeal ${appealData.length} indicator(s). This action can only be performed once. Do you want to continue?`)) {
            return;
        }

        setIsSubmitting(true);
        try {
            await submitAppeal(id!, { indicators: appealData });
            alert('Your appeal has been submitted successfully.');
            navigate('/app/department/dashboard');
        } catch (err: any) {
            setModalError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) return <Spinner size="lg" />;
    if (error) return <Alert message={error} type="error" />;
    if (!submission) return null;

    const appealedCount = Object.keys(appealedIndicators).length;

    return (
        <>
            <div className="space-y-6">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border border-border sticky top-0 z-10">
                    <div>
                        <h1 className="text-2xl font-bold">Appeal Submission: {submission.title}</h1>
                        <p className="text-muted-foreground">Select indicators you wish to appeal and provide a clear justification.</p>
                    </div>
                    <Button onClick={handleSubmitAppeal} isLoading={isSubmitting} disabled={appealedCount === 0}>
                        <Send className="mr-2" size={18} />
                        Submit Appeal ({appealedCount})
                    </Button>
                </div>

                 {submission.partB.criteria.map((criterion) => (
                    <div key={criterion._id} className="bg-card rounded-lg border border-border overflow-hidden">
                        {criterion.subCriteria.map((sc) => (
                             <div key={sc._id} className="p-4">
                                {sc.indicators.map((ind) => (
                                    <div key={ind._id} className="py-4 border-b last:border-b-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <p className="font-semibold">{ind.indicatorCode}: {ind.title}</p>
                                                <p className="text-sm mt-1">Final Score: <span className="font-bold text-lg text-destructive-DEFAULT">{ind.finalScore ?? ind.reviewScore} / 4</span></p>
                                            </div>
                                            <input type="checkbox" checked={appealedIndicators[ind.indicatorCode] !== undefined} onChange={() => handleToggleAppeal(ind.indicatorCode)} className="form-checkbox h-5 w-5 text-primary-DEFAULT rounded mt-1" />
                                        </div>
                                        
                                        {/* --- NEW: Reviewer Remarks --- */}
                                        {(ind.reviewRemark || ind.superuserRemark) && (
                                            <div className="mt-3 space-y-2">
                                                {ind.reviewRemark && <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex items-start"><MessageSquare size={16} className="mr-3 mt-1 flex-shrink-0" /><div><span className="font-bold">QAA Reviewer's Remark:</span> {ind.reviewRemark}</div></div>}
                                                {ind.superuserRemark && <div className="bg-purple-50 text-purple-800 p-3 rounded-lg text-sm flex items-start"><MessageSquare size={16} className="mr-3 mt-1 flex-shrink-0" /><div><span className="font-bold">Superuser's Remark:</span> {ind.superuserRemark}</div></div>}
                                            </div>
                                        )}
                                        
                                        {/* --- NEW: Download Buttons --- */}
                                        <div className="flex items-center space-x-2 mt-3">
                                            {ind.fileKey && <Button onClick={() => downloadFile(ind.fileKey)} size="sm" variant="outline" isLoading={isDownloading}><Download size={14} className="mr-2"/> View Main Doc</Button>}
                                            {ind.evidenceLinkFileKey && <Button onClick={() => downloadFile(ind.evidenceLinkFileKey)} size="sm" variant="outline" isLoading={isDownloading}><Download size={14} className="mr-2"/> View Evidence Doc</Button>}
                                        </div>

                                        {appealedIndicators[ind.indicatorCode] !== undefined && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-foreground mb-1">Your Justification for Appeal:</label>
                                                <textarea value={appealedIndicators[ind.indicatorCode]} onChange={(e) => handleCommentChange(ind.indicatorCode, e.target.value)} rows={3} className="w-full p-2 border border-input rounded-md bg-background" placeholder={`Explain why you are appealing the score for ${ind.indicatorCode}...`}/>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                 ))}
            </div>
            <Modal isOpen={!!modalError} onClose={() => setModalError('')} title="Appeal Submission Error">
                <Alert message={modalError} type="error" />
            </Modal>
        </>
    );
};

export default AppealPage;
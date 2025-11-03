import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSubmissionStore from '../../store/submissionStore';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import Button from '../../components/shared/Button';
import FileUploader from '../../components/shared/FileUploader';
import { Save, Send, FileText, Download, ChevronDown } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import Scorecard from '../../components/shared/Scorecard';
import IndicatorItem from './components/IndicatorItem';
import PartATemplateViewer from './components/PartATemplateViewer';

interface Indicator {
    indicatorCode: string;
    title: string;
    templateFileKey?: string;
    requiresEvidenceLink?: boolean;
    rubric: any;
    guidelines: any;
}

interface SubCriterionSubmission {
    subCriteriaCode: string;
    title: string;
    indicators: {
        indicatorCode: string;
        title: string;
        fileKey: string | null;
        evidenceLinkFileKey: string | null;
        selfAssessedScore?: number;
    }[];
}

interface CriterionSubmission {
    criteriaCode: string;
    title: string;
    subCriteria: SubCriterionSubmission[];
}

interface Submission {
    _id: string;
    title: string;
    academicYear: string;
    status: 'Draft' | 'Under Review' | 'Approved';
    partA: {
        summaryFileKey: string | null;
    };
    partB: {
        criteria: CriterionSubmission[];
    };
}

interface SubmissionStoreState {
    submission: Submission | null;
    indicators: Indicator[];
    totalSelfAssessedScore: number;
    isLoading: boolean;
    error: string | null;
    initializeForm: (id: string) => void;
    reset: () => void;
    saveDraft: () => Promise<void>;
    submitForReview: () => Promise<void>;
    updatePartASummaryFileKey: (fileKey: string | null) => void;
    updateIndicatorFileKey: (criterionCode: string, subCriteriaCode: string, indicatorCode: string, fileKey: string | null) => void;
    updateIndicatorEvidenceLinkFileKey: (criterionCode: string, subCriteriaCode: string, indicatorCode: string, fileKey: string | null) => void;
}

const SubmissionForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('PartA');
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [openSubCriterion, setOpenSubCriterion] = useState<string | null>(null);

    const {
        submission,
        indicators,
        totalSelfAssessedScore,
        isLoading,
        error,
        initializeForm,
        reset,
        saveDraft,
        submitForReview,
        updatePartASummaryFileKey,
        updateIndicatorFileKey,
        updateIndicatorEvidenceLinkFileKey,
    } = useSubmissionStore<SubmissionStoreState>((state) => state);

    const handleToggleSubCriterion = (subCriteriaCode: string): void => {
        setOpenSubCriterion(prev => (prev === subCriteriaCode ? null : subCriteriaCode));
    };

    useEffect(() => {
        if (id) {
            initializeForm(id);
        }
        return () => reset();
    }, [id, initializeForm, reset]);

    const handleSaveDraft = async () => {
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            await saveDraft();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (err) {
            alert((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitForReview = async () => {
        if (window.confirm("Are you sure? You will not be able to edit after submission.")) {
            setIsSubmitting(true);
            try {
                await submitForReview();
                alert("Submission successful!");
                navigate('/app/department/dashboard');
            } catch (err) {
                alert((err as Error).message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleFileRemove = async (identifier: Record<string, any>, fileKey: string) => {
        if (identifier.partACode === 'SUMMARY') {
            updatePartASummaryFileKey(null);
        } else if (identifier.indicatorCode && identifier.isEvidenceLink) {
            updateIndicatorEvidenceLinkFileKey(identifier.criterionCode, identifier.subCriteriaCode, identifier.indicatorCode, null);
        } else if (identifier.indicatorCode) {
            updateIndicatorFileKey(identifier.criterionCode, identifier.subCriteriaCode, identifier.indicatorCode, null);
        }

        try {
            await saveDraft();
        } catch (err) {
            alert(`Failed to save file deletion: ${(err as Error).message}`);
            if (id) {
                initializeForm(id);
            }
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    if (error) return <Alert message={error} type="error" />;
    if (!submission) return <Alert message="Could not load submission data." type="error" />;

    const isFormDisabled = submission.status !== 'Draft';
    const criteriaList = [...submission.partB.criteria].sort((a, b) => a.criteriaCode.localeCompare(b.criteriaCode));
    const activeCriterion = criteriaList.find(c => c.criteriaCode === activeTab);

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{submission.title || `IFQE Submission: ${submission.academicYear}`}</h1>
                        <p className="text-muted-foreground">Status: <span className="font-semibold">{submission.status}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-48">
                            <Scorecard
                                title="Total Self-Assessed Score"
                                score={totalSelfAssessedScore}
                                colorClass="bg-primary"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            {/* Highlighted Save Draft button */}
                            <Button
                                onClick={handleSaveDraft}
                                isLoading={isSaving}
                                disabled={isFormDisabled}
                                className="bg-primary text-white font-semibold shadow-md hover:scale-105 transition-transform"
                            >
                                <Save size={18} className="mr-2" /> {saveSuccess ? 'Saved!' : 'Save Draft'}
                            </Button>

                            <Button onClick={handleSubmitForReview} isLoading={isSubmitting} disabled={isFormDisabled}>
                                <Send size={18} className="mr-2" /> Submit for Review
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-6">
                    <aside className="w-full md:w-1/4">
                        <nav className="space-y-1 bg-card p-4 rounded-lg shadow-sm sticky top-24 border border-border">
                            <button onClick={() => setActiveTab('PartA')} className={`w-full text-left p-3 rounded flex items-center space-x-3 ${activeTab === 'PartA' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-accent'}`}><FileText size={18} /><span>Part A</span></button>
                            {criteriaList.map(c => (
                                <button key={c.criteriaCode} onClick={() => setActiveTab(c.criteriaCode)} className={`w-full text-left p-3 rounded ${activeTab === c.criteriaCode ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-accent'}`}>
                                    Criterion {c.criteriaCode}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="w-full md:w-3/4 bg-card p-6 rounded-lg shadow-sm border border-border">
                        {activeTab === 'PartA' && (
                            <div>
                                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                                    <h2 className="text-2xl font-bold">Part A: Executive Summary</h2>
                                    {/* Highlighted View Template button */}
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsTemplateModalOpen(true)}
                                        className="bg-primary/90 text-white font-semibold hover:scale-105 transition-transform"
                                    >
                                        <Download size={16} className="mr-2" />  View Template
                                    </Button>
                                </div>

                                {/* Darker grey informative section */}
                                <div className="bg-muted/60 p-4 rounded-lg text-foreground/70 text-sm space-y-2 mb-6">
                                    <p>Part A provides an Executive Summary from your school, highlighting its profile, vision, mission, and alignment with the University's institutional goals.</p>
                                    <p>Please compile a single document containing all required sections (SWOC analysis, strategic plans, best practices, etc.) and upload it below. Use the template for guidance on structure and content.</p>
                                </div>

                                <FileUploader
                                    submissionId={submission._id}
                                    identifier={{ partACode: 'SUMMARY' }}
                                    onUploadSuccess={(fileKey) => updatePartASummaryFileKey(fileKey)}
                                    onRemove={(fileKey) => handleFileRemove({ partACode: 'SUMMARY' }, fileKey)}
                                    initialFileKey={submission.partA.summaryFileKey}
                                    isDisabled={isFormDisabled}
                                />
                            </div>
                        )}

                        {activeCriterion && (
                            <div>
                                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                                    <h2 className="text-2xl font-bold text-foreground">Criterion {activeCriterion.criteriaCode}: {activeCriterion.title}</h2>
                                </div>
                                <div className="space-y-2">
                                    {[...activeCriterion.subCriteria].sort((a, b) => a.subCriteriaCode.localeCompare(b.subCriteriaCode)).map(sc => (
                                        <div key={sc.subCriteriaCode} className="border border-border rounded-md overflow-hidden bg-card">
                                            <button
                                                onClick={() => handleToggleSubCriterion(sc.subCriteriaCode)}
                                                className="w-full text-left flex justify-between items-center text-lg font-semibold bg-secondary p-3 hover:bg-accent focus:outline-none"
                                            >
                                                <span>{sc.subCriteriaCode}: {sc.title}</span>
                                                <ChevronDown
                                                    className={`transition-transform duration-200 ${openSubCriterion === sc.subCriteriaCode ? 'transform rotate-180' : ''}`}
                                                />
                                            </button>
                                            {openSubCriterion === sc.subCriteriaCode && (
                                                <div className="border-t border-border">
                                                    {[...sc.indicators].sort((a, b) => a.indicatorCode.localeCompare(b.indicatorCode)).map(subInd => {
                                                        const fullIndicator = indicators.find(i => i.indicatorCode === subInd.indicatorCode);
                                                        if (!fullIndicator) return null;
                                                        return (
                                                            <IndicatorItem
                                                                key={fullIndicator.indicatorCode}
                                                                indicator={fullIndicator}
                                                                criterionCode={activeCriterion.criteriaCode}
                                                                subCriteriaCode={sc.subCriteriaCode}
                                                                isDisabled={isFormDisabled}
                                                                onFileRemove={handleFileRemove}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} title="Part A: Executive Summary Template">
                <PartATemplateViewer />
            </Modal>
        </>
    );
};

export default SubmissionForm;

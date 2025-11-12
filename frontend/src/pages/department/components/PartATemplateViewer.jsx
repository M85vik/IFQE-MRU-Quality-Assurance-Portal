import React from 'react';
import useSecureDownloader from '../../../hooks/useSecureDownloader';
import Button from '../../../components/shared/Button';
import { Download, FileText } from 'lucide-react';

const PartATemplateViewer = () => {
    const { downloadFile, isDownloading } = useSecureDownloader();
  
    const templateFileKey = 'templates/PartA_Template.xlsx';

    const templateSections = [
        { code: "1", title: "About the University (Word limit: 350-500 words)" },
        { code: "2", title: "About the School (Word limit: 350 - 500 words)" },
        { code: "3", title: "Vision: School vision statement" },
        { code: "4", title: "Mission: School mission statement" },
        { code: "5", title: "Alignment of School Vision Mission with University (300 - 500 words)" },
        { code: "6", title: "SWOC Analysis (Detailed description)" },
        { code: "7", title: "Strategic Plan (CAY) (Goals & Roadmap - Execution details)" },
        { code: "8", title: "Best practices" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Template Contents</h3>
                <p className="text-sm text-gray-800 mb-4">
                    Your single summary document for Part A should be a well-structured report containing the following sections:
                </p>
                <div className="space-y-2 border rounded-lg p-4 bg-gray-80">
                    {templateSections.map(section => (
                        <div key={section.code} className="flex items-start">
                            <FileText className="h-4 w-4 text-gray-500 mt-1 mr-3 flex-shrink-0" />
                            <p className="text-gray-700"><strong>{section.code}. {section.title}</strong></p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="text-center pt-4 border-t">
                <Button onClick={() => downloadFile(templateFileKey)} isLoading={isDownloading}>
                    <Download size={18} className="mr-2"/>
                    Download Template
                </Button>
            </div>
        </div>
    );
};

export default PartATemplateViewer;
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

const Indicator381Preview = ({ fileKey }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileKey) {
      setSummaryData(null);
      return;
    }

    const fetchAndParseExcel = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!fileKey.match(/\.(xlsx|xls|csv)$/i)) {
          throw new Error('Cannot analyze this file type. Please upload a valid Excel (.xlsx/.xls) template.');
        }

        const response = await apiClient.get(
          `/files/download-proxy?fileKey=${encodeURIComponent(fileKey)}`,
          { responseType: 'arraybuffer' }
        );

        if (!response.data) throw new Error('Failed to download the template file');

        const workbook = XLSX.read(response.data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // The file has TWO sections:
        // Section A: "3.8(a) Students going for Internship as per Scheme" (industry internship)
        //   S.No | Student Name | Roll No | Program/Branch | Level (National/International)
        //   | Company/Organization Name | Evidence Link
        // Section B: "3.8(b) Students going for In House Projects as per scheme"
        //   S.No | Student Name | Roll No | Program/Branch | Project Title | SDG Mapped | Evidence Link

        // Strategy: scan rows; when we see "3.8(a)" header, enter section A mode;
        // when we see "3.8(b)" header, switch to section B mode.
        // Count entries per program per section.

        const programMap = {}; // { programName: { industry: count, inhouse: count } }

        let currentSection = null; // 'a' or 'b'
        let colProgram = 3;
        let colName = 1;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          // Detect section headers
          const firstCellStr = String(row[0] || row[1] || '').toLowerCase().trim();
          const rowText = row.map(c => String(c || '').toLowerCase()).join(' ');

          if (rowText.includes('3.8(a)') || rowText.includes('3.8(a)') || rowText.includes('internship as per scheme') || rowText.includes('students going for internship')) {
            currentSection = 'a';
            colProgram = 3; // reset to defaults for section A
            colName = 1;
            continue;
          }
          if (rowText.includes('3.8(b)') || rowText.includes('in house projects') || rowText.includes('inhouse projects')) {
            currentSection = 'b';
            colProgram = 3; // reset to defaults for section B
            colName = 1;
            continue;
          }

          // Detect header row for current section (dynamic column detection)
          const isHeaderRow = row.some(cell => {
            const t = String(cell || '').toLowerCase();
            return t.includes('program') || t.includes('branch') || t.includes('roll') || t.includes('student name');
          });
          if (isHeaderRow) {
            row.forEach((cell, idx) => {
              const t = String(cell || '').toLowerCase().trim();
              if (t.includes('program') || t.includes('branch')) colProgram = idx;
              else if (t.includes('student name') || (t.includes('name') && !t.includes('program') && !t.includes('company') && !t.includes('organisation'))) colName = idx;
            });
            continue;
          }

          if (!currentSection) continue;

          // Check if it's a data row (starts with number or has student name)
          const snoCell = String(row[0] || '').trim();
          const nameCell = row[colName] && String(row[colName]).trim();

          if (!nameCell) continue;
          if (nameCell.toLowerCase().includes('total') || nameCell.toLowerCase().includes('s.no') || nameCell.toLowerCase() === 'name') continue;
          if (!/^\d+$/.test(snoCell) && snoCell !== '') {
            // Not a numbered row, might be a title row - skip
            if (snoCell.toLowerCase().includes('s.no') || snoCell.toLowerCase().includes('sl')) continue;
          }

          const program = (row[colProgram] && String(row[colProgram]).trim()) || 'General';

          if (!programMap[program]) {
            programMap[program] = { industry: 0, inhouse: 0 };
          }

          if (currentSection === 'a') {
            programMap[program].industry++;
          } else if (currentSection === 'b') {
            programMap[program].inhouse++;
          }
        }

        const programs = Object.entries(programMap).map(([name, counts]) => ({ name, ...counts }));
        const totalIndustry = programs.reduce((s, p) => s + p.industry, 0);
        const totalInhouse = programs.reduce((s, p) => s + p.inhouse, 0);

        setSummaryData({ programs, totalIndustry, totalInhouse });
      } catch (err) {
        console.error('Preview generation error:', err);
        setError(err.message.includes('Cannot analyze') ? err.message : `Failed to generate summary: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseExcel();
  }, [fileKey]);

  if (loading) {
    return (
      <div className="mt-6 p-4 rounded-lg border border-blue-100 bg-blue-50/50 flex items-center gap-3 w-full">
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        <span className="text-sm text-blue-700 font-medium">Analyzing template data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 rounded-lg border border-red-100 bg-red-50 flex items-center gap-3 w-full">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span className="text-sm text-red-700">{error}</span>
      </div>
    );
  }

  if (summaryData !== null) {
    const total = summaryData.totalIndustry + summaryData.totalInhouse;
    return (
      <div className="mt-6 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800">Uploaded Data Summary</h3>
            <p className="text-xs text-gray-500 mt-0.5">Automated validation of internship and in-house project data.</p>
          </div>
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center border-2 border-teal-200">
            <span className="text-lg font-bold text-teal-700">{total}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td colSpan="3" className="px-3 py-2 font-bold text-gray-800 text-left" style={{ fontSize: '11px' }}>
                    3.8 Internships
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-100/60 text-gray-600 font-bold" style={{ fontSize: '11px' }}>
                  <th className="px-3 py-2 text-left border-r border-gray-200 w-[40%]">Name of the Program</th>
                  <th className="px-3 py-2 text-center border-r border-gray-200 w-[30%]">Count(inhouse)</th>
                  <th className="px-3 py-2 text-center w-[30%]">Count(industry)</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.programs.map((prog, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-3 py-2 font-semibold text-gray-800 border-r border-gray-200" style={{ fontSize: '11px' }}>{prog.name}</td>
                    <td className="px-3 py-2 text-center font-bold text-teal-700 bg-teal-50/30 border-r border-gray-200" style={{ fontSize: '11px' }}>{prog.inhouse}</td>
                    <td className="px-3 py-2 text-center font-bold text-blue-700 bg-blue-50/30" style={{ fontSize: '11px' }}>{prog.industry}</td>
                  </tr>
                ))}
                {summaryData.programs.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-3 py-3 text-center text-gray-400 italic" style={{ fontSize: '11px' }}>
                      No internship data found in the uploaded file.
                    </td>
                  </tr>
                )}
                {summaryData.programs.length > 0 && (
                  <tr className="bg-gray-50/80 border-t-2 border-gray-200">
                    <td className="px-3 py-2 font-bold text-gray-700 border-r border-gray-200" style={{ fontSize: '11px' }}>Total</td>
                    <td className="px-3 py-2 text-center font-bold text-teal-800 border-r border-gray-200" style={{ fontSize: '11px' }}>{summaryData.totalInhouse}</td>
                    <td className="px-3 py-2 text-center font-bold text-blue-800" style={{ fontSize: '11px' }}>{summaryData.totalIndustry}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Indicator381Preview;

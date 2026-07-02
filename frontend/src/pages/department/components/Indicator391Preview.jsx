import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

const Indicator391Preview = ({ fileKey }) => {
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
        // Section A: "3.9.1(a) Number of Student publication"
        //   S.No | Name of the student | Roll No | Program/Branch | Title of Publication
        //   | SDG Mapped | Journal/Conference Name | Paper Indexing | Date of Publication
        //   | Paper DOI | CoAuthor | Evidence Link
        //   → Journal vs Conference detected from "Journal/Conference Name" or "Paper Indexing" column
        // Section B: "3.9.1(b) Number of Student patents"
        //   S.No | Name of the student | Roll No | Program/Branch | Title of Patent
        //   | Application Number | Date of Publication/Grant | SDG Mapped | CoAuthor

        const programMap = {}; // { programName: { journal: count, conference: count } }

        let currentSection = null; // 'a' (publications) or 'b' (patents)
        let colProgram = 3;
        let colName = 1;
        let colJournalConf = 6; // "Journal/Conference Name"
        let colIndexing = 7;    // "Paper Indexing"

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const rowText = row.map(c => String(c || '').toLowerCase()).join(' ');

          // Detect section headers
          if (rowText.includes('3.9.1(a)') || rowText.includes('student publication') || rowText.includes('number of student publication')) {
            currentSection = 'a';
            colProgram = 3;
            colName = 1;
            colJournalConf = 6;
            colIndexing = 7;
            continue;
          }
          if (rowText.includes('3.9.1(b)') || rowText.includes('student patent') || rowText.includes('number of student patent')) {
            currentSection = 'b';
            continue;
          }

          // Detect header row (dynamic column detection)
          const isHeaderRow = row.some(cell => {
            const t = String(cell || '').toLowerCase();
            return t.includes('program') || t.includes('branch') || t.includes('roll') || t.includes('student') || t.includes('journal');
          });
          if (isHeaderRow) {
            row.forEach((cell, idx) => {
              const t = String(cell || '').toLowerCase().trim();
              if (t.includes('program') || t.includes('branch')) colProgram = idx;
              else if ((t.includes('name') || t.includes('student')) && !t.includes('program') && !t.includes('journal') && !t.includes('conference')) colName = idx;
              else if (t.includes('journal') || t.includes('conference')) colJournalConf = idx;
              else if (t.includes('indexing') || t.includes('paper indexing')) colIndexing = idx;
            });
            continue;
          }

          // Only process section A (publications) for journal/conference summary
          if (currentSection !== 'a') continue;

          const snoCell = String(row[0] || '').trim();
          const nameCell = row[colName] && String(row[colName]).trim();
          if (!nameCell) continue;
          if (nameCell.toLowerCase().includes('total') || nameCell.toLowerCase() === 'name of the student') continue;

          const program = (row[colProgram] && String(row[colProgram]).trim()) || 'General';
          if (!programMap[program]) {
            programMap[program] = { journal: 0, conference: 0 };
          }

          // Determine if journal or conference based on the journal/conference cell or indexing
          const journalConf = String(row[colJournalConf] || '').toLowerCase().trim();
          const indexing = String(row[colIndexing] || '').toLowerCase().trim();

          if (journalConf.includes('conference') || journalConf.includes('conf') || indexing.includes('conference')) {
            programMap[program].conference++;
          } else {
            // Default: treat as journal publication
            programMap[program].journal++;
          }
        }

        const programs = Object.entries(programMap).map(([name, counts]) => ({ name, ...counts }));
        const totalJournal = programs.reduce((s, p) => s + p.journal, 0);
        const totalConference = programs.reduce((s, p) => s + p.conference, 0);

        setSummaryData({ programs, totalJournal, totalConference });
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
    const total = summaryData.totalJournal + summaryData.totalConference;
    return (
      <div className="mt-6 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800">Uploaded Data Summary</h3>
            <p className="text-xs text-gray-500 mt-0.5">Automated validation of student publications (journal &amp; conference).</p>
          </div>
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
            <span className="text-lg font-bold text-indigo-700">{total}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td colSpan="3" className="px-3 py-2 font-bold text-gray-800 text-left" style={{ fontSize: '11px' }}>
                    3.9.1(a) Number of Student publication
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-100/60 text-gray-600 font-bold" style={{ fontSize: '11px' }}>
                  <th className="px-3 py-2 text-left border-r border-gray-200 w-[40%]">Name of the Program</th>
                  <th className="px-3 py-2 text-center border-r border-gray-200 w-[30%]">Count(Journal)</th>
                  <th className="px-3 py-2 text-center w-[30%]">Count(Conference)</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.programs.map((prog, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-3 py-2 font-semibold text-gray-800 border-r border-gray-200" style={{ fontSize: '11px' }}>{prog.name}</td>
                    <td className="px-3 py-2 text-center font-bold text-indigo-700 bg-indigo-50/30 border-r border-gray-200" style={{ fontSize: '11px' }}>{prog.journal}</td>
                    <td className="px-3 py-2 text-center font-bold text-purple-700 bg-purple-50/30" style={{ fontSize: '11px' }}>{prog.conference}</td>
                  </tr>
                ))}
                {summaryData.programs.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-3 py-3 text-center text-gray-400 italic" style={{ fontSize: '11px' }}>
                      No publication data found in the uploaded file.
                    </td>
                  </tr>
                )}
                {summaryData.programs.length > 0 && (
                  <tr className="bg-gray-50/80 border-t-2 border-gray-200">
                    <td className="px-3 py-2 font-bold text-gray-700 border-r border-gray-200" style={{ fontSize: '11px' }}>Total</td>
                    <td className="px-3 py-2 text-center font-bold text-indigo-800 border-r border-gray-200" style={{ fontSize: '11px' }}>{summaryData.totalJournal}</td>
                    <td className="px-3 py-2 text-center font-bold text-purple-800" style={{ fontSize: '11px' }}>{summaryData.totalConference}</td>
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

export default Indicator391Preview;

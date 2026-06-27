import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

const Indicator371Preview = ({ fileKey }) => {
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

        // 3.7.1 Template columns:
        // S.No | Student Name | Roll No | Program/Branch | Year of Passing
        // | Status (Placed/Self Employed/Higher Studies/NA) | Organisation name
        // | Address Details | Level (National/International) | Country
        // | Job Profile/Name of Program pursued | Package(LPA) | Evidence Link
        let colProgram = 3;
        let colStatus = 5;
        let colName = 1;

        for (let i = 0; i < Math.min(rows.length, 5); i++) {
          const row = rows[i];
          if (!row) continue;
          row.forEach((cell, idx) => {
            if (!cell) return;
            const text = String(cell).toLowerCase().trim();
            if (text.includes('program') || text.includes('branch') || text.includes('programme')) {
              colProgram = idx;
            } else if (text.includes('status') || text.includes('placed') || text.includes('self employed')) {
              colStatus = idx;
            } else if (text.includes('student name') || text.includes('name of student') || (text.includes('name') && !text.includes('program') && !text.includes('organisation'))) {
              colName = idx;
            }
          });
        }

        // Find data start row
        let dataStart = 2;
        for (let i = 0; i < Math.min(rows.length, 7); i++) {
          const row = rows[i];
          if (!row) continue;
          const firstCell = String(row[0] || '').toLowerCase().trim();
          if (/^\d+$/.test(firstCell) || firstCell === '1') {
            dataStart = i;
            break;
          }
        }

        // Group by program, count by status
        const programMap = {};

        for (let i = dataStart; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const name = row[colName] && String(row[colName]).trim();
          if (!name) continue;
          if (name.toLowerCase().includes('total')) continue;

          const program = (row[colProgram] && String(row[colProgram]).trim()) || 'General';
          const status = row[colStatus] && String(row[colStatus]).toLowerCase().trim();

          if (!programMap[program]) {
            programMap[program] = { placed: 0, selfEmployed: 0, higherStudies: 0 };
          }

          if (status) {
            if (status.includes('placed') || status === 'placed') {
              programMap[program].placed++;
            } else if (status.includes('self') || status.includes('self employed') || status.includes('selfemployed')) {
              programMap[program].selfEmployed++;
            } else if (status.includes('higher') || status.includes('higher studies') || status.includes('higherstudies')) {
              programMap[program].higherStudies++;
            } else if (status === 'na' || status === 'n/a') {
              // skip
            } else {
              // default treat as placed if unclear
              programMap[program].placed++;
            }
          }
        }

        const programs = Object.entries(programMap).map(([name, counts]) => ({ name, ...counts }));
        const totalPlaced = programs.reduce((s, p) => s + p.placed, 0);
        const totalSelf = programs.reduce((s, p) => s + p.selfEmployed, 0);
        const totalHigher = programs.reduce((s, p) => s + p.higherStudies, 0);

        setSummaryData({ programs, totalPlaced, totalSelf, totalHigher });
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
    const total = summaryData.totalPlaced + summaryData.totalSelf + summaryData.totalHigher;
    return (
      <div className="mt-6 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800">Uploaded Data Summary</h3>
            <p className="text-xs text-gray-500 mt-0.5">Automated validation of student placement / employment / higher studies data.</p>
          </div>
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
            <span className="text-lg font-bold text-green-700">{total}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td colSpan="4" className="px-3 py-2 font-bold text-gray-800 text-left" style={{ fontSize: '11px' }}>
                    3.7.1 Percentage of students placed/self employed/ going for higher studies
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-100/60 text-gray-600 font-bold" style={{ fontSize: '11px' }}>
                  <th className="px-3 py-2 text-left border-r border-gray-200 w-[34%]">Name of the Program</th>
                  <th className="px-3 py-2 text-center border-r border-gray-200 w-[22%]">Placed</th>
                  <th className="px-3 py-2 text-center border-r border-gray-200 w-[22%]">Self employed</th>
                  <th className="px-3 py-2 text-center w-[22%]">higher studies</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.programs.map((prog, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-3 py-2 font-semibold text-gray-800 border-r border-gray-200" style={{ fontSize: '11px' }}>{prog.name}</td>
                    <td className="px-3 py-2 text-center font-bold text-green-700 bg-green-50/30 border-r border-gray-200" style={{ fontSize: '11px' }}>{prog.placed}</td>
                    <td className="px-3 py-2 text-center font-bold text-blue-700 bg-blue-50/30 border-r border-gray-200" style={{ fontSize: '11px' }}>{prog.selfEmployed}</td>
                    <td className="px-3 py-2 text-center font-bold text-purple-700 bg-purple-50/30" style={{ fontSize: '11px' }}>{prog.higherStudies}</td>
                  </tr>
                ))}
                {summaryData.programs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-3 py-3 text-center text-gray-400 italic" style={{ fontSize: '11px' }}>
                      No student data found in the uploaded file.
                    </td>
                  </tr>
                )}
                {summaryData.programs.length > 0 && (
                  <tr className="bg-gray-50/80 border-t-2 border-gray-200">
                    <td className="px-3 py-2 font-bold text-gray-700 border-r border-gray-200" style={{ fontSize: '11px' }}>Total</td>
                    <td className="px-3 py-2 text-center font-bold text-green-800 border-r border-gray-200" style={{ fontSize: '11px' }}>{summaryData.totalPlaced}</td>
                    <td className="px-3 py-2 text-center font-bold text-blue-800 border-r border-gray-200" style={{ fontSize: '11px' }}>{summaryData.totalSelf}</td>
                    <td className="px-3 py-2 text-center font-bold text-purple-800" style={{ fontSize: '11px' }}>{summaryData.totalHigher}</td>
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

export default Indicator371Preview;

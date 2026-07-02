import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

const Indicator345Preview = ({ fileKey }) => {
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

        // 3.4.5 Template columns:
        // S. No. | Title of the Session | Name of Resource Person
        // | Designation and Affiliation | Date | Duration
        // | No. of Participants | Mode (Online/Offline) | Evidence Link
        let colTitle = 1;

        for (let i = 0; i < Math.min(rows.length, 5); i++) {
          const row = rows[i];
          if (!row) continue;
          row.forEach((cell, idx) => {
            if (!cell) return;
            const text = String(cell).toLowerCase().trim();
            if (text.includes('title of the session') || text.includes('title of session') || (text.includes('title') && !text.includes('resource'))) {
              colTitle = idx;
            }
          });
        }

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

        let totalCount = 0;

        for (let i = dataStart; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const title = row[colTitle] && String(row[colTitle]).trim();
          if (!title) continue;
          if (title.toLowerCase().includes('total')) continue;

          totalCount++;
        }

        setSummaryData({ totalCount });
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
    return (
      <div className="mt-6 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800">Uploaded Data Summary</h3>
            <p className="text-xs text-gray-500 mt-0.5">Automated validation of competitive exam / career counselling sessions.</p>
          </div>
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-cyan-100 flex items-center justify-center border-2 border-cyan-200">
            <span className="text-lg font-bold text-cyan-700">{summaryData.totalCount}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td colSpan="2" className="px-3 py-2 font-bold text-gray-800 text-left" style={{ fontSize: '11px' }}>
                    3.4.5 Competetive exam/Career Counselling guiding sessions by external experts
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-100/60 text-gray-600 font-bold" style={{ fontSize: '11px' }}>
                  <th className="px-3 py-2 text-left border-r border-gray-200 w-[65%]">Name of the Program</th>
                  <th className="px-3 py-2 text-center w-[35%]">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-2 font-semibold text-gray-800 border-r border-gray-200" style={{ fontSize: '11px' }}>
                    Sessions Organized
                  </td>
                  <td className="px-3 py-2 text-center font-bold text-cyan-700 bg-cyan-50/30" style={{ fontSize: '11px' }}>
                    {summaryData.totalCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Indicator345Preview;

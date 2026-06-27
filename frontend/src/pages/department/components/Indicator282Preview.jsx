import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

// 2.8.2 Percentage of scholars awarded a doctoral degree out of the active scholars
const Indicator282Preview = ({ fileKey }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileKey) { setSummaryData(null); return; }

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

        // Template columns (Image 4 - 2.8.2):
        // S.No | Name of the scholar | Thesis Title | Name of the supervisor
        // | Name of the co-supervisor | Degree award notification | Ph.D. Certification
        let colScholar = 1;
        let colThesis = 2;
        let colDegreeNotification = 5;
        let colCertification = 6;

        for (let i = 0; i < Math.min(rows.length, 6); i++) {
          const row = rows[i];
          if (!row) continue;
          row.forEach((cell, idx) => {
            if (!cell) return;
            const text = String(cell).toLowerCase().trim();
            if (text.includes('name of the scholar') || text.includes('scholar')) {
              colScholar = idx;
            } else if (text.includes('thesis title') || text.includes('thesis')) {
              colThesis = idx;
            } else if (text.includes('degree award') || text.includes('notification')) {
              colDegreeNotification = idx;
            } else if (text.includes('certification') || text.includes('ph.d. cert') || text.includes('phd cert')) {
              colCertification = idx;
            }
          });
        }

        // Find data start row
        let dataStart = 2;
        for (let i = 0; i < Math.min(rows.length, 7); i++) {
          const row = rows[i];
          if (!row) continue;
          const firstCell = String(row[0] || '').trim();
          if (/^\d+$/.test(firstCell)) { dataStart = i; break; }
        }

        let totalScholars = 0;
        let awardedCount = 0;
        let deptName = 'Deptt';

        for (let i = dataStart; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;
          const scholar = row[colScholar] && String(row[colScholar]).trim();
          if (!scholar) continue;
          if (scholar.toLowerCase().includes('total')) continue;

          totalScholars++;

          // Check if degree award notification or certification is present/filled
          const degreeAward = row[colDegreeNotification] && String(row[colDegreeNotification]).trim();
          const cert = row[colCertification] && String(row[colCertification]).trim();
          if (
            (degreeAward && degreeAward !== '-' && degreeAward.toLowerCase() !== 'na') ||
            (cert && cert !== '-' && cert.toLowerCase() !== 'na')
          ) {
            awardedCount++;
          }
        }

        const percentage = totalScholars > 0
          ? ((awardedCount / totalScholars) * 100).toFixed(1)
          : '0.0';

        setSummaryData({ totalScholars, awardedCount, percentage, deptName });
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
            <p className="text-xs text-gray-500 mt-0.5">Automated validation of doctoral degree award records.</p>
          </div>
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center border-2 border-rose-200">
            <span className="text-lg font-bold text-rose-700">{summaryData.totalScholars}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td colSpan="3" className="px-3 py-2 font-bold text-gray-800 text-left" style={{ fontSize: '11px' }}>
                    2.8 Ph.D. Program
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-100/60 text-gray-600 font-bold" style={{ fontSize: '11px' }}>
                  <th className="px-3 py-2 text-left border-r border-gray-200 w-[30%]">deptt</th>
                  <th className="px-3 py-2 text-center border-r border-gray-200 w-[30%]">Number of Active Scholars</th>
                  <th className="px-3 py-2 text-center w-[40%]">Percentage of scholars awarded a doctoral degree out of the active scholars</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-2.5 font-semibold text-gray-700 border-r border-gray-200" style={{ fontSize: '11px' }}>
                    {summaryData.deptName}
                  </td>
                  <td className="px-3 py-2.5 text-center font-bold text-violet-700 bg-violet-50/30 border-r border-gray-200" style={{ fontSize: '11px' }}>
                    {summaryData.totalScholars}
                  </td>
                  <td className="px-3 py-2.5 text-center font-bold text-rose-700 bg-rose-50/30" style={{ fontSize: '11px' }}>
                    {summaryData.percentage}%
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

export default Indicator282Preview;

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

const Indicator212Preview = ({ fileKey }) => {
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

        // Column indices based on 2.1.2 template:
        // S.No | Title of Paper | Author's Name | Affiliation | Title of Conference | Organized by
        // | Category (WoS/SCI/SCOPUS/EBSCO/ABDC) | Publication Month | No. of Conference Proceedings
        // | Name of Publisher | DOI Link | SDG Mapped
        let colTitle = 1;
        let colCategory = 6;
        let colDept = 3; // Affiliation used as dept

        // Dynamically detect header columns
        for (let i = 0; i < Math.min(rows.length, 5); i++) {
          const row = rows[i];
          if (!row) continue;
          row.forEach((cell, idx) => {
            if (!cell) return;
            const text = String(cell).toLowerCase().trim();
            if (text.includes('title of the paper') || text.includes('title of paper') || (text.includes('title') && !text.includes('conference'))) {
              colTitle = idx;
            } else if (text.includes('category')) {
              colCategory = idx;
            } else if (text.includes('affiliation') || text.includes('department')) {
              colDept = idx;
            }
          });
        }

        // Find data start row
        let dataStart = 2;
        for (let i = 0; i < Math.min(rows.length, 6); i++) {
          const row = rows[i];
          if (!row) continue;
          const firstCell = String(row[0] || '').toLowerCase().trim();
          if (/^\d+$/.test(firstCell) || firstCell === '1') {
            dataStart = i;
            break;
          }
        }

        let totalPapers = 0;
        let scopusIndexed = 0;
        let nonIndexed = 0;
        let departmentName = 'Department';

        for (let i = dataStart; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const title = row[colTitle] && String(row[colTitle]).trim();
          if (!title) continue;
          if (title.toLowerCase().includes('total')) continue;

          const category = row[colCategory] && String(row[colCategory]).toLowerCase().trim();
          const dept = row[colDept] && String(row[colDept]).trim();

          if (dept && dept !== '' && departmentName === 'Department') {
            departmentName = dept;
          }

          totalPapers++;

          if (category) {
            if (
              category.includes('scopus') ||
              category.includes('wos') ||
              category.includes('sci') ||
              category.includes('ebsco') ||
              category.includes('abdc')
            ) {
              scopusIndexed++;
            } else {
              nonIndexed++;
            }
          } else {
            nonIndexed++;
          }
        }

        setSummaryData({ totalPapers, scopusIndexed, nonIndexed, departmentName });
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
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800">Uploaded Data Summary</h3>
            <p className="text-xs text-gray-500 mt-0.5">Automated validation of uploaded conference papers.</p>
          </div>
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
            <span className="text-lg font-bold text-blue-700">{summaryData.totalPapers}</span>
          </div>
        </div>

        <div className="p-4">
          {/* Summary Table matching Image 4 format */}
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td
                    colSpan="3"
                    className="px-3 py-2 font-bold text-gray-800 text-left"
                    style={{ fontSize: '11px' }}
                  >
                    2.1.2 Number of Conference Paper Published in Scopus Indexed proceedings (per faculty)
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-100/60 text-gray-600 font-bold" style={{ fontSize: '11px' }}>
                  <th className="px-3 py-2 text-left border-r border-gray-200 w-[40%]">Department</th>
                  <th className="px-3 py-2 text-center border-r border-gray-200 w-[30%]">Scopus indexed</th>
                  <th className="px-3 py-2 text-center w-[30%]">Non indexed</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-2.5 font-semibold text-gray-800 border-r border-gray-200" style={{ fontSize: '11px' }}>
                    {summaryData.departmentName}
                  </td>
                  <td className="px-3 py-2.5 text-center font-bold text-blue-700 bg-blue-50/30 border-r border-gray-200" style={{ fontSize: '11px' }}>
                    {summaryData.scopusIndexed}
                  </td>
                  <td className="px-3 py-2.5 text-center font-bold text-gray-700 bg-gray-50/30" style={{ fontSize: '11px' }}>
                    {summaryData.nonIndexed}
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

export default Indicator212Preview;

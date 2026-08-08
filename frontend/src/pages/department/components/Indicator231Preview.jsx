import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

// 2.3.1 Funded Projects (Govt / Non-Govt/Industry / Institutional)
const Indicator231Preview = ({ fileKey }) => {
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

        // Template columns (Image 2):
        // S.No | Title of Project | SDG Mapped | Name of Principal Investigator
        // | Affiliation | Name of CO-Principal Investigator | No. of students involved
        // | Funding Agency (Govt/Non-Govt/Industry/Institution) | Date of submission
        // | Date of acceptance | Grant Received (in lakhs) | Scope | Justification of Scope
        let colTitle = 1;
        let colFundingAgency = 7;
        let colDept = 3; // Principal Investigator used as dept proxy

        for (let i = 0; i < Math.min(rows.length, 6); i++) {
          const row = rows[i];
          if (!row) continue;
          row.forEach((cell, idx) => {
            if (!cell) return;
            const text = String(cell).toLowerCase().trim();
            if (text.includes('title of the project') || text.includes('title of project') || (text.includes('title') && text.includes('project'))) {
              colTitle = idx;
            } else if (text.includes('funding agency') || text.includes('government') || text.includes('non-govt') || text.includes('institution')) {
              colFundingAgency = idx;
            } else if (text.includes('affiliation') || text.includes('department')) {
              colDept = idx;
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

        let govtCount = 0;
        let nonGovtCount = 0;
        let institutionalCount = 0;
        let totalProjects = 0;
        let deptName = 'Deptt';

        for (let i = dataStart; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;
          
          // Strictly enforce that the first cell contains a valid serial number (digit)
          const firstCell = String(row[0] || '').trim();
          if (!/^\d+$/.test(firstCell)) continue;

          const title = row[colTitle] && String(row[colTitle]).trim();
          if (!title) continue;
          if (title.toLowerCase().includes('total')) continue;

          const agency = row[colFundingAgency] ? String(row[colFundingAgency]).toLowerCase().trim() : '';
          
          if (agency.includes('industry') || agency.includes('non-govt') || agency.includes('non govt')) {
            nonGovtCount++;
            totalProjects++;
          } else if (agency.includes('govt') || agency.includes('government')) {
            govtCount++;
            totalProjects++;
          } else if (agency.includes('institution') || agency.includes('institutional')) {
            institutionalCount++;
            totalProjects++;
          } else {
            // Default fallback if agency field has any text
            if (agency) {
              govtCount++;
              totalProjects++;
            }
          }

          if (deptName === 'Deptt' && row[colDept]) {
            const d = String(row[colDept]).trim();
            if (d) deptName = d;
          }
        }

        setSummaryData({ totalProjects, govtCount, nonGovtCount, institutionalCount, deptName });
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
            <p className="text-xs text-gray-500 mt-0.5">Automated validation of uploaded funded projects.</p>
          </div>
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
            <span className="text-lg font-bold text-blue-700">{summaryData.totalProjects}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td colSpan="4" className="px-3 py-2 font-bold text-gray-800 text-left" style={{ fontSize: '11px' }}>
                    2.3 (A) Funded Projects
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-100/60 text-gray-600 font-bold" style={{ fontSize: '11px' }}>
                  <th className="px-3 py-2 text-left border-r border-gray-200 w-[40%]"></th>
                  <th className="px-3 py-2 text-center border-r border-gray-200 w-[20%]">(Govt.)</th>
                  <th className="px-3 py-2 text-center border-r border-gray-200 w-[25%]">Non - Govt./Industry</th>
                  <th className="px-3 py-2 text-center w-[15%]">(Institutional)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-2.5 font-semibold text-gray-700 border-r border-gray-200" style={{ fontSize: '11px' }}>
                    {summaryData.deptName}
                  </td>
                  <td className="px-3 py-2.5 text-center font-bold text-blue-700 bg-blue-50/30 border-r border-gray-200" style={{ fontSize: '11px' }}>
                    {summaryData.govtCount}
                  </td>
                  <td className="px-3 py-2.5 text-center font-bold text-green-700 bg-green-50/30 border-r border-gray-200" style={{ fontSize: '11px' }}>
                    {summaryData.nonGovtCount}
                  </td>
                  <td className="px-3 py-2.5 text-center font-bold text-purple-700 bg-purple-50/30" style={{ fontSize: '11px' }}>
                    {summaryData.institutionalCount}
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

export default Indicator231Preview;

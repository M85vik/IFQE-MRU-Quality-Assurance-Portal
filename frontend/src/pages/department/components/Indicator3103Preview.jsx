import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, FileSpreadsheet, AlertCircle, BookOpen, Users, Calendar, MapPin } from 'lucide-react';

const Indicator3103Preview = ({ fileKey }) => {
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
        // 0. Validate file extension
        if (!fileKey.match(/\.(xlsx|xls|csv)$/i)) {
           throw new Error("Cannot analyze this file type. Please upload a valid Excel (.xlsx/.xls) template.");
        }

        // 1. Fetch the binary file directly through the backend proxy
        const response = await apiClient.get(`/files/download-proxy?fileKey=${encodeURIComponent(fileKey)}`, {
             responseType: 'arraybuffer'
        });
        
        if (!response.data) {
           throw new Error("Failed to download the template file");
        }
        
        const arrayBuffer = response.data;
        
        // 3. Parse with XLSX
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Grab first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to array of arrays
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // 4. Analyze data (Skip first 3 generic header rows)
        // Structure: S.No (0), Alumni Name (1), Passing Year (2), Program (3), Committees (4), 
        // Alumni Contribution (5), Title of Event (6)
        let totalCount = 0;
        let lectures = 0;
        let seminars = 0;
        let events = 0;
        let extractedItems = [];
        
        if (rows.length > 3) {
            for (let i = 3; i < rows.length; i++) {
                const row = rows[i];
                if (!row) continue;
                
                // Count a row if it has an Alumni Name OR Title of the Event OR Contribution
                const hasAlumniName = row[1] && String(row[1]).trim() !== '';
                const hasEventTitle = row[6] && String(row[6]).trim() !== '';
                const hasContribution = row[5] && String(row[5]).trim() !== '';
                
                if (hasAlumniName || hasEventTitle || hasContribution) {
                    totalCount++;
                    
                    const contributionType = String(row[5] || '').toLowerCase();
                    if (contributionType.includes('lecture')) lectures++;
                    else if (contributionType.includes('seminar')) seminars++;
                    else events++; 
                    
                    // extract a few entries for the preview table
                    if (extractedItems.length < 5) {
                         extractedItems.push({
                              alumni: String(row[1] || 'Unknown'),
                              title: String(row[6] || 'Untitled'),
                              date: String(row[7] || 'N/A'),
                              mode: String(row[8] || 'N/A')
                         });
                    }
                }
            }
        }
        
        setSummaryData({ totalCount, lectures, seminars, events, extractedItems });
      } catch (err) {
         console.error("Preview generation error:", err);
         if (err.message.includes("Cannot analyze")) {
             setError(err.message);
         } else {
             setError(`Failed to generate summary: ${err.message}`);
         }
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
             {/* Header Section */}
             <div className="p-5 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-bold text-gray-800">Uploaded Data Summary</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Automated validation of the uploaded excel file.</p>
                 </div>
                 <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                     <span className="text-xl font-bold text-blue-700">{summaryData.totalCount}</span>
                 </div>
             </div>

             <div className="p-5 space-y-6">
                  {/* Configurable Stats Block */}
                  <div className="grid grid-cols-3 gap-3">
                     <div className="relative rounded-xl bg-indigo-50/50 border border-indigo-100/60 p-3 transition-all hover:bg-indigo-50 overflow-hidden">
                         <BookOpen className="absolute right-2 top-2 w-7 h-7 text-indigo-300/40" />
                         <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1 leading-tight pr-6">Lectures</div>
                         <div className="text-2xl font-black text-indigo-700 leading-none mt-2">{summaryData.lectures}</div>
                     </div>
                     <div className="relative rounded-xl bg-emerald-50/50 border border-emerald-100/60 p-3 transition-all hover:bg-emerald-50 overflow-hidden">
                         <Users className="absolute right-2 top-2 w-7 h-7 text-emerald-300/40" />
                         <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1 leading-tight pr-6">Seminars</div>
                         <div className="text-2xl font-black text-emerald-700 leading-none mt-2">{summaryData.seminars}</div>
                     </div>
                     <div className="relative rounded-xl bg-orange-50/50 border border-orange-100/60 p-3 transition-all hover:bg-orange-50 overflow-hidden">
                         <Calendar className="absolute right-2 top-2 w-7 h-7 text-orange-300/40" />
                         <div className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1 leading-tight pr-6">Events</div>
                         <div className="text-2xl font-black text-orange-700 leading-none mt-2">{summaryData.events}</div>
                     </div>
                  </div>

                 {/* Tabular Data View */}
                 {summaryData.extractedItems.length > 0 && (
                     <div className="pt-2">
                         <h4 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-3">Sample Entries Detected</h4>
                          <div className="overflow-x-auto rounded-lg border border-gray-200">
                             <table className="w-full text-xs text-left">
                                 <thead className="text-[11px] font-bold text-gray-500 bg-gray-50">
                                     <tr>
                                         <th className="px-3.5 py-2 font-bold">ALUMNI NAME</th>
                                         <th className="px-3.5 py-2 font-bold">EVENT TITLE</th>
                                         <th className="px-3.5 py-2 font-bold">DATE</th>
                                         <th className="px-3.5 py-2 font-bold text-right">MODE</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-gray-100">
                                     {summaryData.extractedItems.map((item, idx) => (
                                         <tr key={idx} className="bg-white hover:bg-gray-50/50 transition-colors">
                                            <td className="px-3.5 py-2.5 font-semibold text-gray-800">{item.alumni}</td>
                                            <td className="px-3.5 py-2.5 text-gray-600">{item.title}</td>
                                            <td className="px-3.5 py-2.5 text-gray-500">{item.date}</td>
                                            <td className="px-3.5 py-2.5 text-right">
                                               <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold tracking-wide capitalize ${
                                                   item.mode.toLowerCase() === 'online' ? 'bg-blue-100 text-blue-700' : 
                                                   item.mode.toLowerCase() === 'offline' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                                               }`}>
                                                  {item.mode}
                                               </span>
                                            </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                         {summaryData.totalCount > summaryData.extractedItems.length && (
                             <div className="text-center mt-3 text-xs text-gray-400 font-medium tracking-wide">
                                 + {summaryData.totalCount - summaryData.extractedItems.length} OTHER ENTRIES FOUND IN DOCUMENT
                             </div>
                         )}
                     </div>
                 )}
             </div>
         </div>
      );
  }

  return null;
};

export default Indicator3103Preview;

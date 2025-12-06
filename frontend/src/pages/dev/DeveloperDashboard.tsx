import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { Cpu, Database, Server, Cloud, Activity, Trash2 } from 'lucide-react';
import CountUp from 'react-countup';
import apiClient from '../../api/axiosConfig';
import { P } from 'framer-motion/dist/types.d-Cjd591yU';

/* ---------------------- Small Stat Card ---------------------- */
const StatCard = React.memo(({ icon: Icon, label, value, color }: any) => (
  <motion.div
    className="flex items-center justify-between p-5 rounded-xl shadow bg-white hover:shadow-lg transition"
    whileHover={{ scale: 1.03 }}
  >
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">
        <CountUp end={value || 0} duration={1.2} separator="," />
      </h3>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </motion.div>
));

/* ---------------------- Health Bar ---------------------- */
const HealthBar = ({ label, percent, color }: { label: string; percent: number; color: string }) => (
  <div className="mb-3">
    <div className="flex justify-between text-sm text-gray-700 mb-1">
      <span>{label}</span>
      <span>{percent.toFixed(1)}%</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-2 ${color}`}
        style={{ width: `${Math.min(percent, 100)}%`, transition: 'width 0.5s ease' }}
      ></div>
    </div>
  </div>
);

/* ---------------------- Main Component ---------------------- */
const DeveloperDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>({});
  const [apiData, setApiData] = useState<any[]>([]);
  const [s3Data, setS3Data] = useState<any[]>([]);
  const [health, setHealth] = useState({ cpu: 0, mem: 0, uptime: 0 });
  const [submissionStatus, setSubmissionStatus] = useState<any[]>([]);
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [archiveLogs, setArchiveLogs] = useState<any[]>([]);


  const fetchSubmissionStatus = useCallback(async () => {
    try {
      const response = await apiClient.get(`/submissions/status?academicYear=${academicYear}`)
      setSubmissionStatus(response.data?.data || []);

    } catch (error) {
      console.error("Failed to fetch submission status:", error);
    }
  }, [academicYear])
  /* ---------------------------------------------------- */
  /* Fetch all metrics */
  /* ---------------------------------------------------- */
  const fetchMetrics = useCallback(async () => {
    try {
      const [summaryRes, chartsRes, systemRes] = await Promise.all([
        apiClient.get('/metrics/developer-summary'),
        apiClient.get('/metrics/charts'),
        apiClient.get('/system/health'),

      ]);

      const sum = summaryRes.data?.summary || {};

      setSummary({
        totalRoutes: sum.totalRoutes,
        totalRequests: sum.totalRequests,
        totalS3Ops: sum.totalS3Ops,
        uploads: sum.uploads,
        downloads: sum.downloads,
        deletes: sum.deletes,
        uptime: sum.uptime
      });

      setApiData(chartsRes.data.apiChart || []);
      setS3Data(chartsRes.data.s3Chart || []);
      setHealth(systemRes.data || { cpu: 0, mem: 0, uptime: 0 });
    } catch (err) {
      console.error('Failed to load developer metrics:', err);
    }
  }, []);

  const fetchArchiveLogs = useCallback(async () => {
  try {
    const res = await apiClient.get("/metrics/archive-logs");
    setArchiveLogs(res.data.logs || []);
  } catch (err) {
    console.error("Logs Fetch Failed:", err);
  }
}, []);


  useEffect(() => {
    fetchMetrics();
    fetchSubmissionStatus();
      fetchArchiveLogs();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, [fetchMetrics, fetchSubmissionStatus,academicYear,   fetchArchiveLogs]);

  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Developer Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Monitor API performance, S3 usage, and real-time system health — all in one place.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard icon={Server} label="Total API Routes" value={summary.totalRoutes} color="bg-blue-600" />
        <StatCard icon={Activity} label="Total API Requests" value={summary.totalRequests} color="bg-green-600" />
        <StatCard icon={Database} label="Total S3 Ops" value={summary.totalS3Ops} color="bg-indigo-600" />
        <StatCard icon={Cloud} label="Uploads" value={summary.uploads} color="bg-emerald-500" />
        <StatCard icon={Cloud} label="Downloads" value={summary.downloads} color="bg-pink-500" />
        <StatCard icon={Trash2} label="Deletes" value={summary.deletes} color="bg-red-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* API Route Performance */}
        <motion.div className="bg-white rounded-xl shadow p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Activity className="mr-2 text-blue-500" /> API Route Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-right">Average response time per API route</p>
        </motion.div>

        {/* S3 Operations Chart */}
        <motion.div className="bg-white rounded-xl shadow p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Cloud className="mr-2 text-indigo-500" /> S3 Uploads / Downloads / Deletes
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={s3Data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uploads" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="downloads" stroke="#f97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="deletes" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-right">Monthly S3 operation trends</p>
        </motion.div>

      </div>

      {/* System Health */}
      <motion.div className="bg-white rounded-xl shadow p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <Cpu className="mr-2 text-green-500" /> System Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <HealthBar label="CPU Usage" percent={health.cpu} color="bg-green-500" />
            <HealthBar label="Memory Usage" percent={health.mem} color="bg-blue-500" />
          </div>

          <div className="text-right">
            <p className="text-gray-700 font-medium">Uptime</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              <CountUp end={health.uptime} duration={1.2} /> hrs
            </h3>
          </div>
        </div>
      </motion.div>

      {/* API routes table */}
      <motion.div className="bg-white rounded-xl shadow p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <Activity className="mr-2 text-pink-500" /> All API Routes
        </h2>

        {apiData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No API metrics available yet.</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 border-b font-semibold">Route Path</th>
                  <th className="px-4 py-3 border-b text-center font-semibold">Hits</th>
                  <th className="px-4 py-3 border-b text-center font-semibold">Avg Response (ms)</th>
                  <th className="px-4 py-3 border-b text-center font-semibold">Performance</th>
                  <th className="px-4 py-3 border-b text-center font-semibold">Last Updated</th>
                </tr>
              </thead>
              <tbody>

                {[...apiData].sort((a, b) => b.hits - a.hits).map((item, index) => (
                  <tr key={index} className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 text-gray-800 font-mono text-base break-all">{item.route}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">{item.hits}</td>

                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${item.avgTime > 1000 ? 'text-red-500' :
                          item.avgTime > 400 ? 'text-yellow-500' : 'text-green-600'
                        }`}>
                        {item.avgTime} ms
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.avgTime > 1000 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-base rounded-md">Slow</span>
                      ) : item.avgTime > 400 ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-base rounded-md">Moderate</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-base rounded-md">Fast</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-500 text-base">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-base text-gray-500 mt-3 text-right">
          Showing all recorded API endpoints and performance metrics
        </p>
      </motion.div>

      <motion.div className='bg-white rounded-xl shadow p-6 mt-10'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >

        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-800'>
            Submission Status Overview
          </h2>


          <select
            value={academicYear}
            onChange={(e) => {
              setAcademicYear(e.target.value)
            }}
            className='border border-gray-300 rounded-lg px-3 py-2 text-gray-700  bg-white focus:ring focus:ring-blue-200'

          >

            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2026-2027">2026-2027</option>
            <option value="2027-2028">2027-2028</option>
          </select>
        </div>

        {
          submissionStatus.length === 0 ? (
            <p className='text-gray-500 text-center py-8'>No records found.</p>
          ) : (
            <div className='overflow-x-auto max-h-[400px] border rounded-lg'>

              <table className='min-w-full text-base'>

                <thead className='bg-gray-100 sticky top-0 z-10'>
                  <tr>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2 text-center">Status</th>
                    <th className="px-3 py-2 text-center">Academic Year</th>
                    <th className="px-3 py-2 text-center">Last Updated</th>
                  </tr>
                </thead>

                <tbody>
                  {submissionStatus.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{item.title}</td>
                      <td className="px-3 py-2 text-center capitalize">{item.status}</td>
                      <td className="px-3 py-2 text-center">{item.academicYear}</td>
                      <td className="px-3 py-2 text-center text-gray-500">
                        {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )
        }


      </motion.div>

      {/* <motion.div className="bg-white rounded-xl shadow p-6"
  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
  <h2 className="text-lg font-semibold mb-4 text-gray-800">
    Archive Activity Logs
  </h2>

  <div className="overflow-x-auto max-h-[350px] border rounded-lg">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100 sticky top-0">
        <tr>
          <th className="px-3 py-2">Submission</th>
          <th className="px-3 py-2 text-center">Files</th>
          <th className="px-3 py-2 text-center">Time (sec)</th>
          <th className="px-3 py-2 text-center">Archived On</th>
        </tr>
      </thead>
      <tbody>
        {archiveLogs.map((log, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="px-3 py-2 font-medium">
              {log.submissionTitle} <br/>
              <span className="text-xs text-gray-500">{log.school} / {log.department}</span>
            </td>
            <td className="px-3 py-2 text-center">{log.fileCount}</td>
            <td className="px-3 py-2 text-center">{log.timeTakenSec}</td>
            <td className="px-3 py-2 text-center text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</motion.div> */}


<motion.div className="bg-white rounded-xl shadow p-6"
  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
  <h2 className="text-lg font-semibold mb-4 text-gray-800">
    Archive Activity Logs
  </h2>

  <div className="overflow-x-auto max-h-[350px] border rounded-lg">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100 sticky top-0">
        <tr>
          <th className="px-3 py-2">Submission</th>
          <th className="px-3 py-2 text-center">Files</th>
          <th className="px-3 py-2 text-center">Size (MB)</th>
          <th className="px-3 py-2 text-center">Time (sec)</th>
          <th className="px-3 py-2 text-center">Archived On</th>
        </tr>
      </thead>

      <tbody>
        {archiveLogs.map((log, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="px-3 py-2 font-medium">
              {log.submissionTitle} <br />
              <span className="text-xs text-gray-500">{log.school} / {log.department}</span>
            </td>

            <td className="px-3 py-2 text-center">{log.fileCount}</td>

            {/* SIZE COLUMN - NEW */}
            <td className="px-3 py-2 text-center text-gray-700 font-semibold">
              {log.zipSizeMB ? `${log.zipSizeMB} MB` : "—"}
            </td>

            <td className="px-3 py-2 text-center">{log.timeTakenSec}</td>

            <td className="px-3 py-2 text-center text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</motion.div>


    </div>
  );
};

export default React.memo(DeveloperDashboard);

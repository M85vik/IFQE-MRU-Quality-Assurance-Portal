import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import { Search, FileText, Copy, ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
const ActivityLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [year, setYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const availableYears = ['2023-24', '2024-25', '2025-26'];

  // --- Fetch Logs from Backend ---
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await apiClient.get(`/activity${year ? `?year=${year}` : ''}`);
        setLogs(data);
        setFilteredLogs(data);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch activity logs.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 60000); // auto-refresh every 60s
    return () => clearInterval(interval);
  }, [year]);

 

const roleColors = {
  admin:      'bg-red-500/15 text-red-700 border border-red-500/30',
  superuser:  'bg-indigo-500/15 text-indigo-700 border border-indigo-500/30',
  qaa:        'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30',
  developer:  'bg-amber-500/15 text-amber-700 border border-amber-500/30',
  default:    'bg-blue-500/15 text-blue-700 border border-blue-500/30',
};

  // --- Search Filter ---
  useEffect(() => {
    const filtered = logs.filter(log =>
      log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [searchTerm, logs]);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // alert('Copied to clipboard!');
    toast.success('Copied to clipboard!');

  };

  const sortLogs = () => {
    const sorted = [...filteredLogs].sort((a, b) =>
      sortAsc
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredLogs(sorted);
    setSortAsc(!sortAsc);
  };

  // --- Table Renderer ---
  const renderLogsTable = () => {
    if (isLoading) return <div className="p-6"><Spinner /></div>;
    if (error) return <div className="p-6"><Alert message={error} type="error" /></div>;
    if (filteredLogs.length === 0)
      return <p className="text-center text-muted-foreground py-8">No activity logs found.</p>;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/70 text-foreground/90">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer"
                onClick={sortLogs}
              >
                Date {sortAsc ? '▲' : '▼'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Action</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Details</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Academic Year</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">IP</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border">
            {filteredLogs.map((log) => (
              <React.Fragment key={log._id}>
                <tr
                  className="hover:bg-accent/40 cursor-pointer"
                  onClick={() => toggleExpand(log._id)}
                >
                  <td className="px-6 py-3 text-sm text-foreground/90">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>

                  <td className="px-6 py-3 text-sm font-medium text-foreground">
                    <div>{log.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{log.user?.email || '-'}</div>
                  </td>

                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    
                   roleColors[log.user?.role] || roleColors.default

                    }`}>
                      {log.user?.role || '-'}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-sm text-foreground">{log.action}</td>

                  {/* Truncate text with tooltip */}
                  <td
                    className="px-6 py-3 text-sm text-muted-foreground max-w-md truncate"
                    title={log.details}
                  >
                    {log.details}
                  </td>

                  <td className="px-6 py-3 text-sm text-muted-foreground">{log.academicYear}</td>

                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    {log.ipAddress?.replace('::ffff:', '') || '-'}
                  </td>

                  <td className="px-6 py-3 text-sm">
                    {expanded === log._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </td>
                </tr>

                {/* Expanded Row */}
                {expanded === log._id && (
                  <tr className="bg-muted/30">
                    <td colSpan={8} className="px-6 py-4 text-sm text-muted-foreground space-y-2">
                      <p><strong>Full Details:</strong> {log.details || '—'}</p>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(log.details); }}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Copy size={14} /> Copy Details
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(log._id); }}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Copy size={14} /> Copy Log ID
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // --- JSX Return ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-[#083D77] flex items-center gap-3">
          <FileText size={26} /> Activity Logs
        </h1>

        <div className="flex gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-input bg-background rounded-md shadow-sm p-2 focus:ring-ring"
          >
            <option value="">All Years</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-3 py-2 border border-input rounded-md bg-background shadow-sm focus:ring-ring w-full"
            />
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-[#083D77] text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-[#062c59]"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Table Card */}
      <Card className="p-0">
        <div className="px-6 py-4 border-b border-border bg-muted/70 rounded-t-lg">
          <h2 className="text-xl font-semibold text-foreground/90 flex items-center gap-3">
            <FileText size={22} className="text-foreground/90" /> System Activity Logs
          </h2>
          <p className="text-sm text-foreground/70 mt-1">
            View user actions, copy log data, and expand rows for more details.
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last refreshed: {lastUpdated.toLocaleTimeString('en-IN')}
            </p>
          )}
        </div>

        <div className="p-6">{renderLogsTable()}</div>
      </Card>
    </div>
  );
};

export default ActivityLogPage;

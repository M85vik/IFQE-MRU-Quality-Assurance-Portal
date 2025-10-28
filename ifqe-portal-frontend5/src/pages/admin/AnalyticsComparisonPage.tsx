import React, { useState, useEffect, useMemo } from 'react';
import { getIndicatorComparisonData } from '../../services/adminService';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import Modal from '../../components/shared/Modal';
import { Search } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface School { _id: string; name: string; }
interface SchoolScore { schoolName: string; score: number; }
interface ComparisonItem {
    indicatorCode: string;
    indicatorTitle: string;
    schoolScores: SchoolScore[];
}

const ComparisonBarChart: React.FC<{ data: SchoolScore[], indicatorTitle: string }> = ({ data, indicatorTitle }) => {
    if (!data) return null;

    return (
        <div className="space-y-4 p-4" style={{ width: '100%', height: 400 }}>
            <h3 className="font-semibold text-lg text-foreground/90">{indicatorTitle}</h3>
            <ResponsiveContainer>
                <RechartsBarChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(93, 10, 10, 0.1)" />
                    <XAxis dataKey="schoolName" stroke="#2121a2ff" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={80}/>
                    <YAxis domain={[0, 4]} stroke="#a1a1aa" />
                    <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        contentStyle={{
                            background: 'hsl(222.2 84% 4.9%)',
                            borderColor: 'hsl(217.2 32.6% 17.5%)'
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                    <Bar dataKey="score" fill="#82ca9d" name="Score (0-4)" />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

const AnalyticsComparisonPage: React.FC = () => {
    const [comparisonData, setComparisonData] = useState<ComparisonItem[]>([]);
    const [allSchools, setAllSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndicator, setSelectedIndicator] = useState<ComparisonItem | null>(null);

    const availableYears = ["2025-2026", "2024-2025", "2023-2024"];
    const [selectedYear, setSelectedYear] = useState(availableYears[0]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const schoolsRes = await apiClient.get('/public/schools');
                const sortedSchools = schoolsRes.data.sort((a: School, b: School) => a.name.localeCompare(b.name));
                setAllSchools(sortedSchools);

                const data = await getIndicatorComparisonData(selectedYear);
                setComparisonData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [selectedYear]);

    const filteredData = useMemo(() => {
        if (!searchTerm) return comparisonData;
        return comparisonData.filter(item =>
            item.indicatorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.indicatorTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, comparisonData]);

    const renderTable = () => {
        if (isLoading) return <div className="p-6"><Spinner /></div>;
        if (error) return <div className="p-6"><Alert message={error} type="error" /></div>;
        if (comparisonData.length === 0) {
            return <p className="text-center text-foreground/70 py-8">No approved submissions found for {selectedYear} to generate a comparison.</p>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-muted/70 text-foreground/90 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Indicator Title</th>
                            {allSchools.map((school) => (
                                <th key={school._id} className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide">{school.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredData.map(item => (
                            <tr key={item.indicatorCode} onClick={() => setSelectedIndicator(item)} className="hover:bg-accent cursor-pointer even:bg-muted/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground/90">{item.indicatorCode}</td>
                                <td className="px-6 py-4 text-sm text-foreground/80">{item.indicatorTitle}</td>
                                {allSchools.map(school => {
                                    const schoolScore = item.schoolScores.find(s => s.schoolName === school.name);
                                    const score = schoolScore ? schoolScore.score : 'N/A';
                                    return <td key={school._id} className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-foreground/90">{score}</td>
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-foreground/90">
                        Indicator Comparison
                    </h1>

                    <div className="flex-shrink-0 w-full sm:w-auto">
                        <label htmlFor="year-select" className="block text-sm font-medium text-foreground/70 mb-1 sm:hidden">Academic Year:</label>
                        <select
                            id="year-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full p-2 border border-border/70 bg-muted/40 rounded-md focus:ring-2 focus:ring-foreground/40 focus:border-foreground/50 text-foreground/90"
                        >
                            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                </div>

                <Card>
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <h2 className="text-xl font-semibold text-foreground/90">School Performance by Indicator</h2>
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                                <input
                                    type="text"
                                    placeholder="Search by code or title..."
                                    value={searchTerm}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 p-2 border border-border/70 bg-muted/40 rounded-md
                                               focus:ring-2 focus:ring-foreground/40 focus:border-foreground/50
                                               placeholder:text-foreground/60 text-foreground/90 transition-all duration-150"
                                />
                            </div>
                        </div>
                        {renderTable()}
                    </div>
                </Card>
            </div>

            <Modal isOpen={!!selectedIndicator} onClose={() => setSelectedIndicator(null)} title={`Comparison for ${selectedIndicator?.indicatorCode}`}>
                {selectedIndicator && (
                    <ComparisonBarChart
                        data={selectedIndicator.schoolScores}
                        indicatorTitle={selectedIndicator.indicatorTitle}
                    />
                )}
            </Modal>
        </>
    );
};

export default AnalyticsComparisonPage;

// ifqe-portal-frontend5/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// --- Portal Page Imports ---
import LoginPage from './pages/LoginPage';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import SubmissionForm from './pages/department/SubmissionForm';
import AppealPage from './pages/department/AppealPage';
import AppealDashboard from './pages/department/AppealDashboard';
import ArchivesPage from './pages/department/ArchivesPage';
import QaaDashboard from './pages/qaa/QaaDashboard';
import ReviewSubmission from './pages/qaa/ReviewSubmission';
import SuperuserDashboard from './pages/superuser/SuperuserDashboard';
import FinalReviewPage from './pages/superuser/FinalReviewPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import ManageWindowsPage from './pages/admin/ManageWindowsPage';
import AnalyticsComparisonPage from './pages/admin/AnalyticsComparisonPage';
import ManageContentPage from './pages/admin/ManageContentPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/shared/ProtectedRoute';

// --- NEW: Public Website Page Imports (from the 'website' folder) ---
import LandingPage from './pages/LandingPage';
import AboutMRUPage from './pages/website/AboutMRUPage';
import AboutIFQEPage from './pages/website/AboutIFQEPage';
import QaaPage from './pages/website/QaaPage';
import LeadershipMessagesPage from './pages/website/LeadershipMessagesPage';
import CriteriaOverviewPage from './pages/website/CriteriaOverviewPage';
import CriterionDetailPage from './pages/website/CriterionDetailPage';
import DevelopingTeamPage from './pages/website/DevelopingTeamPage';
import FacultyTeamPage from './pages/website/FacultyTeamPage';

const AppRootRedirector = () => {
    const { userInfo } = useAuthStore();
    if (!userInfo) return <Navigate to="/login" replace />;

    switch (userInfo.role) {
        case 'department': return <Navigate to="/app/department/dashboard" replace />;
        case 'qaa': return <Navigate to="/app/qaa/dashboard" replace />;
        case 'admin': return <Navigate to="/app/admin/dashboard" replace />;
        case 'superuser': return <Navigate to="/app/superuser/approval-queue" replace />;
        default: return <Navigate to="/unauthorized" replace />;
    }
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Website Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-mru" element={<AboutMRUPage />} />
        <Route path="/about-ifqe" element={<AboutIFQEPage />} />
        <Route path="/qaa" element={<QaaPage />} />
        <Route path="/leadership-messages" element={<LeadershipMessagesPage />} />
        <Route path="/criteria" element={<CriteriaOverviewPage />} />
        <Route path="/criteria/:criterionId" element={<CriterionDetailPage />} />
        <Route path="/developing-team" element={<DevelopingTeamPage />} /> 
        <Route path="/faculty-team" element={<FacultyTeamPage />} />
        
        {/* --- Authentication & System Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* --- Protected Portal Application Routes --- */}
        <Route path="/app" element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<AppRootRedirector />} />
            
            <Route path="department/dashboard" element={<DepartmentDashboard />} />
            <Route path="department/submission/:id" element={<SubmissionForm />} />
            <Route path="department/appeal/:id" element={<AppealPage />} />
            <Route path="department/appeals" element={<AppealDashboard />} />   
            <Route path="department/archives" element={<ArchivesPage />} />

            <Route path="qaa/dashboard" element={<QaaDashboard />} />
            <Route path="qaa/review/:id" element={<ReviewSubmission />} />
            
            <Route path="superuser/dashboard" element={<Navigate to="/app/superuser/approval-queue" replace />} />
            <Route path="superuser/approval-queue" element={<SuperuserDashboard queueType="approval" />} />
            <Route path="superuser/appeal-queue" element={<SuperuserDashboard queueType="appeal" />} />
            <Route path="superuser/review/:id" element={<FinalReviewPage />} />
            
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/comparison" element={<AnalyticsComparisonPage />} />
            <Route path="admin/users" element={<UserManagementPage />} />
            <Route path="admin/windows" element={<ManageWindowsPage />} />
            <Route path="admin/content" element={<ManageContentPage />} />
          </Route>
        </Route>
        
        {/* --- Catch-all 404 Route --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
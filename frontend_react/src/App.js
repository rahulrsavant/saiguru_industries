import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminUsersPage from './pages/AdminUsersPage';
import EstimatePage from './pages/EstimatePage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const BASE_PATH = process.env.PUBLIC_URL || '/saiguru_industries';

function App() {
  return (
    <BrowserRouter
      basename={BASE_PATH}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="estimate" element={<EstimatePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="history/:estimateNo" element={<HistoryDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="admin/users" element={<AdminUsersPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

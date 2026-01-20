import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './components/AppLayout';
import EstimatePage from './pages/EstimatePage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';

const BASE_PATH = process.env.PUBLIC_URL || '/saiguru_industries';

function App() {
  return (
    <BrowserRouter
      basename={BASE_PATH}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="estimate" element={<EstimatePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="history/:estimateNo" element={<HistoryDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

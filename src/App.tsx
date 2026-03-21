import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StudentProvider } from './context/StudentContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Modules } from './pages/Modules';
import { ModuleDetail } from './modules/ModuleDetail';
import AlgorithmLab from './pages/AlgorithmLab';
import SimulationPage from './pages/SimulationPage';
import { Practice } from './pages/Practice';
import { Progress } from './pages/Progress';
import { About } from './pages/About';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminModules } from './pages/admin/AdminModules';
import { AdminExercises } from './pages/admin/AdminExercises';
import { AdminStatistics } from './pages/admin/AdminStatistics';
import { ProtectedRoute } from './components/ProtectedRoute';

import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAccessCodes } from './pages/admin/AdminAccessCodes';
import { StudentDashboard } from './pages/student/Dashboard';
import { AITutor } from './components/tutor/AITutor';

const App: React.FC = () => {
  return (
    <StudentProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Student Routes - Protected (Admins can also access) */}
            <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/modulos" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            <Route path="/modulos/:moduleId" element={<ProtectedRoute><ModuleDetail /></ProtectedRoute>} />
            <Route path="/laboratorio" element={<ProtectedRoute><AlgorithmLab /></ProtectedRoute>} />
            <Route path="/simulacion" element={<ProtectedRoute><SimulationPage /></ProtectedRoute>} />
            <Route path="/practica" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route path="/progreso" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/acerca" element={<About />} />
            
            {/* Admin Routes - Protected (Only Admins) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/modules" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminModules />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/exercises" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminExercises />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/statistics" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminStatistics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/access-codes" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminAccessCodes />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect /admin to dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AITutor />
        </Layout>
      </Router>
    </StudentProvider>
  );
};

export default App;

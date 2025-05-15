import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MatrixProvider } from './contexts/MatrixContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/users/Users';
import NewUser from './pages/users/NewUser';
import UserDetail from './pages/users/UserDetail';
import Rooms from './pages/rooms/Rooms';
import RoomDetail from './pages/rooms/RoomDetail';
import Media from './pages/media/Media';
import Federation from './pages/federation/Federation';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MatrixProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/users/new" 
                element={
                  <ProtectedRoute>
                    <NewUser />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/users/:userId" 
                element={
                  <ProtectedRoute>
                    <UserDetail />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/rooms" 
                element={
                  <ProtectedRoute>
                    <Rooms />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/rooms/:roomId" 
                element={
                  <ProtectedRoute>
                    <RoomDetail />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/media" 
                element={
                  <ProtectedRoute>
                    <Media />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/federation" 
                element={
                  <ProtectedRoute>
                    <Federation />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </MatrixProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { User, Student, Role } from './types';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Swal from 'sweetalert2';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | Student | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial data seed if needed
    storage.getUsers();
    
    // Check session from localStorage if desired, but for this SPA we keep it in memory
    setLoading(false);
  }, []);

  const handleLogin = (user: User | Student, userRole: Role) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentUser(user);
      setRole(userRole);
      setLoading(false);
      Swal.fire({
        title: 'สำเร็จ',
        text: 'เข้าสู่ระบบเรียบร้อยแล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }, 800);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-primary rounded-full mb-4"></div>
          <p className="text-gray-500 font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      user={currentUser} 
      role={role!} 
      onLogout={handleLogout} 
    />
  );
};

export default App;

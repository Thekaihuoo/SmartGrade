
import React, { useState } from 'react';
import { User, Student, Role } from '../types';
import { storage } from '../services/storage';
import { THEME } from '../constants';
import { GraduationCap, ShieldCheck, UserCircle, Key, User as UserIcon, Sparkles, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button, Card } from '../components/UI';

interface LoginProps {
  onLogin: (user: User | Student, role: Role) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'STAFF' | 'STUDENT'>('STAFF');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user, user.role);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'อุ๊ปส์...',
        text: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
        confirmButtonColor: THEME.primary,
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const students = storage.getStudents();
    const student = students.find(s => s.studentId === studentId);
    if (student) {
      onLogin(student, 'STUDENT');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ไม่พบข้อมูล',
        text: 'ไม่พบรหัสประจำตัวนักเรียนนี้ในระบบ',
        confirmButtonColor: THEME.secondary,
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-kanit relative overflow-hidden">
      {/* วงกลมตกแต่งสีสันสดใส */}
      <div className="absolute top-[-15%] right-[-10%] w-[50rem] h-[50rem] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[45rem] h-[45rem] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] left-[5%] w-[20rem] h-[20rem] bg-accent-purple/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-white shadow-[0_20px_50px_rgba(38,166,154,0.2)] rounded-[3rem] mb-8 text-primary group transition-all hover:scale-110 hover:rotate-3">
            <GraduationCap className="w-14 h-14" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">
            <span className="gradient-text">SmartGrade</span>
          </h1>
          <p className="text-gray-500 text-xl font-medium">สัมผัสประสบการณ์การจัดการเรียนที่ทันสมัย</p>
        </div>

        <Card className="p-0 overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border-0 bg-white/90 backdrop-blur-xl rounded-[3.5rem]">
          <div className="flex bg-gray-50/50 p-3 m-4 rounded-[2.5rem]">
            <button
              onClick={() => setTab('STAFF')}
              className={`flex-1 py-4 text-base font-bold rounded-[2rem] transition-all duration-500 ${
                tab === 'STAFF' ? 'bg-white text-primary shadow-[0_10px_20px_rgba(0,0,0,0.05)] scale-105' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className={`w-5 h-5 ${tab === 'STAFF' ? 'text-primary' : ''}`} />
                เจ้าหน้าที่
              </div>
            </button>
            <button
              onClick={() => setTab('STUDENT')}
              className={`flex-1 py-4 text-base font-bold rounded-[2rem] transition-all duration-500 ${
                tab === 'STUDENT' ? 'bg-white text-secondary-dark shadow-[0_10px_20px_rgba(0,0,0,0.05)] scale-105' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserCircle className={`w-5 h-5 ${tab === 'STUDENT' ? 'text-secondary-dark' : ''}`} />
                นักเรียน
              </div>
            </button>
          </div>

          <div className="p-12 pt-6">
            {tab === 'STAFF' ? (
              <form onSubmit={handleStaffLogin} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-500 ml-2 uppercase tracking-widest">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.75rem] focus:border-primary/20 focus:ring-0 focus:bg-white transition-all text-lg font-medium outline-none"
                      placeholder="ชื่อผู้ใช้งานของคุณ"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-500 ml-2 uppercase tracking-widest">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                      <Key className="w-6 h-6" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.75rem] focus:border-primary/20 focus:ring-0 focus:bg-white transition-all text-lg font-medium outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full py-5 text-xl rounded-[2rem] mt-4 shadow-primary/30 group">
                  เข้าสู่ระบบ
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleStudentLogin} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-500 ml-2 uppercase tracking-widest">Student ID</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-secondary-dark transition-colors">
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="block w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.75rem] focus:border-secondary/30 focus:ring-0 focus:bg-white transition-all text-lg font-medium outline-none"
                      placeholder="รหัสประจำตัว 5 หลัก"
                    />
                  </div>
                </div>
                <Button type="submit" variant="secondary" className="w-full py-5 text-xl rounded-[2rem] mt-4 shadow-secondary/40 group">
                  ตรวจสอบผลการเรียน
                  <Sparkles className="w-6 h-6 group-hover:scale-125 transition-transform" />
                </Button>
              </form>
            )}
          </div>
        </Card>
        
        <p className="text-center text-gray-400 mt-12 font-medium">
          ลิขสิทธิ์ความภาคภูมิใจ © 2024 <span className="text-primary-dark font-bold">SmartGrade</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
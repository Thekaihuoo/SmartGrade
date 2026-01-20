
import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  ClipboardList, 
  UserCircle,
  Briefcase,
  ChevronRight,
  Sparkles,
  Trophy,
  Settings,
  Star
} from 'lucide-react';
import { User, Student, Role } from '../types';
import UserManagement from './admin/UserManagement';
import ClassManagement from './admin/ClassManagement';
import StudentManagement from './admin/StudentManagement';
import SubjectManagement from './admin/SubjectManagement';
import TeacherAssignment from './admin/TeacherAssignment';
import TeacherProfile from './teacher/TeacherProfile';
import GradeEntry from './teacher/GradeEntry';
import StudentView from './student/StudentView';
import { THEME } from '../constants';
import { Badge } from '../components/UI';

interface DashboardProps {
  user: User | Student;
  role: Role;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, role, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState<string>(role === 'ADMIN' ? 'users' : role === 'TEACHER' ? 'grade_entry' : 'student_dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = {
    ADMIN: [
      { id: 'users', label: 'บัญชีผู้ใช้งาน', icon: Users, color: THEME.primary, activeClass: 'menu-active-primary' },
      { id: 'classes', label: 'ห้องเรียน', icon: GraduationCap, color: THEME.secondary, activeClass: 'menu-active-secondary' },
      { id: 'students', label: 'ทะเบียนนักเรียน', icon: Star, color: THEME.orange, activeClass: 'menu-active-orange' },
      { id: 'subjects', label: 'หลักสูตรวิชา', icon: BookOpen, color: THEME.warning, activeClass: 'menu-active-warning' },
      { id: 'assignments', label: 'การสอน', icon: Briefcase, color: THEME.danger, activeClass: 'menu-active-danger' },
    ],
    TEACHER: [
      { id: 'grade_entry', label: 'บันทึกเกรด', icon: ClipboardList, color: '#26A69A', activeClass: 'menu-active-primary' },
      { id: 'profile', label: 'โปรไฟล์ครู', icon: UserCircle, color: '#7E57C2', activeClass: 'menu-active-purple' },
    ],
    STUDENT: [
      { id: 'student_dashboard', label: 'ดูผลการเรียน', icon: LayoutDashboard, color: '#EC407A', activeClass: 'menu-active-pink' },
    ]
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'users': return <UserManagement />;
      case 'classes': return <ClassManagement />;
      case 'students': return <StudentManagement />;
      case 'subjects': return <SubjectManagement />;
      case 'assignments': return <TeacherAssignment />;
      case 'profile': return <TeacherProfile user={user as User} onUpdate={(u) => console.log('Update User')} />;
      case 'grade_entry': return <GradeEntry teacher={user as User} />;
      case 'student_dashboard': return <StudentView student={user as Student} />;
      default: return <div className="p-8">Coming Soon</div>;
    }
  };

  const currentMenu = [...menuItems.ADMIN, ...menuItems.TEACHER, ...menuItems.STUDENT].find(i => i.id === activeMenu);

  return (
    <div className="min-h-screen flex overflow-hidden font-kanit">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 z-30 lg:hidden backdrop-blur-md transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-80 sidebar-glass border-r border-white/40 z-40
        transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="mb-10 px-4">
            <h1 className="text-3xl font-black flex items-center gap-4">
              <div className="p-3 bg-white shadow-[0_15px_35px_rgba(38,166,154,0.35)] rounded-3xl floating">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <span className="gradient-text tracking-tighter text-4xl">SG</span>
            </h1>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto hide-scrollbar">
            {/* Menu Group Label */}
            <div>
              <p className="px-6 mb-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">
                {role === 'ADMIN' ? 'เมนูผู้ดูแลระบบ' : role === 'TEACHER' ? 'เมนูคุณครู' : 'เมนูนักเรียน'}
              </p>
              <nav className="space-y-2">
                {menuItems[role].map((item) => {
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenu(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        group w-full flex items-center gap-4 px-5 py-4 rounded-[2.25rem] text-sm font-bold transition-all duration-500 relative overflow-hidden
                        ${isActive 
                          ? `${item.activeClass} text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] scale-[1.03] z-10` 
                          : 'text-gray-500 hover:bg-white/70 hover:text-gray-900 hover:translate-x-1'}
                      `}
                    >
                      <div className={`
                        p-2.5 rounded-2xl transition-all duration-500 shadow-sm
                        ${isActive ? 'bg-white/20 backdrop-blur-md ring-2 ring-white/30' : 'bg-white group-hover:bg-white'}
                      `} style={{ color: isActive ? 'white' : item.color }}>
                        <item.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]' : ''}`} />
                      </div>
                      <span className={`flex-1 text-left tracking-wide ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                      {isActive && (
                        <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="mt-auto space-y-4 pt-6">
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.06)] group relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 transition-all duration-700">
                <Settings className="w-24 h-24" />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors border border-gray-100">
                   <UserCircle className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">สถานะปัจจุบัน</p>
                  <p className="text-sm font-black text-gray-800 truncate">{user.name}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge color={currentMenu?.color || THEME.primary}>{role}</Badge>
                <div className="flex items-center gap-1 text-[10px] font-black text-primary animate-pulse">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  ONLINE
                </div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 py-4.5 rounded-[2.25rem] text-sm font-black text-danger bg-white hover:bg-danger/5 transition-all border border-gray-100 hover:border-danger/20 group active:scale-95 shadow-sm"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              ลงชื่อออก
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="lg:hidden h-20 bg-white/70 backdrop-blur-2xl border-b border-white/40 flex items-center px-6 sticky top-0 z-20">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-3.5 bg-white shadow-lg shadow-gray-200/50 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all active:scale-90"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 ml-6">
            <div className="p-2 bg-primary shadow-xl shadow-primary/30 rounded-xl">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-gray-900 text-xl tracking-tighter gradient-text">SmartGrade</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scroll-smooth bg-transparent">
          <div className="max-w-7xl mx-auto pb-12">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

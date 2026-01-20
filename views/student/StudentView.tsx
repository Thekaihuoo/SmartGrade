
import React, { useState } from 'react';
import { Student, GradeRecord, Subject, Assignment, User } from '../../types';
import { storage } from '../../services/storage';
import { Card, Badge, SectionHeader } from '../../components/UI';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { THEME } from '../../constants';
import { 
  Star, TrendingUp, Book, LayoutDashboard, Award, 
  Target, UserCircle, BarChart3, PieChart as PieChartIcon,
  Crown, Zap, Medal
} from 'lucide-react';

const StudentView: React.FC<{ student: Student }> = ({ student }) => {
  const [chartType, setChartType] = useState<'BAR' | 'PIE'>('BAR');
  
  const grades = storage.getGrades().filter(g => g.studentId === student.id);
  const assignments = storage.getAssignments();
  const subjects = storage.getSubjects();
  const users = storage.getUsers();

  const getFullGradeData = () => {
    return grades.map(g => {
      const assignment = assignments.find(a => a.id === g.assignmentId);
      const subject = subjects.find(s => s.id === assignment?.subjectId);
      const teacher = users.find(u => u.id === assignment?.teacherId);
      return {
        ...g,
        subject,
        teacher
      };
    }).filter(g => g.subject);
  };

  const gradeData = getFullGradeData();

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    gradeData.forEach(item => {
      if (item.grade !== null && item.subject) {
        totalPoints += (item.grade * item.subject.credits);
        totalCredits += item.subject.credits;
      }
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const gpaValue = parseFloat(calculateGPA());

  const allPossibleGrades = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4];
  const barData = allPossibleGrades.map(g => {
    const count = gradeData.filter(item => item.grade === g).length;
    return { name: `${g}`, count: count };
  });

  const pieData = allPossibleGrades.map(g => {
    const count = gradeData.filter(item => item.grade === g).length;
    return { name: `เกรด ${g}`, value: count, grade: g };
  }).filter(d => d.value > 0);

  const getGradeColor = (grade: number) => {
    if (grade >= 4.0) return '#26A69A'; // Primary
    if (grade >= 3.0) return '#7E57C2'; // Purple
    if (grade >= 2.0) return '#FFCA28'; // Warning
    if (grade >= 1.0) return '#FF8A65'; // Orange
    return '#EF5350'; // Danger
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <SectionHeader 
        title={`ยินดีต้อนรับ, ${student.name}`}
        description="ตรวจสอบความก้าวหน้าทางการเรียนของคุณด้วยสถิติที่สวยงาม"
        icon={<Crown className="w-8 h-8" />}
        color="#7E57C2"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GPA CARD - VIBRANT GRADIENT */}
        <Card className="p-10 relative overflow-hidden group border-0 shadow-2xl" isGradient accentColor="#26A69A">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-[#004D40] opacity-95" />
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
          <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-secondary/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-white/20 p-5 rounded-[2rem] mb-6 backdrop-blur-md shadow-xl border border-white/20">
              <Award className="w-12 h-12 text-white floating" />
            </div>
            <p className="text-white/80 font-bold text-sm uppercase tracking-[0.2em] mb-2">Grade Point Average</p>
            <h3 className="text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
              {calculateGPA()}
            </h3>
            
            <div className="flex gap-2">
              <div className="px-5 py-2 bg-white/20 rounded-full backdrop-blur-md border border-white/20">
                <p className="text-white text-xs font-black uppercase">
                  {gpaValue >= 3.5 ? '🏆 High Honors' : gpaValue >= 3.0 ? '🌟 Good' : '📈 Progressing'}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Card className="p-8 border-0 shadow-xl flex items-center gap-6" isGradient accentColor="#AED581">
            <div className="bg-secondary/15 p-6 rounded-[2rem] text-secondary-dark">
              <Zap className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-5xl font-black text-gray-800 tracking-tighter">{gradeData.length}</h3>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">วิชาที่ลงทะเบียน</p>
            </div>
          </Card>

          <Card className="p-8 border-0 shadow-xl flex items-center gap-6" isGradient accentColor="#FFCA28">
            <div className="bg-warning/15 p-6 rounded-[2rem] text-warning-dark">
              <Medal className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-5xl font-black text-gray-800 tracking-tighter">
                {gradeData.filter(g => g.grade !== null).length}
              </h3>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">วิชาที่ประเมินแล้ว</p>
            </div>
          </Card>

          <Card className="p-8 sm:col-span-2 border-0 shadow-xl" isGradient accentColor="#EC407A">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-accent-pink" />
                สถิติระดับผลการเรียน
              </h4>
              <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setChartType('BAR')}
                  className={`p-2.5 rounded-xl transition-all ${chartType === 'BAR' ? 'bg-white shadow-md text-accent-pink' : 'text-gray-400'}`}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setChartType('PIE')}
                  className={`p-2.5 rounded-xl transition-all ${chartType === 'PIE' ? 'bg-white shadow-md text-accent-pink' : 'text-gray-400'}`}
                >
                  <PieChartIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full h-[280px]">
              {gradeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'BAR' ? (
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={2000}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.count > 0 ? getGradeColor(parseFloat(entry.name)) : '#f3f4f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none" animationDuration={1500}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getGradeColor(entry.grade)} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                  <LayoutDashboard className="w-16 h-16 opacity-10" />
                  <p className="font-bold text-gray-400">ยังไม่มีข้อมูลให้แสดงสถิติ</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* TABLE SECTION - CLEAN & VIBRANT */}
      <Card className="p-0 border-0 shadow-2xl overflow-hidden" accentColor="#26A69A">
        <div className="px-10 py-8 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-[1.25rem] text-primary">
              <Book className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-gray-800">รายละเอียดผลการเรียน</h4>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">Academic Performance Record</p>
            </div>
          </div>
          <Badge color="#26A69A">ภาคเรียนที่ 1/2567</Badge>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-[0.2em] font-black border-b border-gray-50">
                <th className="px-10 py-6 text-center">No.</th>
                <th className="px-10 py-6">รายวิชา / ผู้สอน</th>
                <th className="px-10 py-6 text-center">หน่วยกิต</th>
                <th className="px-10 py-6 text-center">ผลการเรียน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {gradeData.map((item, idx) => (
                <tr key={idx} className="group hover:bg-primary/[0.02] transition-colors duration-500">
                  <td className="px-10 py-8 text-center text-gray-300 font-black italic text-xl">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 text-xl group-hover:text-primary transition-colors">{item.subject?.code}</span>
                      <span className="text-base font-bold text-gray-500 mt-1">{item.subject?.name}</span>
                      <div className="flex items-center gap-2 mt-3 px-3 py-1.5 bg-gray-100 w-fit rounded-xl">
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-600">ครู {item.teacher?.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 text-gray-600 font-black text-lg">
                      {item.subject?.credits.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] font-black text-2xl shadow-sm border-2 ${
                      item.grade === null ? 'bg-gray-50 text-gray-300 border-gray-100' : 
                      item.grade >= 3.5 ? 'bg-primary/10 text-primary border-primary/20 scale-110' : 
                      item.grade >= 2.5 ? 'bg-accent-purple/10 text-accent-purple border-accent-purple/20' : 
                      'bg-orange/10 text-orange border-orange/20'
                    }`}>
                      {item.grade === null ? '-' : item.grade.toFixed(1)}
                    </div>
                  </td>
                </tr>
              ))}
              {gradeData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-5 opacity-20">
                      <LayoutDashboard className="w-24 h-24" />
                      <p className="text-2xl font-black">ไม่พบข้อมูลผลการเรียนในขณะนี้</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {gradeData.length > 0 && (
              <tfoot className="bg-gray-50/30">
                <tr className="font-black">
                  <td colSpan={3} className="px-10 py-10 text-right text-gray-400 uppercase tracking-[0.2em] text-sm">Summary GPA</td>
                  <td className="px-10 py-10 text-center text-primary-dark text-5xl tracking-tighter">
                    {calculateGPA()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentView;
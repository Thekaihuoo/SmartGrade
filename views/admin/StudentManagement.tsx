
import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { Student, SchoolClass } from '../../types';
import { UserPlus, Pencil, Trash2, Filter, Users, Info } from 'lucide-react';
import { Button, Card, Modal, Badge, SectionHeader } from '../../components/UI';
import Swal from 'sweetalert2';
import { THEME } from '../../constants';

const StudentManagement: React.FC = () => {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'SINGLE' | 'BULK'>('SINGLE');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    seatNumber: 1
  });

  const [bulkData, setBulkData] = useState('');

  useEffect(() => {
    setAllStudents(storage.getStudents());
    const classList = storage.getClasses();
    setClasses(classList);
    if (classList.length > 0 && !selectedClassId) setSelectedClassId(classList[0].id);
  }, []);

  const filteredStudents = allStudents
    .filter(s => s.classId === selectedClassId)
    .sort((a, b) => a.seatNumber - b.seatNumber);

  const handleOpenModal = (student: Student | null = null, mode: 'SINGLE' | 'BULK' = 'SINGLE') => {
    setModalMode(mode);
    if (student) {
      setEditingStudent(student);
      setFormData({
        studentId: student.studentId,
        name: student.name,
        seatNumber: student.seatNumber
      });
    } else {
      setEditingStudent(null);
      setFormData({
        studentId: '',
        name: '',
        seatNumber: filteredStudents.length + 1
      });
      setBulkData('');
    }
    setIsModalOpen(true);
  };

  const handleSaveSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return Swal.fire('กรุณาเลือกชั้นเรียนก่อน', '', 'error');

    let newStudents;
    if (editingStudent) {
      newStudents = allStudents.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s);
    } else {
      const newStudent: Student = { 
        ...formData, 
        id: `stu-${Date.now()}`, 
        classId: selectedClassId 
      };
      newStudents = [...allStudents, newStudent];
    }
    storage.saveStudents(newStudents);
    setAllStudents(newStudents);
    setIsModalOpen(false);
    Swal.fire({
      title: 'สำเร็จ',
      text: 'บันทึกข้อมูลเรียบร้อย',
      icon: 'success',
      confirmButtonColor: THEME.orange
    });
  };

  const handleSaveBulk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return Swal.fire('กรุณาเลือกชั้นเรียนก่อน', '', 'error');
    if (!bulkData.trim()) return Swal.fire('กรุณากรอกข้อมูลนักเรียน', '', 'warning');

    const lines = bulkData.trim().split('\n');
    const newAddedStudents: Student[] = [];
    let currentMaxSeat = filteredStudents.length > 0 
      ? Math.max(...filteredStudents.map(s => s.seatNumber)) 
      : 0;

    let errorLines: string[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const studentId = parts[0];
        const name = parts[1];
        
        newAddedStudents.push({
          id: `stu-${Date.now()}-${index}`,
          studentId,
          name,
          classId: selectedClassId,
          seatNumber: ++currentMaxSeat
        });
      } else if (line.trim()) {
        errorLines.push(line);
      }
    });

    if (newAddedStudents.length === 0) {
      return Swal.fire('ไม่พบรูปแบบที่ถูกต้อง', 'กรุณาใช้รูปแบบ: รหัส, ชื่อ-นามสกุล', 'error');
    }

    const updatedAllStudents = [...allStudents, ...newAddedStudents];
    storage.saveStudents(updatedAllStudents);
    setAllStudents(updatedAllStudents);
    setIsModalOpen(false);

    Swal.fire({
      title: 'สำเร็จ',
      text: `เพิ่มนักเรียนเรียบร้อย ${newAddedStudents.length} คน${errorLines.length > 0 ? ` (ข้าม ${errorLines.length} บรรทัดที่ไม่ถูกต้อง)` : ''}`,
      icon: 'success',
      confirmButtonColor: THEME.orange
    });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'ลบนักเรียนคนนี้?',
      text: "ผลการเรียนทั้งหมดของนักเรียนจะถูกลบด้วย",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      confirmButtonColor: THEME.danger,
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const newStudents = allStudents.filter(s => s.id !== id);
        storage.saveStudents(newStudents);
        setAllStudents(newStudents);
        Swal.fire('ลบเรียบร้อย', '', 'success');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <SectionHeader 
          title="จัดการนักเรียน" 
          description="ลงทะเบียนนักเรียนและจัดสรรเข้าชั้นเรียนต่างๆ"
          icon={<Users className="w-8 h-8" />}
          color={THEME.orange}
        />
        <div className="flex gap-2 w-full sm:w-auto sm:mt-2">
           <Button onClick={() => handleOpenModal(null, 'SINGLE')} variant="ghost" className="bg-white border border-gray-100 flex-1 sm:flex-none">
            <UserPlus className="w-5 h-5" />
            เพิ่มทีละคน
          </Button>
          <Button onClick={() => handleOpenModal(null, 'BULK')} variant="white" className="bg-orange text-white flex-1 sm:flex-none hover:bg-orange/90">
            <Users className="w-5 h-5" />
            เพิ่มคราวละมาก ๆ
          </Button>
        </div>
      </div>

      <Card className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-white border-0 shadow-sm">
        <div className="flex items-center gap-4 w-full">
          <div className="p-3 bg-gray-50 rounded-2xl">
            <Filter className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1 max-w-sm">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">เลือกชั้นเรียนเพื่อเรียกดูข้อมูล</label>
             <select 
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl font-bold text-gray-700 outline-none focus:ring-4 focus:ring-orange/10 transition-all"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">-- เลือกชั้นเรียน --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-0 border-0 shadow-xl shadow-gray-200/50 overflow-hidden" accentColor={THEME.orange}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-[0.15em] font-black border-b border-gray-50">
                <th className="px-8 py-5 text-center w-24">เลขที่</th>
                <th className="px-8 py-5 w-48">รหัสประจำตัว</th>
                <th className="px-8 py-5">ชื่อ-นามสกุล</th>
                <th className="px-8 py-5 text-right">เครื่องมือ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-100 text-gray-600 font-black text-xs shadow-sm group-hover:bg-white group-hover:text-orange transition-all">
                      {stu.seatNumber}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-gray-700">{stu.studentId}</td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-600">{stu.name}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(stu, 'SINGLE')} className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl text-orange hover:shadow-md transition-all">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(stu.id)} className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl text-danger hover:shadow-md transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 bg-gray-50 rounded-full">
                        <Users className="w-16 h-16 text-gray-200" />
                      </div>
                      <p className="text-lg font-bold text-gray-400">
                        {selectedClassId ? 'ไม่พบข้อมูลนักเรียนในชั้นนี้' : 'กรุณาเลือกชั้นเรียนเพื่อดูข้อมูล'}
                      </p>
                      {selectedClassId && (
                         <Button onClick={() => handleOpenModal(null, 'SINGLE')} variant="white" className="border-orange text-orange">
                           เพิ่มนักเรียนคนแรก
                         </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
          modalMode === 'BULK' 
          ? 'เพิ่มนักเรียนคราวละมากๆ' 
          : (editingStudent ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนเข้าชั้นเรียน')
        }
      >
        <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-6">
           <button 
            disabled={!!editingStudent}
            onClick={() => setModalMode('SINGLE')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${modalMode === 'SINGLE' ? 'bg-white shadow-sm text-orange' : 'text-gray-400 disabled:opacity-30'}`}
           >เพิ่มทีละคน</button>
           <button 
            disabled={!!editingStudent}
            onClick={() => setModalMode('BULK')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${modalMode === 'BULK' ? 'bg-white shadow-sm text-orange' : 'text-gray-400 disabled:opacity-30'}`}
           >เพิ่มคราวละมาก ๆ</button>
        </div>

        {modalMode === 'SINGLE' ? (
          <form onSubmit={handleSaveSingle} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">เลขที่</label>
              <input 
                type="number" required min="1"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-orange/10 outline-none font-black transition-all"
                value={formData.seatNumber}
                onChange={(e) => setFormData({...formData, seatNumber: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">รหัสประจำตัวนักเรียน</label>
              <input 
                type="text" required 
                placeholder="เช่น 12345"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-orange/10 outline-none font-bold transition-all"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">ชื่อ-นามสกุล</label>
              <input 
                type="text" required 
                placeholder="ชื่อ และ นามสกุล"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-orange/10 outline-none font-bold transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <Button type="submit" variant="secondary" className="w-full py-4 rounded-2xl mt-4 bg-orange shadow-orange/20">บันทึกข้อมูล</Button>
          </form>
        ) : (
          <form onSubmit={handleSaveBulk} className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 text-blue-600">
              <Info className="w-6 h-6 shrink-0" />
              <div className="text-xs font-bold">
                <p>รูปแบบข้อมูล: 1 บรรทัดต่อ 1 คน</p>
                <p className="mt-1">รหัสนักเรียน, ชื่อ-นามสกุล</p>
                <p className="mt-1 opacity-70">ตัวอย่าง:<br/>10001, นายสมชาย ใจดี<br/>10002, นางสาวใจบุญ รักเรียน</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">ข้อมูลนักเรียน</label>
              <textarea 
                required
                rows={8}
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-orange/10 outline-none font-medium transition-all resize-none text-sm leading-relaxed"
                placeholder="คัดลอกข้อมูลมาวางที่นี่..."
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" className="w-full py-4 rounded-2xl mt-4 bg-orange shadow-orange/20">
              <Users className="w-5 h-5" />
              ยืนยันการเพิ่มทั้งหมด
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default StudentManagement;

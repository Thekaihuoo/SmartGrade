
import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { User, SchoolClass, Subject, Assignment } from '../../types';
// Added GraduationCap to imports to fix the undefined icon error
import { ShoppingCart, Trash2, Plus, Briefcase, ChevronRight, GraduationCap } from 'lucide-react';
import { Button, Card, Badge } from '../../components/UI';
import Swal from 'sweetalert2';

const TeacherAssignment: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Cart / Selection State
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [cart, setCart] = useState<Subject[]>([]);

  useEffect(() => {
    setTeachers(storage.getUsers().filter(u => u.role === 'TEACHER'));
    setClasses(storage.getClasses());
    setSubjects(storage.getSubjects());
    setAssignments(storage.getAssignments());
  }, []);

  const addToCart = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    if (cart.some(s => s.id === subjectId)) {
      return Swal.fire({ title: 'วิชานี้อยู่ในตะกร้าแล้ว', icon: 'info', toast: true, position: 'top' });
    }
    setCart([...cart, subject]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(s => s.id !== id));
  };

  const handleAssign = () => {
    if (!selectedTeacherId || !selectedClassId || cart.length === 0) {
      return Swal.fire('กรุณาเลือกข้อมูลให้ครบถ้วน', '', 'warning');
    }

    const newAssignments: Assignment[] = cart.map(sub => ({
      id: `assign-${Date.now()}-${sub.id}`,
      teacherId: selectedTeacherId,
      classId: selectedClassId,
      subjectId: sub.id
    }));

    // Check for duplicates in current assignments (optional but good)
    const filteredNew = newAssignments.filter(nas => 
      !assignments.some(as => as.classId === nas.classId && as.subjectId === nas.subjectId)
    );

    if (filteredNew.length < newAssignments.length) {
      Swal.fire('บางวิชามีผู้สอนในชั้นนี้อยู่แล้ว', 'ระบบจะข้ามวิชาที่มีการมอบหมายไว้แล้ว', 'info');
    }

    const updated = [...assignments, ...filteredNew];
    storage.saveAssignments(updated);
    setAssignments(updated);
    setCart([]);
    Swal.fire('มอบหมายงานสำเร็จ', '', 'success');
  };

  const removeAssignment = (id: string) => {
    Swal.fire({
      title: 'ลบการมอบหมายงาน?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      confirmButtonColor: '#EF5350'
    }).then(r => {
      if (r.isConfirmed) {
        const updated = assignments.filter(a => a.id !== id);
        storage.saveAssignments(updated);
        setAssignments(updated);
      }
    });
  };

  const groupAssignmentsByClass = () => {
    const grouped: Record<string, Assignment[]> = {};
    assignments.forEach(a => {
      if (!grouped[a.classId]) grouped[a.classId] = [];
      grouped[a.classId].push(a);
    });
    return grouped;
  };

  const groupedAssignments = groupAssignmentsByClass();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1 & 2: Selection */}
        <Card className="space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-700">
            <Briefcase className="w-5 h-5 text-primary" />
            สร้างรายการมอบหมาย
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">1. เลือกครูผู้สอน</label>
              <select 
                className="w-full px-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                value={selectedTeacherId}
                onChange={e => setSelectedTeacherId(e.target.value)}
              >
                <option value="">-- เลือกครู --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">2. เลือกชั้นเรียน</label>
              <select 
                className="w-full px-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
              >
                <option value="">-- เลือกชั้นเรียน --</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">3. เลือกรายวิชา</label>
            <div className="flex gap-2">
              <select 
                className="flex-1 px-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                id="subject-select"
              >
                <option value="">-- เลือกรายวิชา --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
              </select>
              <Button onClick={() => {
                const el = document.getElementById('subject-select') as HTMLSelectElement;
                if (el.value) addToCart(el.value);
              }}>
                <Plus className="w-4 h-4" />
                หยิบใส่ตะกร้า
              </Button>
            </div>
          </div>
        </Card>

        {/* Cart View */}
        <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-700 mb-4">
            <ShoppingCart className="w-5 h-5 text-orange" />
            ตะกร้ารายการวิชา ({cart.length})
          </h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
            {cart.map(sub => (
              <div key={sub.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <div>
                  <p className="font-bold text-sm text-gray-700">{sub.code}</p>
                  <p className="text-xs text-gray-500">{sub.name}</p>
                </div>
                <button onClick={() => removeFromCart(sub.id)} className="text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {cart.length === 0 && (
              <p className="text-center text-gray-400 py-10 text-sm italic">ไม่มีรายการในตะกร้า</p>
            )}
          </div>
          {cart.length > 0 && (
            <Button onClick={handleAssign} className="w-full mt-6 py-3" variant="secondary">
              บันทึกการมอบหมายทั้งหมด
            </Button>
          )}
        </Card>
      </div>

      {/* Assignment List Table */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">ข้อมูลการมอบหมายครูผู้สอน</h3>
        {Object.entries(groupedAssignments).map(([classId, classAs]) => {
          const className = classes.find(c => c.id === classId)?.name;
          return (
            <Card key={classId} className="p-0 overflow-hidden border-0 shadow-md">
              <div className="bg-primary/5 px-6 py-4 flex items-center gap-2 border-b border-primary/10">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-primary">ชั้นเรียน: {className}</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6 py-3 font-semibold">รหัสวิชา - รายวิชา</th>
                      <th className="px-6 py-3 font-semibold">ชื่อครูผู้สอน</th>
                      <th className="px-6 py-3 font-semibold text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {classAs.map(as => {
                      const teacher = teachers.find(t => t.id === as.teacherId);
                      const subject = subjects.find(s => s.id === as.subjectId);
                      return (
                        <tr key={as.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-800">{subject?.code}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-gray-600">{subject?.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{teacher?.name}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => removeAssignment(as.id)} className="text-gray-300 hover:text-danger p-2">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })}
        {assignments.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl text-gray-400">ยังไม่มีการมอบหมายครูผู้สอน</div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignment;

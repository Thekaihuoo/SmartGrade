
import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { Subject } from '../../types';
import { Plus, Pencil, Trash2, BookOpen, Search, Filter } from 'lucide-react';
import { Button, Card, Modal, Badge, SectionHeader } from '../../components/UI';
import Swal from 'sweetalert2';
import { THEME } from '../../constants';

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Omit<Subject, 'id'>>({
    code: '',
    name: '',
    credits: 1,
    type: 'พื้นฐาน'
  });

  useEffect(() => {
    setSubjects(storage.getSubjects());
  }, []);

  const handleOpenModal = (sub: Subject | null = null) => {
    if (sub) {
      setEditingSub(sub);
      setFormData({
        code: sub.code,
        name: sub.name,
        credits: sub.credits,
        type: sub.type
      });
    } else {
      setEditingSub(null);
      setFormData({ code: '', name: '', credits: 1.5, type: 'พื้นฐาน' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let newSubs;
    if (editingSub) {
      newSubs = subjects.map(s => s.id === editingSub.id ? { ...s, ...formData } : s);
    } else {
      newSubs = [...subjects, { ...formData, id: `sub-${Date.now()}` }];
    }
    storage.saveSubjects(newSubs);
    setSubjects(newSubs);
    setIsModalOpen(false);
    Swal.fire({
      title: 'สำเร็จ',
      text: 'บันทึกรายวิชาเรียบร้อย',
      icon: 'success',
      confirmButtonColor: '#7E57C2',
      customClass: { popup: 'rounded-[2.5rem]' }
    });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'ลบรายวิชานี้?',
      text: "การมอบหมายครูและผลการเรียนในวิชานี้จะถูกลบทั้งหมด",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบข้อมูล',
      confirmButtonColor: THEME.danger,
      customClass: { popup: 'rounded-[2.5rem]' }
    }).then((result) => {
      if (result.isConfirmed) {
        const newSubs = subjects.filter(s => s.id !== id);
        storage.saveSubjects(newSubs);
        setSubjects(newSubs);
        Swal.fire({ title: 'ลบเรียบร้อย', icon: 'success', customClass: { popup: 'rounded-[2.5rem]' } });
      }
    });
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
        <SectionHeader 
          title="จัดการรายวิชา" 
          description="กำหนดรหัสวิชา หน่วยกิต และประเภทของวิชาเรียน"
          icon={<BookOpen className="w-8 h-8" />}
          color="#7E57C2"
        />
        <Button onClick={() => handleOpenModal()} className="sm:mt-2 bg-gradient-to-r from-accent-purple to-[#5e35b1] shadow-xl shadow-accent-purple/20">
          <Plus className="w-6 h-6" />
          เพิ่มรายวิชาใหม่
        </Button>
      </div>

      <Card className="p-6 bg-white/60 border-0 shadow-sm flex items-center max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-6 h-6" />
          <input 
            type="text" 
            placeholder="ค้นหารหัสวิชา หรือชื่อวิชา..."
            className="w-full pl-14 pr-6 py-4.5 bg-gray-50/50 border-0 rounded-[1.75rem] focus:ring-4 focus:ring-accent-purple/10 transition-all text-base outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <Card className="p-0 border-0 shadow-2xl overflow-hidden" accentColor="#7E57C2">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-100">
                <th className="px-10 py-6">รหัสวิชา</th>
                <th className="px-10 py-6">ชื่อรายวิชา</th>
                <th className="px-10 py-6 text-center">หน่วยกิต</th>
                <th className="px-10 py-6 text-center">ประเภท</th>
                <th className="px-10 py-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSubjects.map((sub) => (
                <tr key={sub.id} className="group hover:bg-accent-purple/[0.02] transition-all duration-300">
                  <td className="px-10 py-8 font-black text-accent-purple text-xl tracking-tight">{sub.code}</td>
                  <td className="px-10 py-8 font-bold text-gray-700">{sub.name}</td>
                  <td className="px-10 py-8 text-center">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 font-black text-lg">
                      {sub.credits.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <Badge color={sub.type === 'พื้นฐาน' ? THEME.primary : THEME.warning}>
                      วิชา{sub.type}
                    </Badge>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => handleOpenModal(sub)} className="p-3.5 bg-white shadow-lg border border-gray-100 rounded-2xl text-accent-purple hover:scale-110 transition-all">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="p-3.5 bg-white shadow-lg border border-gray-100 rounded-2xl text-danger hover:scale-110 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center text-gray-400 font-bold">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <BookOpen className="w-20 h-20" />
                      <p className="text-xl italic">ไม่พบข้อมูลรายวิชา</p>
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
        title={editingSub ? 'แก้ไขข้อมูลรายวิชา' : 'เพิ่มรายวิชาใหม่'}
      >
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">รหัสวิชา</label>
            <input 
              type="text" required 
              className="w-full px-6 py-4.5 bg-gray-50 border-2 border-transparent focus:border-accent-purple/20 focus:bg-white rounded-[1.75rem] outline-none font-black text-xl transition-all"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              placeholder="ENG101"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">ชื่อรายวิชา</label>
            <input 
              type="text" required 
              className="w-full px-6 py-4.5 bg-gray-50 border-2 border-transparent focus:border-accent-purple/20 focus:bg-white rounded-[1.75rem] outline-none font-bold text-lg transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="ภาษาอังกฤษพื้นฐาน"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">หน่วยกิต</label>
              <input 
                type="number" step="0.5" min="0" required
                className="w-full px-6 py-4.5 bg-gray-50 border-2 border-transparent focus:border-accent-purple/20 focus:bg-white rounded-[1.75rem] outline-none font-black text-xl transition-all text-center"
                value={formData.credits}
                onChange={(e) => setFormData({...formData, credits: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">ประเภทวิชา</label>
              <select 
                className="w-full px-6 py-4.5 bg-gray-50 border-2 border-transparent focus:border-accent-purple/20 focus:bg-white rounded-[1.75rem] outline-none font-black text-lg transition-all appearance-none cursor-pointer"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="พื้นฐาน">วิชาพื้นฐาน</option>
                <option value="เพิ่มเติม">วิชาเพิ่มเติม</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full py-5 text-xl rounded-[2rem] mt-4 shadow-accent-purple/30 bg-accent-purple">
            บันทึกรายวิชา
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectManagement;

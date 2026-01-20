
import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { SchoolClass } from '../../types';
import { Plus, Pencil, Trash2, GraduationCap, Sparkles } from 'lucide-react';
import { Button, Card, Modal, SectionHeader } from '../../components/UI';
import Swal from 'sweetalert2';
import { THEME } from '../../constants';

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [className, setClassName] = useState('');

  useEffect(() => {
    setClasses(storage.getClasses());
  }, []);

  const handleOpenModal = (cls: SchoolClass | null = null) => {
    if (cls) {
      setEditingClass(cls);
      setClassName(cls.name);
    } else {
      setEditingClass(null);
      setClassName('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let newClasses;
    if (editingClass) {
      newClasses = classes.map(c => c.id === editingClass.id ? { ...c, name: className } : c);
    } else {
      newClasses = [...classes, { id: `class-${Date.now()}`, name: className }];
    }
    storage.saveClasses(newClasses);
    setClasses(newClasses);
    setIsModalOpen(false);
    Swal.fire({
      title: 'บันทึกสำเร็จ',
      icon: 'success',
      confirmButtonColor: THEME.secondary,
      customClass: { popup: 'rounded-[2.5rem]' }
    });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'ต้องการลบชั้นเรียนนี้?',
      text: "รายชื่อนักเรียนในชั้นนี้จะยังคงอยู่แต่จะไม่มีชั้นเรียนสังกัด",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: THEME.danger,
      customClass: { popup: 'rounded-[2.5rem]' }
    }).then((result) => {
      if (result.isConfirmed) {
        const newClasses = classes.filter(c => c.id !== id);
        storage.saveClasses(newClasses);
        setClasses(newClasses);
        Swal.fire({ title: 'ลบเรียบร้อย', icon: 'success', customClass: { popup: 'rounded-[2.5rem]' } });
      }
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
        <SectionHeader 
          title="จัดการชั้นเรียน" 
          description="บริหารจัดการรายชื่อห้องเรียนและข้อมูลพื้นฐาน"
          icon={<GraduationCap className="w-8 h-8" />}
          color={THEME.secondary}
        />
        <Button onClick={() => handleOpenModal()} variant="secondary" className="sm:mt-2 shadow-xl shadow-secondary/20">
          <Plus className="w-6 h-6" />
          เพิ่มชั้นเรียนใหม่
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.map(cls => (
          <Card key={cls.id} className="group p-10 relative overflow-hidden border-0 shadow-xl" isGradient accentColor={THEME.secondary}>
             <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2 translate-y-[-10px] group-hover:translate-y-0">
              <button onClick={() => handleOpenModal(cls)} className="p-3 bg-white shadow-lg rounded-2xl text-secondary hover:bg-secondary hover:text-white transition-all">
                <Pencil className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(cls.id)} className="p-3 bg-white shadow-lg rounded-2xl text-danger hover:bg-danger hover:text-white transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-secondary/15 rounded-[2.5rem] flex items-center justify-center text-secondary-dark mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <GraduationCap className="w-12 h-12" />
              </div>
              <h4 className="text-3xl font-black text-gray-800 tracking-tighter">{cls.name}</h4>
              <p className="text-xs font-black text-gray-400 mt-3 uppercase tracking-[0.2em]">Classroom Unit</p>
              <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-4 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span>Active Class</span>
              </div>
            </div>
          </Card>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white/40 backdrop-blur-md rounded-[4rem] border-4 border-dashed border-gray-200">
            <div className="flex flex-col items-center gap-6 opacity-30">
              <GraduationCap className="w-24 h-24 text-gray-300" />
              <p className="text-2xl font-black text-gray-400 italic">ยังไม่มีข้อมูลชั้นเรียนในระบบ</p>
              <Button onClick={() => handleOpenModal()} variant="white" className="mt-4">สร้างชั้นเรียนแรกของคุณ</Button>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingClass ? 'แก้ไขข้อมูลชั้นเรียน' : 'เพิ่มชั้นเรียนใหม่'}
      >
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">ชื่อชั้นเรียน</label>
            <input 
              type="text" required 
              placeholder="เช่น ม.1/1 หรือ G.10A"
              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-secondary/30 focus:bg-white rounded-[2rem] outline-none font-black text-2xl transition-all text-center"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" className="w-full py-5 text-xl rounded-[2rem] mt-4 shadow-secondary/30">
            บันทึกชั้นเรียน
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ClassManagement;

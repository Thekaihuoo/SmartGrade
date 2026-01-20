
import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { User } from '../../types';
import { UserPlus, Pencil, Trash2, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Button, Card, Modal, Badge, SectionHeader } from '../../components/UI';
import Swal from 'sweetalert2';
import { THEME } from '../../constants';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'TEACHER' as 'ADMIN' | 'TEACHER'
  });

  useEffect(() => {
    setUsers(storage.getUsers());
  }, []);

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: user.password || '',
        name: user.name,
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({ username: '', password: '', name: '', role: 'TEACHER' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let newUsers;
    if (editingUser) {
      newUsers = users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u);
    } else {
      const newUser: User = { ...formData, id: `user-${Date.now()}` };
      newUsers = [...users, newUser];
    }
    storage.saveUsers(newUsers);
    setUsers(newUsers);
    setIsModalOpen(false);
    Swal.fire({
      title: 'บันทึกสำเร็จ',
      icon: 'success',
      confirmButtonColor: THEME.primary,
      timer: 1500,
      customClass: { popup: 'rounded-[2rem]' }
    });
  };

  const handleDelete = (id: string) => {
    if (id === 'admin-01') {
      return Swal.fire('ไม่สามารถลบผู้ดูแลระบบหลักได้', '', 'error');
    }
    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: "ข้อมูลนี้ไม่สามารถกู้คืนได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: THEME.danger,
      cancelButtonColor: '#aaa',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      customClass: { popup: 'rounded-[2rem]' }
    }).then((result) => {
      if (result.isConfirmed) {
        const newUsers = users.filter(u => u.id !== id);
        storage.saveUsers(newUsers);
        setUsers(newUsers);
        Swal.fire({ title: 'ลบข้อมูลเรียบร้อย', icon: 'success', customClass: { popup: 'rounded-[2rem]' } });
      }
    });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
        <SectionHeader 
          title="จัดการผู้ใช้งาน" 
          description="บริหารจัดการสิทธิ์สำหรับ Admin และคุณครูผู้สอน"
          icon={<ShieldCheck className="w-8 h-8" />}
          color={THEME.primary}
        />
        <Button onClick={() => handleOpenModal()} className="sm:mt-2 bg-gradient-to-r from-primary to-primary-dark shadow-xl shadow-primary/20">
          <UserPlus className="w-6 h-6" />
          เพิ่มผู้ใช้งาน
        </Button>
      </div>

      <Card className="p-6 bg-white/60 border-0 shadow-sm flex items-center max-w-lg mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-6 h-6" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ หรือ username..."
            className="w-full pl-14 pr-6 py-4.5 bg-gray-50/50 border-0 rounded-[1.75rem] focus:ring-4 focus:ring-primary/10 transition-all text-base outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <Card className="p-0 border-0 shadow-2xl overflow-hidden" accentColor={THEME.primary}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-100">
                <th className="px-10 py-6">ชื่อ-นามสกุล</th>
                <th className="px-10 py-6">ชื่อผู้ใช้ (Username)</th>
                <th className="px-10 py-6 text-center">สิทธิ์การใช้งาน</th>
                <th className="px-10 py-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-base">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-primary/[0.02] transition-all duration-300">
                  <td className="px-10 py-8 font-black text-gray-800 group-hover:text-primary transition-colors">{user.name}</td>
                  <td className="px-10 py-8 text-gray-400 font-bold italic">@{user.username}</td>
                  <td className="px-10 py-8 text-center">
                    <Badge color={user.role === 'ADMIN' ? THEME.primary : THEME.orange}>
                      {user.role === 'ADMIN' ? (
                        <div className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />ผู้ดูแลระบบ</div>
                      ) : 'คุณครูผู้สอน'}
                    </Badge>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => handleOpenModal(user)} className="p-3.5 bg-white shadow-lg border border-gray-100 rounded-2xl text-primary hover:scale-110 active:scale-95 transition-all">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-3.5 bg-white shadow-lg border border-gray-100 rounded-2xl text-danger hover:scale-110 active:scale-95 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center text-gray-400 font-bold">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <Search className="w-20 h-20" />
                      <p className="text-xl">ไม่พบข้อมูลผู้ใช้งานที่ค้นหา</p>
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
        title={editingUser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
      >
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">ชื่อ-นามสกุล</label>
            <input 
              type="text" required 
              className="w-full px-6 py-4.5 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[1.75rem] outline-none font-bold text-lg transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="สมชาย ใจดี"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Username</label>
            <input 
              type="text" required 
              className="w-full px-6 py-4.5 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[1.75rem] outline-none font-bold text-lg transition-all"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="ครูสมชาย"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Password</label>
            <input 
              type="password" required 
              className="w-full px-6 py-4.5 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[1.75rem] outline-none font-bold text-lg transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">สิทธิ์การใช้งาน</label>
            <select 
              className="w-full px-6 py-4.5 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[1.75rem] outline-none font-black text-lg transition-all appearance-none cursor-pointer"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as any})}
            >
              <option value="TEACHER">ครูผู้สอน (Teacher)</option>
              <option value="ADMIN">ผู้ดูแลระบบ (Admin)</option>
            </select>
          </div>
          <Button type="submit" className="w-full py-5 text-xl rounded-[2rem] mt-4 shadow-primary/30">
            บันทึกข้อมูล
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;

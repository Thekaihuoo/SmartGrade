
import React, { useState } from 'react';
import { User } from '../../types';
import { storage } from '../../services/storage';
import { UserCircle, Key, User as UserIcon, Save } from 'lucide-react';
import { Button, Card } from '../../components/UI';
import Swal from 'sweetalert2';

const TeacherProfile: React.FC<{ user: User; onUpdate: (u: User) => void }> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    password: user.password || ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...formData } : u);
    storage.saveUsers(updatedUsers);
    Swal.fire('อัปเดตข้อมูลส่วนตัวเรียบร้อย', '', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <UserCircle className="w-16 h-16" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
          <p className="text-gray-400 text-sm">ครูผู้สอน</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">ชื่อ-นามสกุล</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">ชื่อผู้ใช้ (Username)</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">รหัสผ่านใหม่</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <Button type="submit" className="w-full py-4 shadow-lg shadow-primary/20">
            <Save className="w-5 h-5" />
            บันทึกการเปลี่ยนแปลง
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default TeacherProfile;

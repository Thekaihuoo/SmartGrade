
import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { User, Assignment, SchoolClass, Subject, Student, GradeRecord } from '../../types';
import { Save, Filter, ClipboardList, CheckCircle2 } from 'lucide-react';
import { Button, Card, Spinner } from '../../components/UI';
import Swal from 'sweetalert2';

const GradeEntry: React.FC<{ teacher: User }> = ({ teacher }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allAssignments = storage.getAssignments().filter(a => a.teacherId === teacher.id);
    setAssignments(allAssignments);
    setSubjects(storage.getSubjects());
    setClasses(storage.getClasses());
  }, [teacher.id]);

  useEffect(() => {
    if (selectedAssignmentId) {
      setLoading(true);
      const assignment = assignments.find(a => a.id === selectedAssignmentId);
      if (assignment) {
        const classStudents = storage.getStudents()
          .filter(s => s.classId === assignment.classId)
          .sort((a, b) => a.seatNumber - b.seatNumber);
        
        const allGrades = storage.getGrades();
        const existingGrades = allGrades.filter(g => g.assignmentId === selectedAssignmentId);
        
        setStudents(classStudents);
        
        // Initialize or load grades for these students
        const initialGrades = classStudents.map(s => {
          const eg = existingGrades.find(g => g.studentId === s.id);
          return {
            studentId: s.id,
            assignmentId: selectedAssignmentId,
            grade: eg ? eg.grade : null
          };
        });
        setGrades(initialGrades);
      }
      setTimeout(() => setLoading(false), 500);
    } else {
      setStudents([]);
      setGrades([]);
    }
  }, [selectedAssignmentId, assignments]);

  const handleGradeChange = (studentId: string, gradeValue: string) => {
    const grade = gradeValue === '' ? null : parseFloat(gradeValue);
    setGrades(prev => prev.map(g => g.studentId === studentId ? { ...g, grade } : g));
  };

  const saveGrades = () => {
    const allGrades = storage.getGrades();
    // Filter out previous grades for THIS assignment to replace them
    const otherGrades = allGrades.filter(g => g.assignmentId !== selectedAssignmentId);
    const updatedGrades = [...otherGrades, ...grades];
    storage.saveGrades(updatedGrades);
    Swal.fire('บันทึกผลการเรียนสำเร็จ', '', 'success');
  };

  return (
    <div className="space-y-6">
      <Card className="flex flex-col md:flex-row items-center gap-4 p-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <Filter className="w-5 h-5 text-primary" />
          <select 
            className="w-full px-4 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            value={selectedAssignmentId}
            onChange={e => setSelectedAssignmentId(e.target.value)}
          >
            <option value="">-- เลือกวิชาและชั้นเรียนที่มอบหมาย --</option>
            {assignments.map(as => {
              const sub = subjects.find(s => s.id === as.subjectId);
              const cls = classes.find(c => c.id === as.classId);
              return (
                <option key={as.id} value={as.id}>
                  {sub?.code} {sub?.name} - ชั้น {cls?.name}
                </option>
              );
            })}
          </select>
        </div>
        {selectedAssignmentId && (
          <Button onClick={saveGrades} className="w-full md:w-auto">
            <Save className="w-4 h-4" />
            บันทึกผลการเรียนทั้งหมด
          </Button>
        )}
      </Card>

      {loading ? <Spinner /> : selectedAssignmentId ? (
        <Card className="p-0 overflow-hidden">
          <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-b border-primary/10">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h4 className="font-bold text-gray-700">บัญชีรายชื่อนักเรียนและบันทึกคะแนน</h4>
            </div>
            <span className="text-xs font-medium text-gray-400">จำนวนนักเรียน {students.length} คน</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold w-20">เลขที่</th>
                  <th className="px-6 py-4 font-semibold w-40">รหัสประจำตัว</th>
                  <th className="px-6 py-4 font-semibold">ชื่อ-นามสกุล</th>
                  <th className="px-6 py-4 font-semibold w-48 text-center">ผลการเรียน (Grade)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(stu => {
                  const studentGrade = grades.find(g => g.studentId === stu.id);
                  return (
                    <tr key={stu.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-400">#{stu.seatNumber}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">{stu.studentId}</td>
                      <td className="px-6 py-4 text-gray-600">{stu.name}</td>
                      <td className="px-6 py-4">
                        <select 
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 font-bold text-center"
                          value={studentGrade?.grade === null ? '' : studentGrade.grade.toString()}
                          onChange={e => handleGradeChange(stu.id, e.target.value)}
                        >
                          <option value="">-</option>
                          <option value="4">4.0</option>
                          <option value="3.5">3.5</option>
                          <option value="3">3.0</option>
                          <option value="2.5">2.5</option>
                          <option value="2">2.0</option>
                          <option value="1.5">1.5</option>
                          <option value="1">1.0</option>
                          <option value="0">0</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <Button onClick={saveGrades} className="px-8 py-3">
              <CheckCircle2 className="w-5 h-5" />
              ยืนยันการบันทึก
            </Button>
          </div>
        </Card>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl text-gray-400 border-2 border-dashed border-gray-100 italic">
          กรุณาเลือกรายวิชาเพื่อเริ่มต้นบันทึกคะแนน
        </div>
      )}
    </div>
  );
};

export default GradeEntry;

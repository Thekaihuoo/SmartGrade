
export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: 'ADMIN' | 'TEACHER';
}

export interface SchoolClass {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  classId: string;
  seatNumber: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  type: 'พื้นฐาน' | 'เพิ่มเติม';
}

export interface Assignment {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
}

export interface GradeRecord {
  studentId: string;
  assignmentId: string;
  grade: number | null; // 0, 1, 1.5, 2, 2.5, 3, 3.5, 4
}

export interface AppState {
  currentUser: User | Student | null;
  role: Role | null;
}

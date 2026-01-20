
import { STORAGE_KEYS, INITIAL_ADMIN } from '../constants';
import { User, SchoolClass, Student, Subject, Assignment, GradeRecord } from '../types';

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      const initial = [INITIAL_ADMIN];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),

  getClasses: (): SchoolClass[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES) || '[]'),
  saveClasses: (classes: SchoolClass[]) => localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes)),

  getStudents: (): Student[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]'),
  saveStudents: (students: Student[]) => localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students)),

  getSubjects: (): Subject[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]'),
  saveSubjects: (subjects: Subject[]) => localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects)),

  getAssignments: (): Assignment[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS) || '[]'),
  saveAssignments: (assignments: Assignment[]) => localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments)),

  getGrades: (): GradeRecord[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.GRADES) || '[]'),
  saveGrades: (grades: GradeRecord[]) => localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades)),
};

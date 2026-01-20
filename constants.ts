
export const THEME = {
  primary: '#26A69A',
  secondary: '#AED581',
  warning: '#FFCA28',
  orange: '#FF8A65',
  danger: '#EF5350',
};

export const STORAGE_KEYS = {
  USERS: 'grade_app_users',
  CLASSES: 'grade_app_classes',
  STUDENTS: 'grade_app_students',
  SUBJECTS: 'grade_app_subjects',
  ASSIGNMENTS: 'grade_app_assignments',
  GRADES: 'grade_app_grades',
};

export const INITIAL_ADMIN = {
  id: 'admin-01',
  username: 'admin',
  password: '1234',
  name: 'System Administrator',
  role: 'ADMIN' as const,
};
// ============================================================
// ISE 4A STAFF REGISTRY — MVJ College of Engineering
// Teachers login with: name (select from list) + secret code
// Codes are assigned below — share with respective teachers
// ============================================================

export const staffCodes = [
  // Teachers from Timetable (MVJ22IS41-55 subject codes)
  {
    code: 'ANU-KM-2026',
    name: 'Prof. Anu K M',
    role: 'teacher',
    section: 'ISE 4A',
    designation: 'Assistant Professor',
    subjects: ['Analysis & Design of Algorithms', 'ADA Lab'],
    subCodes: ['MVJ22IS41', 'MVJ22ISL44'],
    email: 'anu.km@mvjce.edu.in',
  },
  {
    code: 'VEN-G-2026',
    name: 'Prof. Venkatesh G',
    role: 'teacher',
    section: 'ISE 4A',
    designation: 'Assistant Professor',
    subjects: ['Advanced Java'],
    subCodes: ['MVJ22IS42'],
    email: 'venkatesh.g@mvjce.edu.in',
  },
  {
    code: 'ANU-P-2026',
    name: 'Prof. Anupama P',
    role: 'teacher',
    section: 'ISE 4A',
    designation: 'Associate Professor & Class Teacher',
    subjects: ['Database Management Systems'],
    subCodes: ['MVJ22IS43'],
    email: 'anupama.p@mvjce.edu.in',
    isClassTeacher: true,
  },
  {
    code: 'NAN-R-2026',
    name: 'Prof. Nandana R',
    role: 'teacher',
    section: 'ISE 4A',
    designation: 'Assistant Professor',
    subjects: ['Biology For Engineers', 'Universal Human Values', 'AEC Vertical Level II'],
    subCodes: ['MVJ22BI47', 'MVJ22UHV48', 'MVJ22AXYYL'],
    email: 'nandana.r@mvjce.edu.in',
  },
  {
    code: 'KOC-M-2026',
    name: 'Prof. Kocheruvu Madhu',
    role: 'teacher',
    section: 'ISE 4A',
    designation: 'Assistant Professor (Maths)',
    subjects: ['Discrete Mathematical Structures'],
    subCodes: ['MVJ22IS451'],
    email: 'kocheruvu.madhu@mvjce.edu.in',
  },
  // HOD
  {
    code: 'HOD-ISE-2026',
    name: 'Dr. Raja Meyyan',
    role: 'hod',
    section: 'ISE 4A',
    designation: 'Head of Department - ISE',
    subjects: [],
    email: 'hod.ise@mvjce.edu.in',
  },
  // Admin
  {
    code: 'ADM-ISE-2026',
    name: 'ISE Department Admin',
    role: 'department_admin',
    section: 'ISE 4A',
    designation: 'Department Administrator',
    subjects: [],
    email: 'admin.ise@mvjce.edu.in',
  },
];

// For backward-compat with existing auth checks
export const approvedStaffAccounts = staffCodes.map(s => ({
  email: s.email,
  role: s.role,
  name: s.name,
  section: s.section,
  designation: s.designation,
  code: s.code,
}));

export const normalizeStaffEmail = (email = '') => email.trim().toLowerCase();

export const getApprovedStaffAccount = (email, role) => {
  const normalizedEmail = normalizeStaffEmail(email);
  return approvedStaffAccounts.find(
    (a) => a.email === normalizedEmail && (!role || role === a.role)
  ) || null;
};

export const isApprovedStaffEmail = (email) =>
  approvedStaffAccounts.some((a) => a.email === normalizeStaffEmail(email));

// New: find staff by name + code (the new secure login method)
export const getStaffByNameAndCode = (name, code) => {
  if (!name || !code) return null;
  const norm = (s = '') => s.trim().toUpperCase().replace(/\s+/g, ' ');
  return staffCodes.find(
    (s) => norm(s.name) === norm(name) && s.code === code.trim()
  ) || null;
};

// Validate a code alone (useful for quick code check)
export const getStaffByCode = (code) =>
  staffCodes.find((s) => s.code === (code || '').trim()) || null;

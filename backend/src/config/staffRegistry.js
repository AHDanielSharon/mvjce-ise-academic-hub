export const approvedStaffAccounts = [
  { email: 'anupama.p@mvjce.edu.in', role: 'teacher', name: 'Prof. Anupama P', section: 'ISE 4A', designation: 'Associate Professor' },
  { email: 'anu.km@mvjce.edu.in', role: 'lab_instructor', name: 'Prof. Anu K M', section: 'ISE 4B', designation: 'Lab Instructor' },
  { email: 'admin.ise@mvjce.edu.in', role: 'department_admin', name: 'ISE Department Admin', section: 'ISE 4A', designation: 'Department Administrator' },
  { email: 'hod.ise@mvjce.edu.in', role: 'hod', name: 'Dr. HOD ISE', section: 'ISE 4A', designation: 'Head of Department' },
  { email: 'principal@mvjce.edu.in', role: 'principal', name: 'Principal MVJCE', section: 'ISE 4A', designation: 'Principal' }
];

export const normalizeStaffEmail = (email = '') => email.trim().toLowerCase();

export const getApprovedStaffAccount = (email, role) => {
  const normalizedEmail = normalizeStaffEmail(email);
  return approvedStaffAccounts.find((account) => account.email === normalizedEmail && (!role || role === account.role)) || null;
};

export const isApprovedStaffEmail = (email) => approvedStaffAccounts.some((account) => account.email === normalizeStaffEmail(email));

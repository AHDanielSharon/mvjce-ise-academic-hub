// ============================================================
// ISE 4A - Sem 4 - MVJ College of Engineering
// Official Timetable w.e.f 16/03/2026
// Class Teacher: Prof. Anupama P | Room: 049
// Labs: JAVA-226, DBMS-228, ADA-227
// ============================================================

export const SUBJECTS = [
  { code: 'MVJ22IS41',  name: 'Analysis & Design of Algorithms',   credits: 4, faculty: 'Prof. Anu K M',          type: 'theory' },
  { code: 'MVJ22IS42',  name: 'Advanced Java',                      credits: 4, faculty: 'Prof. Venkatesh G',      type: 'theory' },
  { code: 'MVJ22IS43',  name: 'Database Management Systems',        credits: 4, faculty: 'Prof. Anupama P',        type: 'theory' },
  { code: 'MVJ22ISL44', name: 'Analysis & Design of Algorithms Lab',credits: 2, faculty: 'Prof. Anu K M',          type: 'lab' },
  { code: 'MVJ22IS451', name: 'Discrete Mathematical Structures',   credits: 4, faculty: 'Prof. Kocheruvu Madhu',  type: 'theory' },
  { code: 'MVJ22BI47',  name: 'Biology For Engineers',              credits: 3, faculty: 'Prof. Nandana R',        type: 'theory' },
  { code: 'MVJ22UHV48', name: 'Universal Human Values',             credits: 2, faculty: 'Prof. Nandana R',        type: 'theory' },
  { code: 'MVJ22AXYYL', name: 'AEC Vertical Level II',              credits: 2, faculty: 'Prof. Nandana R',        type: 'theory' },
  { code: 'MVJ22NS49',  name: 'National Service Scheme (NSS)',      credits: 0, faculty: '',                       type: 'activity' },
];

// Real timetable from the official MVJ ISE 4A document (w.e.f 16/03/2026)
// Periods: 8:00-8:50, 8:50-9:40, 9:40-10:10(BREAK), 10:10-11:00, 11:00-11:50, 11:50-12:00(BREAK), 12:00-12:50, 12:50-1:40(LUNCH), 1:40-2:30, 2:30-3:20
export const TIMETABLE = [
  {
    day: 'Monday',
    entries: [
      { startTime: '08:00', endTime: '08:50', subject: 'Analysis & Design of Algorithms', code: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: '049', type: 'theory' },
      { startTime: '08:50', endTime: '09:40', subject: 'Advanced Java', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
      { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '10:10', endTime: '11:00', subject: 'ADA Lab (B2) / Advanced Java Lab (B3)', code: 'MVJ22ISL44/MVJ22IS43', faculty: 'Prof. Anu K M / Prof. Venkatesh G', roomNumber: 'ADA-227 / JAVA-226', type: 'lab' },
      { startTime: '11:00', endTime: '11:50', subject: 'ADA Lab (B2) / Advanced Java Lab (B3)', code: 'MVJ22ISL44/MVJ22IS43', faculty: 'Prof. Anu K M / Prof. Venkatesh G', roomNumber: 'ADA-227 / JAVA-226', type: 'lab' },
      { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '12:00', endTime: '12:50', subject: 'Discrete Mathematical Structures (Remedial)', code: 'MVJ22IS451', faculty: 'Prof. Kocheruvu Madhu', roomNumber: '049', type: 'theory' },
      { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '13:40', endTime: '14:30', subject: 'National Service Scheme', code: 'MVJ22NS49', faculty: '', roomNumber: '', type: 'activity' },
    ]
  },
  {
    day: 'Tuesday',
    entries: [
      { startTime: '08:00', endTime: '08:50', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
      { startTime: '08:50', endTime: '09:40', subject: 'Universal Human Values', code: 'MVJ22UHV48', faculty: 'Prof. Nandana R', roomNumber: '049', type: 'theory' },
      { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '10:10', endTime: '11:00', subject: 'Advanced Java Lab (B2) / ADA Lab (B1)', code: 'MVJ22IS42/MVJ22ISL44', faculty: 'Prof. Venkatesh G / Prof. Anu K M', roomNumber: 'JAVA-226 / ADA-227', type: 'lab' },
      { startTime: '11:00', endTime: '11:50', subject: 'Advanced Java Lab (B2) / ADA Lab (B1)', code: 'MVJ22IS42/MVJ22ISL44', faculty: 'Prof. Venkatesh G / Prof. Anu K M', roomNumber: 'JAVA-226 / ADA-227', type: 'lab' },
      { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '12:00', endTime: '12:50', subject: 'Discrete Mathematical Structures', code: 'MVJ22IS451', faculty: 'Prof. Kocheruvu Madhu', roomNumber: '049', type: 'theory' },
      { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '13:40', endTime: '14:30', subject: 'AEC Vertical Level II', code: 'MVJ22AXYYL', faculty: 'Prof. Nandana R', roomNumber: '049', type: 'theory' },
    ]
  },
  {
    day: 'Wednesday',
    entries: [
      { startTime: '08:00', endTime: '08:50', subject: 'Analysis & Design of Algorithms', code: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: '049', type: 'theory' },
      { startTime: '08:50', endTime: '09:40', subject: 'Database Management Systems (Remedial)', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
      { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '10:10', endTime: '11:00', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
      { startTime: '11:00', endTime: '11:50', subject: 'Discrete Mathematical Structures', code: 'MVJ22IS451', faculty: 'Prof. Kocheruvu Madhu', roomNumber: '049', type: 'theory' },
      { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '12:00', endTime: '12:50', subject: 'Advanced Java', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
      { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '13:40', endTime: '14:30', subject: 'LIBRARY', code: '', faculty: '', roomNumber: 'Library', type: 'activity' },
      { startTime: '14:30', endTime: '15:20', subject: 'Biology For Engineers', code: 'MVJ22BI47', faculty: 'Prof. Nandana R', roomNumber: '049', type: 'theory' },
    ]
  },
  {
    day: 'Thursday',
    entries: [
      { startTime: '08:00', endTime: '08:50', subject: 'Discrete Mathematical Structures', code: 'MVJ22IS451', faculty: 'Prof. Kocheruvu Madhu', roomNumber: '049', type: 'theory' },
      { startTime: '08:50', endTime: '09:40', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
      { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '10:10', endTime: '11:00', subject: 'DBMS Lab (B1) / Advanced Java Lab (B2)', code: 'MVJ22IS43/MVJ22IS42', faculty: 'Prof. Anupama P / Prof. Venkatesh G', roomNumber: 'DBMS-228 / JAVA-226', type: 'lab' },
      { startTime: '11:00', endTime: '11:50', subject: 'DBMS Lab (B1) / Advanced Java Lab (B2)', code: 'MVJ22IS43/MVJ22IS42', faculty: 'Prof. Anupama P / Prof. Venkatesh G', roomNumber: 'DBMS-228 / JAVA-226', type: 'lab' },
      { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '12:00', endTime: '12:50', subject: 'Advanced Java (Remedial)', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
      { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '13:40', endTime: '14:30', subject: 'Advanced Java', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
    ]
  },
  {
    day: 'Friday',
    entries: [
      { startTime: '08:00', endTime: '08:50', subject: 'Advanced Java', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
      { startTime: '08:50', endTime: '09:40', subject: 'Analysis & Design of Algorithms (Remedial)', code: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: '049', type: 'theory' },
      { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '10:10', endTime: '11:00', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
      { startTime: '11:00', endTime: '11:50', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
      { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '12:00', endTime: '12:50', subject: 'COUNSELLING', code: '', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'activity' },
      { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
      { startTime: '13:40', endTime: '14:30', subject: 'Biology For Engineers', code: 'MVJ22BI47', faculty: 'Prof. Nandana R', roomNumber: '049', type: 'theory' },
      { startTime: '14:30', endTime: '15:20', subject: 'Analysis & Design of Algorithms', code: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: '049', type: 'theory' },
    ]
  },
];

// Faculty directory for ISE 4A
export const FACULTY = [
  {
    facultyName: 'Prof. Anu K M',
    designation: 'Assistant Professor',
    department: 'ISE',
    section: 'ISE 4A',
    subjects: ['Analysis & Design of Algorithms', 'ADA Lab'],
    subCodes: ['MVJ22IS41', 'MVJ22ISL44'],
    email: 'anu.km@mvjce.edu.in',
    isClassCoordinator: false,
    cabin: 'ISE Department',
  },
  {
    facultyName: 'Prof. Venkatesh G',
    designation: 'Assistant Professor',
    department: 'ISE',
    section: 'ISE 4A',
    subjects: ['Advanced Java'],
    subCodes: ['MVJ22IS42'],
    email: 'venkatesh.g@mvjce.edu.in',
    isClassCoordinator: false,
    cabin: 'ISE Department',
  },
  {
    facultyName: 'Prof. Anupama P',
    designation: 'Associate Professor & Class Teacher',
    department: 'ISE',
    section: 'ISE 4A',
    subjects: ['Database Management Systems'],
    subCodes: ['MVJ22IS43'],
    email: 'anupama.p@mvjce.edu.in',
    isClassCoordinator: true,
    cabin: 'ISE Department',
  },
  {
    facultyName: 'Prof. Nandana R',
    designation: 'Assistant Professor',
    department: 'ISE',
    section: 'ISE 4A',
    subjects: ['Biology For Engineers', 'Universal Human Values', 'AEC Vertical Level II'],
    subCodes: ['MVJ22BI47', 'MVJ22UHV48', 'MVJ22AXYYL'],
    email: 'nandana.r@mvjce.edu.in',
    isClassCoordinator: false,
    cabin: 'ISE Department',
  },
  {
    facultyName: 'Prof. Kocheruvu Madhu',
    designation: 'Assistant Professor (Mathematics)',
    department: 'Mathematics',
    section: 'ISE 4A',
    subjects: ['Discrete Mathematical Structures'],
    subCodes: ['MVJ22IS451'],
    email: 'kocheruvu.madhu@mvjce.edu.in',
    isClassCoordinator: false,
    cabin: 'Maths Department',
  },
  {
    facultyName: 'Dr. Raja Meyyan',
    designation: 'Head of Department',
    department: 'ISE',
    section: 'ISE 4A',
    subjects: [],
    email: 'hod.ise@mvjce.edu.in',
    isClassCoordinator: false,
    cabin: 'HOD ISE Chamber',
  }
];
export const offlineData = {
  subjects: SUBJECTS,
  timetable: TIMETABLE,
  faculty: FACULTY,
  notifications: [],

  // ✅ ADD THIS FUNCTION
  getNotifications() {
    return this.notifications;
  }
};


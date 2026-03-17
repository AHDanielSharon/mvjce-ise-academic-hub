export const approvedStudents = [
  { usn: '1MVJ24IS001', name: 'ANWESHA ANURAKTA PANIGRAHY', section: 'ISE 4A' },
  { usn: '1MVJ24IS002', name: 'AINAVY KUMAR REDDY', section: 'ISE 4A' },
  { usn: '1MVJ24IS003', name: 'ABHILASH AMARAPPA PATTIPUR', section: 'ISE 4A' },
  { usn: '1MVJ24IS004', name: 'ABHILASH S', section: 'ISE 4A' },
  { usn: '1MVJ24IS005', name: 'ADVITH SRIJAN R', section: 'ISE 4A' },
  { usn: '1MVJ24IS006', name: 'AKSHAY SINGH S', section: 'ISE 4A' },
  { usn: '1MVJ24IS007', name: 'AMRUTHA R', section: 'ISE 4A' },
  { usn: '1MVJ24IS009', name: 'ANGELIN GIA', section: 'ISE 4A' },
  { usn: '1MVJ24IS010', name: 'ANKITHA H P GOWDA', section: 'ISE 4A' },
  { usn: '1MVJ24IS011', name: 'ANUP AVINASH WALVEKAR', section: 'ISE 4A' },
  { usn: '1MVJ24IS012', name: 'ARCHANA C', section: 'ISE 4A' },
  { usn: '1MVJ24IS014', name: 'ASHIKA VIJAYKUMAR', section: 'ISE 4A' },
  { usn: '1MVJ24IS015', name: 'B KUMARASWAMY', section: 'ISE 4A' },
  { usn: '1MVJ24IS016', name: 'BASWAKIRAN', section: 'ISE 4A' },
  { usn: '1MVJ24IS017', name: 'BUJJIREDDY PAVAN KUMAR', section: 'ISE 4A' },
  { usn: '1MVJ24IS018', name: 'CHOWDA REDDY G M', section: 'ISE 4A' },
  { usn: '1MVJ24IS019', name: 'DHANYAL SAMRUDH SHIVANAND', section: 'ISE 4A' },
  { usn: '1MVJ24IS020', name: 'DHARSHAN J S', section: 'ISE 4A' },
  { usn: '1MVJ24IS021', name: 'DIVYA B J', section: 'ISE 4A' },
  { usn: '1MVJ24IS022', name: 'G N PRAJIN', section: 'ISE 4A' },
  { usn: '1MVJ24IS023', name: 'GAGAN C', section: 'ISE 4A' },
  { usn: '1MVJ24IS024', name: 'GOWTHAMI V', section: 'ISE 4A' },
  { usn: '1MVJ24IS025', name: 'HARSHITH M S', section: 'ISE 4A' },
  { usn: '1MVJ24IS026', name: 'HAVYASHREE G H', section: 'ISE 4A' },
  { usn: '1MVJ24IS027', name: 'HRUTHIK N P', section: 'ISE 4A' },
  { usn: '1MVJ24IS028', name: 'JYOTI KAGDOD', section: 'ISE 4A' },
  { usn: '1MVJ24IS029', name: 'KN NANDITHA', section: 'ISE 4A' },
  { usn: '1MVJ24IS030', name: 'KALATHURU BAVITHA', section: 'ISE 4A' },
  { usn: '1MVJ24IS031', name: 'KARTHIK REDDY S', section: 'ISE 4A' },
  { usn: '1MVJ24IS032', name: 'KASHINATH SURESH KAILAWADGI', section: 'ISE 4A' },
  { usn: '1MVJ24IS033', name: 'KISHORE K H', section: 'ISE 4A' },
  { usn: '1MVJ24IS034', name: 'KONDA DEEKSHA', section: 'ISE 4A' },
  { usn: '1MVJ24IS035', name: 'KOTAPATI THEERTHI VAIBHAV', section: 'ISE 4A' },
  { usn: '1MVJ24IS036', name: 'KRISHNAVENI', section: 'ISE 4A' },
  { usn: '1MVJ24IS037', name: 'KUSHAL U', section: 'ISE 4A' },
  { usn: '1MVJ24IS038', name: 'L V NIVETHA V AN', section: 'ISE 4A' },
  { usn: '1MVJ24IS039', name: 'LAKSHAN S GOWDA', section: 'ISE 4A' },
  { usn: '1MVJ24IS040', name: 'LAXMEETA KRISHNA NAIK', section: 'ISE 4A' },
  { usn: '1MVJ24IS041', name: 'LIKITH M', section: 'ISE 4A' },
  { usn: '1MVJ24IS042', name: 'LIKITH GOWDA T K', section: 'ISE 4A' },
  { usn: '1MVJ24IS043', name: 'LIKITHA L N GOWDA', section: 'ISE 4A' },
  { usn: '1MVJ24IS044', name: 'M ITHRITHIKA', section: 'ISE 4A' },
  { usn: '1MVJ24IS045', name: 'MADHU G', section: 'ISE 4A' },
  { usn: '1MVJ24IS046', name: 'MADHURA N', section: 'ISE 4A' },
  { usn: '1MVJ24IS047', name: 'MAHESH S', section: 'ISE 4A' },
  { usn: '1MVJ24IS049', name: 'MANJUNATH S ARKACHAR', section: 'ISE 4A' },
  { usn: '1MVJ24IS050', name: 'MANOJ KUMAR JENA M', section: 'ISE 4A' },
  { usn: '1MVJ24IS051', name: 'MANSI DEVI', section: 'ISE 4A' },
  { usn: '1MVJ24IS052', name: 'MIDHUN RAJ', section: 'ISE 4A' },
  { usn: '1MVJ24IS054', name: 'MUNNELLA SUSHMITHA REDDY', section: 'ISE 4A' },
  { usn: '1MVJ24IS055', name: 'N CHAITRA', section: 'ISE 4A' },
  { usn: '1MVJ24IS056', name: 'NAGESH A', section: 'ISE 4A' },
  { usn: '1MVJ24IS057', name: 'NANDINI R', section: 'ISE 4A' }
];

const normalize = (v = '') => v.trim().replace(/\s+/g, ' ').toUpperCase();

export const getApprovedStudent = ({ usn, name }) => {
  const nUsn = normalize(usn);
  const nName = normalize(name);
  return approvedStudents.find((s) => s.usn === nUsn && normalize(s.name) === nName) || null;
};

export const makeStudentSignature = (name = '') => `✍ ${name}`;

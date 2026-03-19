import { useState, useMemo } from 'react';
import { Users, Search, Download } from 'lucide-react';

const STUDENTS = [
  { sno: 1,  usn: '1MJ24IS001', name: 'ANWESHA ANURAKTA PANIGRAHY' },
  { sno: 2,  usn: '1MJ24IS002', name: 'A VINAY KUMAR REDDY' },
  { sno: 3,  usn: '1MJ24IS003', name: 'ABHILASH AMARAPPA PATTEPUR' },
  { sno: 4,  usn: '1MJ24IS004', name: 'ABHILASH S' },
  { sno: 5,  usn: '1MJ24IS005', name: 'ADVITH SRUJAN RUMAL' },
  { sno: 6,  usn: '1MJ24IS006', name: 'AKSHAY SINGH S' },
  { sno: 7,  usn: '1MJ24IS007', name: 'AMRUTHA R' },
  { sno: 8,  usn: '1MJ24IS008', name: 'ANGELIN GIA' },
  { sno: 9,  usn: '1MJ24IS009', name: 'ANKITHA H P GOWDA' },
  { sno: 10, usn: '1MJ24IS010', name: 'ANUP AVINASH WALVEKAR' },
  { sno: 11, usn: '1MJ24IS011', name: 'ARCHANA C' },
  { sno: 12, usn: '1MJ24IS012', name: 'ASHIKA VIJAYKUMAR' },
  { sno: 13, usn: '1MJ24IS014', name: 'B KUMARASWAMY' },
  { sno: 14, usn: '1MJ24IS015', name: 'BASWAKIRAN' },
  { sno: 15, usn: '1MJ24IS016', name: 'BUJJIREDDY PAVAN KUMAR' },
  { sno: 16, usn: '1MJ24IS017', name: 'CHOWDA REDDY G M' },
  { sno: 17, usn: '1MJ24IS018', name: 'DHANYAL SAMRUDDH SHIVANAND' },
  { sno: 18, usn: '1MJ24IS019', name: 'DHARSHAN J S' },
  { sno: 19, usn: '1MJ24IS020', name: 'DIVYA B J' },
  { sno: 20, usn: '1MJ24IS021', name: 'G N PRAJIN' },
  { sno: 21, usn: '1MJ24IS022', name: 'GAGAN C' },
  { sno: 22, usn: '1MJ24IS023', name: 'GOWTHAMI V' },
  { sno: 23, usn: '1MJ24IS024', name: 'HARSHITH M S' },
  { sno: 24, usn: '1MJ24IS025', name: 'HAVYASHREE G H' },
  { sno: 25, usn: '1MJ24IS026', name: 'HRUTHIK N P' },
  { sno: 26, usn: '1MJ24IS027', name: 'JYOTI KAGGOD' },
  { sno: 27, usn: '1MJ24IS028', name: 'KN NANDITHA' },
  { sno: 28, usn: '1MJ24IS029', name: 'KALATHURU BAVITHA' },
  { sno: 29, usn: '1MJ24IS030', name: 'KARTHIK REDDY S' },
  { sno: 30, usn: '1MJ24IS031', name: 'KASHINATH SURESH KAILAWADGI' },
  { sno: 31, usn: '1MJ24IS032', name: 'KISHORE K H' },
  { sno: 32, usn: '1MJ24IS033', name: 'KONDA DEEKSHA' },
  { sno: 33, usn: '1MJ24IS034', name: 'KOTAPATI THEERTH VAIBHAV' },
  { sno: 34, usn: '1MJ24IS035', name: 'KRISHNAVENI' },
  { sno: 35, usn: '1MJ24IS036', name: 'KUSHAL U' },
  { sno: 36, usn: '1MJ24IS037', name: 'L V NIVETHAN' },
  { sno: 37, usn: '1MJ24IS038', name: 'LAKSHAN S GOWDA' },
  { sno: 38, usn: '1MJ24IS039', name: 'LAXMEETA KRISHNA NAIK' },
  { sno: 39, usn: '1MJ24IS040', name: 'LIKHITH M' },
  { sno: 40, usn: '1MJ24IS041', name: 'LIKITH GOWDA T K' },
  { sno: 41, usn: '1MJ24IS042', name: 'LIKITHA L N GOWDA' },
  { sno: 42, usn: '1MJ24IS043', name: 'M I HRITHIKA' },
  { sno: 43, usn: '1MJ24IS044', name: 'MADHU G' },
  { sno: 44, usn: '1MJ24IS045', name: 'MADHURA N' },
  { sno: 45, usn: '1MJ24IS046', name: 'MAHESH S' },
  { sno: 46, usn: '1MJ24IS047', name: 'MANJUNATH S ARKACHAR' },
  { sno: 47, usn: '1MJ24IS049', name: 'MANOJ KUMAR JENA M' },
  { sno: 48, usn: '1MJ24IS050', name: 'MANSI DEVI' },
  { sno: 49, usn: '1MJ24IS051', name: 'MIDHUN RAJ' },
  { sno: 50, usn: '1MJ24IS052', name: 'MUNNELLA SUSHMITHA REDDY' },
  { sno: 51, usn: '1MJ24IS054', name: 'N CHAITRA' },
  { sno: 52, usn: '1MJ24IS055', name: 'NAGESH A' },
  { sno: 53, usn: '1MJ24IS056', name: 'NANDINI R' },
];

const COLORS = ['#6366f1','#d946ef','#10b981','#f59e0b','#ef4444','#06b6d4','#8b5cf6','#ec4899'];
const avatarColor = (name) => COLORS[name.charCodeAt(0) % COLORS.length];

export default function StudentsPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() =>
    STUDENTS.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.usn.toLowerCase().includes(query.toLowerCase()) ||
      String(s.sno).includes(query)
    ), [query]
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <Users size={18} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Class Roll List</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>ISE 4A — Semester 4 · {STUDENTS.length} students enrolled</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl px-4 py-3 text-xs" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)', color: 'var(--text-secondary)' }}>
        📋 Official roll list — MVJ College of Engineering, ISE Department — Even Semester 2026
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input placeholder="Search by name, USN or roll number…" value={query}
          onChange={e => setQuery(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {STUDENTS.length} students
          </p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Name</th>
              <th>USN</th>
              <th className="hidden sm:table-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const color = avatarColor(s.name);
              return (
                <tr key={s.usn}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{s.sno}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: color, fontFamily: 'Space Grotesk' }}>
                        {s.name[0]}
                      </div>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 13 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-secondary)' }}>{s.usn}</td>
                  <td className="hidden sm:table-cell">
                    <span className="badge badge-success" style={{ fontSize: 9 }}>Enrolled</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No students match "{query}"</p>
        )}
      </div>
    </div>
  );
}

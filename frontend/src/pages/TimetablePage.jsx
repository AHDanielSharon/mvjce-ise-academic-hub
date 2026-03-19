import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, Clock, MapPin, User, Plus, Trash2, Save, ChevronLeft, ChevronRight, Info } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const canEditRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

// Real MVJ ISE 4A timetable — from official document w.e.f 16/03/2026
const REAL_TIMETABLE = {
  Monday: [
    { startTime: '08:00', endTime: '08:50', subject: 'Analysis & Design of Algorithms', code: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: '049', type: 'theory' },
    { startTime: '08:50', endTime: '09:40', subject: 'Advanced Java', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
    { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '10:10', endTime: '11:00', subject: 'ADA Lab (B2) / Adv. Java Lab (B3)', code: 'MVJ22ISL44/IS42', faculty: 'Prof. Anu K M / Prof. Venkatesh G', roomNumber: 'ADA-227 / JAVA-226', type: 'lab' },
    { startTime: '11:00', endTime: '11:50', subject: 'ADA Lab (B2) / Adv. Java Lab (B3)', code: 'MVJ22ISL44/IS42', faculty: 'Prof. Anu K M / Prof. Venkatesh G', roomNumber: 'ADA-227 / JAVA-226', type: 'lab' },
    { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '12:00', endTime: '12:50', subject: 'Discrete Maths (Remedial)', code: 'MVJ22IS451', faculty: 'Prof. Kocheruvu Madhu', roomNumber: '049', type: 'theory' },
    { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '13:40', endTime: '14:30', subject: 'National Service Scheme (NSS)', code: 'MVJ22NS49', faculty: '', roomNumber: '', type: 'activity' },
  ],
  Tuesday: [
    { startTime: '08:00', endTime: '08:50', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
    { startTime: '08:50', endTime: '09:40', subject: 'Universal Human Values', code: 'MVJ22UHV48', faculty: 'Prof. Nandana R', roomNumber: '049', type: 'theory' },
    { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '10:10', endTime: '11:00', subject: 'Adv. Java Lab (B2) / ADA Lab (B1)', code: 'MVJ22IS42/ISL44', faculty: 'Prof. Venkatesh G / Prof. Anu K M', roomNumber: 'JAVA-226 / ADA-227', type: 'lab' },
    { startTime: '11:00', endTime: '11:50', subject: 'Adv. Java Lab (B2) / ADA Lab (B1)', code: 'MVJ22IS42/ISL44', faculty: 'Prof. Venkatesh G / Prof. Anu K M', roomNumber: 'JAVA-226 / ADA-227', type: 'lab' },
    { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '12:00', endTime: '12:50', subject: 'Discrete Mathematical Structures', code: 'MVJ22IS451', faculty: 'Prof. Kocheruvu Madhu', roomNumber: '049', type: 'theory' },
    { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '13:40', endTime: '14:30', subject: 'AEC Vertical Level II', code: 'MVJ22AXYYL', faculty: 'Prof. Nandana R', roomNumber: '049', type: 'theory' },
  ],
  Wednesday: [
    { startTime: '08:00', endTime: '08:50', subject: 'Analysis & Design of Algorithms', code: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: '049', type: 'theory' },
    { startTime: '08:50', endTime: '09:40', subject: 'Database Management Systems (R)', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
    { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '10:10', endTime: '11:00', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
    { startTime: '11:00', endTime: '11:50', subject: 'Discrete Mathematical Structures', code: 'MVJ22IS451', faculty: 'Prof. Kocheruvu Madhu', roomNumber: '049', type: 'theory' },
    { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '12:00', endTime: '12:50', subject: 'Advanced Java', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
    { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '13:40', endTime: '14:30', subject: 'LIBRARY', code: '', faculty: '', roomNumber: 'Library', type: 'activity' },
    { startTime: '14:30', endTime: '15:20', subject: 'Biology For Engineers', code: 'MVJ22BI47', faculty: 'Prof. Nandana R', roomNumber: '049', type: 'theory' },
  ],
  Thursday: [
    { startTime: '08:00', endTime: '08:50', subject: 'Discrete Mathematical Structures', code: 'MVJ22IS451', faculty: 'Prof. Kocheruvu Madhu', roomNumber: '049', type: 'theory' },
    { startTime: '08:50', endTime: '09:40', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
    { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '10:10', endTime: '11:00', subject: 'DBMS Lab (B1) / Adv. Java Lab (B2)', code: 'MVJ22IS43/IS42', faculty: 'Prof. Anupama P / Prof. Venkatesh G', roomNumber: 'DBMS-228 / JAVA-226', type: 'lab' },
    { startTime: '11:00', endTime: '11:50', subject: 'DBMS Lab (B1) / Adv. Java Lab (B2)', code: 'MVJ22IS43/IS42', faculty: 'Prof. Anupama P / Prof. Venkatesh G', roomNumber: 'DBMS-228 / JAVA-226', type: 'lab' },
    { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '12:00', endTime: '12:50', subject: 'Advanced Java (Remedial)', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
    { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '13:40', endTime: '14:30', subject: 'Advanced Java', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
  ],
  Friday: [
    { startTime: '08:00', endTime: '08:50', subject: 'Advanced Java', code: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: '049', type: 'theory' },
    { startTime: '08:50', endTime: '09:40', subject: 'Analysis & Design of Algorithms (R)', code: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: '049', type: 'theory' },
    { startTime: '09:40', endTime: '10:10', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '10:10', endTime: '11:00', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
    { startTime: '11:00', endTime: '11:50', subject: 'Database Management Systems', code: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'theory' },
    { startTime: '11:50', endTime: '12:00', subject: 'BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '12:00', endTime: '12:50', subject: 'COUNSELLING', code: '', faculty: 'Prof. Anupama P', roomNumber: '049', type: 'activity' },
    { startTime: '12:50', endTime: '13:40', subject: 'LUNCH BREAK', code: '', faculty: '', roomNumber: '', type: 'break' },
    { startTime: '13:40', endTime: '14:30', subject: 'Biology For Engineers', code: 'MVJ22BI47', faculty: 'Prof. Nandana R', roomNumber: '049', type: 'theory' },
    { startTime: '14:30', endTime: '15:20', subject: 'Analysis & Design of Algorithms', code: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: '049', type: 'theory' },
  ],
};

const TYPE_COLORS = {
  theory: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#6366f1', label: 'Theory' },
  lab:    { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#10b981', label: 'Lab' },
  activity:{ bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.25)', text: '#d97706', label: 'Activity' },
  break:  { bg: 'rgba(148,163,184,0.08)', border: 'transparent', text: '#94a3b8', label: 'Break' },
};

function getCurrentDay() {
  const d = new Date().getDay();
  return days[d - 1] || null; // null on weekend
}

function getCurrentPeriod(entries) {
  const now = new Date();
  const cur = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  return entries.find(e => e.startTime <= cur && cur < e.endTime) || null;
}

function PeriodCard({ entry, isCurrent, delay = 0 }) {
  const colors = TYPE_COLORS[entry.type] || TYPE_COLORS.theory;
  if (entry.type === 'break') return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      {entry.subject}
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
    </div>
  );

  return (
    <div className="rounded-xl p-3 transition-all animate-slide-up" style={{ animationDelay: `${delay}ms`,
      background: isCurrent ? 'rgba(99,102,241,0.12)' : colors.bg,
      border: `1.5px solid ${isCurrent ? 'rgba(99,102,241,0.45)' : colors.border}`,
      boxShadow: isCurrent ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
    }}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-snug" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>
            {entry.subject}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Clock size={10} /> {entry.startTime} – {entry.endTime}</span>
            {entry.roomNumber && <span className="flex items-center gap-1"><MapPin size={10} /> {entry.roomNumber}</span>}
            {entry.faculty && <span className="flex items-center gap-1"><User size={10} /> {entry.faculty}</span>}
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-1">
          {isCurrent && <span className="badge badge-brand" style={{ fontSize: 9 }}>● Live</span>}
          <span className="badge" style={{ background: colors.bg, color: colors.text, fontSize: 9 }}>{colors.label}</span>
          {entry.code && <span className="badge badge-muted" style={{ fontSize: 9, fontFamily: 'JetBrains Mono' }}>{entry.code.split('/')[0]}</span>}
        </div>
      </div>
    </div>
  );
}

export default function TimetablePage() {
  const { user } = useAuth();
  const canEdit = canEditRoles.includes(user?.role);
  const todayName = getCurrentDay();
  const [activeDay, setActiveDay] = useState(todayName || 'Monday');

  const dayEntries = REAL_TIMETABLE[activeDay] || [];
  const currentPeriod = todayName === activeDay ? getCurrentPeriod(dayEntries) : null;

  const goDay = (dir) => {
    const i = days.indexOf(activeDay);
    setActiveDay(days[(i + dir + days.length) % days.length]);
  };

  const todayClasses = todayName ? (REAL_TIMETABLE[todayName] || []).filter(e => e.type !== 'break') : [];
  const nextClass = todayName ? (() => {
    const now = new Date();
    const cur = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    return (REAL_TIMETABLE[todayName] || []).find(e => e.type !== 'break' && e.startTime > cur) || null;
  })() : null;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <CalendarDays size={18} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Class Timetable</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              ISE 4A · Room 049 · {currentPeriod
                ? `📍 Now: ${currentPeriod.subject}`
                : nextClass ? `⏭ Next: ${nextClass.subject} at ${nextClass.startTime}` : 'No class right now'}
            </p>
          </div>
        </div>
      </div>

      {/* Official info banner */}
      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="flex flex-wrap gap-4 text-xs">
          <div><span style={{ color: 'var(--text-muted)' }}>Department:</span> <strong style={{ color: 'var(--text-primary)' }}>ISE — MVJ College of Engineering</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Semester:</span> <strong style={{ color: 'var(--text-primary)' }}>4 (Even) — 2026</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Class Teacher:</span> <strong style={{ color: '#6366f1' }}>Prof. Anupama P</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>w.e.f:</span> <strong style={{ color: 'var(--text-primary)' }}>16/03/2026</strong></div>
        </div>
      </div>

      {/* Day selector */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button onClick={() => goDay(-1)} className="btn btn-ghost btn-icon"><ChevronLeft size={16} /></button>
          <div className="flex flex-wrap justify-center gap-1">
            {days.map(d => (
              <button key={d} onClick={() => setActiveDay(d)}
                className="rounded-xl px-3 py-2 text-xs font-medium transition-all whitespace-nowrap"
                style={{
                  fontFamily: 'Space Grotesk',
                  background: activeDay === d ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : d === todayName ? 'rgba(99,102,241,0.12)' : 'var(--surface-muted)',
                  color: activeDay === d ? 'white' : d === todayName ? '#6366f1' : 'var(--text-muted)',
                }}>
                {d.slice(0,3)}{d === todayName && ' •'}
              </button>
            ))}
          </div>
          <button onClick={() => goDay(1)} className="btn btn-ghost btn-icon"><ChevronRight size={16} /></button>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          {Object.entries(TYPE_COLORS).filter(([k]) => k !== 'break').map(([key, c]) => (
            <span key={key} className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg" style={{ background: c.bg, color: c.text }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.text }} />
              {c.label}
            </span>
          ))}
        </div>

        {/* Periods */}
        <div className="space-y-2">
          {dayEntries.map((entry, i) => (
            <PeriodCard key={`${entry.startTime}-${i}`} entry={entry}
              isCurrent={currentPeriod?.startTime === entry.startTime && activeDay === todayName}
              delay={i * 30} />
          ))}
          {dayEntries.length === 0 && (
            <p className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No timetable data for {activeDay}</p>
          )}
        </div>
      </div>

      {/* Lab rooms guide */}
      <div className="card">
        <h2 className="mb-3 font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>Lab Rooms Guide</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { label: 'ADA Lab', room: 'ADA-227', sub: 'Analysis & Design Lab', color: '#6366f1' },
            { label: 'Java Lab', room: 'JAVA-226', sub: 'Advanced Java Lab', color: '#10b981' },
            { label: 'DBMS Lab', room: 'DBMS-228', sub: 'Database Management Lab', color: '#f59e0b' },
          ].map(l => (
            <div key={l.room} className="rounded-xl p-3 text-center" style={{ background: l.color + '10', border: `1px solid ${l.color}25` }}>
              <p className="font-bold" style={{ fontFamily: 'Space Grotesk', color: l.color, fontSize: 15 }}>{l.room}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{l.label}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{l.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

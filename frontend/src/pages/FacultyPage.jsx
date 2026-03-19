import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, BookOpen, Star, Award, Phone } from 'lucide-react';

// Real ISE 4A faculty — from official timetable
const LOCAL_FACULTY = [
  {
    facultyName: 'Prof. Anupama P',
    designation: 'Associate Professor & Class Teacher',
    department: 'ISE',
    section: 'ISE 4A',
    subjects: ['Database Management Systems'],
    subCodes: ['MVJ22IS43'],
    email: 'anupama.p@mvjce.edu.in',
    isClassCoordinator: true,
    cabin: 'ISE Dept, Block C',
    initials: 'AP',
    color: '#6366f1',
  },
  {
    facultyName: 'Prof. Anu K M',
    designation: 'Assistant Professor',
    department: 'ISE',
    section: 'ISE 4A',
    subjects: ['Analysis & Design of Algorithms', 'ADA Lab'],
    subCodes: ['MVJ22IS41', 'MVJ22ISL44'],
    email: 'anu.km@mvjce.edu.in',
    isClassCoordinator: false,
    cabin: 'ISE Dept, Block C',
    initials: 'AK',
    color: '#10b981',
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
    cabin: 'ISE Dept, Block C',
    initials: 'VG',
    color: '#d946ef',
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
    cabin: 'ISE Dept, Block C',
    initials: 'NR',
    color: '#f59e0b',
  },
  {
    facultyName: 'Prof. Kocheruvu Madhu',
    designation: 'Assistant Professor (Mathematics Dept)',
    department: 'Mathematics',
    section: 'ISE 4A',
    subjects: ['Discrete Mathematical Structures'],
    subCodes: ['MVJ22IS451'],
    email: 'kocheruvu.madhu@mvjce.edu.in',
    isClassCoordinator: false,
    cabin: 'Maths Department',
    initials: 'KM',
    color: '#ef4444',
  },
  {
    facultyName: 'Dr. Raja Meyyan',
    designation: 'Head of Department — ISE',
    department: 'ISE',
    section: 'ISE 4A',
    subjects: [],
    subCodes: [],
    email: 'hod.ise@mvjce.edu.in',
    isClassCoordinator: false,
    cabin: 'HOD Chamber, Block C',
    initials: 'RM',
    color: '#7c3aed',
    isHOD: true,
  },
];

function FacultyCard({ item, index }) {
  return (
    <div className="card card-hover animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}bb)`, fontFamily: 'Space Grotesk' }}>
          {item.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)', fontSize: 15 }}>
                {item.facultyName}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.designation}</p>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-1">
              {item.isHOD && <span className="badge" style={{ background: 'rgba(124,58,237,0.15)', color: '#7c3aed' }}><Award size={9} /> HOD</span>}
              {item.isClassCoordinator && <span className="badge badge-brand"><Star size={9} /> Class Teacher</span>}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="badge badge-muted" style={{ fontSize: 10 }}>{item.department} Dept</span>
          </div>

          {item.subjects.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                <BookOpen size={10} /> Subjects Handling
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.subjects.map((s, i) => (
                  <span key={s} className="rounded-lg px-2 py-1 text-xs font-medium"
                    style={{ background: item.color + '18', color: item.color }}>
                    {s}
                    {item.subCodes[i] && <span style={{ opacity: 0.6, marginLeft: 4, fontSize: 10 }}>({item.subCodes[i]})</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            {item.email && (
              <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:underline" style={{ color: item.color }}>
                <Mail size={10} /> {item.email}
              </a>
            )}
            {item.cabin && (
              <span className="flex items-center gap-1">📍 {item.cabin}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FacultyPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
          <GraduationCap size={18} style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Faculty Directory</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>ISE 4A — Sem 4 (Even 2026) · {LOCAL_FACULTY.length} faculty members · Room 049</p>
        </div>
      </div>

      {/* College info banner */}
      <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(217,70,239,0.07))', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="grid gap-2 sm:grid-cols-3 text-xs">
          <div><span style={{ color: 'var(--text-muted)' }}>Institution:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>MVJ College of Engineering</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Classroom:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Room 049</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Labs:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>JAVA-226 · DBMS-228 · ADA-227</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Class Teacher:</span> <span style={{ color: '#6366f1', fontWeight: 600 }}>Prof. Anupama P</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>HOD:</span> <span style={{ color: '#7c3aed', fontWeight: 600 }}>Dr. Raja Meyyan</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>w.e.f:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>16/03/2026</span></div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {LOCAL_FACULTY.map((item, i) => <FacultyCard key={item.facultyName} item={item} index={i} />)}
      </div>
    </div>
  );
}

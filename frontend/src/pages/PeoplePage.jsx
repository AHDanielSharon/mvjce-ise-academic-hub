import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const formatRole = (role = '') => role.replaceAll('_', ' ');
const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : 'Not available');

function UserList({ title, users }) {
  return (
    <section className="card">
      <h2 className="mb-2 text-lg font-semibold">{title} ({users.length})</h2>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u._id} className="rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700">
            <p className="font-semibold">{u.name}</p>
            <p>{u.email}</p>
            <p className="text-xs text-slate-500">{formatRole(u.role)} • {u.section} {u.designation ? `• ${u.designation}` : ''}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AuditBadge({ tone, children }) {
  const tones = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
  };

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function OfficialAccountAudit({ audit }) {
  const totals = audit?.totals || { approved: 0, provisioned: 0, missing: 0, mismatched: 0 };

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Official staff account audit</h2>
        <p className="text-sm text-slate-500">Management can verify which approved MVJCE staff accounts are provisioned and whether any registered role no longer matches the official registry.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs uppercase tracking-wide text-slate-500">Approved accounts</p>
          <p className="text-2xl font-semibold">{totals.approved}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 p-3 dark:border-emerald-800">
          <p className="text-xs uppercase tracking-wide text-slate-500">Provisioned</p>
          <p className="text-2xl font-semibold text-emerald-600">{totals.provisioned}</p>
        </div>
        <div className="rounded-xl border border-amber-200 p-3 dark:border-amber-800">
          <p className="text-xs uppercase tracking-wide text-slate-500">Missing</p>
          <p className="text-2xl font-semibold text-amber-600">{totals.missing}</p>
        </div>
        <div className="rounded-xl border border-rose-200 p-3 dark:border-rose-800">
          <p className="text-xs uppercase tracking-wide text-slate-500">Role mismatches</p>
          <p className="text-2xl font-semibold text-rose-600">{totals.mismatched}</p>
        </div>
      </div>

      <div className="space-y-3">
        {audit.accounts.map((account) => {
          const statusTone = account.provisioned ? 'success' : account.roleMismatch ? 'danger' : 'warning';
          const statusLabel = account.provisioned
            ? 'Provisioned'
            : account.roleMismatch
              ? 'Role mismatch'
              : 'Missing';

          return (
            <div key={account.email} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold">{account.expectedName}</p>
                  <p className="text-sm text-slate-500">{account.email}</p>
                  <p className="text-xs text-slate-500">Expected role: {formatRole(account.expectedRole)} • {account.expectedSection} • {account.expectedDesignation}</p>
                </div>
                <AuditBadge tone={statusTone}>{statusLabel}</AuditBadge>
              </div>

              <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Registry expectation</p>
                  <p>{account.expectedName}</p>
                  <p>{formatRole(account.expectedRole)} • {account.expectedSection}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Provisioned account</p>
                  {account.matchedUser ? (
                    <>
                      <p>{account.matchedUser.name}</p>
                      <p>{formatRole(account.matchedUser.role)} • {account.matchedUser.section}</p>
                      <p className="text-xs text-slate-500">Created: {formatDateTime(account.matchedUser.createdAt)}</p>
                    </>
                  ) : (
                    <p className="text-slate-500">No registered account found for this official email.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function PeoplePage() {
  const [data, setData] = useState({ grouped: { students: [], teachers: [], management: [] } });

  useEffect(() => {
    api.get('/users').then((res) => setData(res.data));
  }, []);

  const countsSummary = useMemo(() => {
    const grouped = data.grouped || { students: [], teachers: [], management: [] };
    return [
      { label: 'Students', value: grouped.students.length },
      { label: 'Teachers & Lab', value: grouped.teachers.length },
      { label: 'Management', value: grouped.management.length }
    ];
  }, [data.grouped]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">People & Roles Directory</h1>
        <p className="text-sm text-slate-500">Use this management-only view to verify current role assignments and audit provisioned official staff accounts.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        {countsSummary.map((item) => (
          <div key={item.label} className="card">
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="text-2xl font-semibold">{item.value}</p>
          </div>
        ))}
      </section>

      {data.officialAccountAudit && <OfficialAccountAudit audit={data.officialAccountAudit} />}

      <div className="grid gap-4 md:grid-cols-3">
        <UserList title="Students" users={data.grouped.students} />
        <UserList title="Teachers & Lab Instructors" users={data.grouped.teachers} />
        <UserList title="Management" users={data.grouped.management} />
      </div>
    </div>
  );
}

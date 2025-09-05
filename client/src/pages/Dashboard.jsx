import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useUser } from '../context/useUser';
import {
  SiteHeader,
  SiteFooter,
  CREATOR_NAME,
  CONTACT_EMAIL,
  SOCIAL_LINKS,
} from "../components/SiteChrome";

/**
 * Mobile‑first, minimalist dashboard
 * - Keeps color theme used in NewApplication: #1E2A5A (ink), #0052CC (primary), #EAF3FF (tint)
 * - Summaries for multiple applications
 * - Search, filter by status, and sort
 * - Card list on mobile, table on desktop
 * - Prominent "Start new application" CTA; Logout moves to profile menu (top‑right)
 */

const Dashboard = () => {
  const { user, setUser } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // UI state
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState('newest'); // 'newest' | 'oldest' | 'status'

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.log(err);
        navigate('/');
      }
    };
    fetchProfile();
  }, [navigate, setUser]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleSignOut = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      navigate('/');
    }
  };

  const handleStartNewApplication = async () => {
    try {
      const res = await api.post('/applications/draft'); // expects backend to return { id }
      const applicationId = res?.data?.id;
      if (!applicationId) throw new Error('Missing new draft id');
      navigate(`/new-application/${applicationId}`);
    } catch (err) {
      console.error('Failed to create new application:', err);
      alert('Could not start a new application. Please try again.');
    }
  };

  const handleViewEditApplication = async (id) => {
    try {
      const res = await api.get(`/applications/${id}`);
      navigate(`/new-application/${id}`, { state: { application: res.data } });
    } catch (err) {
      alert('Could not fetch application.');
      console.error(err);
    }
  };

  // Unique statuses present + All
  const statusOptions = useMemo(() => {
    const set = new Set(applications.map(a => (a.status || 'unknown').toLowerCase()));
    const humanize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const opts = ['All', ...Array.from(set).map(humanize)];
    return opts;
  }, [applications]);

  // Stats
  const stats = useMemo(() => {
    const total = applications.length;
    const byStatus = applications.reduce((acc, a) => {
      const k = (a.status || 'unknown').toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    return { total, byStatus };
  }, [applications]);

  // Filtering + sorting
  const visibleApps = useMemo(() => {
    let list = [...applications];

    if (statusFilter !== 'All') {
      const needle = statusFilter.toLowerCase();
      list = list.filter(a => (a.status || '').toLowerCase() === needle);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(a =>
        String(a.claimNumber || a.id || '')?.toLowerCase().includes(q) ||
        (a.customerName || a.customerFirstName || a.customerLastName || '')
          .toString()
          .toLowerCase()
          .includes(q) ||
        (a.status || '').toLowerCase().includes(q)
      );
    }

    switch (sortKey) {
      case 'oldest':
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'status':
        list.sort((a, b) => String(a.status || '').localeCompare(String(b.status || '')));
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [applications, query, statusFilter, sortKey]);

  const StatusPill = ({ value }) => {
    const v = String(value || 'Unknown');
    const key = v.toLowerCase();
    // Color mapping aligned with app theme
    const styles = {
      submitted: 'bg-[#EAF3FF] text-[#1E2A5A]',
      draft: 'bg-gray-100 text-gray-700',
      'in review': 'bg-amber-100 text-amber-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-700',
      unknown: 'bg-gray-100 text-gray-600',
    };
    const cls = styles[key] || styles.unknown;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
        {v}
      </span>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-[#EAF3FF] flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E2A5A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18"/><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M7 7v-.5A2.5 2.5 0 0 1 9.5 4h5A2.5 2.5 0 0 1 17 6.5V7"/></svg>
      </div>
      <h3 className="text-lg font-semibold text-[#1E2A5A]">No applications yet</h3>
      <p className="text-gray-500 mt-1">Start your first rebate claim in a few taps.</p>
      <button onClick={handleStartNewApplication} className="btn-primary mt-5">Start a new application</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
  <SiteHeader user={user} onSignOut={handleSignOut} onStartNewApplication={handleStartNewApplication} showNewButton={true} />
      <main className="mx-auto max-w-6xl px-4 pb-28 sm:pb-12">
        {/* Greeting */}
        <section className="pt-5">
          <h1 className="text-xl font-semibold text-[#1E2A5A]">Welcome{user?.email ? `, ${user.email}` : ''}</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your rebate applications.</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="rounded-xl bg-white border p-4">
            <p className="text-xs text-gray-500">Total</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E2A5A]">{stats.total}</p>
          </div>
          {Object.entries(stats.byStatus).slice(0, 3).map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white border p-4">
              <p className="text-xs text-gray-500">{k.charAt(0).toUpperCase() + k.slice(1)}</p>
              <p className="mt-1 text-2xl font-semibold text-[#1E2A5A]">{v}</p>
            </div>
          ))}
        </section>

        {/* Controls */}
        <section className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by claim #, name, or status"
                className="input pl-9"
              />
              <svg className="absolute left-3 top-2.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <select
              className="input max-w-[140px]"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="status">Status A–Z</option>
            </select>
          </div>
        </section>

        {/* Status filter chips (scrollable on mobile) */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar py-1">
          {statusOptions.map((opt) => {
            const active = statusFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border transition ${
                  active
                    ? 'border-[#0052CC] text-[#1E2A5A] bg-[#EAF3FF]'
                    : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* List */}
        <section className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-white border overflow-hidden">
                  <div className="animate-pulse h-full p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="mt-3 h-3 bg-gray-200 rounded w-2/3" />
                    <div className="mt-5 h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleApps.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Cards on mobile */}
              <div className="grid grid-cols-1 gap-3 sm:hidden">
                {visibleApps.map((app) => (
                  <div key={app.id} className="rounded-xl bg-white border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Claim #</p>
                        <p className="font-semibold text-[#1E2A5A]">{app.claimNumber || app.id}</p>
                      </div>
                      <StatusPill value={app.status} />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-3">
                      <span>Created {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</span>
                      {app.updatedAt && <span>• Updated {new Date(app.updatedAt).toLocaleDateString()}</span>}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {String(app.status).toLowerCase() !== 'submitted' ? (
                        <button onClick={() => handleViewEditApplication(app.id)} className="btn-primary w-full">Resume</button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Table on >= sm */}
              <div className="hidden sm:block overflow-hidden rounded-xl border bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-[#1E2A5A]">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Claim #</th>
                      <th className="text-left font-medium px-4 py-3">Status</th>
                      <th className="text-left font-medium px-4 py-3">Created</th>
                      <th className="text-left font-medium px-4 py-3">Updated</th>
                      <th className="text-left font-medium px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleApps.map((app, idx) => (
                      <tr key={app.id} className={idx % 2 ? 'bg-white' : 'bg-white'}>
                        <td className="px-4 py-3 font-medium text-[#1E2A5A]">{app.claimNumber || app.id}</td>
                        <td className="px-4 py-3"><StatusPill value={app.status} /></td>
                        <td className="px-4 py-3">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3">{app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3">
                          {String(app.status).toLowerCase() !== 'submitted' ? (
                            <button onClick={() => handleViewEditApplication(app.id)} className="btn-primary">Resume</button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>

      <SiteFooter creatorName={CREATOR_NAME} contactEmail={CONTACT_EMAIL} socialLinks={SOCIAL_LINKS} />

      {/* Sticky mobile CTA bar */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-10 bg-white border-t p-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="flex items-center gap-2">
          <button onClick={handleStartNewApplication} className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Start new application
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

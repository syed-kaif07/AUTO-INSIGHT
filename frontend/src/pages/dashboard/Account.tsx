import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  User, Mail, Shield, Bell, Palette, Building2, Users, CreditCard, ScrollText,
  Upload, Trash2, Plus, Download, Crown, ChevronDown, Search, FileText
} from 'lucide-react';
import MagicCard from '@/components/magicui/MagicCard';
import BlurFade from '@/components/magicui/BlurFade';
import ShimmerButton from '@/components/magicui/ShimmerButton';
import BorderBeam from '@/components/magicui/BorderBeam';

const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Other'];
const teamSizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

const teamMembers = [
  { name: 'Syed Kaifuddin', email: 'syed@autoinsight.ai', role: 'Admin', initials: 'SK' },
  { name: 'Sarah Chen', email: 'sarah@autoinsight.ai', role: 'Analyst', initials: 'SC' },
  { name: 'Marcus Williams', email: 'marcus@autoinsight.ai', role: 'Analyst', initials: 'MW' },
  { name: 'Priya Sharma', email: 'priya@autoinsight.ai', role: 'Viewer', initials: 'PS' },
];

const auditLogs = [
  { user: 'Syed Kaifuddin', action: 'Updated organization settings', time: '2 hours ago' },
  { user: 'Sarah Chen', action: 'Uploaded dataset sales_2024.csv', time: '5 hours ago' },
  { user: 'Marcus Williams', action: 'Ran analysis pipeline', time: '1 day ago' },
  { user: 'Syed Kaifuddin', action: 'Invited priya@autoinsight.ai', time: '2 days ago' },
  { user: 'Priya Sharma', action: 'Viewed predictions report', time: '2 days ago' },
  { user: 'Sarah Chen', action: 'Trained new ML model', time: '3 days ago' },
  { user: 'Syed Kaifuddin', action: 'Updated billing plan to Pro', time: '1 week ago' },
];

const roleBadgeColor: Record<string, string> = {
  Admin: 'bg-primary/20 text-primary',
  Analyst: 'bg-success/20 text-success',
  Viewer: 'bg-yellow-400/20 text-yellow-400',
};

const Account = () => {
  const { user } = useAuth();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [auditFilter, setAuditFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    if (auditFilter !== 'all' && log.user !== auditFilter) return false;
    if (actionFilter !== 'all') {
      const actionMap: Record<string, string[]> = {
        uploads: ['Uploaded'],
        settings: ['Updated'],
        analysis: ['Ran', 'Trained'],
        views: ['Viewed'],
        invites: ['Invited'],
      };
      if (!actionMap[actionFilter]?.some(a => log.action.startsWith(a))) return false;
    }
    return true;
  });

  const uniqueUsers = [...new Set(auditLogs.map(l => l.user))];

  return (
    <div className="space-y-8 max-w-3xl">
      <BlurFade>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile, team, and preferences</p>
        </div>
      </BlurFade>

      {/* Profile Card */}
      <BlurFade delay={0.1}>
        <MagicCard className="p-6 space-y-6">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Profile
          </h2>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-foreground font-medium text-lg">{user?.name || 'User'}</p>
              <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-secondary-foreground mb-1.5 block">Full Name</label>
              <input defaultValue={user?.name || ''} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-secondary-foreground mb-1.5 block">Email</label>
              <input defaultValue={user?.email || ''} className="input-field" />
            </div>
          </div>
          <ShimmerButton>Save Changes</ShimmerButton>
        </MagicCard>
      </BlurFade>

      {/* Organization */}
      <BlurFade delay={0.15}>
        <MagicCard className="p-6 space-y-6">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Organization
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-secondary-foreground mb-1.5 block">Organization Name</label>
              <input defaultValue="AutoInsight Inc." className="input-field" />
            </div>
            <div>
              <label className="text-sm text-secondary-foreground mb-1.5 block">Organization Logo</label>
              <label className="input-field flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload logo</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <div>
              <label className="text-sm text-secondary-foreground mb-1.5 block">Industry</label>
              <div className="relative">
                <select className="input-field appearance-none pr-10">
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm text-secondary-foreground mb-1.5 block">Team Size</label>
              <div className="relative">
                <select className="input-field appearance-none pr-10">
                  {teamSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
          <ShimmerButton>Save Organization</ShimmerButton>
        </MagicCard>
      </BlurFade>

      {/* Team Members */}
      <BlurFade delay={0.2}>
        <MagicCard className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Team Members
            </h2>
            <button
              onClick={() => setShowInvite(!showInvite)}
              className="secondary-btn text-sm flex items-center gap-1.5 px-4 py-2"
            >
              <Plus className="w-4 h-4" /> Invite Member
            </button>
          </div>

          {showInvite && (
            <div className="flex gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="input-field flex-1"
              />
              <ShimmerButton className="text-sm px-5" onClick={() => { setInviteEmail(''); setShowInvite(false); }}>
                Send Invite
              </ShimmerButton>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 text-muted-foreground font-medium">Member</th>
                  <th className="text-left py-3 text-muted-foreground font-medium hidden sm:table-cell">Email</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Role</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map(m => (
                  <tr key={m.email} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {m.initials}
                        </div>
                        <span className="font-medium text-foreground">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground hidden sm:table-cell">{m.email}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeColor[m.role]}`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {m.role !== 'Admin' && (
                        <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MagicCard>
      </BlurFade>

      {/* Billing */}
      <BlurFade delay={0.25}>
        <MagicCard className="p-6 space-y-6">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Billing
          </h2>

          {/* Current Plan */}
          <div className="relative rounded-2xl p-6 bg-white/[0.04] border border-primary/20 overflow-hidden">
            <BorderBeam duration={10} />
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-primary" />
                  <span className="font-heading font-bold text-lg text-foreground">Pro Plan</span>
                </div>
                <p className="text-2xl font-heading font-extrabold text-foreground">
                  $49<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
              </div>
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">Active</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-muted-foreground mb-1">Next Billing Date</p>
              <p className="text-sm font-medium text-foreground">April 8, 2026</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                •••• •••• •••• 4242
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <ShimmerButton className="text-sm">Upgrade to Enterprise</ShimmerButton>
            <button className="secondary-btn text-sm flex items-center gap-1.5 px-5 py-2.5">
              <Download className="w-4 h-4" /> Download Invoice
            </button>
          </div>
        </MagicCard>
      </BlurFade>

      {/* Security */}
      <BlurFade delay={0.3}>
        <MagicCard className="p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Security
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-secondary-foreground mb-1.5 block">Current Password</label>
              <input type="password" placeholder="••••••••" className="input-field" />
            </div>
            <div>
              <label className="text-sm text-secondary-foreground mb-1.5 block">New Password</label>
              <input type="password" placeholder="••••••••" className="input-field" />
            </div>
          </div>
          <button className="secondary-btn text-sm">Update Password</button>
        </MagicCard>
      </BlurFade>

      {/* Audit Log */}
      <BlurFade delay={0.35}>
        <MagicCard className="p-6 space-y-5">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-primary" /> Audit Log
          </h2>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={auditFilter}
                onChange={e => setAuditFilter(e.target.value)}
                className="input-field appearance-none pr-10 text-sm py-2"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={actionFilter}
                onChange={e => setActionFilter(e.target.value)}
                className="input-field appearance-none pr-10 text-sm py-2"
              >
                <option value="all">All Actions</option>
                <option value="uploads">Uploads</option>
                <option value="settings">Settings</option>
                <option value="analysis">Analysis</option>
                <option value="views">Views</option>
                <option value="invites">Invites</option>
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 text-muted-foreground font-medium">User</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Action</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground text-sm">No matching activity found</td>
                  </tr>
                ) : (
                  filteredLogs.map((log, i) => (
                    <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                            {log.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-foreground whitespace-nowrap">{log.user}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{log.action}</td>
                      <td className="py-3 text-muted-foreground text-right whitespace-nowrap">{log.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </MagicCard>
      </BlurFade>

      {/* Preferences */}
      <BlurFade delay={0.4}>
        <MagicCard className="p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" /> Preferences
          </h2>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Email Notifications</span>
            </div>
            <button className="w-10 h-6 rounded-full bg-primary/30 relative">
              <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-primary transition-transform" />
            </button>
          </div>
        </MagicCard>
      </BlurFade>
    </div>
  );
};

export default Account;
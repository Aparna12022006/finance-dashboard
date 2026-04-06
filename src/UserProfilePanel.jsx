import React, { useRef, useEffect } from 'react'
import { useFinance } from './FinanceContext'
import { User, Shield, Eye, TrendingUp, CreditCard, LogOut, Edit2, X } from 'lucide-react'

const profiles = {
    admin: {
        name: 'Alex Johnson',
        email: 'alex.johnson@finflow.app',
        role: 'Admin',
        avatar: 'AJ',
        joined: 'Jan 2024',
        roleColor: '#10b981',
        roleIcon: Shield,
        permissions: ['View Dashboard', 'View Transactions', 'Add Transactions', 'Edit Transactions', 'Delete Transactions', 'Export Data', 'Manage Settings'],
    },
    viewer: {
        name: 'Sam Viewer',
        email: 'sam.viewer@finflow.app',
        role: 'Viewer',
        avatar: 'SV',
        joined: 'Mar 2024',
        roleColor: '#8888aa',
        roleIcon: Eye,
        permissions: ['View Dashboard', 'View Transactions'],
    },
}

export default function UserProfilePanel({ onClose }) {
    const { role, setRole, stats, darkMode } = useFinance()
    const panelRef = useRef(null)
    const profile = profiles[role]
    const RoleIcon = profile.roleIcon

    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose()
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [onClose])

    return (
        <div
            ref={panelRef}
            className="absolute right-0 bottom-full mb-2 w-72 rounded-2xl border shadow-2xl z-50 animate-fade-up overflow-hidden"
            style={{
                background: 'var(--c-card)',
                borderColor: 'var(--c-border)',
                animationFillMode: 'forwards',
            }}
        >
            {/* Avatar header */}
            <div
                className="px-4 pt-5 pb-4 text-center relative"
                style={{
                    background: 'linear-gradient(135deg, rgba(124,106,247,0.15) 0%, rgba(16,185,129,0.1) 100%)',
                    borderBottom: `1px solid var(--c-border)`,
                }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ color: 'var(--c-muted)' }}
                >
                    <X size={13} />
                </button>
                <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #7c6af7, #10b981)' }}
                >
                    {profile.avatar}
                </div>
                <h3 className="font-display font-semibold text-base" style={{ color: 'var(--c-text)' }}>
                    {profile.name}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>{profile.email}</p>
                <div
                    className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: `${profile.roleColor}18`, color: profile.roleColor }}
                >
                    <RoleIcon size={11} />
                    {profile.role}
                </div>
            </div>

            {/* Stats mini row */}
            <div
                className="grid grid-cols-3 divide-x"
                style={{ borderBottom: `1px solid var(--c-border)`, divideColor: 'var(--c-border)' }}
            >
                {[
                    { label: 'Income', value: `₹${(stats.income / 1000).toFixed(0)}k`, icon: TrendingUp, color: '#10b981' },
                    { label: 'Expenses', value: `₹${(stats.expenses / 1000).toFixed(0)}k`, icon: CreditCard, color: '#f43f5e' },
                    { label: 'Txns', value: stats.count, icon: User, color: '#7c6af7' },
                ].map(s => (
                    <div key={s.label} className="py-3 text-center" style={{ borderColor: 'var(--c-border)' }}>
                        <p className="text-xs font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--c-dim)' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Permissions */}
            <div className="px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--c-dim)' }}>
                    Permissions
                </p>
                <div className="space-y-1">
                    {['View Dashboard', 'View Transactions', 'Add Transactions', 'Edit Transactions', 'Delete Transactions'].map(p => {
                        const allowed = profile.permissions.includes(p)
                        return (
                            <div key={p} className="flex items-center gap-2">
                                <span
                                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold"
                                    style={{
                                        background: allowed ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.1)',
                                        color: allowed ? '#10b981' : '#f43f5e',
                                    }}
                                >
                                    {allowed ? '✓' : '✗'}
                                </span>
                                <span className="text-[11px]" style={{ color: allowed ? 'var(--c-muted)' : 'var(--c-dim)' }}>
                                    {p}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Switch role */}
            <div className="px-4 pb-4 space-y-2 border-t pt-3" style={{ borderColor: 'var(--c-border)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--c-dim)' }}>
                    Switch Role
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {['viewer', 'admin'].map(r => (
                        <button
                            key={r}
                            onClick={() => { setRole(r); onClose() }}
                            className="py-2 rounded-xl text-xs font-semibold capitalize transition-all border"
                            style={role === r ? {
                                background: 'rgba(124,106,247,0.12)',
                                color: 'var(--c-accent)',
                                borderColor: 'rgba(124,106,247,0.3)',
                            } : {
                                background: 'var(--c-card)',
                                color: 'var(--c-muted)',
                                borderColor: 'var(--c-border)',
                            }}
                        >
                            {r === 'admin' ? '🛡 Admin' : '👁 Viewer'}
                        </button>
                    ))}
                </div>

                <button
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-colors mt-1"
                    style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.08)' }}
                    onClick={onClose}
                >
                    <LogOut size={13} />
                    Sign Out
                </button>
            </div>
        </div>
    )
}

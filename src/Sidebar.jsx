import React, { useState } from 'react'
import { useFinance } from './FinanceContext'
import {
    LayoutDashboard, ArrowLeftRight, Lightbulb,
    TrendingUp, Settings, ChevronRight, Shield, Eye
} from 'lucide-react'
import SettingsModal from './SettingsModal'
import UserProfilePanel from './UserProfilePanel'

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
]

export default function Sidebar() {
    const { activeView, setActiveView, stats, role } = useFinance()
    const [showSettings, setShowSettings] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const isAdmin = role === 'admin'

    return (
        <>
            <aside
                className="w-60 shrink-0 h-full flex flex-col py-6 px-4 overflow-y-auto border-r"
                style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
            >
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-3 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-[#7c6af7] flex items-center justify-center accent-glow">
                        <TrendingUp size={16} className="text-white" />
                    </div>
                    <span
                        className="font-display font-bold text-base tracking-tight"
                        style={{ color: 'var(--c-text)' }}
                    >
                        FinFlow
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1">
                    <p
                        className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
                        style={{ color: 'var(--c-dim)' }}
                    >
                        Menu
                    </p>
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveView(id)}
                            className={`sidebar-link ${activeView === id ? 'active' : ''}`}
                        >
                            <Icon size={16} />
                            <span className="flex-1 text-left">{label}</span>
                            {activeView === id && <ChevronRight size={14} className="opacity-50" />}
                        </button>
                    ))}
                </nav>

                {/* Overview Mini Card */}
                <div className="mt-6 border-t pt-6" style={{ borderColor: 'var(--c-border)' }}>
                    <p
                        className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
                        style={{ color: 'var(--c-dim)' }}
                    >
                        Overview
                    </p>
                    <div
                        className="rounded-xl p-4 border space-y-3"
                        style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)' }}
                    >
                        <div>
                            <p className="text-[11px] mb-1" style={{ color: 'var(--c-muted)' }}>Net Balance</p>
                            <p
                                className="font-display font-semibold text-lg"
                                style={{ color: stats.savings >= 0 ? '#10b981' : '#f43f5e' }}
                            >
                                ₹{Math.abs(stats.savings).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="flex justify-between text-xs">
                            <div>
                                <p className="mb-0.5" style={{ color: 'var(--c-muted)' }}>Savings Rate</p>
                                <p className="font-medium" style={{ color: 'var(--c-text)' }}>{stats.savingsRate}%</p>
                            </div>
                            <div className="text-right">
                                <p className="mb-0.5" style={{ color: 'var(--c-muted)' }}>Txns</p>
                                <p className="font-medium" style={{ color: 'var(--c-text)' }}>{stats.count}</p>
                            </div>
                        </div>
                        <div className="w-full rounded-full h-1.5" style={{ background: 'var(--c-border)' }}>
                            <div
                                className="h-1.5 rounded-full transition-all duration-700"
                                style={{
                                    width: `${Math.min(stats.savingsRate, 100)}%`,
                                    background: 'linear-gradient(90deg, #7c6af7, #10b981)',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom: Settings + Profile */}
                <div className="mt-auto pt-6">
                    <button
                        className="sidebar-link w-full"
                        onClick={() => setShowSettings(true)}
                    >
                        <Settings size={16} />
                        <span>Settings</span>
                    </button>

                    {/* Role badge */}
                    <div
                        className="flex items-center gap-1.5 px-3 py-1 mx-0 mt-2 mb-1 rounded-lg text-[11px] font-semibold"
                        style={{
                            background: isAdmin ? 'rgba(16,185,129,0.1)' : 'rgba(136,136,170,0.1)',
                            color: isAdmin ? '#10b981' : '#8888aa',
                        }}
                    >
                        {isAdmin ? <Shield size={11} /> : <Eye size={11} />}
                        {isAdmin ? 'Admin Mode' : 'Viewer Mode'}
                    </div>

                    {/* User avatar / profile button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfile(v => !v)}
                            className="flex items-center gap-3 px-3 mt-2 w-full rounded-xl py-2 transition-colors hover:bg-[var(--c-border)]"
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                style={{ background: 'linear-gradient(135deg, #7c6af7, #10b981)' }}
                            >
                                {isAdmin ? 'AJ' : 'SV'}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-medium" style={{ color: 'var(--c-text)' }}>
                                    {isAdmin ? 'Alex Johnson' : 'Sam Viewer'}
                                </p>
                                <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>
                                    {isAdmin ? 'Admin Account' : 'View Only'}
                                </p>
                            </div>
                        </button>

                        {showProfile && (
                            <UserProfilePanel onClose={() => setShowProfile(false)} />
                        )}
                    </div>
                </div>
            </aside>

            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </>
    )
}
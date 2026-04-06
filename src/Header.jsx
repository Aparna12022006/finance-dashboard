import React, { useState } from 'react'
import { useFinance } from './FinanceContext'
import { Search, Plus, Bell, Calendar, Sun, Moon, Shield, Eye } from 'lucide-react'
import AddTransactionModal from './AddTransactionModal'
import NotificationsPanel from './NotificationsPanel'

const dateOptions = [
    { value: '7',  label: '7D' },
    { value: '30', label: '30D' },
    { value: '60', label: '60D' },
    { value: '90', label: '90D' },
]

export default function Header() {
    const {
        activeView,
        searchQuery, setSearchQuery,
        dateFilter, setDateFilter,
        role, setRole, isAdmin,
        darkMode, setDarkMode,
        unreadCount,
    } = useFinance()

    const [showModal, setShowModal]   = useState(false)
    const [showNotifs, setShowNotifs] = useState(false)

    const titles = { dashboard: 'Dashboard', transactions: 'Transactions', insights: 'Insights' }

    return (
        <>
            <header
                className="h-16 shrink-0 flex items-center gap-3 px-6 border-b"
                style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
            >
                {/* Title */}
                <div className="flex-1">
                    <h1
                        className="font-display font-semibold text-lg"
                        style={{ color: 'var(--c-text)' }}
                    >
                        {titles[activeView]}
                    </h1>
                </div>

                {/* Search */}
                <div className="relative hidden sm:flex items-center">
                    <Search size={13} className="absolute left-3" style={{ color: 'var(--c-dim)' }} />
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search transactions..."
                        className="rounded-lg pl-8 pr-4 py-2 text-sm border focus:outline-none w-44 transition-all"
                        style={{
                            background: 'var(--c-card)',
                            borderColor: 'var(--c-border)',
                            color: 'var(--c-text)',
                        }}
                    />
                </div>

                {/* Date filter pills */}
                <div
                    className="hidden sm:flex items-center gap-0.5 rounded-lg p-1 border"
                    style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)' }}
                >
                    <Calendar size={12} className="ml-1 mr-0.5" style={{ color: 'var(--c-dim)' }} />
                    {dateOptions.map(o => (
                        <button
                            key={o.value}
                            onClick={() => setDateFilter(o.value)}
                            className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                            style={dateFilter === o.value
                                ? { background: '#7c6af7', color: '#fff' }
                                : { color: 'var(--c-muted)' }
                            }
                        >
                            {o.label}
                        </button>
                    ))}
                </div>

                {/* Role Switcher */}
                <div
                    className="hidden sm:flex items-center gap-1.5 rounded-lg px-2 py-1.5 border cursor-pointer"
                    style={{
                        background: isAdmin ? 'rgba(16,185,129,0.08)' : 'rgba(136,136,170,0.08)',
                        borderColor: isAdmin ? 'rgba(16,185,129,0.25)' : 'var(--c-border)',
                    }}
                >
                    {isAdmin ? <Shield size={12} style={{ color: '#10b981' }} /> : <Eye size={12} style={{ color: '#8888aa' }} />}
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="text-xs font-semibold border-none focus:outline-none cursor-pointer bg-transparent pr-1"
                        style={{ color: isAdmin ? '#10b981' : '#8888aa' }}
                    >
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Dark/Light Toggle */}
                <button
                    onClick={() => setDarkMode(v => !v)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
                    style={{
                        background: 'var(--c-card)',
                        borderColor: 'var(--c-border)',
                        color: darkMode ? '#f59e0b' : '#7c6af7',
                    }}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {darkMode ? <Sun size={15} /> : <Moon size={15} />}
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifs(v => !v)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors relative"
                        style={{
                            background: showNotifs ? 'rgba(124,106,247,0.1)' : 'var(--c-card)',
                            borderColor: showNotifs ? 'rgba(124,106,247,0.35)' : 'var(--c-border)',
                            color: 'var(--c-muted)',
                        }}
                        title="Notifications"
                    >
                        <Bell size={15} />
                        {unreadCount > 0 && (
                            <span
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                                style={{ background: '#7c6af7' }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifs && (
                        <NotificationsPanel onClose={() => setShowNotifs(false)} />
                    )}
                </div>

                {/* Add Transaction (Admin only) */}
                {isAdmin && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors accent-glow"
                        style={{ background: '#7c6af7' }}
                    >
                        <Plus size={15} />
                        <span className="hidden sm:inline">Add Transaction</span>
                    </button>
                )}
            </header>

            {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
        </>
    )
}
import React, { useRef, useEffect } from 'react'
import { useFinance } from './FinanceContext'
import { Bell, CheckCheck, AlertTriangle, CheckCircle, Info, AlertCircle, X, Check } from 'lucide-react'

const typeConfig = {
    alert:   { icon: AlertTriangle, color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'   },
    success: { icon: CheckCircle,   color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
    warn:    { icon: AlertCircle,   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
    info:    { icon: Info,          color: '#7c6af7', bg: 'rgba(124,106,247,0.12)' },
}

export default function NotificationsPanel({ onClose }) {
    const { notifications, unreadCount, markAllRead, markNotificationRead } = useFinance()
    const panelRef = useRef(null)

    // Close panel when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose()
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [onClose])

    const handleNotifClick = (n) => {
        if (!n.read) markNotificationRead(n.id)
    }

    return (
        <div
            ref={panelRef}
            className="absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl z-50 animate-fade-up overflow-hidden"
            style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)', animationFillMode: 'forwards' }}
        >
            {/* ── Header ── */}
            <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--c-border)' }}
            >
                <div className="flex items-center gap-2">
                    <Bell size={15} style={{ color: 'var(--c-accent)' }} />
                    <span className="font-semibold text-sm" style={{ color: 'var(--c-text)' }}>Notifications</span>
                    {unreadCount > 0 && (
                        <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: 'var(--c-accent)' }}
                        >
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-70"
                            style={{ color: 'var(--c-accent)' }}
                            title="Mark all as read"
                        >
                            <CheckCheck size={12} />
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="transition-opacity hover:opacity-70"
                        style={{ color: 'var(--c-muted)' }}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* ── Notification list ── */}
            <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="py-10 text-center text-sm" style={{ color: 'var(--c-muted)' }}>
                        <Bell size={24} className="mx-auto mb-2 opacity-30" />
                        No notifications
                    </div>
                ) : (
                    notifications.map(n => {
                        const cfg  = typeConfig[n.type] || typeConfig.info
                        const Icon = cfg.icon
                        return (
                            <button
                                key={n.id}
                                onClick={() => handleNotifClick(n)}
                                className="w-full flex items-start gap-3 px-4 py-3 border-b text-left transition-colors"
                                style={{
                                    borderColor: 'var(--c-border)',
                                    background: n.read ? 'transparent' : 'rgba(124,106,247,0.05)',
                                    cursor: n.read ? 'default' : 'pointer',
                                }}
                                onMouseEnter={e => { if (!n.read) e.currentTarget.style.background = 'rgba(124,106,247,0.10)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(124,106,247,0.05)' }}
                            >
                                {/* Type icon */}
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                    style={{ background: cfg.bg }}
                                >
                                    <Icon size={14} style={{ color: cfg.color }} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p
                                            className="text-xs font-semibold leading-tight"
                                            style={{ color: 'var(--c-text)', opacity: n.read ? 0.7 : 1 }}
                                        >
                                            {n.title}
                                        </p>
                                        {/* Unread dot OR read tick */}
                                        {!n.read ? (
                                            <span
                                                className="w-2 h-2 rounded-full shrink-0 mt-1"
                                                style={{ background: 'var(--c-accent)' }}
                                            />
                                        ) : (
                                            <Check size={11} className="shrink-0 mt-0.5 opacity-40" style={{ color: 'var(--c-muted)' }} />
                                        )}
                                    </div>
                                    <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: 'var(--c-muted)' }}>
                                        {n.body}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px]" style={{ color: 'var(--c-dim)' }}>{n.time}</p>
                                        {!n.read && (
                                            <span
                                                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                                                style={{ background: 'rgba(124,106,247,0.15)', color: 'var(--c-accent)' }}
                                            >
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        )
                    })
                )}
            </div>

            {/* ── Footer ── */}
            <div className="px-4 py-2.5 text-center border-t" style={{ borderColor: 'var(--c-border)' }}>
                {unreadCount === 0 ? (
                    <p className="text-[11px]" style={{ color: 'var(--c-dim)' }}>All caught up ✓</p>
                ) : (
                    <button
                        onClick={markAllRead}
                        className="text-xs font-medium transition-opacity hover:opacity-70"
                        style={{ color: 'var(--c-accent)' }}
                    >
                        Clear all unread ({unreadCount})
                    </button>
                )}
            </div>
        </div>
    )
}

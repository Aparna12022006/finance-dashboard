import React from 'react'
import { useFinance } from './FinanceContext'
import { X, Moon, Sun, Shield, Eye, Download, Trash2, Bell, Palette, RefreshCw } from 'lucide-react'

// ─── Sub-components ──────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
    <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--c-dim)' }}>
            {title}
        </p>
        <div
            className="rounded-xl border divide-y overflow-hidden"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-card)' }}
        >
            {children}
        </div>
    </div>
)

const SettingRow = ({ icon: Icon, label, desc, children, iconColor = 'var(--c-accent)' }) => (
    <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderColor: 'var(--c-border)' }}>
        <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${iconColor}18` }}
        >
            <Icon size={15} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>{label}</p>
            {desc && <p className="text-[11px] mt-0.5" style={{ color: 'var(--c-muted)' }}>{desc}</p>}
        </div>
        {children}
    </div>
)

const Toggle = ({ value, onChange }) => (
    <button
        onClick={() => onChange(!value)}
        className="relative rounded-full transition-all duration-300 flex-shrink-0"
        style={{ background: value ? 'var(--c-accent)' : 'var(--c-subtle)', width: 40, height: 22 }}
        aria-checked={value}
        role="switch"
    >
        <span
            className="absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-all duration-300"
            style={{ width: 18, height: 18, transform: value ? 'translateX(18px)' : 'translateX(0)' }}
        />
    </button>
)

// Accent colour options with display labels
const ACCENT_COLORS = [
    { hex: '#7c6af7', label: 'Purple'   },
    { hex: '#10b981', label: 'Emerald'  },
    { hex: '#f43f5e', label: 'Rose'     },
    { hex: '#f59e0b', label: 'Amber'    },
    { hex: '#06b6d4', label: 'Cyan'     },
    { hex: '#ec4899', label: 'Pink'     },
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsModal({ onClose }) {
    const {
        darkMode, setDarkMode,
        role, setRole,
        accentColor, setAccentColor,
        notifSettings, setNotifSettings,
        exportTransactionsCSV,
        clearAllData,
        transactions,
    } = useFinance()

    const handleClearData = () => {
        if (window.confirm(`This will remove all ${transactions.length} transactions permanently. Are you sure?`)) {
            clearAllData()
            onClose()
        }
    }

    const handleExportCSV = () => {
        exportTransactionsCSV()
    }

    const toggleNotif = (key) => {
        setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="modal-overlay absolute inset-0" onClick={onClose} />
            <div
                className="relative w-full max-w-md rounded-2xl border shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto"
                style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)', animationFillMode: 'forwards' }}
            >
                {/* ── Header ── */}
                <div
                    className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
                    style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
                >
                    <h2 className="font-display font-semibold text-lg" style={{ color: 'var(--c-text)' }}>Settings</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'var(--c-border)', color: 'var(--c-muted)' }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-5 space-y-6">

                    {/* Appearance */}
                    <Section title="Appearance">
                        {/* Dark Mode Toggle */}
                        <SettingRow
                            icon={darkMode ? Moon : Sun}
                            label="Dark Mode"
                            desc="Toggle between dark and light theme"
                            iconColor={darkMode ? '#7c6af7' : '#f59e0b'}
                        >
                            <Toggle value={darkMode} onChange={setDarkMode} />
                        </SettingRow>

                        {/* Accent Colour Picker */}
                        <SettingRow
                            icon={Palette}
                            label="Accent Color"
                            desc={ACCENT_COLORS.find(c => c.hex === accentColor)?.label ?? 'Custom'}
                            iconColor={accentColor}
                        >
                            <div className="flex gap-1.5 flex-wrap justify-end">
                                {ACCENT_COLORS.map(({ hex, label }) => (
                                    <button
                                        key={hex}
                                        title={label}
                                        onClick={() => setAccentColor(hex)}
                                        className="w-5 h-5 rounded-full transition-all hover:scale-110"
                                        style={{
                                            background: hex,
                                            outline: accentColor === hex ? `2px solid ${hex}` : 'none',
                                            outlineOffset: '2px',
                                            boxShadow: accentColor === hex ? `0 0 8px ${hex}80` : 'none',
                                        }}
                                        aria-label={`Set accent to ${label}`}
                                    />
                                ))}
                            </div>
                        </SettingRow>
                    </Section>

                    {/* Access Control */}
                    <Section title="Access Control">
                        <SettingRow
                            icon={role === 'admin' ? Shield : Eye}
                            label="Current Role"
                            desc={role === 'admin' ? 'Full access — can add, edit & delete' : 'Read-only — cannot modify data'}
                            iconColor={role === 'admin' ? '#10b981' : '#8888aa'}
                        >
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="text-xs font-medium rounded-lg px-2 py-1.5 border cursor-pointer focus:outline-none"
                                style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)', color: 'var(--c-text)' }}
                            >
                                <option value="viewer">Viewer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </SettingRow>
                    </Section>

                    {/* Notifications */}
                    <Section title="Notifications">
                        <SettingRow
                            icon={Bell}
                            label="Transaction Alerts"
                            desc="Get notified when new transactions are added"
                            iconColor="#7c6af7"
                        >
                            <Toggle
                                value={notifSettings.transactionAlerts}
                                onChange={() => toggleNotif('transactionAlerts')}
                            />
                        </SettingRow>
                        <SettingRow
                            icon={Bell}
                            label="Budget Warnings"
                            desc="Alert when spending is 80%+ of income"
                            iconColor="#f59e0b"
                        >
                            <Toggle
                                value={notifSettings.budgetWarnings}
                                onChange={() => toggleNotif('budgetWarnings')}
                            />
                        </SettingRow>
                    </Section>

                    {/* Data */}
                    <Section title="Data">
                        <SettingRow
                            icon={Download}
                            label="Export CSV"
                            desc={`Download all ${transactions.length} transactions as a CSV file`}
                            iconColor="#10b981"
                        >
                            <button
                                onClick={handleExportCSV}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80 active:scale-95"
                                style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}
                            >
                                Export
                            </button>
                        </SettingRow>

                        <SettingRow
                            icon={RefreshCw}
                            label="Reset to Mock Data"
                            desc="Restore all original sample transactions"
                            iconColor="#7c6af7"
                        >
                            <button
                                onClick={() => { window.location.reload() }}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80 active:scale-95"
                                style={{ background: 'rgba(124,106,247,0.12)', color: '#7c6af7' }}
                            >
                                Reset
                            </button>
                        </SettingRow>

                        <SettingRow
                            icon={Trash2}
                            label="Clear All Data"
                            desc="Remove every transaction permanently"
                            iconColor="#f43f5e"
                        >
                            <button
                                onClick={handleClearData}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80 active:scale-95"
                                style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e' }}
                            >
                                Clear
                            </button>
                        </SettingRow>
                    </Section>
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 border-t text-center" style={{ borderColor: 'var(--c-border)' }}>
                    <p className="text-[11px]" style={{ color: 'var(--c-dim)' }}>FinFlow v1.0.0 · Finance Dashboard UI</p>
                </div>
            </div>
        </div>
    )
}

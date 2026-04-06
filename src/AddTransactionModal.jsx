import React, { useState } from 'react'
import { useFinance } from './FinanceContext'
import { categories } from './mockData'
import { X, Plus } from 'lucide-react'
import { format } from 'date-fns'

export default function AddTransactionModal({ onClose }) {
    const { addTransaction } = useFinance()
    const [form, setForm] = useState({
        type: 'expense',
        description: '',
        amount: '',
        category: '',
        date: format(new Date(), 'yyyy-MM-dd'),
    })
    const [error, setError] = useState('')

    const filteredCategories = categories.filter(c => c.type === form.type)

    const handleChange = (key, val) => {
        if (key === 'type') {
            setForm(prev => ({ ...prev, type: val, category: '' }))
        } else {
            setForm(prev => ({ ...prev, [key]: val }))
        }
    }

    const handleSubmit = () => {
        if (!form.description.trim()) return setError('Description is required')
        if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return setError('Enter a valid amount')
        if (!form.category) return setError('Select a category')
        addTransaction({ ...form, amount: parseFloat(form.amount) })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="modal-overlay absolute inset-0" onClick={onClose} />
            <div
                className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-fade-up"
                style={{
                    background: 'var(--c-card)',
                    borderColor: 'var(--c-border)',
                    animationFillMode: 'forwards',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-semibold text-lg" style={{ color: 'var(--c-text)' }}>
                        Add Transaction
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'var(--c-border)', color: 'var(--c-muted)' }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Type Toggle */}
                <div className="flex rounded-xl p-1 mb-5" style={{ background: 'var(--c-surface)' }}>
                    {['expense', 'income'].map(t => (
                        <button
                            key={t}
                            onClick={() => handleChange('type', t)}
                            className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                            style={form.type === t
                                ? { background: t === 'expense' ? '#f43f5e' : '#10b981', color: 'white' }
                                : { color: 'var(--c-muted)' }
                            }
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {/* Description */}
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--c-muted)' }}>
                            Description
                        </label>
                        <input
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                            placeholder="e.g. Grocery shopping"
                            className="w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none transition-all"
                            style={{
                                background: 'var(--c-surface)',
                                borderColor: 'var(--c-border)',
                                color: 'var(--c-text)',
                            }}
                        />
                    </div>

                    {/* Amount + Date */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--c-muted)' }}>
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={form.amount}
                                onChange={e => handleChange('amount', e.target.value)}
                                placeholder="0"
                                className="w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none transition-all font-mono"
                                style={{
                                    background: 'var(--c-surface)',
                                    borderColor: 'var(--c-border)',
                                    color: 'var(--c-text)',
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--c-muted)' }}>
                                Date
                            </label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => handleChange('date', e.target.value)}
                                className="w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none transition-all"
                                style={{
                                    background: 'var(--c-surface)',
                                    borderColor: 'var(--c-border)',
                                    color: 'var(--c-text)',
                                }}
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--c-muted)' }}>
                            Category
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {filteredCategories.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => handleChange('category', c.id)}
                                    className="py-2 px-2 rounded-xl text-xs font-medium border transition-all"
                                    style={form.category === c.id
                                        ? { borderColor: '#7c6af7', background: 'rgba(124,106,247,0.1)', color: '#7c6af7' }
                                        : { borderColor: 'var(--c-border)', color: 'var(--c-muted)', background: 'transparent' }
                                    }
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs font-medium" style={{ color: '#f43f5e' }}>{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="w-full text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 mt-2 accent-glow"
                        style={{ background: '#7c6af7' }}
                    >
                        <Plus size={16} />
                        Add Transaction
                    </button>
                </div>
            </div>
        </div>
    )
}
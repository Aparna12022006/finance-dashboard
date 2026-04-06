import React, { useState } from 'react'
import { useFinance } from './FinanceContext'
import { categories } from './mockData'
import { Trash2, Edit2, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { format } from 'date-fns'
import EditTransactionModal from './EditTransactionModal'

const PAGE_SIZE = 12
const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

export default function TransactionTable() {
    const { filteredTransactions, deleteTransaction, categoryFilter, setCategoryFilter, isAdmin } = useFinance()
    const [page, setPage] = useState(1)
    const [editingTxn, setEditingTxn] = useState(null)   // null or a transaction object

    const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE)
    const paginated  = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
        <>
            <div
                className="rounded-2xl border card-glow overflow-hidden"
                style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)' }}
            >
                {/* ── Viewer notice ── */}
                {!isAdmin && (
                    <div
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium border-b"
                        style={{ background: 'rgba(136,136,170,0.08)', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}
                    >
                        <Lock size={11} />
                        You are in Viewer mode — switch to Admin to add, edit, or delete transactions
                    </div>
                )}

                {/* ── Category filter bar ── */}
                <div className="flex items-center gap-2 p-4 border-b overflow-x-auto" style={{ borderColor: 'var(--c-border)' }}>
                    <button
                        onClick={() => { setCategoryFilter('all'); setPage(1) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                        style={categoryFilter === 'all'
                            ? { background: 'var(--c-accent)', color: '#fff' }
                            : { background: 'var(--c-surface)', color: 'var(--c-muted)' }
                        }
                    >
                        All
                    </button>
                    {categories.map(c => (
                        <button
                            key={c.id}
                            onClick={() => { setCategoryFilter(c.id); setPage(1) }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                            style={categoryFilter === c.id
                                ? { background: c.color, color: '#fff' }
                                : { background: 'var(--c-surface)', color: 'var(--c-muted)' }
                            }
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* ── Table header ── */}
                <div
                    className="grid gap-4 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest border-b"
                    style={{
                        gridTemplateColumns: isAdmin ? '1fr auto auto auto auto' : '1fr auto auto auto',
                        color: 'var(--c-dim)',
                        borderColor: 'var(--c-border)',
                    }}
                >
                    <span>Description</span>
                    <span className="text-right">Category</span>
                    <span className="text-right">Date</span>
                    <span className="text-right">Amount</span>
                    {isAdmin && <span className="text-right">Actions</span>}
                </div>

                {/* ── Rows ── */}
                <div>
                    {paginated.length === 0 && (
                        <div className="py-16 text-center text-sm" style={{ color: 'var(--c-dim)' }}>
                            No transactions found
                        </div>
                    )}

                    {paginated.map(txn => {
                        const cat = catMap[txn.category]
                        return (
                            <div
                                key={txn.id}
                                className="grid gap-4 items-center px-5 py-3.5 group transition-colors"
                                style={{
                                    gridTemplateColumns: isAdmin ? '1fr auto auto auto auto' : '1fr auto auto auto',
                                    borderBottom: `1px solid var(--c-border)`,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,106,247,0.03)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {/* Description + icon */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: `${cat?.color || '#888'}20` }}
                                    >
                                        {txn.type === 'income'
                                            ? <ArrowUpRight   size={14} style={{ color: '#10b981' }} />
                                            : <ArrowDownLeft  size={14} style={{ color: '#f43f5e' }} />}
                                    </div>
                                    <span className="text-sm truncate" style={{ color: 'var(--c-text)' }}>
                                        {txn.description}
                                    </span>
                                </div>

                                {/* Category badge */}
                                <span
                                    className="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap"
                                    style={{ background: `${cat?.color || '#888'}18`, color: cat?.color || '#888' }}
                                >
                                    {cat?.label || txn.category}
                                </span>

                                {/* Date */}
                                <span className="text-xs font-mono whitespace-nowrap" style={{ color: 'var(--c-muted)' }}>
                                    {format(new Date(txn.date), 'dd MMM yy')}
                                </span>

                                {/* Amount */}
                                <span
                                    className="font-mono font-semibold text-sm whitespace-nowrap text-right"
                                    style={{ color: txn.type === 'income' ? '#10b981' : '#f43f5e' }}
                                >
                                    {txn.type === 'income' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                                </span>

                                {/* Admin action buttons — Edit + Delete */}
                                {isAdmin && (
                                    <div className="flex items-center justify-end gap-1.5">
                                        {/* Edit button */}
                                        <button
                                            onClick={() => setEditingTxn(txn)}
                                            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                                            style={{ background: 'rgba(124,106,247,0.12)', color: 'var(--c-accent)' }}
                                            title="Edit transaction"
                                        >
                                            <Edit2 size={11} />
                                        </button>

                                        {/* Delete button */}
                                        <button
                                            onClick={() => deleteTransaction(txn.id)}
                                            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                                            style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}
                                            title="Delete transaction"
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div
                        className="flex items-center justify-between px-5 py-3 border-t"
                        style={{ borderColor: 'var(--c-border)' }}
                    >
                        <p className="text-xs" style={{ color: 'var(--c-muted)' }}>
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                                style={{ background: 'var(--c-border)', color: 'var(--c-muted)' }}
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <span className="text-xs font-mono" style={{ color: 'var(--c-text)' }}>
                                {page} / {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                                style={{ background: 'var(--c-border)', color: 'var(--c-muted)' }}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Edit Modal ── */}
            {editingTxn && (
                <EditTransactionModal
                    transaction={editingTxn}
                    onClose={() => setEditingTxn(null)}
                />
            )}
        </>
    )
}

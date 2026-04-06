import React from 'react'
import { useFinance } from './FinanceContext'
import { categories } from './mockData'
import { TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Target } from 'lucide-react'

const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

export default function Insights() {
    const { stats, categoryData } = useFinance()

    const topExpense = categoryData[0]
    const savingsRate = parseFloat(stats.savingsRate)
    const insights = []

    if (savingsRate >= 30) {
        insights.push({ type: 'success', icon: CheckCircle, title: 'Great savings rate!', body: `You're saving ${savingsRate}% of your income. Financial advisors recommend 20%+.` })
    } else if (savingsRate >= 15) {
        insights.push({ type: 'warn', icon: Target, title: 'Savings on track', body: `You're saving ${savingsRate}%. Try to push toward 30% for faster wealth building.` })
    } else {
        insights.push({ type: 'alert', icon: AlertTriangle, title: 'Low savings rate', body: `Only ${savingsRate}% saved. Review your top spending categories to improve this.` })
    }

    if (topExpense) {
        const pct = ((topExpense.value / stats.expenses) * 100).toFixed(0)
        insights.push({ type: 'info', icon: Lightbulb, title: `Top spend: ${topExpense.label}`, body: `${pct}% of all expenses go to ${topExpense.label}. Consider if this aligns with your goals.` })
    }

    if (stats.income > 0) {
        const expRatio = ((stats.expenses / stats.income) * 100).toFixed(0)
        insights.push({ type: expRatio > 80 ? 'alert' : 'success', icon: TrendingUp, title: 'Expense ratio', body: `Your expenses are ${expRatio}% of income. ${expRatio > 80 ? 'This is high — try cutting discretionary spending.' : 'This is healthy!'}` })
    }

    insights.push({ type: 'info', icon: Target, title: 'Emergency fund', body: `Aim to keep 3–6 months of expenses (₹${(stats.expenses * 4).toLocaleString('en-IN')}) in a liquid account.` })

    const colorMap = {
        success: { bg: '#10b98115', border: '#10b98130', icon: '#10b981' },
        warn:    { bg: '#f59e0b15', border: '#f59e0b30', icon: '#f59e0b' },
        alert:   { bg: '#f43f5e15', border: '#f43f5e30', icon: '#f43f5e' },
        info:    { bg: '#7c6af715', border: '#7c6af730', icon: '#7c6af7' },
    }

    return (
        <div className="space-y-6">
            {/* Health Score */}
            <div
                className="rounded-2xl border p-6 card-glow"
                style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)' }}
            >
                <h3 className="font-display font-semibold mb-1" style={{ color: 'var(--c-text)' }}>
                    Financial Health Score
                </h3>
                <p className="text-xs mb-5" style={{ color: 'var(--c-muted)' }}>Based on your last 30 days activity</p>
                <div className="flex items-center gap-6">
                    <div className="relative w-28 h-28 shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--c-border)" strokeWidth="10" />
                            <circle
                                cx="50" cy="50" r="40" fill="none"
                                stroke="#7c6af7" strokeWidth="10"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(savingsRate, 50) / 50)}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-display font-bold text-2xl" style={{ color: 'var(--c-text)' }}>
                                {Math.min(Math.round(savingsRate * 2), 100)}
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--c-muted)' }}>/ 100</span>
                        </div>
                    </div>
                    <div className="space-y-3 flex-1">
                        {[
                            { label: 'Income',   value: stats.income,              max: stats.income, color: '#10b981' },
                            { label: 'Expenses', value: stats.expenses,             max: stats.income, color: '#f43f5e' },
                            { label: 'Savings',  value: Math.max(stats.savings, 0), max: stats.income, color: '#7c6af7' },
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span style={{ color: 'var(--c-muted)' }}>{item.label}</span>
                                    <span className="font-mono" style={{ color: 'var(--c-text)' }}>
                                        ₹{item.value.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--c-border)' }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${Math.min((item.value / (item.max || 1)) * 100, 100)}%`, background: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insights.map((ins, i) => {
                    const c = colorMap[ins.type]
                    const Icon = ins.icon
                    return (
                        <div
                            key={i}
                            className="rounded-2xl p-5 border opacity-0 animate-fade-up"
                            style={{ background: c.bg, borderColor: c.border, animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
                        >
                            <div className="flex items-start gap-3">
                                <Icon size={18} style={{ color: c.icon }} className="mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--c-text)' }}>{ins.title}</h4>
                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>{ins.body}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Category Breakdown Table */}
            <div
                className="rounded-2xl border overflow-hidden card-glow"
                style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)' }}
            >
                <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--c-border)' }}>
                    <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--c-text)' }}>
                        Category Breakdown
                    </h3>
                </div>
                <div>
                    {categoryData.slice(0, 8).map((cat, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 px-5 py-3.5"
                            style={{ borderBottom: i < 7 ? `1px solid var(--c-border)` : 'none' }}
                        >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                            <span className="text-sm flex-1" style={{ color: 'var(--c-text)' }}>{cat.label}</span>
                            <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--c-border)' }}>
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${(cat.value / categoryData[0].value) * 100}%`, background: cat.color }}
                                />
                            </div>
                            <span className="font-mono text-sm font-medium w-24 text-right" style={{ color: 'var(--c-text)' }}>
                                ₹{cat.value.toLocaleString('en-IN')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
import React from 'react'
import { useFinance } from './FinanceContext'
import { useAnimatedNumber } from './useAnimatedNumber'
import { TrendingUp, TrendingDown, PiggyBank, Percent } from 'lucide-react'

const Card = ({ label, value, prefix, suffix, icon: Icon, color, trend, delay }) => {
    const animated = useAnimatedNumber(value)
    return (
        <div
            className="card-glow rounded-2xl p-5 border flex flex-col gap-4 opacity-0 animate-fade-up"
            style={{
                background: 'var(--c-card)',
                borderColor: 'var(--c-border)',
                animationDelay: `${delay}ms`,
                animationFillMode: 'forwards',
            }}
        >
            <div className="flex items-start justify-between">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}18` }}
                >
                    <Icon size={18} style={{ color }} />
                </div>
                {trend !== undefined && (
                    <span
                        className="stat-badge"
                        style={trend >= 0
                            ? { background: 'rgba(16,185,129,0.12)', color: '#10b981' }
                            : { background: 'rgba(244,63,94,0.12)', color: '#f43f5e' }
                        }
                    >
                        {trend >= 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--c-muted)' }}>{label}</p>
                <p className="font-display font-semibold text-2xl" style={{ color: 'var(--c-text)' }}>
                    {prefix}<span className="tabular-nums">{animated.toLocaleString('en-IN')}</span>{suffix}
                </p>
            </div>
        </div>
    )
}

export default function SummaryCards() {
    const { stats } = useFinance()

    const cards = [
        { label: 'Total Income',   value: stats.income,                            prefix: '₹', icon: TrendingUp,  color: '#10b981', trend: 8.2  },
        { label: 'Total Expenses', value: stats.expenses,                           prefix: '₹', icon: TrendingDown, color: '#f43f5e', trend: -3.1 },
        { label: 'Net Savings',    value: Math.abs(stats.savings),                  prefix: stats.savings >= 0 ? '₹' : '-₹', icon: PiggyBank, color: '#7c6af7', trend: 12.5 },
        { label: 'Savings Rate',   value: parseFloat(stats.savingsRate), prefix: '', suffix: '%', icon: Percent, color: '#f59e0b' },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c, i) => (
                <Card key={c.label} {...c} delay={i * 100} />
            ))}
        </div>
    )
}
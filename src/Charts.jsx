import React from 'react'
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useFinance } from './FinanceContext'

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div
            className="rounded-xl p-3 shadow-xl border text-xs"
            style={{ background: 'var(--c-card)', borderColor: 'var(--c-subtle)' }}
        >
            <p className="mb-2" style={{ color: 'var(--c-muted)' }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="font-medium" style={{ color: p.color }}>
                    {p.name}: ₹{p.value.toLocaleString('en-IN')}
                </p>
            ))}
        </div>
    )
}

export default function Charts() {
    const { monthlyData, categoryData } = useFinance()
    const top5 = categoryData.slice(0, 5)

    const cardStyle = {
        background: 'var(--c-card)',
        borderColor: 'var(--c-border)',
        animationFillMode: 'forwards',
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Area Chart — Income vs Expenses */}
            <div
                className="lg:col-span-2 rounded-2xl p-5 border card-glow opacity-0 animate-fade-up animation-delay-200"
                style={cardStyle}
            >
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--c-text)' }}>
                            Income vs Expenses
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>Last 6 months overview</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--c-muted)' }}>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: '#7c6af7' }} />Income
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: '#f43f5e' }} />Expenses
                        </span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#7c6af7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#7c6af7" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" />
                        <XAxis dataKey="name" tick={{ fill: 'var(--c-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'var(--c-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="income"   name="Income"   stroke="#7c6af7" strokeWidth={2} fill="url(#incomeGrad)"  />
                        <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Donut Chart — Spending by Category */}
            <div
                className="rounded-2xl p-5 border card-glow opacity-0 animate-fade-up animation-delay-300"
                style={cardStyle}
            >
                <h3 className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--c-text)' }}>
                    Spending by Category
                </h3>
                <p className="text-xs mb-4" style={{ color: 'var(--c-muted)' }}>Top 5 categories</p>
                <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                        <Pie data={top5} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={3}>
                            {top5.map((entry, i) => (
                                <Cell key={i} fill={entry.color} stroke="transparent" />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
                            contentStyle={{
                                background: 'var(--c-card)',
                                border: '1px solid var(--c-border)',
                                borderRadius: 12,
                                fontSize: 12,
                                color: 'var(--c-text)',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                    {top5.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                                <span className="truncate max-w-[100px]" style={{ color: 'var(--c-muted)' }}>{c.label}</span>
                            </div>
                            <span className="font-mono font-medium" style={{ color: 'var(--c-text)' }}>
                                ₹{c.value.toLocaleString('en-IN')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bar Chart — Monthly Savings */}
            <div
                className="lg:col-span-3 rounded-2xl p-5 border card-glow opacity-0 animate-fade-up animation-delay-400"
                style={cardStyle}
            >
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--c-text)' }}>
                            Monthly Savings
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>Net savings per month</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: 'var(--c-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'var(--c-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="savings" name="Savings" radius={[6, 6, 0, 0]}>
                            {monthlyData.map((entry, i) => (
                                <Cell key={i} fill={entry.savings >= 0 ? '#7c6af7' : '#f43f5e'} fillOpacity={0.85} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
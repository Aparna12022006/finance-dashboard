import { subDays, format } from 'date-fns'

export const categories = [
    { id: 'salary', label: 'Salary', color: '#7c6af7', type: 'income' },
    { id: 'freelance', label: 'Freelance', color: '#10b981', type: 'income' },
    { id: 'investments', label: 'Investments', color: '#f59e0b', type: 'income' },
    { id: 'food', label: 'Food & Dining', color: '#f43f5e', type: 'expense' },
    { id: 'transport', label: 'Transport', color: '#06b6d4', type: 'expense' },
    { id: 'utilities', label: 'Utilities', color: '#8b5cf6', type: 'expense' },
    { id: 'entertainment', label: 'Entertainment', color: '#ec4899', type: 'expense' },
    { id: 'healthcare', label: 'Healthcare', color: '#14b8a6', type: 'expense' },
    { id: 'shopping', label: 'Shopping', color: '#f97316', type: 'expense' },
    { id: 'education', label: 'Education', color: '#a78bfa', type: 'expense' },
]

const generateTransactions = () => {
    const txns = []
    const incomeEntries = [
        { description: 'Monthly Salary', category: 'salary', amount: 85000 },
        { description: 'Freelance Project - UI Design', category: 'freelance', amount: 15000 },
        { description: 'Stock Dividend', category: 'investments', amount: 4200 },
        { description: 'Consulting Fee', category: 'freelance', amount: 8500 },
        { description: 'Bonus Payment', category: 'salary', amount: 12000 },
    ]
    const expenseEntries = [
        { description: 'Swiggy Order', category: 'food', amount: 450 },
        { description: 'Ola Cab', category: 'transport', amount: 320 },
        { description: 'Netflix Subscription', category: 'entertainment', amount: 649 },
        { description: 'Electricity Bill', category: 'utilities', amount: 2100 },
        { description: 'Amazon Shopping', category: 'shopping', amount: 3400 },
        { description: 'Gym Membership', category: 'healthcare', amount: 2000 },
        { description: 'Udemy Course', category: 'education', amount: 1299 },
        { description: 'Grocery Store', category: 'food', amount: 1850 },
        { description: 'Petrol', category: 'transport', amount: 3000 },
        { description: 'Internet Bill', category: 'utilities', amount: 999 },
        { description: 'Movie Tickets', category: 'entertainment', amount: 780 },
        { description: 'Restaurant Dinner', category: 'food', amount: 2200 },
        { description: 'Mobile Recharge', category: 'utilities', amount: 599 },
        { description: 'Pharmacy', category: 'healthcare', amount: 860 },
        { description: 'H&M Clothing', category: 'shopping', amount: 4500 },
    ]

    for (let i = 89; i >= 0; i--) {
        const date = subDays(new Date(), i)
        const dateStr = format(date, 'yyyy-MM-dd')
        const dayOfMonth = date.getDate()

        if (dayOfMonth === 1) {
            const inc = incomeEntries[0]
            txns.push({ id: `txn-${i}-sal`, date: dateStr, ...inc, type: 'income' })
        }
        if (dayOfMonth === 15) {
            const inc = incomeEntries[2]
            txns.push({ id: `txn-${i}-inv`, date: dateStr, ...inc, type: 'income' })
        }
        if (Math.random() < 0.3) {
            const inc = incomeEntries[Math.floor(Math.random() * (incomeEntries.length - 1)) + 1]
            txns.push({ id: `txn-${i}-inc`, date: dateStr, ...inc, type: 'income', amount: inc.amount * (0.8 + Math.random() * 0.4) | 0 })
        }
        const numExp = Math.floor(Math.random() * 3)
        for (let j = 0; j < numExp; j++) {
            const exp = expenseEntries[Math.floor(Math.random() * expenseEntries.length)]
            txns.push({ id: `txn-${i}-exp-${j}`, date: dateStr, ...exp, type: 'expense', amount: (exp.amount * (0.7 + Math.random() * 0.6)) | 0 })
        }
    }
    return txns.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const initialTransactions = generateTransactions()

export const getMonthlyData = (transactions) => {
    const months = {}
    transactions.forEach(t => {
        const month = t.date.slice(0, 7)
        if (!months[month]) months[month] = { month, income: 0, expenses: 0 }
        if (t.type === 'income') months[month].income += t.amount
        else months[month].expenses += t.amount
    })
    return Object.values(months)
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6)
        .map(m => ({
            ...m,
            name: format(new Date(m.month + '-01'), 'MMM'),
            savings: m.income - m.expenses,
        }))
}

export const getCategoryBreakdown = (transactions) => {
    const cats = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
        if (!cats[t.category]) cats[t.category] = { name: t.category, value: 0, color: '' }
        cats[t.category].value += t.amount
    })
    const catMap = Object.fromEntries(categories.map(c => [c.id, c]))
    return Object.values(cats).map(c => ({
        ...c,
        label: catMap[c.name]?.label || c.name,
        color: catMap[c.name]?.color || '#888',
    })).sort((a, b) => b.value - a.value)
}
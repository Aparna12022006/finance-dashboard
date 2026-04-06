import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { initialTransactions, getMonthlyData, getCategoryBreakdown } from './mockData'

const FinanceContext = createContext(null)

export const sampleNotifications = [
    { id: 1, type: 'alert',   title: 'High Spending Detected',  body: 'Shopping expenses are 40% above last month.',        time: '2m ago', read: false },
    { id: 2, type: 'info',    title: 'Salary Credited',         body: 'Monthly Salary of ₹85,000 has been received.',       time: '1h ago', read: false },
    { id: 3, type: 'success', title: 'Savings Goal Met',        body: 'You reached your 30% savings rate target!',          time: '3h ago', read: true  },
    { id: 4, type: 'warn',    title: 'Bill Due Soon',           body: 'Electricity Bill payment due in 3 days.',            time: '1d ago', read: true  },
    { id: 5, type: 'info',    title: 'New Transaction Added',   body: 'Freelance Project payment of ₹15,000 recorded.',     time: '2d ago', read: true  },
]

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions]   = useState(initialTransactions)
    const [activeView, setActiveView]       = useState('dashboard')
    const [dateFilter, setDateFilter]       = useState('30')
    const [searchQuery, setSearchQuery]     = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [role, setRole]                   = useState('viewer')   // 'admin' | 'viewer'
    const [darkMode, setDarkMode]           = useState(true)       // true = dark, false = light
    const [accentColor, setAccentColorState] = useState('#7c6af7')
    const [notifications, setNotifications] = useState(sampleNotifications)
    const [notifSettings, setNotifSettings] = useState({ transactionAlerts: true, budgetWarnings: true })

    // ── Apply dark/light theme ──────────────────────────────────────────────
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    }, [darkMode])

    // ── Apply accent colour as CSS variable ─────────────────────────────────
    const setAccentColor = (color) => {
        setAccentColorState(color)
        document.documentElement.style.setProperty('--c-accent', color)
    }

    // ── Notification helpers ────────────────────────────────────────────────
    const unreadCount = notifications.filter(n => !n.read).length

    const markAllRead = () =>
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))

    const markNotificationRead = (id) =>
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

    // ── Export all transactions as CSV ──────────────────────────────────────
    const exportTransactionsCSV = () => {
        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (₹)']
        const rows = transactions.map(t => [
            t.date,
            `"${t.description}"`,   // quote in case of commas
            t.category,
            t.type,
            t.amount,
        ])
        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url  = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href     = url
        link.download = `finflow-transactions-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    // ── Clear all transaction data ──────────────────────────────────────────
    const clearAllData = () => {
        setTransactions([])
        setCategoryFilter('all')
        setSearchQuery('')
    }

    // ── Derived state ───────────────────────────────────────────────────────
    const filteredTransactions = useMemo(() => {
        const days   = parseInt(dateFilter)
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        return transactions.filter(t => {
            const d          = new Date(t.date)
            const inRange    = d >= cutoff
            const matchSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchCat   = categoryFilter === 'all' || t.category === categoryFilter
            return inRange && matchSearch && matchCat
        })
    }, [transactions, dateFilter, searchQuery, categoryFilter])

    const stats = useMemo(() => {
        const income   = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
        const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
        const savings  = income - expenses
        const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0
        return { income, expenses, savings, savingsRate, count: filteredTransactions.length }
    }, [filteredTransactions])

    const monthlyData  = useMemo(() => getMonthlyData(transactions), [transactions])
    const categoryData = useMemo(() => getCategoryBreakdown(filteredTransactions), [filteredTransactions])

    // ── Transaction CRUD ────────────────────────────────────────────────────
    const addTransaction = (txn) =>
        setTransactions(prev => [{ ...txn, id: `txn-new-${Date.now()}` }, ...prev])

    const editTransaction = (id, updates) =>
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))

    const deleteTransaction = (id) =>
        setTransactions(prev => prev.filter(t => t.id !== id))

    return (
        <FinanceContext.Provider value={{
            transactions,
            filteredTransactions,
            stats,
            monthlyData,
            categoryData,
            activeView,      setActiveView,
            dateFilter,      setDateFilter,
            searchQuery,     setSearchQuery,
            categoryFilter,  setCategoryFilter,
            role,            setRole,
            isAdmin: role === 'admin',
            darkMode,        setDarkMode,
            accentColor,     setAccentColor,
            notifications,
            notifSettings,   setNotifSettings,
            unreadCount,
            markAllRead,
            markNotificationRead,
            exportTransactionsCSV,
            clearAllData,
            addTransaction,
            editTransaction,
            deleteTransaction,
        }}>
            {children}
        </FinanceContext.Provider>
    )
}

export const useFinance = () => {
    const ctx = useContext(FinanceContext)
    if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
    return ctx
}
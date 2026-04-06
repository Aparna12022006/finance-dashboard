import React from 'react'
import { FinanceProvider, useFinance } from './FinanceContext'
import Sidebar from './Sidebar'
import Header from './Header'
import Dashboard from './Dashboard'
import TransactionTable from './TransactionTable'
import Insights from './Insights'

const ViewRenderer = () => {
    const { activeView } = useFinance()
    if (activeView === 'dashboard') return <Dashboard />
    if (activeView === 'transactions') return <TransactionTable />
    if (activeView === 'insights') return <Insights />
    return <Dashboard />
}

const AppInner = () => {
    const { darkMode } = useFinance()
    return (
        <div className={`flex h-screen w-screen overflow-hidden theme-bg ${darkMode ? '' : 'light'}`}>
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 theme-bg">
                    <ViewRenderer />
                </main>
            </div>
        </div>
    )
}

export default function App() {
    return (
        <FinanceProvider>
            <AppInner />
        </FinanceProvider>
    )
}
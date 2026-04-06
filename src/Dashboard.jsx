import React from 'react'
import SummaryCards from './SummaryCards'
import Charts from './Charts'
import TransactionTable from './TransactionTable'

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <SummaryCards />
            <Charts />
            <div>
                <h2 className="font-display font-semibold text-sm text-[#8888aa] uppercase tracking-widest mb-3">Recent Transactions</h2>
                <TransactionTable />
            </div>
        </div>
    )
}
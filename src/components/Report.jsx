import useStore from '../store'
import { calculateBalances, simplifyDebts, formatCurrency, generateWhatsAppLink, groupByCategory } from '../utils'
import { Download, MessageCircle } from 'lucide-react'

export default function Report() {
  const { expenses, roommates, settlements } = useStore()
  const balances = calculateBalances(expenses, roommates, settlements)
  const transactions = simplifyDebts(balances)
  const categoryData = groupByCategory(expenses)
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  function downloadCSV() {
    const headers = ['Date', 'Description', 'Amount', 'Paid By', 'Category', 'Split Among']
    const rows = expenses.map((e) => [
      new Date(e.date).toLocaleDateString(),
      e.description,
      e.amount.toFixed(2),
      e.paidBy,
      e.category,
      e.splitAmong.join('; '),
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roomie-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Report</h2>
        <button onClick={downloadCSV} className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="glass p-5">
        <h3 className="font-semibold text-white mb-3">Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-dark p-3 rounded-xl">
            <p className="text-white/50 text-xs">Total Expenses</p>
            <p className="text-white font-bold text-lg">{formatCurrency(total)}</p>
          </div>
          <div className="glass-dark p-3 rounded-xl">
            <p className="text-white/50 text-xs">Transactions Needed</p>
            <p className="text-white font-bold text-lg">{transactions.length}</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryData).length > 0 && (
        <div className="glass p-5">
          <h3 className="font-semibold text-white mb-3">By Category</h3>
          <div className="space-y-2">
            {Object.entries(categoryData)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amt]) => (
                <div key={cat} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-white/70 text-sm">{cat}</span>
                    <div className="flex-1 mx-2">
                      <div
                        className="h-1.5 bg-indigo-500/50 rounded-full"
                        style={{ width: `${(amt / total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white text-sm font-semibold">{formatCurrency(amt)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Settlement Plan */}
      {transactions.length > 0 && (
        <div className="glass p-5">
          <h3 className="font-semibold text-white mb-3">Settlement Plan</h3>
          <div className="space-y-3">
            {transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <div>
                  <p className="text-white text-sm">
                    <span className="text-red-400 font-medium">{t.from}</span>
                    {' pays '}
                    <span className="text-green-400 font-medium">{t.to}</span>
                  </p>
                  <p className="text-indigo-300 font-semibold">{formatCurrency(t.amount)}</p>
                </div>
                <a
                  href={generateWhatsAppLink([t])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-1.5 text-xs py-1.5"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="glass p-8 text-center">
          <p className="text-white/50">No expenses to report yet.</p>
        </div>
      )}
    </div>
  )
}

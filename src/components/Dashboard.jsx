import { useState } from 'react'
import useStore from '../store'
import { calculateBalances, simplifyDebts, formatCurrency, generateWhatsAppLink } from '../utils'
import { Users, Receipt, TrendingUp, MessageCircle, Trash2 } from 'lucide-react'

export default function Dashboard() {
  const { roommates, expenses, addRoommate, removeRoommate, deleteExpense, settlements } = useStore()
  const [newRoommate, setNewRoommate] = useState('')

  const balances = calculateBalances(expenses, roommates, settlements)
  const transactions = simplifyDebts(balances)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  function handleAddRoommate(e) {
    e.preventDefault()
    if (newRoommate.trim() && !roommates.includes(newRoommate.trim())) {
      addRoommate(newRoommate.trim())
      setNewRoommate('')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass p-4">
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Receipt size={16} />
            <span className="text-xs">Total Expenses</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="glass p-4">
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Users size={16} />
            <span className="text-xs">Roommates</span>
          </div>
          <p className="text-xl font-bold text-white">{roommates.length}</p>
        </div>
        <div className="glass p-4 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs">Transactions</span>
          </div>
          <p className="text-xl font-bold text-white">{transactions.length}</p>
        </div>
      </div>

      {/* Balances */}
      <div className="glass p-5">
        <h3 className="font-semibold text-white mb-3">Balances</h3>
        {roommates.length === 0 ? (
          <p className="text-white/50 text-sm">No roommates yet.</p>
        ) : (
          <div className="space-y-2">
            {roommates.map((r) => {
              const bal = balances[r] || 0
              return (
                <div key={r} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500/30 rounded-full flex items-center justify-center text-indigo-300 font-bold text-sm">
                      {r[0]}
                    </div>
                    <span className="text-white">{r}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${bal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {bal >= 0 ? '+' : ''}{formatCurrency(bal)}
                    </span>
                    <button onClick={() => removeRoommate(r)} className="text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add Roommate */}
        <form onSubmit={handleAddRoommate} className="flex gap-2 mt-4">
          <input
            type="text"
            value={newRoommate}
            onChange={(e) => setNewRoommate(e.target.value)}
            placeholder="Add roommate..."
            className="input-glass flex-1 text-sm"
          />
          <button type="submit" className="btn-primary text-sm px-3 py-2">Add</button>
        </form>
      </div>

      {/* Settlements */}
      {transactions.length > 0 && (
        <div className="glass p-5">
          <h3 className="font-semibold text-white mb-3">Who Owes What</h3>
          <div className="space-y-2">
            {transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <span className="text-white/80 text-sm">
                  <span className="text-red-400 font-medium">{t.from}</span>
                  {' → '}
                  <span className="text-green-400 font-medium">{t.to}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{formatCurrency(t.amount)}</span>
                  <a
                    href={generateWhatsAppLink([t])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors"
                    title="Share via WhatsApp"
                  >
                    <MessageCircle size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="glass p-5">
        <h3 className="font-semibold text-white mb-3">Recent Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-white/50 text-sm">No expenses yet. Add one in Split Expense.</p>
        ) : (
          <div className="space-y-2">
            {expenses.slice(-5).reverse().map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{e.description}</p>
                  <p className="text-white/50 text-xs">{e.paidBy} • {e.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{formatCurrency(e.amount)}</span>
                  <button onClick={() => deleteExpense(e.id)} className="text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

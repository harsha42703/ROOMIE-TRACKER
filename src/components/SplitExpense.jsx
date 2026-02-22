import { useState } from 'react'
import useStore from '../store'
import { formatCurrency } from '../utils'
import { PlusCircle, Check } from 'lucide-react'

const CATEGORIES = ['Rent', 'Groceries', 'Utilities', 'Internet', 'Dining', 'Entertainment', 'Transport', 'Other']

export default function SplitExpense() {
  const { roommates, expenses, addExpense } = useStore()
  const [form, setForm] = useState({
    description: '',
    amount: '',
    paidBy: roommates[0] || '',
    category: 'Other',
    splitAmong: roommates,
  })
  const [success, setSuccess] = useState(false)

  function togglePerson(person) {
    setForm((f) => ({
      ...f,
      splitAmong: f.splitAmong.includes(person)
        ? f.splitAmong.filter((p) => p !== person)
        : [...f.splitAmong, person],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.description || !form.amount || !form.paidBy || form.splitAmong.length === 0) return
    addExpense({
      description: form.description,
      amount: parseFloat(form.amount),
      paidBy: form.paidBy,
      category: form.category,
      splitAmong: form.splitAmong,
    })
    setForm({ description: '', amount: '', paidBy: roommates[0] || '', category: 'Other', splitAmong: roommates })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  const share = form.amount && form.splitAmong.length
    ? parseFloat(form.amount) / form.splitAmong.length
    : 0

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-bold text-white">Split Expense</h2>

      {roommates.length < 2 && (
        <div className="glass p-4 border-yellow-500/30 border">
          <p className="text-yellow-300 text-sm">Add at least 2 roommates from the Dashboard to split expenses.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
        <div>
          <label className="text-white/70 text-sm mb-1 block">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="e.g. Groceries run"
            className="input-glass w-full"
            required
          />
        </div>

        <div>
          <label className="text-white/70 text-sm mb-1 block">Amount ($)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="0.00"
            className="input-glass w-full"
            required
          />
        </div>

        <div>
          <label className="text-white/70 text-sm mb-1 block">Paid By</label>
          <select
            value={form.paidBy}
            onChange={(e) => setForm((f) => ({ ...f, paidBy: e.target.value }))}
            className="input-glass w-full"
          >
            {roommates.map((r) => <option key={r} value={r} className="bg-slate-800">{r}</option>)}
          </select>
        </div>

        <div>
          <label className="text-white/70 text-sm mb-1 block">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="input-glass w-full"
          >
            {CATEGORIES.map((c) => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-white/70 text-sm mb-2 block">Split Among</label>
          <div className="flex flex-wrap gap-2">
            {roommates.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => togglePerson(r)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  form.splitAmong.includes(r)
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {share > 0 && (
          <p className="text-white/60 text-sm">
            Each person pays: <span className="text-indigo-300 font-semibold">{formatCurrency(share)}</span>
          </p>
        )}

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
          {success ? <><Check size={16} /> Added!</> : <><PlusCircle size={16} /> Add Expense</>}
        </button>
      </form>

      {/* Expense List */}
      <div className="glass p-5">
        <h3 className="font-semibold text-white mb-3">All Expenses ({expenses.length})</h3>
        {expenses.length === 0 ? (
          <p className="text-white/50 text-sm">No expenses yet.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {[...expenses].reverse().map((e) => (
              <div key={e.id} className="py-2 border-b border-white/10 last:border-0">
                <div className="flex justify-between">
                  <span className="text-white text-sm font-medium">{e.description}</span>
                  <span className="text-white font-semibold text-sm">{formatCurrency(e.amount)}</span>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-white/50 text-xs">{e.paidBy} · {e.category}</span>
                  <span className="text-white/50 text-xs">÷ {e.splitAmong.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

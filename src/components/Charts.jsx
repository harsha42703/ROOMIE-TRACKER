import useStore from '../store'
import { groupByCategory } from '../utils'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f97316', '#14b8a6']

export default function Charts() {
  const { expenses, roommates } = useStore()

  const categoryData = Object.entries(groupByCategory(expenses)).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }))

  const roommateData = roommates.map((r) => ({
    name: r,
    paid: parseFloat(
      expenses.filter((e) => e.paidBy === r).reduce((s, e) => s + e.amount, 0).toFixed(2)
    ),
    share: parseFloat(
      expenses
        .filter((e) => e.splitAmong.includes(r))
        .reduce((s, e) => s + e.amount / e.splitAmong.length, 0)
        .toFixed(2)
    ),
  }))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Charts</h2>

      {expenses.length === 0 ? (
        <div className="glass p-8 text-center">
          <p className="text-white/50">No expenses yet. Add some to see charts.</p>
        </div>
      ) : (
        <>
          {/* Category Pie Chart */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Roommate Bar Chart */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-4">Paid vs. Share by Roommate</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={roommateData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                <Bar dataKey="paid" name="Paid" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="share" name="Fair Share" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

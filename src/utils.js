/**
 * Calculate balances between roommates based on expenses and settlements.
 * Returns an object mapping each person to their net balance (+owe them, -they owe).
 */
export function calculateBalances(expenses, roommates, settlements = []) {
  const balances = {}
  roommates.forEach((r) => (balances[r] = 0))

  expenses.forEach(({ paidBy, amount, splitAmong }) => {
    if (!splitAmong || splitAmong.length === 0) return
    const share = amount / splitAmong.length
    splitAmong.forEach((person) => {
      if (person !== paidBy) {
        balances[paidBy] = (balances[paidBy] || 0) + share
        balances[person] = (balances[person] || 0) - share
      }
    })
  })

  settlements.forEach(({ from, to, amount }) => {
    balances[from] = (balances[from] || 0) + amount
    balances[to] = (balances[to] || 0) - amount
  })

  return balances
}

/**
 * Simplify debts to minimum transactions.
 */
export function simplifyDebts(balances) {
  const creditors = []
  const debtors = []

  Object.entries(balances).forEach(([person, balance]) => {
    if (balance > 0.01) creditors.push({ person, amount: balance })
    else if (balance < -0.01) debtors.push({ person, amount: -balance })
  })

  const transactions = []

  while (creditors.length && debtors.length) {
    const creditor = creditors[0]
    const debtor = debtors[0]
    const amount = Math.min(creditor.amount, debtor.amount)

    transactions.push({ from: debtor.person, to: creditor.person, amount })

    creditor.amount -= amount
    debtor.amount -= amount

    if (creditor.amount < 0.01) creditors.shift()
    if (debtor.amount < 0.01) debtors.shift()
  }

  return transactions
}

/**
 * Format currency
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Group expenses by category
 */
export function groupByCategory(expenses) {
  return expenses.reduce((acc, expense) => {
    const cat = expense.category || 'Other'
    acc[cat] = (acc[cat] || 0) + expense.amount
    return acc
  }, {})
}

/**
 * Get expenses for a specific month (YYYY-MM)
 */
export function getMonthlyExpenses(expenses, month) {
  return expenses.filter((e) => e.date && e.date.startsWith(month))
}

/**
 * Generate a WhatsApp share link with a summary message
 */
export function generateWhatsAppLink(transactions, phone = '') {
  const lines = transactions.map(
    (t) => `${t.from} owes ${t.to} $${t.amount.toFixed(2)}`
  )
  const message = encodeURIComponent(
    `💸 Roomie Tracker Summary:\n${lines.join('\n')}`
  )
  return `https://wa.me/${phone}?text=${message}`
}

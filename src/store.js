import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Roommates
      roommates: ['Alice', 'Bob', 'Charlie'],
      addRoommate: (name) =>
        set((s) => ({ roommates: [...s.roommates, name] })),
      removeRoommate: (name) =>
        set((s) => ({ roommates: s.roommates.filter((r) => r !== name) })),

      // Expenses
      expenses: [],
      addExpense: (expense) =>
        set((s) => ({
          expenses: [
            ...s.expenses,
            { ...expense, id: crypto.randomUUID(), date: new Date().toISOString() },
          ],
        })),
      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      // Settlements
      settlements: [],
      addSettlement: (settlement) =>
        set((s) => ({
          settlements: [
            ...s.settlements,
            { ...settlement, id: crypto.randomUUID(), date: new Date().toISOString() },
          ],
        })),
    }),
    { name: 'roomie-tracker-storage' }
  )
)

export default useStore

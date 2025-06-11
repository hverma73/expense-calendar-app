import { createContext, useContext, useState } from 'react';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [monthData, setMonthData] = useState({});

  return <ExpenseContext.Provider value={{ monthData, setMonthData }}>{children}</ExpenseContext.Provider>;
};

export const useExpense = () => useContext(ExpenseContext);

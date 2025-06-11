// components/MonthExpenseModal.jsx
import React, { useState, useEffect } from 'react';
import '../styles/MonthExpenseModal.css'; // Ensure you have this CSS file for styling

const MonthExpenseModal = ({ visible, onClose, month, year, onSave }) => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState([{ category: '', amount: '' }]);

  const handleChange = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = field === 'amount' ? parseFloat(value) || '' : value;
    setExpenses(updated);
  };

  const handleAddRow = () => {
    setExpenses([...expenses, { category: '', amount: '' }]);
  };

  const handleRemoveRow = index => {
    const updated = [...expenses];
    updated.splice(index, 1);
    setExpenses(updated);
  };

  const totalExpense = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const remaining = (parseFloat(income) || 0) - totalExpense;

  const handleSubmit = () => {
    onSave({ income, expenses, remaining });
    onClose();
  };

  useEffect(() => {
    if (!visible) {
      setIncome('');
      setExpenses([{ category: '', amount: '' }]);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          Expenses of {month} {year}
        </h2>
        <label>Income:</label>
        <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="Enter income" />

        {expenses.map((e, index) => (
          <div className="expense-row" key={index}>
            <input
              type="text"
              placeholder="Category"
              value={e.category}
              onChange={e => handleChange(index, 'category', e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={e.amount}
              onChange={e => handleChange(index, 'amount', e.target.value)}
            />
            {index > 0 && <button onClick={() => handleRemoveRow(index)}>🗑</button>}
          </div>
        ))}

        <button className="add-row" onClick={handleAddRow}>
          + Add Expense
        </button>

        <div className="remaining">Remaining: ₹{remaining}</div>

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MonthExpenseModal;

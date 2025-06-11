import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import '../styles/TemplateModal.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6384', '#82ca9d'];

const TemplateModal = ({ show, onClose, onSave, selectedMonthKey, existingData }) => {
  const [fields, setFields] = useState([]);
  const [income, setIncome] = useState('');
  const [incomeFlag, setIncomeFlag] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (selectedMonthKey) {
      if (existingData) {
        setFields(existingData.expenses || []);
        setIncome(existingData.income?.toString() || '');
        setIncomeFlag(true);
      } else {
        setFields([
          { category: 'Rent', amount: '10000' },
          { category: 'Food', amount: '5000' },
          { category: 'Travel', amount: '3000' }
        ]);
        setIncome('');
        setIncomeFlag(false);
      }
      setShowChart(false);
    }
  }, [selectedMonthKey, existingData]);

  const addField = () => setFields([...fields, { category: '', amount: '' }]);

  const handleChange = (index, field, value) => {
    const newFields = [...fields];
    newFields[index][field] = value;
    setFields(newFields);
  };

  const removeField = index => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleOnSaveIncome = () => {
    if (income.trim() !== '' && !isNaN(Number(income))) {
      setIncomeFlag(true);
    }
  };

  const totalExpenses = fields.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const remainingIncome = parseFloat(income) - totalExpenses;

  const chartData = [
    ...fields.map(item => ({
      name: item.category || 'Unnamed',
      value: parseFloat(item.amount) || 0
    })),
    {
      name: 'Remaining',
      value: remainingIncome > 0 ? remainingIncome : 0
    }
  ];

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-body">
          <h2>Expense Category</h2>

          {!incomeFlag ? (
            <div className="form-row">
              <label style={{ color: 'black' }}>Income</label>
              <input
                type="number"
                value={income}
                onChange={e => setIncome(e.target.value)}
                placeholder="Enter income"
                style={{ color: 'black' }}
              />
              <button onClick={handleOnSaveIncome}>Save</button>
            </div>
          ) : (
            <div className="form-row">
              <label style={{ color: 'black' }}>Income:</label>
              <span style={{ fontWeight: 'bold', marginLeft: '0.5rem', color: 'black' }}>₹{income}</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontWeight: 'bold',
                  color: remainingIncome >= 0 ? 'green' : 'red'
                }}
              >
                Remaining: {remainingIncome >= 0 ? `₹${remainingIncome}` : `-₹${Math.abs(remainingIncome)}`}
              </span>
            </div>
          )}

          {incomeFlag && (
            <>
              {!showChart &&
                fields.map((item, index) => (
                  <div key={index} className="form-row">
                    <input
                      placeholder="Category"
                      value={item.category}
                      onChange={e => handleChange(index, 'category', e.target.value)}
                      style={{ color: 'black' }}
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={e => handleChange(index, 'amount', e.target.value)}
                      style={{ color: 'black' }}
                    />
                    {fields.length > 1 && (
                      <button className="remove-btn" onClick={() => removeField(index)}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {!showChart && (
                  <button className="add-btn" onClick={addField}>
                    + Add Field
                  </button>
                )}
                <button className="chart-btn" onClick={() => setShowChart(prev => !prev)}>
                  {showChart ? 'Hide Details' : 'Detailed Expenses'}
                </button>
              </div>

              {showChart && (
                <div className="chart-container" style={{ marginTop: '1rem' }}>
                  <PieChart width={320} height={320}>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              )}

              <div className="modal-actions">
                <button className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="save-btn"
                  onClick={() => {
                    const [month, year] = selectedMonthKey.split('-');
                    onSave(month, year, income, fields);
                  }}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;

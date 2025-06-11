import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import YearCalendar from './components/YearCalender';
import TemplateModal from './components/TemplateModal';
import './App.css';
import { useExpense } from './context/ExpenseContext';

function App() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');

  const { monthData, setMonthData } = useExpense();

  useEffect(() => {
    const fetchAllMonthData = async () => {
      try {
        const allData = await window.electron.ipcRenderer.invoke('get-all-months');
        setMonthData(allData || {});
      } catch (err) {
        console.error('Failed to load all months data:', err);
      }
    };

    fetchAllMonthData();
  }, []);

  const handleMonthClick = async (month, year) => {
    const existingData = await window.electron.ipcRenderer.invoke('get-month-data', { month, year });
    setSelectedMonth(`${month}-${year}`);
    setShowModal(true);

    console.log('Existing data for month:', existingData);

    if (existingData) {
      setMonthData(prev => ({
        ...prev,
        [`${month}-${year}`]: existingData
      }));
    }
  };

  const handleSaveTemplate = async (month, year, income, expenses) => {
    console.log('Saving template for:', month, year, income, expenses);
    const key = `${month}-${year}`;

    try {
      await window.electron.ipcRenderer.invoke('save-month-data', {
        month,
        year,
        income: parseFloat(income),
        expenses: expenses.map(item => ({
          category: item.category,
          amount: parseFloat(item.amount)
        }))
      });

      setMonthData(prev => ({
        ...prev,
        [key]: {
          income: Number(income),
          expenses
        }
      }));
    } catch (error) {
      console.error('Error saving month data to SQLite:', error);
    }

    setShowModal(false);
  };

  return (
    <>
      <Navbar
        year={year}
        onYearChange={delta => setYear(y => y + delta)}
        onOpenTemplate={() => setShowModal(true)}
        onReset={() => setYear(currentYear)}
      />
      <YearCalendar year={year} onMonthClick={handleMonthClick} monthData={monthData} />
      <TemplateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTemplate}
        selectedMonthKey={selectedMonth}
        existingData={monthData[selectedMonth]}
      />
    </>
  );
}

export default App;

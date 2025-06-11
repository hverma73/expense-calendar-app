import MonthCard from './MonthCard';
import '../styles/YearCalender.css';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const YearCalendar = ({ year, onMonthClick, monthData }) => {
  return (
    <div className="calendar-grid">
      {months.map(month => {
        const key = `${month}-${year}`;
        const data = monthData[key] || { income: 0, expenses: [] };
        const totalExpense = data.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

        return (
          <MonthCard
            key={key}
            month={month}
            year={year}
            income={data.income}
            expense={totalExpense}
            onClick={onMonthClick}
          />
        );
      })}
    </div>
  );
};

export default YearCalendar;

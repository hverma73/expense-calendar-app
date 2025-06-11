import '../styles/MonthCard.css';

const MonthCard = ({ month, year, income, expense, onClick }) => {
  const remaining = income - expense;
  const percentage = income > 0 ? Math.min((expense / income) * 100, 100) : 0;

  return (
    <div className="month-card" onClick={() => onClick(month, year)}>
      <h3>
        {month} {year}
      </h3>

      <div className="info-row">
        <span>Income:</span>
        <span>₹{income}</span>
      </div>

      <div className="info-row">
        <span>Expense:</span>
        <span>₹{expense}</span>
      </div>

      <div className="info-row">
        <span>Remaining:</span>
        <span style={{ color: remaining < 0 ? 'red' : 'black' }}>
          {remaining < 0 ? `-₹${Math.abs(remaining)}` : `₹${remaining}`}
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: percentage >= 100 ? 'red' : 'green'
          }}
        ></div>
      </div>
    </div>
  );
};

export default MonthCard;

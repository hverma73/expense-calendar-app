import '../styles/Navbar.css';

const Navbar = ({ year, onYearChange, onOpenTemplate, onReset }) => {
  return (
    <nav className="navbar">
      <div className="nav-left" onClick={onReset}>
        Expense Calendar
      </div>
      <div className="nav-center">
        <button className="template-button" onClick={onOpenTemplate}>
          Template
        </button>
      </div>
      <div className="nav-right">
        <button onClick={() => onYearChange(-1)}>‹</button>
        <span>{year}</span>
        <button onClick={() => onYearChange(1)}>›</button>
      </div>
    </nav>
  );
};

export default Navbar;

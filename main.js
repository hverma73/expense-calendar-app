import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(path.join(app.getPath('userData'), 'expense-calendar.db'));

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS months (
    id INTEGER PRIMARY KEY,
    month TEXT NOT NULL,
    year TEXT NOT NULL,
    income REAL
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY,
    month_id INTEGER,
    category TEXT,
    amount REAL,
    FOREIGN KEY(month_id) REFERENCES months(id) ON DELETE CASCADE
  )
`
).run();

console.log('Database initialized');
console.log('path', path.join(__dirname, 'preload.js'));

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (process.env.NODE_ENV === 'production') {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  } else {
    win.loadURL('http://localhost:5173');
  }
}

// IPC: Save month data
ipcMain.handle('save-month-data', (event, { month, year, income, expenses }) => {
  const insertMonth = db.prepare(`
    INSERT OR REPLACE INTO months (id, month, year, income)
    VALUES (
      (SELECT id FROM months WHERE month = ? AND year = ?),
      ?, ?, ?
    )
  `);
  insertMonth.run(month, year, month, year, income);

  const getMonthId = db.prepare(`SELECT id FROM months WHERE month = ? AND year = ?`);
  const monthRow = getMonthId.get(month, year);
  if (!monthRow) return;

  const monthId = monthRow.id;

  const deleteOld = db.prepare(`DELETE FROM expenses WHERE month_id = ?`);
  deleteOld.run(monthId);

  const insertExpense = db.prepare(`
    INSERT INTO expenses (month_id, category, amount)
    VALUES (?, ?, ?)
  `);
  const insertMany = db.transaction(items => {
    for (const { category, amount } of items) {
      insertExpense.run(monthId, category, amount);
    }
  });

  insertMany(expenses);
});

ipcMain.handle('get-month-data', (event, { month, year }) => {
  const getMonth = db.prepare(`SELECT id, income FROM months WHERE month = ? AND year = ?`);
  const monthRow = getMonth.get(month, year);

  if (!monthRow) return null;
  const getExpenses = db.prepare(`SELECT category, amount FROM expenses WHERE month_id = ?`);
  const expenses = getExpenses.all(monthRow.id);

  return {
    income: monthRow.income,
    expenses
  };
});

ipcMain.handle('get-all-months', () => {
  const rows = db
    .prepare(
      `
    SELECT m.month, m.year, m.income, e.category, e.amount
    FROM months m
    LEFT JOIN expenses e ON m.id = e.month_id
  `
    )
    .all();

  const grouped = {};

  for (const row of rows) {
    const key = `${row.month}-${row.year}`;
    if (!grouped[key]) {
      grouped[key] = {
        income: row.income,
        expenses: []
      };
    }
    if (row.category && row.amount !== null) {
      grouped[key].expenses.push({
        category: row.category,
        amount: row.amount
      });
    }
  }

  return grouped;
});

// Ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

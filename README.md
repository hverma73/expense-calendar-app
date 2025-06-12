# 📅 Expense Calendar App

The **Expense Calendar App** is a **desktop budgeting and expense tracking tool** designed to simplify your personal finance management. Rather than using complex spreadsheets or cloud-based tools, this app gives you a **clear month-by-month view** of your income and spending habits — all stored locally and securely on your device.

Think of it as your personal financial calendar where you can track how much you earn, how much you spend, where your money goes, and how much is left — all visualized beautifully through charts and color-coded calendar cards.

---

## ✨ Features

Here’s what makes this app useful:

- 📆 **Yearly Calendar Overview**  
  Navigate through all 12 months in a calendar-style layout. Each month card displays how much money remains after expenses — color-coded to quickly identify your financial health.

- 💸 **Dynamic Expense Entry**  
  Add as many expense categories as you need per month. Whether it’s Rent, Groceries, Internet, or Travel — you can define your own categories with exact amounts.

- 💰 **Income Management**  
  Set a different income for each month. The app automatically calculates how much you have left after subtracting your expenses.

- 📊 **Detailed Visual Charts**  
  With one click, visualize your expenses in a **pie chart** — instantly see which categories are consuming most of your income.

- 🗃️ **Data Persistence (SQLite)**  
  Your data is stored locally in a lightweight and efficient **SQLite** database. Nothing is stored online. Your financial data is yours — private and offline.

- 🖥️ **Cross-Platform Desktop App**  
  Built using **Electron**, this app runs on Windows, macOS, and Linux — no need for browsers or cloud accounts.

---

## 🛠️ Tech Stack

This app is powered by:

- ⚛️ **React.js** – For building a responsive, modular user interface.
- ⚡ **Electron.js** – Turns the web app into a native desktop application.
- 🗃️ **SQLite** – Stores all your data persistently on your device.
- 📈 **Recharts** – Renders dynamic, responsive pie charts for data visualization.
- 📦 **Node.js** – Provides backend logic and filesystem access within Electron.

---

## 🚀 Getting Started

Here’s how to install and run the app locally.

### Prerequisites

Ensure the following tools are installed on your machine:

- [Node.js](https://nodejs.org/) – JavaScript runtime (v16+ recommended)
- [npm](https://www.npmjs.com/) – Comes with Node.js, used to install dependencies
- [Git](https://git-scm.com/) – For cloning the repository

---

### 📥 Clone the Repository

```bash
git clone https://github.com/hverma73/expense-calendar-app.git
cd expense-calendar-app
```

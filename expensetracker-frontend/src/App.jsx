import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function App() {
  const [salaryMonth, setSalaryMonth] = useState('');
  const [salary, setSalary] = useState('');
  const [salariesList, setSalariesList] = useState([]);
  const [editingSalaryId, setEditingSalaryId] = useState(null);

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const months = ['May', 'June', 'July', 'August'];

  useEffect(() => {
    fetchSalaries();
    fetchExpenses();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/salaries');
      setSalariesList(res.data);
    } catch (err) {
      console.error('Failed to fetch salaries:', err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    if (!salary || !salaryMonth) return;

    try {
      if (editingSalaryId) {
        await axios.put(`http://localhost:5000/api/salaries/${editingSalaryId}`, {
          month: salaryMonth,
          amount: parseFloat(salary),
        });
      } else {
        await axios.post('http://localhost:5000/api/salaries', {
          month: salaryMonth,
          amount: parseFloat(salary),
        });
      }
      fetchSalaries();
      setSalary('');
      setSalaryMonth('');
      setEditingSalaryId(null);
    } catch (err) {
      console.error('Failed to save salary:', err);
    }
  };

  const handleEditSalary = (salary) => {
    setSalaryMonth(salary.month);
    setSalary(salary.amount);
    setEditingSalaryId(salary._id);
  };

  const handleDeleteSalary = async (id) => {
    await axios.delete(`http://localhost:5000/api/salaries/${id}`);
    fetchSalaries();
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!desc || !amount || !date) return;

    const month = new Date(date).toLocaleString('default', { month: 'long' });

    try {
      if (editingExpenseId) {
        await axios.put(`http://localhost:5000/api/expenses/${editingExpenseId}`, {
          description: desc,
          amount: parseFloat(amount),
          date,
          month
        });
      } else {
        await axios.post('http://localhost:5000/api/expenses', {
          description: desc,
          amount: parseFloat(amount),
          date,
          month
        });
      }
      fetchExpenses();
      setDesc('');
      setAmount('');
      setDate('');
      setEditingExpenseId(null);
    } catch (err) {
      console.error('Failed to save expense:', err);
    }
  };

  const handleEditExpense = (exp) => {
    setDesc(exp.description);
    setAmount(exp.amount);
    setDate(exp.date);
    setEditingExpenseId(exp._id);
  };

  const handleDeleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    fetchExpenses();
  };

  const savingsData = months.map((month) => {
    const monthlyExpenses = expenses
      .filter((e) => e.month === month)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const income = salariesList.find((s) => s.month === month)?.amount || 0;
    const savings = income - monthlyExpenses;

    return {
      month,
      savings: savings > 0 ? savings : 0,
    };
  });

  return (
    <div className="bg-dark text-white min-vh-100 p-4">
      <div className="container">

        {/* Salary Form + Salary List Side by Side */}
        <div className="row mb-4">
          {/* Salary Form */}
          <div className="col-md-6">
            <div className="card bg-secondary text-white h-100">
              <div className="card-header">{editingSalaryId ? 'Edit' : 'Enter'} Salary</div>
              <div className="card-body">
                <form onSubmit={handleSalarySubmit}>
                  <div className="mb-3">
                    <label className="form-label">Month</label>
                    <select
                      className="form-select"
                      value={salaryMonth}
                      onChange={(e) => setSalaryMonth(e.target.value)}
                    >
                      <option value="">Choose month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Salary (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <button type="submit" className="btn btn-light w-100">
                    {editingSalaryId ? 'Update' : 'Save'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Salary List */}
          {salariesList.length > 0 && (
            <div className="col-md-6">
              <div className="card bg-secondary text-white h-100">
                <div className="card-header">Salary List</div>
                <div className="card-body p-0">
                  <table className="table table-dark mb-0">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Amount (₹)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salariesList.map((s) => (
                        <tr key={s._id}>
                          <td>{s.month}</td>
                          <td>{s.amount}</td>
                          <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditSalary(s)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSalary(s._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Expense Input Form */}
        <div className="row">
          <div className="col-md-12">
            <div className="card bg-secondary text-white mb-4">
              <div className="card-header">{editingExpenseId ? 'Edit' : 'Add'} Daily Expense</div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleExpenseSubmit}>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Description"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">
                      {editingExpenseId ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Expense List */}
        {expenses.length > 0 && (
          <div className="row">
            <div className="col-md-12">
              <div className="card bg-secondary text-white mb-4">
                <div className="card-header">Expense List</div>
                <div className="card-body p-0">
                  <table className="table table-dark table-striped mb-0">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount (₹)</th>
                        <th>Date</th>
                        <th>Month</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((exp) => (
                        <tr key={exp._id}>
                          <td>{exp.description}</td>
                          <td>{exp.amount}</td>
                          <td>{exp.date}</td>
                          <td>{exp.month}</td>
                          <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditExpense(exp)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteExpense(exp._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Savings Chart at the Bottom */}
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card bg-secondary text-white mb-4">
              <div className="card-header">Savings (Last 3 Months)</div>
              <div className="card-body bg-white">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={savingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="savings" fill="#007bff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;

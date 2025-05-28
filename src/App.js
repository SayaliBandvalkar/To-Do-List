import React, { useState, useEffect } from 'react';
import { FaPlus, FaClipboardList, FaTrash, FaCheck, FaEdit } from 'react-icons/fa';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addOrEditTask = () => {
    if (newTask.trim()) {
      const updatedTask = {
        text: newTask,
        completed: false,
        category,
        priority,
        dueDate
      };

      if (editingIndex !== null) {
        const updated = [...tasks];
        updated[editingIndex] = { ...updated[editingIndex], ...updatedTask };
        setTasks(updated);
        setEditingIndex(null);
      } else {
        setTasks([...tasks, updatedTask]);
      }

      setNewTask('');
      setCategory('General');
      setPriority('Medium');
      setDueDate('');
    }
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const startEdit = (index) => {
    const task = tasks[index];
    setNewTask(task.text);
    setCategory(task.category);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setEditingIndex(index);
  };

  const filteredTasks = tasks
    .filter(task => filterCategory === 'All' || task.category === filterCategory)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Tasks',
        data: [tasks.filter(t => t.completed).length, tasks.filter(t => !t.completed).length],
        // backgroundColor: ['#28a745', '#dc3545'],
        backgroundColor: ['rgba(40, 167, 69, 0.5)', 'rgba(220, 53, 69, 0.5)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="app-container">
      <div className="todo-card">
        <h3 className="mb-4 text-primary fw-bold">
          <FaClipboardList className="me-2" /> To-Do List
        </h3>

        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Add your task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2 mb-3">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>General</option>
            <option>Work</option>
            <option>Personal</option>
            <option>Study</option>
          </select>

          <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button className="btn btn-success" onClick={addOrEditTask}>
            {editingIndex !== null ? 'Update' : <FaPlus />}
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Filter by Category:</label>
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option>All</option>
            <option>General</option>
            <option>Work</option>
            <option>Personal</option>
            <option>Study</option>
          </select>
        </div>

        <ul className="list-group">
          {filteredTasks.map((task, index) => (
            <li
              key={index}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                task.completed ? 'list-group-item-success' : ''
              }`}
            >
              <div>
                <span
                  onClick={() => toggleTask(index)}
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {task.text}
                </span>
                <div className="text-muted small">
                  {task.category} | Priority: {task.priority} | Due: {task.dueDate || 'N/A'}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => toggleTask(index)}
                >
                  <FaCheck />
                </button>
                <button
                  className="btn btn-sm btn-outline-warning me-2"
                  onClick={() => startEdit(index)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteTask(index)}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <h5 className="fw-bold">📊 Task Completion Stats</h5>
          <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
          <Pie data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { CheckSquare, Clock, Edit2, Trash2, Plus, X } from 'lucide-react';

function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Update homepage layout', assignee: 'Emma Stone', status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Fix bug in login page', assignee: 'Liam Johnson', status: 'Pending', priority: 'Medium' },
    { id: 3, title: 'Design new employee onboarding', assignee: 'Sophia Turner', status: 'Completed', priority: 'High' },
    { id: 4, title: 'Write API documentation', assignee: 'Michael Brown', status: 'In Progress', priority: 'Low' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', assignee: '', status: 'Pending', priority: 'Medium' });

  const handleAddClick = () => {
    setCurrentTask(null);
    setFormData({ title: '', assignee: '', status: 'Pending', priority: 'Medium' });
    setIsModalOpen(true);
  };

  const handleEditClick = (task) => {
    setCurrentTask(task);
    setFormData({ title: task.title, assignee: task.assignee, status: task.status, priority: task.priority });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTask) {
      setTasks(tasks.map(t => t.id === currentTask.id ? { ...t, ...formData } : t));
    } else {
      setTasks([...tasks, { id: Date.now(), ...formData }]);
    }
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-toolbar">
        <div className="toolbar-title">
          <CheckSquare className="toolbar-icon" size={24} />
          <span>Employee Tasks ({tasks.length})</span>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-primary" onClick={handleAddClick}>
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>
      
      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">No tasks found.</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td className="font-medium">{task.title}</td>
                  <td>{task.assignee}</td>
                  <td>
                    <span className={`badge ${task.priority === 'High' ? 'badge-contract' : task.priority === 'Medium' ? 'badge-part-time' : 'badge-full-time'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} className="text-muted" />
                      <span>{task.status}</span>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn-icon-action" onClick={() => handleEditClick(task)} title="Edit Task">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon-action delete" onClick={() => handleDeleteClick(task.id)} title="Delete Task">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>
                {currentTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Update Database"
                />
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <input 
                  type="text" 
                  name="assignee" 
                  value={formData.assignee} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Emma Stone"
                />
              </div>
              
              <div className="form-group">
                <label>Priority</label>
                <select 
                  name="priority" 
                  value={formData.priority} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'var(--text-main)' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'var(--text-main)' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="modal-actions" style={{ borderTop: 'none', paddingTop: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;

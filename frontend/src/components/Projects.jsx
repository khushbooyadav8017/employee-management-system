import { useState } from 'react';
import { Briefcase, Clock, Edit2, Trash2, Plus, X } from 'lucide-react';

function Projects() {
  const [projects, setProjects] = useState([
    { id: 1, title: 'Opndoo Studio Redesign', assignee: 'Khushboo', status: 'In Progress', budget: '$12,000' },
    { id: 2, title: 'E-commerce App', assignee: 'Liam Johnson', status: 'Pending', budget: '$8,500' },
    { id: 3, title: 'Marketing Campaign UX', assignee: 'Emma Stone', status: 'Completed', budget: '$5,000' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', assignee: '', status: 'Pending', budget: '' });

  const handleAddClick = () => {
    setCurrentProject(null);
    setFormData({ title: '', assignee: '', status: 'Pending', budget: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (project) => {
    setCurrentProject(project);
    setFormData({ title: project.title, assignee: project.assignee, status: project.status, budget: project.budget });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentProject) {
      setProjects(projects.map(p => p.id === currentProject.id ? { ...p, ...formData } : p));
    } else {
      setProjects([...projects, { id: Date.now(), ...formData }]);
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
          <Briefcase className="toolbar-icon" size={24} />
          <span>Company Projects ({projects.length})</span>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-primary" onClick={handleAddClick}>
            <Plus size={16} /> Add Project
          </button>
        </div>
      </div>
      
      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Project Title</th>
              <th>Assigned To</th>
              <th>Budget / Scope</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">No projects found.</td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="font-medium" style={{ color: 'var(--text-main)' }}>{project.title}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.assignee}`} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-color)'}} alt="" />
                      <span>{project.assignee}</span>
                    </div>
                  </td>
                  <td className="text-muted">{project.budget}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} className="text-muted" />
                      <span>{project.status}</span>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn-icon-action" onClick={() => handleEditClick(project)} title="Edit Project">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon-action delete" onClick={() => handleDeleteClick(project.id)} title="Delete Project">
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
                {currentProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label>Project Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Website Redesign"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Assign to Team Member</label>
                <input 
                  type="text" 
                  name="assignee" 
                  value={formData.assignee} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Khushboo"
                />
              </div>
              
              <div className="form-group">
                <label>Budget / Scope (Optional)</label>
                <input 
                  type="text" 
                  name="budget" 
                  value={formData.budget} 
                  onChange={handleChange} 
                  placeholder="e.g. $10,000"
                />
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
                  {currentProject ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;

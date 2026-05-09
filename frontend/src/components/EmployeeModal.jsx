import { useState, useEffect } from 'react';
import api from '../api';

function EmployeeModal({ employee, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    leaveTaken: 0,
  });

  useEffect(() => {
    if (employee) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        leaveTaken: employee.leaveTaken || 0,
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        await api.put(`/employees/${employee._id}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save employee', error);
      alert(error.response?.data?.message || 'Failed to save employee');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Doe" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@example.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 890" />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required placeholder="Engineering" />
            </div>
            <div className="form-group">
              <label>Position</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} required placeholder="Senior Developer" />
            </div>
            <div className="form-group">
              <label>Salary</label>
              <input type="number" name="salary" value={formData.salary} onChange={handleChange} required placeholder="120000" />
            </div>
            <div className="form-group">
              <label>Leave Taken</label>
              <input type="number" name="leaveTaken" value={formData.leaveTaken} onChange={handleChange} required placeholder="0" min="0" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{employee ? 'Save Changes' : 'Add Employee'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeModal;

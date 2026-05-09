import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await api.get(`/employees/${id}`);
        setEmployee(data);
      } catch (error) {
        console.error('Failed to fetch employee details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading employee details...</div>;
  }

  if (!employee) {
    return (
      <div className="employee-detail-container">
        <h2>Employee not found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const displayId = employee.employeeId || 'EMP-' + employee._id.substring(employee._id.length - 4).toUpperCase();

  return (
    <div className="employee-detail-wrapper">
      <div className="employee-detail-card">
        <div className="detail-header">
          <div className="detail-avatar">
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2>{employee.name}</h2>
            <span className="badge badge-dept">{employee.department}</span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-group">
            <span className="detail-label">Employee ID</span>
            <span className="detail-value">{displayId}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Email Address</span>
            <span className="detail-value">{employee.email}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Phone Number</span>
            <span className="detail-value">{employee.phone}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Position</span>
            <span className="detail-value">{employee.position}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Salary</span>
            <span className="detail-value">${employee.salary?.toLocaleString() || '0'}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Leave Taken</span>
            <span className="detail-value">{employee.leaveTaken || '0'} days</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Profile Created</span>
            <span className="detail-value">{new Date(employee.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="detail-footer">
          <Link to="/" className="btn btn-outline btn-full">
            ← Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;

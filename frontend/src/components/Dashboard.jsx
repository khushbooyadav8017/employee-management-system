import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import EmployeeModal from './EmployeeModal.jsx';
import { Users, Search, Download, Filter, ArrowUpDown, Edit2, Trash2 } from 'lucide-react';

function Dashboard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterDept, setFilterDept] = useState('All');

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [location.search]);

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Failed to delete employee', error);
      }
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchEmployees();
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Email,Department,Position,Salary,Leave Taken,Status\n"
      + employees.map(emp => `"${emp.employeeId || emp._id}","${emp.name}","${emp.email}","${emp.department}","${emp.position}","${emp.salary}","${emp.leaveTaken || 0}","${emp.status || 'Full Time'}"`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = () => {
    if (sortBy === 'name') { setSortBy('department'); setSortOrder('asc'); }
    else if (sortBy === 'department') { setSortBy('name'); setSortOrder('desc'); }
    else { setSortBy('name'); setSortOrder('asc'); }
  };

  const departments = ['All', ...new Set(employees.map(e => e.department))];

  // Apply Search -> Filter -> Sort
  const processedEmployees = employees
    .filter(emp => 
      (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       emp.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterDept === 'All' || emp.department === filterDept)
    )
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      else if (valA == null) valA = '';
      if (typeof valB === 'string') valB = valB.toLowerCase();
      else if (valB == null) valB = '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const getStatusBadge = (status = 'Full Time') => {
    const s = status.toLowerCase();
    if (s.includes('full')) return 'badge-full-time';
    if (s.includes('part')) return 'badge-part-time';
    if (s.includes('contract')) return 'badge-contract';
    if (s.includes('freelance')) return 'badge-freelance';
    return 'badge-full-time';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <div className="dashboard-toolbar">
          <div className="toolbar-title">
            <Users className="toolbar-icon" size={24} />
            <span>Total Employee: {employees.length}</span>
          </div>

          <div className="toolbar-actions">
            <div className="search-input-wrapper">
              <Search size={16} color="#A3AED0" />
              <input 
                type="text" 
                placeholder="Search name or email" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button className="btn-icon-text" onClick={handleExport} title="Export to CSV">
              <Download size={16} /> Export
            </button>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <select 
                value={filterDept} 
                onChange={(e) => setFilterDept(e.target.value)}
                style={{ 
                  appearance: 'none', background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  paddingLeft: '1.5rem'
                }}
                className="btn-icon-text"
              >
                {departments.map(dept => <option key={dept} value={dept}>{dept === 'All' ? 'Filter' : dept}</option>)}
              </select>
              <Filter size={16} style={{ position: 'absolute', left: '16px', top: '10px', pointerEvents: 'none', color: 'var(--primary)' }} />
            </div>
            <button className="btn-icon-text" onClick={handleSort} title={`Sort by ${sortBy}`}>
              <ArrowUpDown size={16} /> Sort ({sortBy === 'name' ? 'Name' : 'Dept'})
            </button>
            <button className="btn btn-primary" onClick={handleAddEmployee} style={{ marginLeft: '1rem' }}>
              + Add Employee
            </button>
          </div>
        </div>

        <div className="employee-table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>
                  <div className="th-content">
                    <input type="checkbox" />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    ID
                  </div>
                </th>
                <th>
                  <div className="th-content" onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} style={{cursor: 'pointer'}}>
                    Name <ArrowUpDown size={12} opacity={sortBy === 'name' ? 1 : 0.3} />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    Email
                  </div>
                </th>
                <th>
                  <div className="th-content" onClick={() => { setSortBy('department'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} style={{cursor: 'pointer'}}>
                    Department <ArrowUpDown size={12} opacity={sortBy === 'department' ? 1 : 0.3} />
                  </div>
                </th>
                <th>
                  <div className="th-content" onClick={() => { setSortBy('salary'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} style={{cursor: 'pointer'}}>
                    Salary <ArrowUpDown size={12} opacity={sortBy === 'salary' ? 1 : 0.3} />
                  </div>
                </th>
                <th>
                  <div className="th-content" onClick={() => { setSortBy('leaveTaken'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} style={{cursor: 'pointer'}}>
                    Leave Taken <ArrowUpDown size={12} opacity={sortBy === 'leaveTaken' ? 1 : 0.3} />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    Status
                  </div>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {processedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">No employees found.</td>
                </tr>
              ) : (
                processedEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td className="text-muted text-sm">
                      {emp.employeeId ? emp.employeeId.toUpperCase() : emp._id.slice(-6).toUpperCase()}
                    </td>
                    <td>
                      <Link to={`/employee/${emp._id}`} className="employee-profile-cell">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} alt={emp.name} />
                        <span className="font-medium">{emp.name}</span>
                      </Link>
                    </td>
                    <td className="text-muted">{emp.email}</td>
                    <td className="text-muted">{emp.department}</td>
                    <td className="text-muted">${emp.salary?.toLocaleString() || '0'}</td>
                    <td className="text-muted">{emp.leaveTaken || '0'}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(emp.status)}`}>
                        {emp.status || 'Full Time'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn-icon-action" onClick={() => handleEditEmployee(emp)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon-action delete" onClick={() => handleDeleteEmployee(emp._id)}>
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
      </div>

      {isModalOpen && (
        <EmployeeModal 
          employee={currentEmployee} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleModalSuccess} 
        />
      )}
    </div>
  );
}

export default Dashboard;

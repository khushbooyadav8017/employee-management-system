import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import api from '../api';

function Analytics() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await api.get('/employees');
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Calculate Real-Time Stats
  const activeEmployees = employees.length;
  const totalPayroll = employees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);
  const departmentsCount = new Set(employees.map(emp => emp.department)).size;
  const avgSalary = activeEmployees > 0 ? (totalPayroll / activeEmployees) : 0;

  const statCards = [
    { title: 'Total Payroll', value: `$${totalPayroll.toLocaleString()}`, trend: 'Expense', icon: DollarSign, isUp: false },
    { title: 'Active Employees', value: activeEmployees, trend: 'Current', icon: Users, isUp: true },
    { title: 'Avg Salary', value: `$${Math.round(avgSalary).toLocaleString()}`, trend: 'Company Avg', icon: Activity, isUp: true },
    { title: 'Departments', value: departmentsCount, trend: 'Total Teams', icon: TrendingUp, isUp: true },
  ];

  if (isLoading) {
    return <div className="text-center py-4 text-muted">Loading Analytics...</div>;
  }

  return (
    <div className="dashboard-card" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
      <div className="dashboard-toolbar" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="toolbar-title">
          <BarChart3 className="toolbar-icon" size={24} />
          <span>Real-Time Organization Analytics</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {statCards.map((stat, index) => (
          <div key={index} style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} color="var(--primary)" />
            </div>
            <div>
              <p className="text-muted text-sm">{stat.title}</p>
              <h3 style={{ fontSize: '1.5rem', margin: '0.25rem 0', color: 'var(--text-main)' }}>{stat.value}</h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: stat.isUp ? '#10B981' : '#A3AED0' }}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1.25rem', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <BarChart3 size={64} className="text-muted" style={{ marginBottom: '1rem', opacity: 0.2 }} />
        <h3 className="text-muted">Interactive Charts Coming Soon</h3>
        <p className="text-muted text-sm">Visual representations of the `{activeEmployees}` employee records will appear here.</p>
      </div>
    </div>
  );
}

export default Analytics;

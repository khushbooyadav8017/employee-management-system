import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Plus, Trash2 } from 'lucide-react';
import api from '../api';
import EmployeeModal from './EmployeeModal.jsx';

function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTeam = async () => {
    try {
      const { data } = await api.get('/employees');
      setTeamMembers(data);
    } catch (error) {
      console.error('Failed to fetch team members', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchTeam();
      } catch (error) {
        console.error('Failed to delete team member', error);
      }
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchTeam();
  };

  if (isLoading) {
    return <div className="text-center py-4 text-muted">Loading Team Directory...</div>;
  }

  return (
    <div className="dashboard-card" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
      <div className="dashboard-toolbar" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="toolbar-title">
          <Users className="toolbar-icon" size={24} />
          <span>Real-Time Team Directory ({teamMembers.length})</span>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Team Member
          </button>
        </div>
      </div>

      {teamMembers.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', padding: '3rem', borderRadius: '1.25rem', textAlign: 'center' }}>
          <p className="text-muted">No team members found in the database. Add some from the Dashboard!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {teamMembers.map((member) => (
            <div key={member._id} style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1.25rem', textAlign: 'center', position: 'relative' }}>
              <span className={`badge ${member.status?.toLowerCase().includes('part') ? 'badge-part-time' : 'badge-full-time'}`} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                {member.department}
              </span>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} 
                alt={member.name}
                style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-color)', marginBottom: '1rem' }}
              />
              <h3 style={{ margin: '0.5rem 0', color: 'var(--text-main)' }}>{member.name}</h3>
              <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>{member.position}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <a href={`mailto:${member.email}`} className="btn-icon-text" style={{ padding: '0.5rem', borderRadius: '50%', display: 'inline-flex' }} title={member.email}>
                  <Mail size={16} />
                </a>
                <a href={`tel:${member.phone}`} className="btn-icon-text" style={{ padding: '0.5rem', borderRadius: '50%', display: 'inline-flex' }} title={member.phone}>
                  <Phone size={16} />
                </a>
                <button onClick={() => handleDelete(member._id)} className="btn-icon-action delete" style={{ padding: '0.5rem', borderRadius: '50%', display: 'inline-flex', background: 'transparent', border: 'none' }} title="Delete Member">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <EmployeeModal 
          employee={null} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleModalSuccess} 
        />
      )}
    </div>
  );
}

export default Team;

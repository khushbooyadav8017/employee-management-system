import { useState, useEffect } from 'react';
import { HelpCircle, FileText, MessageSquare, ExternalLink, Activity, X } from 'lucide-react';
import api from '../api';

function Help() {
  const [latency, setLatency] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });

  useEffect(() => {
    const checkStatus = async () => {
      const start = Date.now();
      try {
        await api.get('/employees'); // simple ping
        setLatency(Date.now() - start);
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };
    checkStatus();
    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(`Your support ticket regarding "${contactForm.subject}" has been successfully submitted to our team! We will respond shortly.`);
    setIsContactModalOpen(false);
    setContactForm({ subject: '', message: '' });
  };

  const faqs = [
    { q: 'How do I add a new employee?', a: 'Navigate to the Dashboard and click the "+ Add Employee" button in the top right corner. Fill out the required details and click "Add Employee" to save to the database.' },
    { q: 'Can I export the employee list?', a: 'Yes! On the Dashboard, click the "Export" button. This will automatically download a CSV file containing all currently filtered employee records.' },
    { q: 'Why are some features marked as coming soon?', a: 'This dashboard is actively being developed. Features like advanced interactive Analytics are on the roadmap for future releases.' },
  ];

  return (
    <div className="dashboard-card" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
      <div className="dashboard-toolbar" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="toolbar-title">
          <HelpCircle className="toolbar-icon" size={24} />
          <span>Help Center</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <HelpCircle size={16} color="var(--primary)" />
                  {faq.q}
                </h4>
                <p className="text-muted text-sm" style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.5' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem', border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color={isOnline ? '#10B981' : '#EF4444'} />
              System Status
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted text-sm">Database API</span>
              <span className={`badge ${isOnline ? 'badge-full-time' : 'badge-freelance'}`} style={{ color: isOnline ? '#10B981' : '#EF4444', background: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            {latency !== null && isOnline && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Response Time: <strong style={{ color: 'var(--text-main)'}}>{latency}ms</strong>
              </div>
            )}
          </div>

          <div style={{ background: 'var(--primary)', color: 'white', padding: '2rem', borderRadius: '1.25rem', textAlign: 'center' }}>
            <MessageSquare size={32} style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Need Support?</h3>
            <p style={{ fontSize: '0.875rem', margin: '0 0 1.5rem 0', opacity: 0.9 }}>Our team is available 24/7 to help you with any issues.</p>
            <button 
              className="btn" 
              onClick={() => setIsContactModalOpen(true)}
              style={{ background: 'white', color: 'var(--primary)', width: '100%', fontWeight: 600 }}
            >
              Contact Support
            </button>
          </div>

          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0' }}>Documentation</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Getting Started Guide', icon: FileText },
                { label: 'API Reference', icon: ExternalLink },
                { label: 'Release Notes', icon: FileText }
              ].map((doc, i) => (
                <li key={i} style={{ padding: '0.75rem 0', borderBottom: i === 2 ? 'none' : '1px solid var(--border-color)' }}>
                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                    <doc.icon size={16} color="var(--primary)" />
                    {doc.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isContactModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>Create Support Ticket</h2>
              <button className="close-btn" onClick={() => setIsContactModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleContactSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Issue Subject</label>
                <input 
                  type="text" 
                  required 
                  placeholder="E.g. Unable to export employees"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Detailed Description</label>
                <textarea 
                  required 
                  placeholder="Please describe your issue in detail..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'var(--text-main)', minHeight: '120px', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsContactModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Help;

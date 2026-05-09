function Placeholder({ title, icon: Icon, description }) {
  return (
    <div className="dashboard-card" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {Icon && <Icon size={64} className="text-muted" style={{ marginBottom: '1rem', opacity: 0.5 }} />}
      <h2 style={{ color: 'var(--text-muted)' }}>{title}</h2>
      <p className="text-muted text-sm mt-2">{description}</p>
    </div>
  );
}

export default Placeholder;

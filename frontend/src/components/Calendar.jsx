import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const numDays = new Date(year, month + 1, 0).getDate();
  const offset = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: numDays }, (_, i) => i + 1);

  // Initialize events relative to current month so user sees dummy data right away
  const [events, setEvents] = useState([
    { id: 1, dateStr: `${year}-${month}-12`, title: 'Team Mtg', color: '#10B981' },
    { id: 2, dateStr: `${year}-${month}-15`, title: 'Project Due', color: 'var(--primary)' },
    { id: 3, dateStr: `${year}-${month}-22`, title: 'Emma Off', color: '#F59E0B' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateObj, setSelectedDateObj] = useState(null); // stores { year, month, date }
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventColor, setNewEventColor] = useState('var(--primary)');

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleDayClick = (date) => {
    setSelectedDateObj({ year, month, date });
    setNewEventTitle('');
    setIsModalOpen(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEventTitle.trim() === '') return;
    
    const dStr = `${selectedDateObj.year}-${selectedDateObj.month}-${selectedDateObj.date}`;
    setEvents([...events, {
      id: Date.now(),
      dateStr: dStr,
      title: newEventTitle,
      color: newEventColor
    }]);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (e, eventId) => {
    e.stopPropagation(); // Prevent triggering the day click
    if (window.confirm('Remove this event?')) {
      setEvents(events.filter(ev => ev.id !== eventId));
    }
  };

  // Determine actual today to highlight properly
  const realToday = new Date();
  const isActualToday = (d) => {
    return realToday.getFullYear() === year && 
           realToday.getMonth() === month && 
           realToday.getDate() === d;
  };

  // For testing styling, fallback to 15 if actual today is not in this month
  const displayToday = realToday.getFullYear() === year && realToday.getMonth() === month 
    ? realToday.getDate() 
    : 15; 

  return (
    <div className="dashboard-card">
      <div className="dashboard-toolbar" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="toolbar-title">
          <CalendarDays className="toolbar-icon" size={24} />
          <span>{monthName} {year}</span>
        </div>
        <div className="toolbar-actions">
          <button className="btn-icon-text" onClick={handlePrevMonth}><ChevronLeft size={16} /></button>
          <button className="btn btn-primary" onClick={handleToday}>Today</button>
          <button className="btn-icon-text" onClick={handleNextMonth}><ChevronRight size={16} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>
        {days.map(day => (
          <div key={day} style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{day}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
        {Array(offset).fill(null).map((_, i) => (
          <div key={`empty-${i}`} style={{ minHeight: '100px', background: 'var(--bg-color)', borderRadius: '0.5rem', opacity: 0.5 }}></div>
        ))}
        {dates.map(date => {
          const dStr = `${year}-${month}-${date}`;
          const dayEvents = events.filter(e => e.dateStr === dStr);
          const isToday = isActualToday(date) || (displayToday === date && realToday.getMonth() !== month); // Hilight dummy today if month doesn't have real today

          return (
            <div 
              key={date} 
              onClick={() => handleDayClick(date)}
              style={{ 
                minHeight: '100px', 
                background: isToday ? 'rgba(67, 24, 255, 0.05)' : 'var(--bg-color)', 
                borderRadius: '0.5rem', 
                padding: '0.5rem',
                border: isToday ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="calendar-day-hover"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: isToday ? 'var(--primary)' : 'var(--text-main)', fontSize: '0.875rem' }}>{date}</span>
                <Plus size={14} color="var(--text-muted)" style={{ opacity: 0.5 }} className="hover-plus" />
              </div>
              
              {dayEvents.map(ev => (
                <div 
                  key={ev.id}
                  onClick={(e) => handleDeleteEvent(e, ev.id)}
                  style={{ 
                    fontSize: '0.75rem', 
                    background: ev.color, 
                    color: 'white', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    marginTop: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  title="Click to remove"
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</span>
                  <X size={10} style={{ opacity: 0.8 }} />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedDateObj && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>
                Add Event for {new Date(selectedDateObj.year, selectedDateObj.month, selectedDateObj.date).toLocaleDateString()}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddEvent} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  value={newEventTitle} 
                  onChange={(e) => setNewEventTitle(e.target.value)} 
                  required 
                  placeholder="e.g. Client Meeting"
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label>Event Color</label>
                <select 
                  value={newEventColor} 
                  onChange={(e) => setNewEventColor(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'var(--text-main)' }}
                >
                  <option value="var(--primary)">Purple (Primary)</option>
                  <option value="#10B981">Green (Success)</option>
                  <option value="#F59E0B">Orange (Warning)</option>
                  <option value="#EF4444">Red (Danger)</option>
                  <option value="#64748B">Gray (Neutral)</option>
                </select>
              </div>

              <div className="modal-actions" style={{ borderTop: 'none', paddingTop: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;

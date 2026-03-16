import { useState } from 'react';
import { FaPlus, FaTrash, FaCalendarAlt, FaClock, FaTimes } from 'react-icons/fa';
import './Planner.css';

const EVENT_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f97316', '#ec4899', '#eab308'];

const SAMPLE_EVENTS = [
    { id: 1, title: 'DBMS Exam Revision', date: '2026-03-17', time: '10:00', color: '#8b5cf6', type: 'Study' },
    { id: 2, title: 'Neural Networks Assignment Due', date: '2026-03-17', time: '23:59', color: '#ef4444', type: 'Assignment' },
    { id: 3, title: 'Hackathon Registration', date: '2026-03-18', time: '09:00', color: '#3b82f6', type: 'Event' },
    { id: 4, title: 'Python Weekly Quiz', date: '2026-03-19', time: '11:00', color: '#10b981', type: 'Quiz' },
    { id: 5, title: 'Web Dev Mock Test', date: '2026-03-20', time: '14:00', color: '#f97316', type: 'Test' },
    { id: 6, title: 'Group Study: DSA', date: '2026-03-21', time: '16:00', color: '#ec4899', type: 'Study' },
    { id: 7, title: 'AI/ML Project Submission', date: '2026-03-22', time: '18:00', color: '#ef4444', type: 'Assignment' },
    { id: 8, title: 'Guest Lecture: Cloud Computing', date: '2026-03-23', time: '10:30', color: '#eab308', type: 'Event' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

export default function Planner() {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
    const [events, setEvents] = useState(SAMPLE_EVENTS);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: selectedDate, time: '09:00', color: '#8b5cf6', type: 'Study' });

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const eventsOnDate = (dateStr) => events.filter(e => e.date === dateStr);
    const selectedEvents = eventsOnDate(selectedDate).sort((a, b) => a.time.localeCompare(b.time));

    const handleDayClick = (day) => {
        const d = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(d);
    };

    const openAddModal = () => {
        setNewEvent({ title: '', date: selectedDate, time: '09:00', color: '#8b5cf6', type: 'Study' });
        setShowModal(true);
    };

    const handleAddEvent = () => {
        if (!newEvent.title.trim()) return;
        setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const formatDate = (dateStr) => {
        const [y, m, d] = dateStr.split('-');
        return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
    };

    const calendarCells = [];
    for (let i = 0; i < firstDay; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

    return (
        <div className="planner-page">
            <div className="planner-header">
                <div className="container">
                    <h1>📅 Study Planner</h1>
                    <p>Organize your study schedule and track upcoming events.</p>
                </div>
            </div>

            <div className="container planner-content">
                {/* Calendar */}
                <div className="calendar-panel">
                    <div className="calendar-nav">
                        <button onClick={prevMonth} className="cal-nav-btn">‹</button>
                        <span className="cal-title">{MONTHS[currentMonth]} {currentYear}</span>
                        <button onClick={nextMonth} className="cal-nav-btn">›</button>
                    </div>
                    <div className="calendar-grid">
                        {DAYS.map(d => (
                            <div key={d} className="cal-day-header">{d}</div>
                        ))}
                        {calendarCells.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} className="cal-cell empty" />;
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const hasEvents = eventsOnDate(dateStr).length > 0;
                            const isToday = dateStr === today.toISOString().slice(0, 10);
                            const isSelected = dateStr === selectedDate;
                            return (
                                <div
                                    key={day}
                                    className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleDayClick(day)}
                                >
                                    <span className="cal-day-num">{day}</span>
                                    {hasEvents && (
                                        <div className="event-dots">
                                            {eventsOnDate(dateStr).slice(0, 3).map(e => (
                                                <span key={e.id} className="event-dot" style={{ background: e.color }} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Events Panel */}
                <div className="events-panel">
                    <div className="events-panel-header">
                        <div>
                            <h3>{formatDate(selectedDate)}</h3>
                            <p className="events-count">
                                {selectedEvents.length === 0 ? 'No events' : `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''}`}
                            </p>
                        </div>
                        <button className="add-event-btn" onClick={openAddModal}>
                            <FaPlus /> Add Event
                        </button>
                    </div>

                    <div className="events-list">
                        {selectedEvents.length === 0 ? (
                            <div className="no-events">
                                <FaCalendarAlt className="no-events-icon" />
                                <p>No events for this day.</p>
                                <span>Click "Add Event" to schedule something.</span>
                            </div>
                        ) : (
                            selectedEvents.map(event => (
                                <div key={event.id} className="event-item" style={{ borderLeftColor: event.color }}>
                                    <div className="event-left">
                                        <div className="event-type-badge" style={{ background: event.color + '22', color: event.color }}>
                                            {event.type}
                                        </div>
                                        <h4 className="event-title">{event.title}</h4>
                                        <span className="event-time"><FaClock /> {event.time}</span>
                                    </div>
                                    <button className="delete-btn" onClick={() => handleDelete(event.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Upcoming Events */}
                    <div className="upcoming-section">
                        <h4>Upcoming Events</h4>
                        <div className="upcoming-list">
                            {events
                                .filter(e => e.date >= today.toISOString().slice(0, 10))
                                .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
                                .slice(0, 5)
                                .map(e => (
                                    <div key={e.id} className="upcoming-item">
                                        <span className="upcoming-dot" style={{ background: e.color }} />
                                        <div className="upcoming-info">
                                            <span className="upcoming-title">{e.title}</span>
                                            <span className="upcoming-date">{formatDate(e.date)} · {e.time}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Event</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
                        </div>
                        <div className="modal-body">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Mock Test, Assignment Due..."
                                value={newEvent.title}
                                onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                            />
                            <div className="modal-row">
                                <div>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="modal-row">
                                <div>
                                    <label>Type</label>
                                    <select value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value }))}>
                                        <option>Study</option>
                                        <option>Assignment</option>
                                        <option>Test</option>
                                        <option>Quiz</option>
                                        <option>Event</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Color</label>
                                    <div className="color-picker">
                                        {EVENT_COLORS.map(c => (
                                            <button
                                                key={c}
                                                className={`color-swatch ${newEvent.color === c ? 'active' : ''}`}
                                                style={{ background: c }}
                                                onClick={() => setNewEvent(p => ({ ...p, color: c }))}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="confirm-btn" onClick={handleAddEvent}>Add Event</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

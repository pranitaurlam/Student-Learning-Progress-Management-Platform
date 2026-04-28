import { useState, useEffect, useRef } from 'react';
import { IoTimerOutline, IoStopwatchOutline, IoAlarmOutline, IoPlay, IoPause, IoRefresh, IoAdd, IoClose } from 'react-icons/io5';
import './StudyTimer.css';

export default function StudyTimer() {
  const [activeTab, setActiveTab] = useState('timer');
  
  // Timer State
  const [timerTime, setTimerTime] = useState(1500); // 25 mins
  const [timerActive, setTimerActive] = useState(false);
  const [timerInput, setTimerInput] = useState('25');

  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);
  const [laps, setLaps] = useState([]);

  // Alarm State
  const [alarms, setAlarms] = useState([]);
  const [alarmInput, setAlarmInput] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const timerRef = useRef(null);
  const stopwatchRef = useRef(null);

  // Update Clock for Alarm
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check alarms
      const currentHM = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      alarms.forEach(alarm => {
        if (alarm.time === currentHM && !alarm.triggered) {
          alert(`ALARM: ${alarm.label || 'Time is up!'}`);
          setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, triggered: true } : a));
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  // Timer Logic
  useEffect(() => {
    if (timerActive && timerTime > 0) {
      timerRef.current = setInterval(() => {
        setTimerTime(prev => prev - 1);
      }, 1000);
    } else if (timerTime === 0) {
      setTimerActive(false);
      clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timerTime]);

  // Stopwatch Logic
  useEffect(() => {
    if (stopwatchActive) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 10); // 10ms intervals for precision
      }, 10);
    } else {
      clearInterval(stopwatchRef.current);
    }
    return () => clearInterval(stopwatchRef.current);
  }, [stopwatchActive]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const formatStopwatch = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const msPortion = Math.floor((ms % 1000) / 10);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}.${msPortion < 10 ? '0' + msPortion : msPortion}`;
  };

  const handleAddAlarm = (e) => {
    e.preventDefault();
    if (!alarmInput) return;
    const newAlarm = {
      id: Date.now(),
      time: alarmInput,
      label: 'Study Alert',
      triggered: false,
      enabled: true
    };
    setAlarms([...alarms, newAlarm]);
    setAlarmInput('');
  };

  const removeAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  return (
    <div className="study-timer-page">
      <div className="glass-container">
        <header className="timer-header">
          <h1>Temporal Toolkit</h1>
          <p>Master your focus, second by second.</p>
        </header>

        <div className="tab-navigation">
          <button 
            className={activeTab === 'timer' ? 'active' : ''} 
            onClick={() => setActiveTab('timer')}
          >
            <IoTimerOutline /> Timer
          </button>
          <button 
            className={activeTab === 'stopwatch' ? 'active' : ''} 
            onClick={() => setActiveTab('stopwatch')}
          >
            <IoStopwatchOutline /> Stopwatch
          </button>
          <button 
            className={activeTab === 'alarm' ? 'active' : ''} 
            onClick={() => setActiveTab('alarm')}
          >
            <IoAlarmOutline /> Alarm
          </button>
        </div>

        <div className="mode-content">
          {activeTab === 'timer' && (
            <div className="timer-mode">
              <div className="display-giant">
                {formatTime(timerTime)}
              </div>
              <div className="timer-controls">
                <button className="control-btn main" onClick={() => setTimerActive(!timerActive)}>
                  {timerActive ? <IoPause /> : <IoPlay />}
                </button>
                <button className="control-btn" onClick={() => { setTimerActive(false); setTimerTime(parseInt(timerInput) * 60 || 1500); }}>
                  <IoRefresh />
                </button>
              </div>
              <div className="presets">
                {[15, 25, 45, 60].map(m => (
                  <button key={m} onClick={() => {
                    setTimerInput(m.toString());
                    setTimerTime(m * 60);
                    setTimerActive(false);
                  }}>{m}m</button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stopwatch' && (
            <div className="stopwatch-mode">
              <div className="display-giant">
                {formatStopwatch(stopwatchTime)}
              </div>
              <div className="timer-controls">
                <button className="control-btn main" onClick={() => setStopwatchActive(!stopwatchActive)}>
                  {stopwatchActive ? <IoPause /> : <IoPlay />}
                </button>
                <button className="control-btn" onClick={() => {
                  if (stopwatchActive) {
                    setLaps([formatStopwatch(stopwatchTime), ...laps]);
                  } else {
                    setStopwatchTime(0);
                    setLaps([]);
                  }
                }}>
                  {stopwatchActive ? 'LAP' : <IoRefresh />}
                </button>
              </div>
              <div className="laps-container">
                {laps.map((lap, i) => (
                  <div key={i} className="lap-item">
                    <span>Lap {laps.length - i}</span>
                    <strong>{lap}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alarm' && (
            <div className="alarm-mode">
              <div className="current-clock">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <form onSubmit={handleAddAlarm} className="alarm-form">
                <input 
                  type="time" 
                  value={alarmInput} 
                  onChange={(e) => setAlarmInput(e.target.value)} 
                />
                <button type="submit"><IoAdd /> Add Alarm</button>
              </form>
              <div className="alarms-list">
                {alarms.map(alarm => (
                  <div key={alarm.id} className={`alarm-card ${alarm.triggered ? 'triggered' : ''}`}>
                    <div className="alarm-info">
                      <span className="alarm-time">{alarm.time}</span>
                      <span className="alarm-label">{alarm.label}</span>
                    </div>
                    <button onClick={() => removeAlarm(alarm.id)} className="delete-alarm">
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

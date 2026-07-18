import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusById } from '../../services/api';
import { getSocket } from '../../services/socket';
import { useAppContext } from '../../context/AppContext';

export default function LiveTrackingPage() {
  const { selectedBusId } = useAppContext();
  const [busData, setBusData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedBusId) {
      navigate('/');
      return;
    }

    getBusById(selectedBusId)
      .then((res) => {
        setBusData(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load bus details');
      });

    const socket = getSocket();
    socket.emit('trackBus', selectedBusId);

    const handler = (data: any) => {
      if (data && data.busId === selectedBusId) {
        setBusData((prev: any) => {
          if (!prev) return data;
          return { ...prev, ...data };
        });
      }
    };

    socket.on('locationUpdate', handler);

    return () => {
      socket.off('locationUpdate', handler);
    };
  }, [selectedBusId, navigate]);

  const formatTime = (dateStr: any) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? 'N/A'
      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (error) {
    return (
      <div style={containerStyle} className="animate-fade-in">
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/user/area')}>
            Back to Areas
          </button>
        </div>
      </div>
    );
  }

  if (!busData) {
    return (
      <div style={containerStyle} className="animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={spinnerStyle}></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>Connecting to live tracking...</p>
        </div>
      </div>
    );
  }

  const stops = busData.stops || [];
  const currentIndex = busData.currentStopIndex !== undefined ? busData.currentStopIndex : 0;

  return (
    <div style={containerStyle} className="animate-slide-up">
      {/* Header */}
      <div style={headerStyle}>
        <button 
          style={backButtonStyle}
          onClick={() => navigate('/user/bus')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div>
          <span style={liveBadgeStyle}>
            <span className="pulse-dot" style={{ marginRight: '6px' }}></span> LIVE
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          {busData.busId}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
          {busData.routeName}
        </p>
      </div>

      {/* Info Card */}
      <div className="glass-card" style={infoCardStyle}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Current Stop
          </p>
          <p style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
            {busData.currentStop || 'Not started'}
          </p>
        </div>
        <div style={dividerStyle}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Via {busData.updatedVia === 'sms' ? '📟 SMS Webhook' : '📱 Driver App'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {formatTime(busData.lastUpdated)}
          </span>
        </div>
      </div>

      {/* Route Timeline */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
          Route Progress
        </h3>
        <div style={timelineContainerStyle}>
          {stops.map((stop: string, idx: number) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            
            return (
              <div key={stop} style={timelineItemStyle}>
                <div style={timelineIndicatorStyle}>
                  {/* Vertical Line */}
                  {idx < stops.length - 1 && (
                    <div style={{
                      ...timelineLineStyle,
                      backgroundColor: isCompleted ? 'var(--success)' : 'var(--bg-tertiary)'
                    }}></div>
                  )}
                  {/* Dot */}
                  <div style={{
                    ...timelineDotStyle,
                    backgroundColor: isCurrent ? 'var(--success)' : isCompleted ? 'var(--success)' : 'var(--bg-tertiary)',
                    boxShadow: isCurrent ? '0 0 0 4px var(--success-glow)' : 'none',
                    transform: isCurrent ? 'scale(1.2)' : 'none'
                  }}>
                    {isCompleted && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
                <div style={{
                  ...timelineContentStyle,
                  color: isCurrent ? 'var(--text-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)',
                  fontWeight: isCurrent ? 700 : 500
                }}>
                  {stop}
                  {isCurrent && <span style={currentLabelStyle}>Active</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Styling Declarations
const containerStyle: React.CSSProperties = {
  padding: '24px 20px',
  maxWidth: '440px',
  margin: '0 auto',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const backButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border)',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const liveBadgeStyle: React.CSSProperties = {
  backgroundColor: 'var(--success-glow)',
  color: 'var(--success)',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center'
};

const infoCardStyle: React.CSSProperties = {
  padding: '20px',
  marginBottom: '24px',
  background: 'linear-gradient(135deg, rgba(25, 33, 56, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'var(--border)',
  margin: '16px 0'
};

const timelineContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
};

const timelineItemStyle: React.CSSProperties = {
  display: 'flex',
  position: 'relative',
  paddingBottom: '24px'
};

const timelineIndicatorStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginRight: '16px',
  position: 'relative',
  width: '20px'
};

const timelineLineStyle: React.CSSProperties = {
  position: 'absolute',
  top: '20px',
  bottom: '-12px',
  width: '2px',
  transition: 'background-color 0.3s ease'
};

const timelineDotStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  transition: 'all 0.3s ease'
};

const timelineContentStyle: React.CSSProperties = {
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  paddingTop: '2px'
};

const currentLabelStyle: React.CSSProperties = {
  backgroundColor: 'var(--success-glow)',
  color: 'var(--success)',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 600
};

const spinnerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '3px solid rgba(99, 102, 241, 0.1)',
  borderTop: '3px solid var(--accent)',
  borderRadius: '50%',
  animation: 'pulse-ring 1.5s infinite linear'
};
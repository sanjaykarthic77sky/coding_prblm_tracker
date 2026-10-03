import React from 'react';

const StatsCard = ({ label, value, icon: Icon, color = 'var(--accent-primary)', bgColor = 'rgba(99, 102, 241, 0.1)' }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className="stat-icon" style={{ backgroundColor: bgColor, color }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
};

export default StatsCard;

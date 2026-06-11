import './ProgressBar.css';

const ProgressBar = ({ progress, color = '#2196f3' }) => {
  return (
    <div className="progress-bar">
      <div 
        className="progress-fill"
        style={{ 
          width: `${Math.min(Math.max(progress, 0), 100)}%`,
          background: color
        }}
      />
    </div>
  );
};

export default ProgressBar;
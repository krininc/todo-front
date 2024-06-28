import React from 'react';
import '../../Assets/styles/Sidebar.css';


const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <input type="text" className="search-bar" placeholder="Search..." />
        </div>
        <div className="sidebar-section">
          <h3>Tasks</h3>
          <ul>
            <li>Upcoming</li>
            <li>Today</li>
            <li>Sticky Wall</li>
          </ul>
        </div>
        
        <div className="sidebar-section">
          <h3>Labels</h3>
          <ul className="tags">
            <li className="tag">Label 1</li>
            <li className="tag">Label 2</li>
            <li className="tag">+ Add Label</li>
          </ul>
        </div>
      </div>
      <div className="sidebar-footer">
        <button>Settings</button>
        <button>Sign out</button>
      </div>
    </div>
  );
};

export default Sidebar;


import React, { ChangeEvent } from "react";
import "../../Assets/styles/Sidebar.css";
import { Label } from "../../Interfaces/todo.interface";

interface SidebarProps {
  upcomingClicked: boolean;
  onUpcomingClick: () => void;
  labels: Label[];
  onCreateLabelClick: () => void;
  onLabelClick: (label: string) => void;
  onDeleteLabel: (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onSearch: (query: string) => void; 
  activeLabel: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  upcomingClicked,
  onUpcomingClick,
  labels,
  onCreateLabelClick,
  onLabelClick,
  onDeleteLabel,
  onSearch,
  activeLabel,
}) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <input
            type="text"
            className="search-bar"
            placeholder="Search by name..."
            onChange={handleSearchChange}
          />
        </div>
        <div className="sidebar-section">
          <h3>Tasks</h3>
          <ul>
            <li>Sticky Wall</li>
            <li
              style={{
                color: upcomingClicked ? "#4CAF50" : "black",
                cursor: "pointer",
              }}
              onClick={onUpcomingClick}
            >
              Upcoming
            </li>
            <li>Today</li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Labels</h3>
          <ul className="tags">
            <li
              // Add 'active' class conditionally
              className={`tag ${"" === activeLabel ? 'active' : ''}`} 
              onClick={() => {
                console.log("Clicked: All Labels");
                onLabelClick("");
              }}
              style={{ cursor: "pointer" }}
            >
              All Labels
            </li>
            {labels.map((label) => (
              <li
                key={label.id}
                // Add 'active' class conditionally
                className={`tag ${label.name === activeLabel ? 'active' : ''}`} 
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => {
                  console.log(`Clicked label: ${label.name}`);
                  onLabelClick(label.name);
                }}
              >
                <span>{label.name}</span>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    console.log(`Delete clicked for label: ${label.name}`);
                    onDeleteLabel(label.id, event);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
            <li
              className="tag"
              onClick={onCreateLabelClick}
              style={{ cursor: "pointer" }}
            >
              + Add Label
            </li>
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

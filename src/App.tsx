import React, { useState } from "react";
import ToolsManager from "./components/admin/ToolsManager";
import DropsManager from "./components/admin/DropsManager";
import SponsorsManager from "./components/admin/SponsorsManager";
import MakersManager from "./components/admin/MakersManager";
import './App.css';

const SECTIONS = [
  { key: "tools", label: "Tools" },
  { key: "drops", label: "Drops" },
  { key: "sponsors", label: "Sponsors" },
  { key: "makers", label: "Makers" },
];

function App() {
  const [section, setSection] = useState("tools");

  return (
    <div className="app-bg">
      <header className="header">
        <h1>SalesDrops Admin</h1>
        <nav>
          {SECTIONS.map(({ key, label }) => (
            <button
              key={key}
              className={section === key ? "active" : ""}
              onClick={() => setSection(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      <main>
        {section === "tools" && <ToolsManager />}
        {section === "drops" && <DropsManager />}
        {section === "sponsors" && <SponsorsManager />}
        {section === "makers" && <MakersManager />}
      </main>
    </div>
  );
}

export default App;

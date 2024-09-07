import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import ChatInterface from "./components/ChatInterface";
import React from "react";

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">DSM Bot</h1>
          <ThemeToggle />
        </header>
        <main>
          <ChatInterface />
        </main>
      </div>
    </div>
  );
};

export default App;

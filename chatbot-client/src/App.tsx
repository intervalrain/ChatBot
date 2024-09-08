import React, { useEffect, useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { login } from './api';
import './App.css';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const loginModel = { userName: '00053997', password: '0931639433' }
        const receivedToken = await login(loginModel);
        setToken(receivedToken);
      } catch (error) {
        setError('You are unauthorized to access the service.')
      }
    };

    authenticate();
  }, []);

  useEffect(() => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
      document.body.classList.add('dark');
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    };
    darkModeMediaQuery.addListener(handleDarkModeChange);

    return () => {
      darkModeMediaQuery.removeListener(handleDarkModeChange);
    };
  }, []);

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-2xl text-red-500'>{error}</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-2xl'>Authenticating...</p>
      </div>
    );
  }


  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4">
          <h1 className="text-4xl font-bold p-4">DSM Bot</h1>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-hidden">
          <ChatInterface token={token} />
        </main>
      </div>
    </div>
  );
};

export default App;
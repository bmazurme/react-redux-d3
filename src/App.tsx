import React, { useState, useMemo, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import MainPage from './pages/MainPage';

import ErrorBoundaryWrapper from './components/core/ErrorBoundaryWrapper';

import ThemeContext from './context/ThemeContext';

// import './index.css';

export default function App() {
  const [style, setStyle] = useState('light');
  const providerValue = useMemo(() => ({ style, setStyle }), [style, setStyle]);

  useEffect(() => {
    const currentTheme = localStorage.getItem('tmp-theme');
    document.documentElement.setAttribute('tmp-theme', (currentTheme === 'dark') ? 'dark' : 'light');
  }, [style]);

  return (
    <ThemeContext.Provider value={providerValue}>
      <ErrorBoundaryWrapper>
        <Routes>
          <Route index element={(<MainPage />)} />
        </Routes>
      </ErrorBoundaryWrapper>
    </ThemeContext.Provider>
  );
}

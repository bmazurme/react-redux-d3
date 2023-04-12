import React from 'react';
import { Route, Routes } from 'react-router-dom';

import MainPage from './pages/MainPage';

import ErrorBoundaryWrapper from './components/core/ErrorBoundaryWrapper';

export default function App() {
  return (
    <ErrorBoundaryWrapper>
      <Routes>
        <Route index element={(<MainPage />)} />
      </Routes>
    </ErrorBoundaryWrapper>
  );
}

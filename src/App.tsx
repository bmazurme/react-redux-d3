import React from 'react';
import { Route, Routes } from 'react-router-dom';

import MainPage from './pages/main-page';

import ErrorBoundaryWrapper from './components/core/error-boundary-wrapper';

export default function App() {
  return (
    <ErrorBoundaryWrapper>
      <Routes>
        <Route index element={(<MainPage />)} />
      </Routes>
    </ErrorBoundaryWrapper>
  );
}

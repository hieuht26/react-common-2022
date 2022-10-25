import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthProvider from 'auth/AuthProvider';
import React from 'react';
import ProtectedRoute from 'auth/ProtectedRoute';

const DemoPage = React.lazy(() => import("./pages/demoPage/DemoPage"));
const DemoPageAuth = React.lazy(() => import("./pages/demoPage/DemoPageAuth"));

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="demo" element={<DemoPage />} />
          <Route path="demo-auth" element={
            <ProtectedRoute>
              <DemoPageAuth />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </div>
  );
}

const queryClient = new QueryClient();

const AppContainer = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);

export default AppContainer;

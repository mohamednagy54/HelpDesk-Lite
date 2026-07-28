import React from 'react';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar';
import { Environment } from '../../types/environment-types';

const RootLayout = () => {
  const [environment, setEnvironment] = useState<Environment>('STG');

  return (
    <main className="min-h-screen bg-grayGreen30">
      <Navbar environment={environment} setEnvironment={setEnvironment} />
      {/* Calculated min-h based on the navbar height of 96px */}
      <section className="min-h-[calc(100vh-96px)] p-7 md:px-24">
        <Outlet context={{ environment, setEnvironment }} />
      </section>
    </main>
  );
};

export { RootLayout };

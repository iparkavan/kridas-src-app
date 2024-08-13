import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';

const SettingsLayout = () => {
  return (
    // To undo default padding
    <div className="md:-mx-24 md:-my-7 flex min-h-[inherit]">
      <Sidebar />
      <section className="w-full md:p-20">
        <Outlet />
      </section>
    </div>
  );
};

export default SettingsLayout;

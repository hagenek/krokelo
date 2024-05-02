// routes/index.tsx
import { Outlet } from '@remix-run/react';
import { NavMenu } from './nav-menu';

export default function Index() {
  return (
    <div className="flex w-full items-center justify-center text-center md:w-auto">
      <div className="h-screen w-full md:w-2/3 xl:w-1/2 dark:text-white">
        <header className="h-[72px]">
          <NavMenu />
        </header>
        <Outlet />
      </div>
    </div>
  );
}

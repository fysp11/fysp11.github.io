'use client';

import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { ME_PROFILE } from '@/constants/profile';

export default function NavBar() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full py-4 backdrop-blur-md">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <img
              src="/icons/icon-192x192.png"
              width={32}
              height={32}
              alt={ME_PROFILE.personal.name}
            />
            <span className="hidden font-bold sm:inline-block">{ME_PROFILE.personal.name}</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}

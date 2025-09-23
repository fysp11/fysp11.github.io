import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type MenuChild = {
  label: string;
  href: string;
};

type MenuSection = {
  label: string;
  href?: string;
  children: MenuChild[];
};

interface MenuProps {
  sections: MenuSection[];
}

const Menu: React.FC<MenuProps> = ({ sections }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(isDesktop ? 'fysp.dev' : null);
  const menuRef = useRef<HTMLUListElement>(null);

  const handleToggle = (label: string) => {
    setOpenSection(prev => {
      // On desktop, don't allow closing the section, only switching
      if (isDesktop) {
        setOpenSection(label);
        return label;
      }
      // On mobile, allow toggling open/closed
      return prev === label ? null : label;
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleResize = () => {
      const isDesktopNow = mediaQuery.matches;
      setIsDesktop(isDesktopNow);
      // If we enter desktop view and no section is open, default to 'Home'
      if (isDesktopNow && openSection === null) {
        setOpenSection('fysp.dev');
      }
    };

    handleResize(); // Set initial state
    mediaQuery.addEventListener('change', handleResize);

    const handleClickOutside = (event: MouseEvent) => {
      // On mobile, close menu when clicking outside
      if (!mediaQuery.matches && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSection]);

  return (
    <ul ref={menuRef} className="flex items-center md:flex-col md:items-stretch gap-1 xs:gap-2">
      {sections.map((section) => {

        const isOpen = openSection === section.label;
        const childLinks = section.children;

        return (
          <li key={section.label} className="w-full">
            <div className="group relative w-full rounded-lg">
              <button
                onClick={() => handleToggle(section.label)}
                className="flex w-full cursor-pointer items-center justify-between gap-1 rounded-lg px-1 py-1.5 font-semibold text-accent-foreground/80 transition hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-ring/40 focus-visible:ring-offset-2"
              >
                <span>{section.label}</span>
                <ChevronDown
                  className={`hidden xs:block h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.3, ease: 'easeOut' },
                      opacity: { duration: 0.01 } // Make opacity fade out almost instantly
                    }}
                    className="absolute left-0 top-full z-50 mt-2 max-w-32 overflow-hidden rounded-lg border border-border/70 bg-popover/95 text-xs text-foreground/70 shadow-xl backdrop-blur-md md:static md:z-auto md:mt-0 md:w-full md:overflow-visible md:border-none md:bg-transparent md:shadow-none md:backdrop-blur-none"
                  >
                    <motion.ul
                      variants={{
                        visible: { transition: { staggerChildren: 0.05 } },
                        hidden: {},
                      }}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col gap-1 p-2 md:p-0"
                    >
                      {childLinks.map((child) => (
                        <motion.li
                          key={child.href}
                          variants={{
                            visible: { opacity: 1, y: 0 },
                            hidden: { opacity: 0, y: -10 },
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <a
                            href={child.href}
                            className="block rounded-md px-2 py-1 font-medium transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-ring/40 focus-visible:ring-offset-2"
                          >
                            {child.label}
                          </a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;

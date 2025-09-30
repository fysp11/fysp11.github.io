import React, { useState, useEffect } from 'react';
import { Image } from 'astro:assets'

type Project = {
  name: string;
  href: string;
  image: string;
  description: string;
};

interface ProjectsViewProps {
  projects: Project[];
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const savedView = localStorage.getItem('projects-view') as 'grid' | 'list' | null;
    if (savedView) {
      setView(savedView);
    }
  }, []);

  const handleSetView = (newView: 'grid' | 'list') => {
    setView(newView);
    localStorage.setItem('projects-view', newView);
  };

  const containerClasses = view === 'grid'
    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2'
    : 'flex flex-col gap-6';

  return (
    <section className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-2 rounded-md border border-border/70 bg-card/90 p-1 text-sm text-foreground/80 shadow-sm">
          <button
            data-view="grid"
            onClick={() => handleSetView('grid')}
            className={`cursor-pointer rounded-sm px-2 py-0.5 transition-colors ${view === 'grid' ? 'bg-accent-foreground text-accent' : ''}`}
            aria-label="Card view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </button>
          <button
            data-view="list"
            onClick={() => handleSetView('list')}
            className={`cursor-pointer rounded-sm px-2 py-0.5 transition-colors ${view === 'list' ? 'bg-accent-foreground text-accent' : ''}`}
            aria-label="List view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div className={containerClasses}>
        {projects.map((project) => (
          <a key={project.href} href={project.href} className="group block rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            {view === 'grid' ? (
              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={`Image for ${project.name} project`}
                  width="800"
                  height="600"
                  className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4">
                <Image
                  src={project.image}
                  alt={`Image for ${project.name} project`}
                  width="80"
                  height="80"
                  class="aspect-square rounded-md object-cover"
                  fetchpriority="high"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
};

export default ProjectsView;

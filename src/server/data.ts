import { getCollection, type CollectionEntry } from 'astro:content';


export const getExperiences = async () => {
  const experienceEntries = await getCollection('experiences');
  const sortedEntries = experienceEntries.sort(
    (a: CollectionEntry<'experiences'>, b: CollectionEntry<'experiences'>) => b.data.year - a.data.year
  );
  return sortedEntries.map((entry: CollectionEntry<'experiences'>) => entry.data);
};

export const getProjects = async (withDemo = false) => {
  const whichVar = withDemo ? 'ENABLED_PROJECT_DEMOS' : 'ENABLED_PROJECTS';
  const enabledProjectsEnv = import.meta.env[whichVar] ?? '';
  const enabledSlugs = enabledProjectsEnv.split(',');
  // console.log({withDemo, whichVar, enabledProjectsEnv, enabledSlugs})

  const projects = await getCollection('projects');
  const activeProjects = projects.filter((p: CollectionEntry<'projects'>) => {
    const fileEnabled = p.data.active;
    const envEnabled = enabledSlugs.includes(p.data.slug);
    return fileEnabled ?? envEnabled;
  });
  return activeProjects;
};

export const getProject = async (slug: string) => {
  const projectEntries = await getCollection('projects');
  const project = projectEntries.find((p: CollectionEntry<'projects'>) => p.data.slug === slug);
  return project;
};

import { getCollection, type CollectionEntry } from 'astro:content';


export const getExperiences = async () => {
  const experienceEntries = await getCollection('experiences');
  const sortedEntries = experienceEntries.sort(
    (a: CollectionEntry<'experiences'>, b: CollectionEntry<'experiences'>) => b.data.year - a.data.year
  );
  return sortedEntries.map((entry: CollectionEntry<'experiences'>) => entry.data);
};

export const getProjects = async () => {
  const enabledProjectsEnv = import.meta.env.ENABLED_PROJECTS ?? '';
  const enabledSlugs = enabledProjectsEnv.split(',')

  const projects = await getCollection('projects');
  let activeProjects = projects.filter((p: CollectionEntry<'projects'>) => {
    const fileEnabled = p.data.active;
    console.log({ slug: p.data.slug, fileEnabled, envEnabled: enabledSlugs.includes(p.data.slug) })
    const envEnabled = enabledSlugs.includes(p.data.slug);
    return fileEnabled ?? envEnabled;
  });
  console.log({ enabledSlugs, activeProjects});
  return activeProjects.map((p: CollectionEntry<'projects'>) => ({ ...p.data, slug: p.data.slug }));
}


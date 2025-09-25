import { getCollection, type CollectionEntry } from 'astro:content';


export const getExperiences = async () => {
  const experiences = await getCollection('experiences');
  const sortedExperiences = experiences.sort(
    (a: CollectionEntry<'experiences'>, b: CollectionEntry<'experiences'>) => b.data.year - a.data.year
  );
  return sortedExperiences.map((exp: CollectionEntry<'experiences'>) => exp.data);
};

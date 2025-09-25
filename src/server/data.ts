import { getCollection, type CollectionEntry } from 'astro:content';


export const getExperiences = async () => {
  const experienceEntries = await getCollection('experiences');
  const sortedEntries = experienceEntries.sort(
    (a: CollectionEntry<'experiences'>, b: CollectionEntry<'experiences'>) => b.data.year - a.data.year
  );
  return sortedEntries.map((entry: CollectionEntry<'experiences'>) => entry.data);
};

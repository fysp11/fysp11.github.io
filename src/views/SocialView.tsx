import type { ISocialItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SocialViewProps {
  socials: ISocialItem[];
}
export default function SocialView({ socials }: SocialViewProps) {
  const styles = {
    root: 'grid grid-cols-2 gap-4 justify-items-center justify-content-center',
    button: cn(
      'flex items-center justify-start',
      'text-teal-800 dark:text-teal-200',
      'hover:bg-sky-200 hover:dark:bg-sky-800',
      'hover:underline',
      'rounded px-2 py-1 text-2xl',
    ),
    icon: 'mr-2 min-w-[10px]',
    label: 'w-full text-center',
  };

  return (
    <div className={styles.root}>
      {socials.map((socialItem) => (
        <a key={socialItem.label} href={socialItem.url} target="_blank">
          <button className={styles.button}>
            <socialItem.icon className={styles.icon} />
            <span className={styles.label}>{socialItem.label}</span>
          </button>
        </a>
      ))}
    </div>
  );
}

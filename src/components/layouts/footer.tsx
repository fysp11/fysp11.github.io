import { cn } from '@/lib/utils';

export default function Footer() {
  const styles = {
    root: cn(
      'flex items-center justify-center',
      'min-h-[80px] px-5 py-3 text-center',
      'animate-pulse italic hover:underline',
    ),
  };

  return <footer className={styles.root}>fysp.eth</footer>;
}

import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps extends PropsWithChildren {
  className?: string;
}
export default function Container({ children, className }: ContainerProps) {
  return <main className={cn('mx-auto px-4', className)}>{children}</main>;
}

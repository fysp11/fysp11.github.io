import type { PropsWithChildren } from 'react';

export default function SectionTitle({ children }: PropsWithChildren) {
  return <div className="mt-3 mb-4 text-2xl font-bold">{children}</div>;
}

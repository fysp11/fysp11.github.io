import type { PropsWithChildren } from 'react';

export default function BioYear({ children }: PropsWithChildren) {
  return <div className="mr-4 font-bold">{children}</div>;
}

import type { PropsWithChildren } from 'react';

export default function Section({ children }: PropsWithChildren) {
  return (
    <div
      className="mx-auto my-2 pl-14"
      style={{
        textIndent: '-3.4em'
      }}
    >
      {children}
    </div>
  );
}

import { ArrowUpRight } from "lucide-react";

interface Props {
    liveUrl: string;
    isExternal?: boolean;
    children: React.ReactNode;
}
export default function LinkButton({liveUrl, isExternal, children}: Props) {
  return (
     <a href={liveUrl} target={isExternal ? "_blank" : "_self"} rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80">
            {children} <ArrowUpRight className="h-4 w-4" />
      </a>
  )
}

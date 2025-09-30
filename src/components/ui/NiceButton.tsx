import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type LinkProps = {
  variant: 'link';
  liveUrl: string;
  isExternal?: boolean;
  children: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonProps = {
  variant?: 'button';
  liveUrl?: never;
  isExternal?: never;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type Props = LinkProps | ButtonProps;

export default function NiceButton(props: Props) {
  const baseClass = "inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 cursor-pointer";

  if (props.variant === 'link') {
    const { liveUrl, isExternal, children, className, ...rest } = props;
    return (
      <a
        href={liveUrl}
        target={isExternal ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className={className || baseClass}
        {...rest}
      >
        {children} <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }

  const { children, className, ...rest } = props;
  return (
    <button className={className || baseClass} {...rest}>
      {children}
    </button>
  );
}

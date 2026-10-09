import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import './Button.scss';

type Variant = 'primary' | 'secondary' | 'accent';
type Size = 'md' | 'sm';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps | AnchorProps) => {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (props.href !== undefined) {
    const { children, ...anchor } = props;
    return (
      <a className={classes} {...anchor}>
        {children}
      </a>
    );
  }

  const { children, ...button } = props;
  return (
    <button type="button" className={classes} {...button}>
      {children}
    </button>
  );
};

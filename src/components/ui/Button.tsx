import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib';
import { cva, VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

export const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-violet-700 text-white hover:bg-violet-800 shadow-[0px_2px_0px_0px_#FFFFFF40_inset]',
        secondary:
          'bg-gray-800 text-white hover:bg-gray-900 shadow-[0px_2px_0px_0px_#FFFFFF40_inset]',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = ({
  className,
  children,
  variant,
  size,
  isLoading,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
};

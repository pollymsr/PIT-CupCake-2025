// // components/ui/button.tsx
// import { ButtonHTMLAttributes, ReactNode } from 'react';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'default' | 'ghost' | 'destructive' | 'outline';
//   size?: 'default' | 'sm' | 'lg' | 'icon';
//   children: ReactNode;
// }

// export function Button({ 
//   variant = 'default', 
//   size = 'default', 
//   className = '', 
//   children, 
//   ...props 
// }: ButtonProps) {
//   const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2';
  
//   const variantClasses = {
//     default: 'bg-pink-500 text-white hover:bg-pink-600',
//     ghost: 'bg-transparent hover:bg-pink-50 text-pink-700',
//     destructive: 'bg-red-500 text-white hover:bg-red-600',
//     outline: 'border border-pink-300 text-pink-600 hover:bg-pink-50'
//   };
  
//   const sizeClasses = {
//     default: 'px-4 py-2 text-sm',
//     sm: 'px-3 py-1 text-xs',
//     lg: 'px-6 py-3 text-base',
//     icon: 'p-2'
//   };

//   const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

//   return (
//     <button className={classes} {...props}>
//       {children}
//     </button>
//   );
// }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "src/lib/ultils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-pink-600 text-white hover:bg-pink-700 shadow-md",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md",
        outline: "border border-pink-600 bg-white text-pink-600 hover:bg-pink-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-pink-600",
        link: "text-pink-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

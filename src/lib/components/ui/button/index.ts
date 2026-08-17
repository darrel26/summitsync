import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-slate-900 text-white shadow hover:bg-slate-800',
				outline: 'border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900',
				secondary: 'bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200',
				ghost: 'hover:bg-slate-100 hover:text-slate-900',
				destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
				link: 'text-slate-900 underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

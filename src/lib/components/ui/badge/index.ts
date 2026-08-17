import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
	'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-slate-900 text-white hover:bg-slate-800',
				secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
				destructive: 'border-transparent bg-red-100 text-red-800 border-red-200',
				outline: 'text-slate-900 border-slate-200',
				success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
				warning: 'border-amber-200 bg-amber-50 text-amber-700'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
);

export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

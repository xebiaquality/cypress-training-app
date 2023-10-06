import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'
interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {}
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <Loader2
        role="status"
        aria-atomic="true"
        aria-live="assertive"
        aria-label="Loading"
        className={cn('animate-spin', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

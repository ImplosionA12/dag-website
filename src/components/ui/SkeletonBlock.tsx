import { clsx } from '@/lib/utils'

interface SkeletonBlockProps {
  className?: string
}

/**
 * Loading shimmer block — pair with aria-busy on the containing section.
 */
export function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return <div className={clsx('skeleton', className)} aria-hidden="true" />
}

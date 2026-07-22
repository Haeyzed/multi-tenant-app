"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      // Note: If offset stays 0, change `document.documentElement` to your main scrollable container's DOM node
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
      <header
          className={cn(
              'z-50 h-16 transition-all duration-200',
              fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
              // Apply background and backdrop-blur directly to the header when scrolled
              offset > 10 && fixed
                  ? 'shadow-sm bg-background/80 backdrop-blur-md border-b'
                  : 'shadow-none bg-transparent',
              className
          )}
          {...props}
      >
        <div className="relative flex h-full items-center gap-3 p-4 sm:gap-4">
          <SidebarTrigger variant='outline' className='max-md:scale-125' />
          <Separator orientation='vertical' className='h-6' />
          {children}
        </div>
      </header>
  )
}
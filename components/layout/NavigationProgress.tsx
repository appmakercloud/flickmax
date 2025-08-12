'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 500
})

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.done()
  }, [pathname, searchParams])

  useEffect(() => {
    const handleStart = () => NProgress.start()
    const handleComplete = () => NProgress.done()

    const handleRouteClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link) {
        const href = link.getAttribute('href')
        const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'))
        const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
        const isNewTab = link.getAttribute('target') === '_blank'
        
        // Check if clicking on the same page
        const currentPath = window.location.pathname
        const isHomePage = currentPath === '/' && (href === '/' || href === '')
        const isSamePage = href === currentPath || isHomePage
        
        if (isInternalLink && !isModifiedClick && !isNewTab && !href.startsWith('#')) {
          if (isSamePage) {
            // If same page, start and immediately complete
            handleStart()
            setTimeout(() => handleComplete(), 100)
          } else {
            // Different page, start normally
            handleStart()
          }
        }
      }
    }

    // Listen for link clicks
    document.addEventListener('click', handleRouteClick)

    // Handle browser back/forward
    window.addEventListener('popstate', handleStart)

    return () => {
      document.removeEventListener('click', handleRouteClick)
      window.removeEventListener('popstate', handleStart)
      handleComplete()
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        /* Custom NProgress styles with gradient */
        #nprogress {
          pointer-events: none;
        }

        #nprogress .bar {
          background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%);
          position: fixed;
          z-index: 9999;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.7), 0 0 5px rgba(6, 182, 212, 0.7);
        }

        /* Fancy blur effect */
        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.8), 0 0 8px rgba(6, 182, 212, 0.8);
          opacity: 1;
          transform: rotate(3deg) translate(0px, -4px);
        }

        /* Remove spinner */
        #nprogress .spinner {
          display: none;
        }

        /* Animation for a smoother feel */
        .nprogress-custom-parent {
          overflow: hidden;
          position: relative;
        }

        .nprogress-custom-parent #nprogress .bar {
          position: absolute;
        }
      `}</style>
    </>
  )
}
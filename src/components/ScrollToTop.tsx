import React, { useEffect } from 'react';

interface ScrollToTopProps {
  /**
   * The list of state values to watch. Whenever any of these values change,
   * the scroll position of the window and all scrollable containers will reset to 0.
   */
  watch: any[];
}

/**
 * ScrollToTop Component
 * 
 * A clean, independent, and reusable utility component designed for RTL/LTR mobile and web layouts.
 * It ensures that when navigating between tabs, opening details pages, or changing major view states,
 * all active scrollable containers are immediately and smoothly reset to the top, preventing
 * the issue where a new screen inherits the scroll position of the previous screen.
 */
export function ScrollToTop({ watch }: ScrollToTopProps) {
  useEffect(() => {
    // 1. Reset standard window and document element scroll positions
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    if (document.documentElement) {
      document.documentElement.scrollTo({ top: 0, behavior: 'instant' as any });
    }
    if (document.body) {
      document.body.scrollTo({ top: 0, behavior: 'instant' as any });
    }

    // 2. Find and reset all local overflow scrollable containers (divs, main elements)
    // This is crucial for modern mobile mockups where individual views/main elements have "overflow-y-auto"
    const scrollContainers = document.querySelectorAll(
      '.overflow-y-auto, .overflow-y-scroll, main, [class*="overflow-y-"]'
    );
    
    scrollContainers.forEach((container) => {
      container.scrollTo({ top: 0, behavior: 'instant' as any });
    });
  }, watch);

  return null; // This component handles side-effects only and has no visual interface
}

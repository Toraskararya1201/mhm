import { ReactNode, useState, useRef, useEffect } from 'react';

interface ScrollingCardContainerProps {
  children: ReactNode;
}

const ScrollingCardContainer = ({ children }: ScrollingCardContainerProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.clientX;
    const walk = (x - (e.currentTarget as any).offsetLeft) * 1;
    (e.currentTarget as any).scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let currentScroll = 0;

    const animate = () => {
      if (!isPaused && !isDragging) {
        currentScroll += 0.5;
        if (currentScroll >= container.scrollWidth - container.clientWidth) {
          currentScroll = 0;
        }
        container.scrollLeft = currentScroll;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused, isDragging]);

  const handleMouseLeaveContainer = () => {
    setIsPaused(false);
    handleMouseUp();
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-6 overflow-x-auto scroll-smooth pb-4 cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeaveContainer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        scrollBehavior: 'smooth',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollingCardContainer;

import { useState } from "react";

export const useSwipeRow = ({
  swipeOffset = 80,
  enabled = true,
}: {
  swipeOffset?: number;
  enabled?: boolean;
}) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const [offset, setOffset] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX !== null) {
      const dx = e.touches[0].clientX - startX;
      setOffset(dx);
    }
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (offset < -swipeOffset) {
      setIsSwiped(true);
    } else if (offset > swipeOffset) {
      setIsSwiped(false);
    }
    setOffset(0);
    setStartX(null);
    e.stopPropagation();
    e.preventDefault();
  };

  if (!enabled) {
    return {
      onTouchMove: () => {},
      onTouchStart: () => {},
      onTouchEnd: () => {},
      isSwiped: false,
    };
  }

  return {
    onTouchMove: handleTouchMove,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    isSwiped,
  };
};

export default useSwipeRow;

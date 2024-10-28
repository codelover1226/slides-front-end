import { useEffect, useState } from "react";

const getPageOffset = () => ({
  x: window.pageXOffset,
  y: window.pageYOffset,
});

const useWindowScroll = () => {
  const [position, setPosition] = useState(getPageOffset);

  useEffect(() => {
    const handleScroll = () => {
      setPosition(getPageOffset);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return position;
};

export default useWindowScroll;

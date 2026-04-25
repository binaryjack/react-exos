//--------------------EXERCICE 5----------------------
import { useCallback, useEffect, useState } from 'react';

export function WindowWidth() {
  const [width, setWidth] = useState<number>(0);
  const handleResize = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return <div>current window width : {width}</div>;
}

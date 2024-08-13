import { useCallback, useEffect, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';

const useClipboard = (value: string) => {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    let timeoutId: number | null = null;

    if (hasCopied) {
      timeoutId = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hasCopied]);

  const onCopy = useCallback(() => {
    copyToClipboard(value);
    setHasCopied(true);
  }, [value]);

  return { onCopy, hasCopied };
};

export { useClipboard };

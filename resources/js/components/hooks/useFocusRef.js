import React, {useEffect, useRef, useState} from 'react';

export const useFocusRef = (focusRef) => {
  const [focused, setFocused] = useState(false);
  const handlerFocus = e => {
    if (!focusRef.current || focusRef.current.contains(e.target)) {
      setFocused(true)
    } else {
      setFocused(false)
    }
  }

  useEffect( () => {
    document.addEventListener('mouseover', handlerFocus)
    return () => {
      document.removeEventListener('mouseover', handlerFocus)
    }
  });

  return (focused);
};

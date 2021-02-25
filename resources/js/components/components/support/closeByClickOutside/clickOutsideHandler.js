import React, {useEffect} from 'react';

export const clickOutsideHandler = (callback, ref) => {

  const actionByClickOutside = e => {
    if (!ref.current || ref.current.contains(e.target)) {
      return;
    }
    callback();
  };

  useEffect(() => {
    document.addEventListener('mousedown', actionByClickOutside);
    return () => {
      document.removeEventListener('mousedown', actionByClickOutside)
    }
  })
};

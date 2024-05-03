"use client";
import React, { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: any, onOutsideClick: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

type OutsideAlerterProps = {
  children: React.ReactNode;
  onOutsideClick: () => void;
};

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(props: OutsideAlerterProps) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.onOutsideClick);

  return <div ref={wrapperRef}>{props.children}</div>;
}

export default OutsideAlerter;

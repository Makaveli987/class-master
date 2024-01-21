import React from "react";

export default function LinearLoader() {
  return (
    <div className="w-full">
      <div className="h-1.5 w-full bg-primary/20 overflow-hidden">
        <div className="animate-progress w-full h-full bg-primary origin-left-right"></div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10; // Adjust increment speed as needed
      });
    }, 200); // Update every 200ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-min-height grid items-center justify-center">
      <span className="loader"></span>
    </div>
  );
}

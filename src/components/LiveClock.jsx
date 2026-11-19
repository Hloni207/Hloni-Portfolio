import React, { useState, useEffect } from 'react';

export default function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      
      const timeFormatted = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const dateFormatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      setTimeStr(timeFormatted);
      setDateStr(dateFormatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <span className="text-[14px] text-[#666666] tracking-tight">
        Local time • Loading...
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[14px] text-[#555555] font-mono">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span>{dateStr}</span>
      <span className="text-black font-semibold">{timeStr}</span>
    </div>
  );
}

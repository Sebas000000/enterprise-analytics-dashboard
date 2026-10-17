import React, { useEffect, useState } from 'react';
import { Clock, Server } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [secondsAgo, setSecondsAgo] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 60 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 h-7 bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-800/70 text-[11px] text-zinc-400 select-none">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Left: System Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          </span>
          <span className="font-medium text-zinc-300">All systems operational</span>
          <span className="text-zinc-600">·</span>
          <span className="font-mono text-zinc-500 text-[10px]">us-east-1</span>
        </div>

        {/* Center: Live update ticker & UTC Note */}
        <div className="hidden sm:flex items-center gap-3 text-zinc-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span>Updated {secondsAgo}s ago</span>
          </div>
          <span>·</span>
          <span>All timestamps in UTC</span>
        </div>

        {/* Right: API Version & Region */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded">
            <Server className="w-2.5 h-2.5 text-zinc-500" />
            API v2.8.1
          </span>
        </div>
      </div>
    </footer>
  );
};

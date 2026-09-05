import React from 'react';
import {
  Map,
  Users,
  QrCode,
  Heart,
  History,
  Shield,
} from 'lucide-react';

interface BottomNavProps {
  activeView: 'map' | 'group' | 'sos' | 'profile' | 'history';
  onViewChange: (view: 'map' | 'group' | 'sos' | 'profile' | 'history') => void;
  pendingRequestCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = React.memo(({
  activeView,
  onViewChange,
  pendingRequestCount = 0,
}) => {
  const tabs = [
    {
      id: 'map' as const,
      label: 'Live Ride',
      icon: <Map className="w-5 h-5" />,
    },
    {
      id: 'group' as const,
      label: 'Group Sync',
      icon: <Users className="w-5 h-5" />,
      badge: pendingRequestCount > 0 ? pendingRequestCount : null,
    },
    {
      id: 'sos' as const,
      label: 'QR Badge',
      icon: <QrCode className="w-5 h-5" />,
    },
    {
      id: 'profile' as const,
      label: 'Medical I.C.E.',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      id: 'history' as const,
      label: 'Logs',
      icon: <History className="w-5 h-5" />,
    },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-2 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-cyan-700 font-bold' : 'text-slate-600 hover:text-slate-950 font-medium'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">{tab.label}</span>
            {isActive && <span className="w-1 h-1 rounded-full bg-cyan-700 -mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
});

BottomNav.displayName = 'BottomNav';

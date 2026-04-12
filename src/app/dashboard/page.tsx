
"use client"

import React, { useEffect, useMemo, memo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  LayoutDashboard, 
  LineChart, 
  LogOut, 
  Activity,
  PieChart,
  User,
  Newspaper,
  History,
  Crown,
  Zap,
  Globe,
  Loader2,
  Menu,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { SignalCard } from '@/components/SignalCard';
import { Paywall } from '@/components/Paywall';
import { AdminPanel } from '@/components/AdminPanel';
import { MobileNav } from '@/components/MobileNav';
import { useTradingSignals } from '@/hooks/use-trading-signals';
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { query, collection, orderBy, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

const NewsTimeline = dynamic(() => import('@/components/tradingview/NewsTimeline').then(mod => mod.NewsTimeline), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { 
    signals, 
    fetchSignal, 
    unlockSignal,
    viewedSignalIds,
    loading,
    isVip,
    signalsUsed,
    isSyncing
  } = useTradingSignals();
  
  const [mounted, setMounted] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router, mounted]);

  const liveSignalsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'tradingSignals'), orderBy('createdAt', 'desc'), limit(10));
  }, [db, user?.uid]); 

  const { data: liveSignals, isLoading: liveSignalsLoading } = useCollection(liveSignalsQuery);

  const instruments = useMemo(() => [
    { symbol: 'GOLD', name: 'XAUUSD', type: 'Forex' as const },
    { symbol: 'BTC', name: 'BTCUSD', type: 'Crypto' as const },
    { symbol: 'ETH', name: 'ETHUSD', type: 'Crypto' as const },
    { symbol: 'EUR', name: 'EURUSD', type: 'Forex' as const },
    { symbol: 'GBP', name: 'GBPUSD', type: 'Forex' as const },
    { symbol: 'JPY', name: 'USDJPY', type: 'Forex' as const },
    { symbol: 'SOL', name: 'SOLUSD', type: 'Crypto' as const },
    { symbol: 'XRP', name: 'XRPUSD', type: 'Crypto' as const },
  ], []);

  const handleFetch = useCallback(async (symbol: string, type: 'Forex' | 'Crypto') => {
    const status = await fetchSignal(symbol, type);
    if (status === 'limit_reached') setPaywallOpen(true);
  }, [fetchSignal]);

  const handleUnlock = useCallback(async (id: string, sig: any) => {
    const success = await unlockSignal(id, sig);
    if (!success && !isVip && signalsUsed >= 7) {
      setPaywallOpen(true);
    }
  }, [unlockSignal, isVip, signalsUsed]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-x-hidden gpu-stable">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border bg-card/40 backdrop-blur-xl hidden lg:flex flex-col sticky top-0 h-screen gpu-stable">
        <div className="p-6">
          <div className="flex items-center gap-2 text-lg font-black tracking-tighter">
            <LineChart className="h-6 w-6 text-primary" />
            DEEBDATA <span className="text-primary">TRADING</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="AI Terminal" active />
          <NavItem href="/manual-analysis" icon={<Award className="h-4 w-4" />} label="Hassan Pro" />
          <NavItem href="/analysis" icon={<PieChart className="h-4 w-4" />} label="Technical Hub" />
          <NavItem href="/history" icon={<History className="h-4 w-4" />} label="Execution Log" />
          <NavItem href="/profile" icon={<User className="h-4 w-4" />} label="Identity" />
        </nav>

        <div className="p-4 space-y-2">
          {!isVip && (
            <Button onClick={() => setPaywallOpen(true)} className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase text-[10px] rounded-xl animate-pulse-gold">
              <Crown className="h-4 w-4 mr-2" /> Activate VIP
            </Button>
          )}
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive h-10" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 bg-background/20 flex flex-col max-w-full relative overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-card/40 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-background border-r border-border">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2 text-lg font-black tracking-tighter">
                    <LineChart className="h-6 w-6 text-primary" />
                    DEEBDATA
                  </div>
                </div>
                <nav className="p-4 space-y-1">
                  <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="AI Terminal" active />
                  <NavItem href="/manual-analysis" icon={<Award className="h-4 w-4" />} label="Hassan Pro" />
                  <NavItem href="/analysis" icon={<PieChart className="h-4 w-4" />} label="Technical Hub" />
                  <NavItem href="/history" icon={<History className="h-4 w-4" />} label="Execution Log" />
                  <NavItem href="/profile" icon={<User className="h-4 w-4" />} label="Identity" />
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-[10px] md:text-xs font-black uppercase tracking-widest hidden xs:block">Institutional AI Terminal</h1>
            {!isVip ? (
              <Badge variant="outline" className="text-[8px] font-black uppercase border-border text-amber-500">
                {signalsUsed}/7 Signals
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[8px] font-black uppercase border-amber-500/20 text-amber-500">
                VIP
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div 
              onClick={() => {
                const count = (window as any).adminClicks || 0;
                (window as any).adminClicks = count + 1;
                if ((window as any).adminClicks >= 7) {
                  setIsAdminOpen(true);
                  (window as any).adminClicks = 0;
                }
              }}
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer"
            >
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </div>
        </header>

        {isSyncing ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing AI Core...</p>
          </div>
        ) : (
          <div className="p-4 md:p-8 space-y-6 md:space-y-8 flex-1 overflow-x-hidden">
             <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 md:p-6 flex items-start gap-3 md:gap-4">
               <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse shrink-0 mt-0.5" />
               <p className="text-[10px] md:text-xs font-medium">
                 يعتمد هذا القسم على <span className="font-black text-primary">الذكاء الاصطناعي</span>. لرؤية تحليلات حسن ديب، انتقل لصفحة <Link href="/manual-analysis" className="underline font-black text-amber-500">Hassan Pro</Link>.
               </p>
             </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
              <div className="xl:col-span-3 space-y-6 md:space-y-8">
                <section className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs md:text-lg font-black tracking-tighter uppercase flex items-center gap-2">
                      <Globe className="h-4 w-4 md:h-5 md:w-5 text-accent" /> 
                      AI Global Feed
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {liveSignalsLoading ? (
                      <div className="col-span-full py-12 flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Mapping Markets...</p>
                      </div>
                    ) : liveSignals?.map((sig) => (
                      <SignalCard 
                        key={sig.id}
                        symbol={sig.asset}
                        type={sig.asset.includes('BTC') || sig.asset.includes('ETH') ? 'Crypto' : 'Forex'}
                        signal={sig}
                        isLocked={!isVip && !viewedSignalIds.has(sig.id)}
                        onUnlock={() => handleUnlock(sig.id, sig)}
                        onUpgradeClick={() => setPaywallOpen(true)}
                      />
                    ))}
                  </div>
                </section>

                <section className="space-y-3 md:space-y-4">
                  <h2 className="text-xs md:text-lg font-black tracking-tighter uppercase">AI Pulse Network</h2>
                  <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
                    {instruments.map(inst => (
                      <Button 
                        key={inst.symbol} 
                        variant="outline" 
                        size="sm" 
                        className="h-9 md:h-10 px-4 md:px-6 text-[9px] md:text-[10px] font-black uppercase bg-card/10 border-white/5 whitespace-nowrap rounded-xl hover:bg-primary snap-start" 
                        onClick={() => handleFetch(inst.name, inst.type)}
                        disabled={loading}
                      >
                        <Zap className={cn("h-3 w-3 mr-1.5", loading && "animate-pulse")} /> {inst.symbol}
                      </Button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {Object.entries(signals).map(([symbol, signal]) => (
                      signal && (
                        <SignalCard 
                          key={symbol}
                          symbol={symbol}
                          type={instruments.find(i => i.name === symbol)?.type || 'Forex'}
                          signal={signal}
                          isLocked={false}
                        />
                      )
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-4 xl:sticky xl:top-24 h-fit hidden xl:block">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <Newspaper className="h-4 w-4 text-accent" /> Intelligence
                </h3>
                <div className="rounded-2xl border border-border glassmorphism overflow-hidden h-[500px] shadow-2xl">
                  <NewsTimeline height="100%" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <MobileNav />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <Paywall isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
      <WhatsAppButton />
    </div>
  );
}

const NavItem = memo(({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) => (
  <Link 
    href={href} 
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
      active ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
    )}
  >
    {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </Link>
));

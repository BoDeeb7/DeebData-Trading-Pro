"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, doc, onSnapshot } from 'firebase/firestore';
import { 
  ArrowLeft, 
  History, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Layers,
  Award,
  Lock,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Paywall } from '@/components/Paywall';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Profile sync for VIP status
  useEffect(() => {
    if (!user || !db) return;
    const profileRef = doc(db, 'users', user.uid, 'profile', user.uid);
    return onSnapshot(profileRef, (snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [user, db]);

  const historyQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'signalHistory'),
      orderBy('viewedAt', 'desc'),
      limit(20)
    );
  }, [db, user]);

  const { data: history, isLoading: historyLoading } = useCollection(historyQuery);

  const isVip = profile?.isSubscribed === true;

  // Calculate aggregated stats from history
  const stats = React.useMemo(() => {
    if (!history) return { total: 0, win: 0, pips: 0 };
    const total = history.length;
    const pips = history.reduce((acc, curr) => acc + (curr.pipsResult || 0), 0);
    const win = history.filter(h => (h.pipsResult || 0) > 0).length;
    return { total, win, pips };
  }, [history]);

  if (!mounted || isUserLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Activity className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Terminal
            </Button>
          </Link>
          <h1 className="text-xl font-bold font-headline flex items-center gap-2 uppercase tracking-tighter">
            <History className="h-5 w-5 text-primary" /> Execution Log
          </h1>
        </div>
        {!isVip && (
          <Button onClick={() => setPaywallOpen(true)} className="h-10 bg-amber-500 text-black font-black uppercase text-[9px] px-6 rounded-xl animate-pulse-gold">
            Unlock Full Tracker
          </Button>
        )}
      </header>

      <main className="flex-1 p-8 container mx-auto space-y-8">
        {/* Performance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {!isVip && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-background/60 backdrop-blur-xl rounded-[2.5rem] border border-amber-500/20 shadow-2xl">
               <Crown className="h-10 w-10 text-amber-500 mb-4 animate-bounce" />
               <p className="text-lg font-black uppercase tracking-tighter">Pips Tracker (VIP Only)</p>
               <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1 mb-6">Upgrade to analyze your institutional performance.</p>
               <Button onClick={() => setPaywallOpen(true)} className="bg-amber-500 text-black font-black uppercase text-[10px] px-10 h-12 rounded-2xl">
                 Activate VIP Terminal
               </Button>
            </div>
          )}
          
          <Card className={cn("border-border glassmorphism rounded-3xl shadow-none", !isVip && "blur-sm")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Lifetime Pips</p>
                  <p className="text-3xl font-black font-headline text-success">+{stats.pips}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={cn("border-border glassmorphism rounded-3xl shadow-none", !isVip && "blur-sm")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Win Accuracy</p>
                  <p className="text-3xl font-black font-headline text-primary">{stats.total > 0 ? Math.round((stats.win / stats.total) * 100) : 0}%</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn("border-border glassmorphism rounded-3xl shadow-none", !isVip && "blur-sm")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Signals Analyzed</p>
                  <p className="text-3xl font-black font-headline text-accent">{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed History Table */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Recent Interactions</h2>
          <div className="space-y-4">
            {history?.map((signal) => (
              <Card key={signal.id} className="border-border glassmorphism rounded-2xl overflow-hidden hover:border-primary/30 transition-all group shadow-none">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${signal.direction === 'Buy' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                        {signal.direction === 'Buy' ? <TrendingUp className="h-6 w-6 text-success" /> : <TrendingDown className="h-6 w-6 text-destructive" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-lg tracking-tighter">{signal.symbol}</p>
                          <Badge variant="outline" className="text-[8px] uppercase font-black bg-foreground/5 border-border">{signal.type}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {signal.viewedAt?.toDate().toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 md:gap-12">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Entry</p>
                        <p className="text-xs font-mono font-bold">{signal.entryPrice}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-accent uppercase tracking-widest">TP</p>
                        <p className="text-xs font-mono font-bold text-accent">{signal.takeProfit}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-success uppercase tracking-widest">Result</p>
                        <p className={`text-xs font-mono font-bold ${signal.pipsResult > 0 ? 'text-success' : 'text-destructive'}`}>
                          {signal.pipsResult > 0 ? '+' : ''}{signal.pipsResult} Pips
                        </p>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <Badge className={signal.pipsResult > 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}>
                        {signal.pipsResult > 0 ? 'PROFITABLE' : 'STOP LOSS'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {history?.length === 0 && (
              <div className="text-center py-20 bg-card/10 rounded-3xl border border-dashed border-border">
                <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No terminal history</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Paywall isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}

"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { 
  Mail, 
  ArrowLeft, 
  Save, 
  Activity, 
  User,
  Crown,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Paywall } from '@/components/Paywall';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [name, setName] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!user || !db) return;

    const profileRef = doc(db, 'users', user.uid, 'profile', user.uid);
    const unsubscribe = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setName(data.name || '');
      }
      setIsInitialLoading(false);
    }, () => setIsInitialLoading(false));

    return () => unsubscribe();
  }, [user, db]);

  if (isUserLoading || isInitialLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Activity className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  const handleSave = async () => {
    if (!user || !db) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid, 'profile', user.uid), {
        name,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Updated", description: "Identity profile saved." });
    } finally {
      setIsSaving(false);
    }
  };

  const isVip = profile?.isSubscribed === true || user?.email === 'HassanDeeb@example.com';

  return (
    <div className="min-h-screen bg-[#020617] text-foreground flex flex-col">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Terminal
            </Button>
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tighter">Trader Profile</h1>
        </div>
        <div className="text-[10px] text-muted-foreground/40 italic uppercase tracking-widest font-black">Powered by Hassan Deeb</div>
      </header>

      <main className="container mx-auto px-6 py-12 flex-1 max-w-5xl">
        <div className="space-y-8">
          {/* Identity Header */}
          <Card className="border-white/5 glassmorphism rounded-3xl overflow-hidden p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-4xl font-black text-primary">
                {name ? name[0].toUpperCase() : <User className="h-16 w-16" />}
              </div>
              {isVip && (
                <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-black animate-pulse-gold">
                  <Crown className="h-5 w-5 text-black" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h2 className="text-3xl font-black tracking-tighter uppercase">{name || 'Anonymous Trader'}</h2>
                <Badge variant="outline" className={cn(
                  "uppercase font-black text-[9px] px-3 py-1",
                  isVip ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-white/5 border-white/10"
                )}>
                  {isVip ? 'VIP MEMBER' : 'FREE MEMBER'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" /> {user?.email}
              </p>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="h-12 bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]">
              {isSaving ? <Activity className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Sync Profile
            </Button>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Details */}
            <Card className="border-white/5 glassmorphism p-8 rounded-3xl">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Identity Information</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Display Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-14 bg-black/40 border-white/10 text-lg font-black rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Account ID</label>
                  <Input value={user?.uid} disabled className="h-14 bg-black/20 border-white/5 text-muted-foreground font-mono text-xs rounded-2xl" />
                </div>
              </div>
            </Card>

            {/* Subscription Card */}
            <Card className={cn(
              "p-8 rounded-3xl border transition-all",
              isVip ? "border-amber-500/30 bg-amber-500/[0.02]" : "border-white/5 glassmorphism"
            )}>
              <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Subscription Hub</CardTitle>
                {isVip && <ShieldCheck className="h-4 w-4 text-amber-500" />}
              </CardHeader>
              
              <div className="space-y-6">
                {!isVip ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-xl font-black uppercase tracking-tight">Free Member</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        {profile?.freeSignalsUsed || 0}/7 Signals Analyzed
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase">
                        <CheckCircle2 className="h-3 w-3" /> 7 Signals Lifetime Limit
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase">
                        <CheckCircle2 className="h-3 w-3" /> Basic History Only
                      </div>
                    </div>
                    <Button onClick={() => setPaywallOpen(true)} className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-tight rounded-2xl animate-pulse-gold">
                      Upgrade to VIP - $25/Mo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-xl font-black uppercase tracking-tight text-amber-500">Institutional VIP</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        Unlimited Core Access Enabled
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-amber-500 uppercase">
                        <CheckCircle2 className="h-3 w-3" /> Unlimited AI Signals
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-amber-500 uppercase">
                        <CheckCircle2 className="h-3 w-3" /> Full History & Pips Tracker
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-amber-500 uppercase">
                        <CheckCircle2 className="h-3 w-3" /> Advanced Technical Hub
                      </div>
                    </div>
                    <div className="pt-4 text-center">
                       <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">Hassan Deeb Professional Member</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Paywall isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}

"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { 
  ArrowLeft, 
  Award, 
  Activity, 
  LayoutDashboard, 
  PieChart, 
  History, 
  User, 
  LogOut, 
  Crown,
  Zap,
  CheckCircle2,
  Instagram,
  MessageCircle,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { MobileNav } from '@/components/MobileNav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SignalCard } from '@/components/SignalCard';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={cn("fill-current", className)} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.91-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

export default function ManualAnalysisPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const manualSignalsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'manualSignals'), orderBy('createdAt', 'desc'), limit(15));
  }, [db, user]);

  const { data: signals, isLoading } = useCollection(manualSignalsQuery);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  if (!mounted || isUserLoading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Activity className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-x-hidden gpu-stable">
      <aside className="w-64 border-r border-border bg-card/40 backdrop-blur-xl hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-2 text-lg font-black tracking-tighter">
            <Award className="h-6 w-6 text-amber-500" />
            DEEBDATA <span className="text-amber-500">PRO</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="AI Terminal" />
          <NavItem href="/manual-analysis" icon={<Award className="h-4 w-4" />} label="Hassan Pro" active />
          <NavItem href="/analysis" icon={<PieChart className="h-4 w-4" />} label="Technical Hub" />
          <NavItem href="/history" icon={<History className="h-4 w-4" />} label="Execution Log" />
          <NavItem href="/profile" icon={<User className="h-4 w-4" />} label="Identity" />
        </nav>
        <div className="p-4">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive h-10" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
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
                  <div className="flex items-center gap-2 text-lg font-black tracking-tighter text-amber-500">
                    <Award className="h-6 w-6" /> DEEBDATA
                  </div>
                </div>
                <nav className="p-4 space-y-1">
                  <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="AI Pulse" />
                  <NavItem href="/manual-analysis" icon={<Award className="h-4 w-4" />} label="Hassan Pro" active />
                  <NavItem href="/analysis" icon={<PieChart className="h-4 w-4" />} label="Tech Hub" />
                  <NavItem href="/history" icon={<History className="h-4 w-4" />} label="Exec Log" />
                  <NavItem href="/profile" icon={<User className="h-4 w-4" />} label="Profile" />
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-sm md:text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Award className="h-4 w-4 md:h-5 md:w-5 text-amber-500" /> Pro Hub
            </h1>
          </div>
          <div className="flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expert Link</span>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8 container max-w-6xl mx-auto">
          <Card className="border-amber-500/20 bg-amber-500/[0.02] rounded-3xl md:rounded-[2.5rem] overflow-hidden glassmorphism border-2">
            <CardContent className="p-6 md:p-12">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start text-center lg:text-left">
                <div className="relative shrink-0">
                  <div className="h-24 w-24 md:h-44 md:w-44 rounded-2xl md:rounded-[2rem] bg-black border-2 border-amber-500/30 flex items-center justify-center shadow-2xl">
                    <Crown className="h-12 w-12 md:h-24 md:w-24 text-amber-500" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 md:h-12 md:w-12 rounded-full bg-success flex items-center justify-center border-4 border-background animate-pulse">
                    <CheckCircle2 className="h-4 w-4 md:h-6 md:w-6 text-black" />
                  </div>
                </div>

                <div className="flex-1 space-y-4 md:space-y-6">
                  <div className="space-y-1">
                    <Badge className="bg-amber-500 text-black font-black uppercase tracking-widest text-[8px] md:text-[10px] px-3 py-0.5">Expert Analyst</Badge>
                    <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter leading-none">Hassan Deeb</h2>
                    <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Institutional Strategy</p>
                  </div>

                  <p className="text-muted-foreground text-[10px] md:text-base font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    أهلاً بكم في مساحتي الخاصة. هنا أشارككم قراءة حقيقية لتدفقات السيولة بعيداً عن الذكاء الاصطناعي. التحليلات تعتمد على رؤية فنية مؤسساتية، يرجى دائماً الالتزام بإدارة رأس المال.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-4">
                    <Link href="https://wa.me/96181438747" target="_blank">
                      <Button size="sm" className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black uppercase text-[8px] md:text-xs rounded-xl px-3 md:px-6 h-9 md:h-12 flex items-center gap-1.5 group">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </Button>
                    </Link>
                    <Link href="https://t.me/hssn_deeb" target="_blank">
                      <Button size="sm" className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-black uppercase text-[8px] md:text-xs rounded-xl px-3 md:px-6 h-9 md:h-12 flex items-center gap-1.5 group">
                        <TelegramIcon className="h-4 w-4" /> Telegram
                      </Button>
                    </Link>
                    <Link href="https://www.instagram.com/hssn_deeb" target="_blank">
                      <Button size="sm" className="bg-gradient-to-tr from-[#f09433] to-[#bc1888] text-white font-black uppercase text-[8px] md:text-xs rounded-xl px-3 md:px-6 h-9 md:h-12 flex items-center gap-1.5 group">
                        <Instagram className="h-4 w-4" /> Instagram
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <h3 className="text-sm md:text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" /> Pro Feed
            </h3>
            <Badge variant="outline" className="border-border text-[7px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground">Live Expert Hub</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {isLoading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center">
                <Activity className="h-8 w-8 text-amber-500 animate-spin mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Syncing Pro Strategy...</p>
              </div>
            ) : signals?.length === 0 ? (
              <div className="col-span-full py-20 text-center border border-dashed border-border rounded-3xl">
                <Zap className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm font-black uppercase text-muted-foreground">Monitoring Liquidity...</p>
              </div>
            ) : (
              signals?.map((sig) => (
                <SignalCard 
                  key={sig.id}
                  symbol={sig.asset}
                  type={sig.asset.includes('/') ? 'Forex' : 'Crypto'}
                  signal={sig}
                  isLocked={false}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}

const NavItem = ({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) => (
  <Link 
    href={href} 
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
      active ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
    )}
  >
    {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </Link>
);

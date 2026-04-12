"use client"

import React, { useState, useEffect } from 'react';
import { ShieldCheck, BarChart2, FilePlus2, Lock, Activity, Loader2, Search, Trash2, Award } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, doc, deleteDoc, orderBy, limit } from 'firebase/firestore';
import { cn } from '@/lib/utils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const db = useFirestore();
  const { user } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  
  const [asset, setAsset] = useState('');
  const [direction, setDirection] = useState<'Buy' | 'Sell'>('Buy');
  const [entry, setEntry] = useState('');
  const [tp, setTp] = useState('');
  const [sl, setSl] = useState('');
  const [reason, setReason] = useState('');

  const adminEmail = 'hassandeeb473@gmail.com';

  useEffect(() => {
    if (user?.email === adminEmail) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [user]);

  const manualSignalsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'manualSignals'), orderBy('createdAt', 'desc'), limit(15));
  }, [db]);
  const { data: manualSignals } = useCollection(manualSignalsQuery);

  const handleManualBroadcast = async () => {
    if (!db || !asset || !entry || !tp || !sl) {
      toast({ title: "Required Fields Missing", variant: "destructive" });
      return;
    }
    setBroadcastLoading(true);
    try {
      await addDoc(collection(db, 'manualSignals'), {
        asset: asset.toUpperCase(),
        direction,
        entryPrice: parseFloat(entry),
        takeProfit: parseFloat(tp),
        stopLoss: parseFloat(sl),
        reasoning: reason || "Professional institutional analysis by Hassan Deeb.",
        confidenceScore: 100,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Manual Analysis Published!" });
      setAsset(''); setEntry(''); setTp(''); setSl(''); setReason('');
    } finally {
      setBroadcastLoading(false);
    }
  };

  const deleteManualSignal = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, 'manualSignals', id));
    toast({ title: "Signal Removed" });
  };

  if (!isAuthorized && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md border-white/10 glassmorphism p-6 md:p-8 mx-4">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
              <Lock className="h-8 w-8 md:h-10 md:w-10 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-black uppercase">Access Denied</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Restricted to Hassan Deeb.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={onClose} className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl font-black uppercase text-[10px]">Close Terminal</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-hidden border-white/10 glassmorphism p-0 mx-auto">
        <div className="h-full flex flex-col p-4 md:p-10 overflow-y-auto custom-scrollbar">
          <DialogHeader className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <DialogTitle className="text-xl md:text-3xl font-black uppercase tracking-tighter">Admin <span className="text-primary">Terminal</span></DialogTitle>
              </div>
              <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em]">Institutional Control Center</p>
            </div>
          </DialogHeader>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 h-10 md:h-12 p-1 rounded-xl mb-6 md:mb-8">
              <TabsTrigger value="manual" className="font-black uppercase text-[7px] md:text-[10px] tracking-tight md:tracking-widest">Manual Setup</TabsTrigger>
              <TabsTrigger value="ai" className="font-black uppercase text-[7px] md:text-[10px] tracking-tight md:tracking-widest">AI Market</TabsTrigger>
              <TabsTrigger value="users" className="font-black uppercase text-[7px] md:text-[10px] tracking-tight md:tracking-widest">Trader Hub</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-6 md:space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <Card className="bg-white/5 border-white/10 p-5 md:p-8 space-y-6 rounded-2xl md:rounded-[2.5rem] shadow-none">
                  <h3 className="font-black text-lg md:text-xl uppercase tracking-tight flex items-center gap-2">
                    <Award className="h-5 w-5 md:h-6 md:w-6 text-amber-500" /> Hassan Broadcast
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground ml-1">Symbol</label>
                      <Input value={asset} onChange={(e) => setAsset(e.target.value)} placeholder="GOLD or BTC/USD" className="bg-black/40 border-white/5 h-12 md:h-14 font-bold rounded-xl md:rounded-2xl" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground ml-1">Direction</label>
                      <Select value={direction} onValueChange={(val: any) => setDirection(val)}>
                        <SelectTrigger className="bg-black/40 border-white/5 h-12 md:h-14 font-bold rounded-xl md:rounded-2xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Buy">BUY</SelectItem>
                          <SelectItem value="Sell">SELL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground ml-1">Entry</label>
                      <Input value={entry} onChange={(e) => setEntry(e.target.value)} className="bg-black/40 border-white/5 h-12 md:h-14 rounded-xl md:rounded-2xl" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground ml-1">Take Profit</label>
                      <Input value={tp} onChange={(e) => setTp(e.target.value)} className="bg-black/40 border-white/5 h-12 md:h-14 rounded-xl md:rounded-2xl text-success" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground ml-1">Stop Loss</label>
                      <Input value={sl} onChange={(e) => setSl(e.target.value)} className="bg-black/40 border-white/5 h-12 md:h-14 rounded-xl md:rounded-2xl text-destructive" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground ml-1">Note / Reason</label>
                      <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Technical reason..." className="bg-black/40 border-white/5 h-12 md:h-14 rounded-xl md:rounded-2xl" />
                    </div>
                  </div>
                  <Button onClick={handleManualBroadcast} disabled={broadcastLoading} className="w-full h-14 md:h-16 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl md:rounded-2xl shadow-lg shadow-amber-500/20">
                    {broadcastLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Broadcast to Hassan Pro'}
                  </Button>
                </Card>

                <Card className="bg-white/5 border-white/10 p-5 md:p-8 space-y-6 rounded-2xl md:rounded-[2.5rem] shadow-none flex flex-col">
                  <h3 className="font-black text-lg md:text-xl uppercase tracking-tight">Active Pro Feed</h3>
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] md:max-h-[600px] pr-2 custom-scrollbar">
                    {manualSignals?.map(sig => (
                      <div key={sig.id} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group gap-2">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                           <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl shrink-0 flex items-center justify-center", sig.direction === 'Buy' ? 'bg-success/10' : 'bg-destructive/10')}>
                              <BarChart2 className={cn("h-5 w-5 md:h-6 md:w-6", sig.direction === 'Buy' ? 'text-success' : 'text-destructive')} />
                           </div>
                           <div className="min-w-0">
                              <p className="font-black text-xs md:text-base uppercase tracking-tighter truncate">{sig.asset}</p>
                              <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-black truncate">{sig.direction} @ {sig.entryPrice}</p>
                           </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteManualSignal(sig.id)} className="text-destructive hover:bg-destructive/10 shrink-0">
                          <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border border-white/5">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Trader Email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="bg-black/40 h-12 md:h-14 pl-12 border-white/10 font-bold rounded-xl md:rounded-2xl" />
                </div>
                <Button className="bg-primary text-black font-black uppercase px-6 md:px-10 h-12 md:h-14 rounded-xl md:rounded-2xl text-[10px] md:text-xs">
                  Search Account
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

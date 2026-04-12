
"use client"

import React, { useState, memo, useMemo } from 'react';
import { Crown, Zap, TrendingUp, Newspaper, ArrowRight, Loader2, ShieldCheck, User, Hash, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Paywall = memo(({ isOpen, onClose }: PaywallProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'offer' | 'checkout' | 'pending'>('offer');
  
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  const isDetailsComplete = useMemo(() => {
    return senderName.trim().length > 3 && senderPhone.trim().length > 7;
  }, [senderName, senderPhone]);

  const handleNotifyAdmin = async () => {
    if (!isDetailsComplete) {
      toast({ title: "Missing Information", description: "Please provide your name and phone number.", variant: "destructive" });
      return;
    }
    
    setIsProcessing(true);
    // Simulation of notification
    setTimeout(() => {
      setIsProcessing(false);
      setStep('pending');
      toast({ title: "Request Dispatched", description: "Hassan Deeb notified. VIP activation in progress." });
    }, 1500);
  };

  const features = [
    { icon: <Zap className="h-5 w-5 text-primary" />, title: "Unlimited Signals", desc: "Unlock every AI pulse signal instantly." },
    { icon: <TrendingUp className="h-5 w-5 text-accent" />, title: "Pips Tracker", desc: "Analyze performance with institutional logs." },
    { icon: <Newspaper className="h-5 w-5 text-success" />, title: "Technical Hub", desc: "Full access to sentiment gauges and news." },
    { icon: <Crown className="h-5 w-5 text-amber-500" />, title: "Elite Terminal", desc: "Priority assistance and advanced analytics." },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isProcessing) {
        onClose();
        setTimeout(() => {
          setStep('offer');
          setSenderName('');
          setSenderPhone('');
        }, 300);
      }
    }}>
      <DialogContent className="sm:max-w-lg border-white/10 bg-black/95 backdrop-blur-2xl p-0 overflow-hidden shadow-2xl rounded-[2rem] border-2 border-amber-500/20">
        <div className="gpu-stable">
          {step === 'offer' ? (
            <div className="p-8 flex flex-col space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Crown className="h-10 w-10 text-amber-500" />
                </div>
                <DialogHeader>
                  <DialogTitle className="text-4xl font-black tracking-tighter text-white">
                    VIP <span className="text-amber-500">TERMINAL</span>
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground font-black uppercase tracking-widest text-[9px] mt-2">
                    INSTITUTIONAL GRADE ACCESS
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2">
                      {f.icon}
                      <span className="text-[10px] font-black uppercase">{f.title}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground/80 font-medium">{f.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-6">
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase">Access Fee</p>
                  <p className="text-3xl font-black text-white">$25<span className="text-xs text-muted-foreground/50 ml-1">/Mo</span></p>
                </div>
                <Button className="h-14 flex-1 text-base font-black bg-amber-500 hover:bg-amber-600 text-black rounded-2xl shadow-lg shadow-amber-500/20" onClick={() => setStep('checkout')}>
                  Upgrade Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : step === 'checkout' ? (
            <div className="p-8 space-y-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Checkout Hub</h3>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Verify Sender Details</p>
                </div>
              </div>

              <div className="space-y-4 bg-white/5 p-5 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em] mb-2 text-center">Required for Verification</p>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Full Name (As shown in payment)" 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="bg-black/40 border-white/10 h-12 pl-12 font-bold rounded-xl"
                    />
                  </div>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Phone Number (e.g. +961...)" 
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="bg-black/40 border-white/10 h-12 pl-12 font-bold rounded-xl"
                      type="tel"
                    />
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="visa" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 h-12 p-1 rounded-xl">
                  <TabsTrigger value="visa" className="font-black uppercase text-[9px] tracking-widest">Visa / Card</TabsTrigger>
                  <TabsTrigger value="wish" className="font-black uppercase text-[9px] tracking-widest">Wish Money</TabsTrigger>
                </TabsList>
                
                <TabsContent value="visa" className="pt-4 space-y-4 text-center">
                  <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                    <p className="text-[10px] font-black uppercase text-accent tracking-widest">Global Card Gateway</p>
                    <a 
                      href="https://www.suyool.com/RiLjpznPZaYe6EMwcCBUZc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-accent text-black font-black uppercase text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20"
                    >
                      Pay via Visa / Mastercard <CreditCard className="h-5 w-5" />
                    </a>
                  </div>
                  <Button 
                    onClick={handleNotifyAdmin} 
                    disabled={!isDetailsComplete || isProcessing}
                    className="w-full h-12 bg-white/5 text-white font-black uppercase text-[10px] rounded-2xl border border-white/10 hover:bg-white/10"
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'I have already paid'}
                  </Button>
                </TabsContent>
                
                <TabsContent value="wish" className="pt-4 space-y-4">
                  <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4 text-center">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Wish Money Transfer</p>
                    <div className="py-3 bg-black/40 rounded-xl border border-white/5">
                       <p className="text-xl font-black font-mono tracking-tighter text-white">+961 81 438 747</p>
                    </div>
                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Transfer $25 and confirm below</p>
                  </div>
                  <Button 
                    onClick={handleNotifyAdmin} 
                    disabled={!isDetailsComplete || isProcessing}
                    className="w-full h-14 bg-success text-black font-black uppercase text-[10px] rounded-2xl shadow-lg shadow-success/20"
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Transfer'}
                  </Button>
                </TabsContent>
              </Tabs>
              {!isDetailsComplete && (
                <p className="text-[8px] text-destructive text-center font-black uppercase tracking-widest animate-pulse">
                  * Provide Name & Phone to activate buttons
                </p>
              )}
            </div>
          ) : (
            <div className="p-12 text-center space-y-6 animate-in zoom-in duration-300">
               <div className="h-20 w-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto">
                 <Clock className="h-10 w-10 text-success" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Pending Review</h3>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                   Details for <span className="text-white">{senderName}</span> were sent. Hassan Deeb will activate your VIP terminal after verification.
                 </p>
               </div>
               <Button onClick={onClose} className="w-full h-14 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] rounded-2xl">
                 Back to Terminal
               </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
Paywall.displayName = 'Paywall';

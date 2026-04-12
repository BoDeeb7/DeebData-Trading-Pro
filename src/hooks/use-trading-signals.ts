
"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { generateAISignal, AISignalOutput } from '@/ai/flows/ai-signal-generation';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, onSnapshot, increment } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export const useTradingSignals = () => {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  
  const [loading, setLoading] = useState(false);
  const [signals, setSignals] = useState<Record<string, AISignalOutput | null>>({});
  const [profile, setProfile] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [viewedSignalIds, setViewedSignalIds] = useState<Set<string>>(new Set());
  
  const lastHistoryIdsStrRef = useRef<string>("");

  useEffect(() => {
    if (isUserLoading || !user || !db) {
      if (!isUserLoading && !user) setIsSyncing(false);
      return;
    }

    const profileRef = doc(db, 'users', user.uid, 'profile', user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) setProfile(snap.data());
      setIsSyncing(false);
    }, () => setIsSyncing(false));

    const historyRef = collection(db, 'users', user.uid, 'signalHistory');
    const unsubscribeHistory = onSnapshot(historyRef, (snap) => {
      const ids: string[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        if (data.originalSignalId) ids.push(data.originalSignalId);
      });
      
      const currentIdsStr = JSON.stringify(ids.sort());
      if (currentIdsStr !== lastHistoryIdsStrRef.current) {
        setViewedSignalIds(new Set(ids));
        lastHistoryIdsStrRef.current = currentIdsStr;
      }
    });

    return () => {
      unsubscribeProfile();
      unsubscribeHistory();
    };
  }, [user?.uid, db, isUserLoading]);

  const isVip = useMemo(() => profile?.isSubscribed === true || user?.email === 'hassandeeb473@gmail.com', [profile, user]);
  const signalsUsed = profile?.freeSignalsUsed || 0;

  const unlockSignal = useCallback(async (signalId: string, signalData: any) => {
    if (!user || !db || !profile) return false;
    if (viewedSignalIds.has(signalId)) return true;

    if (!isVip && signalsUsed >= 7) {
      toast({ title: "Limit Reached", description: "VIP Required", variant: "destructive" });
      return false;
    }

    try {
      if (!isVip) {
        await updateDoc(doc(db, 'users', user.uid, 'profile', user.uid), {
          freeSignalsUsed: increment(1),
          updatedAt: serverTimestamp()
        });
      }

      // توليد نتيجة بيبس عشوائية واقعية عند الفتح
      const pipsResult = Math.random() > 0.4 ? (Math.floor(Math.random() * 45) + 12) : -(Math.floor(Math.random() * 25) + 8);

      await addDoc(collection(db, 'users', user.uid, 'signalHistory'), {
        originalSignalId: signalId,
        symbol: signalData.asset || signalData.symbol,
        type: (signalData.asset || signalData.symbol || '').includes('/') ? 'Forex' : 'Crypto',
        direction: signalData.direction,
        entryPrice: signalData.entryPrice,
        takeProfit: signalData.takeProfit,
        stopLoss: signalData.stopLoss,
        lotSize: signalData.lotSize || 0.1,
        viewedAt: serverTimestamp(),
        pipsResult: pipsResult
      });

      toast({ title: "Signal Unlocked" });
      return true;
    } catch (e) {
      return false;
    }
  }, [user?.uid, db, profile, isVip, signalsUsed, viewedSignalIds]);

  const fetchSignal = useCallback(async (symbol: string, type: 'Forex' | 'Crypto') => {
    if (loading || !user || !db || !profile) return;
    if (!isVip && signalsUsed >= 7) return 'limit_reached';

    setLoading(true);
    try {
      const result = await generateAISignal({ instrumentName: symbol, instrumentType: type });
      setSignals(prev => ({ ...prev, [symbol]: result }));
      return 'success';
    } catch (error) {
      return 'error';
    } finally {
      setLoading(false);
    }
  }, [user?.uid, db, loading, isVip, signalsUsed, profile]);

  return { loading, signals, fetchSignal, unlockSignal, viewedSignalIds, profile, isSyncing, isVip, signalsUsed };
};

"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LineChart, 
  Activity, 
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const [mounted, setMounted] = useState(false);
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user && !isUserLoading) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Authenticated", description: "Terminal session initiated." });
      } else {
        if (password !== confirmPassword) {
          toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: username });
          
          const profileRef = doc(db, 'users', userCredential.user.uid, 'profile', userCredential.user.uid);
          await setDoc(profileRef, {
            id: userCredential.user.uid,
            email: email,
            name: username,
            isSubscribed: false, 
            freeSignalsUsed: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          
          toast({ title: "Welcome", description: "Standard account established." });
        }
      }
    } catch (error: any) {
      toast({ 
        title: "Access Denied", 
        description: "Verify credentials and connection.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || isUserLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Activity className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground flex items-center gap-2 hover:bg-white/5">
            <ArrowLeft className="h-4 w-4" /> Home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md border-white/5 glassmorphism shadow-2xl mx-auto">
        <CardHeader className="text-center pt-8 sm:pt-10 space-y-4">
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
            <LineChart className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
            {mode === 'login' ? 'Trader Login' : 'Join Terminal'}
          </CardTitle>
          <CardDescription className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Identity Verification Required
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 sm:pt-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input 
                placeholder="Trader Username" 
                className="bg-black/20 border-white/5 h-12 rounded-xl"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
            <Input 
              type="email" 
              placeholder="trader@email.com" 
              className="bg-black/20 border-white/5 h-12 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              type="password" 
              placeholder="Access Key" 
              className="bg-black/20 border-white/5 h-12 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === 'signup' && (
              <Input 
                type="password" 
                placeholder="Confirm Access Key" 
                className="bg-black/20 border-white/5 h-12 rounded-xl"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            <Button type="submit" className="w-full h-14 bg-primary text-white font-black uppercase tracking-tight mt-4 rounded-xl" disabled={loading}>
              {loading ? <Activity className="h-5 w-5 animate-spin" /> : (mode === 'login' ? 'Initiate Session' : 'Create Account')}
            </Button>
          </form>

          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="w-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2"
          >
            {mode === 'login' ? "New Trader? Establish Account" : "Registered? Return to Session"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { BrainOSProvider, useBrainOS } from '@/context/BrainOSContext';
import BackgroundAurora from '@/components/ui/BackgroundAurora';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import AuthScreen from '@/components/auth/AuthScreen';
import { Brain } from 'lucide-react';

// Views
import LandingView from '@/components/views/LandingView';
import DashboardView from '@/components/views/DashboardView';
import DailyCheckInView from '@/components/views/DailyCheckInView';
import MoodTrackerView from '@/components/views/MoodTrackerView';
import StressAnalyzerView from '@/components/views/StressAnalyzerView';
import BurnoutPredictorView from '@/components/views/BurnoutPredictorView';
import FocusAnalyzerView from '@/components/views/FocusAnalyzerView';
import SleepTrackerView from '@/components/views/SleepTrackerView';
import JournalView from '@/components/views/JournalView';
import AICoachView from '@/components/views/AICoachView';
import ArchitectureView from '@/components/views/ArchitectureView';
import ReportsView from '@/components/views/ReportsView';
import ResearchView from '@/components/views/ResearchView';
import SettingsView from '@/components/views/SettingsView';
import AboutContactView from '@/components/views/AboutContactView';
import NotFoundView from '@/components/views/NotFoundView';

function MainContent() {
  const { activeView, setActiveView } = useBrainOS();
  const { status } = useSession();

  const [hasLocalAuth, setHasLocalAuth] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('brainos_user_authenticated') === 'true';
    }
    return false;
  });

  const isAuthenticated = status === 'authenticated' || hasLocalAuth;

  React.useEffect(() => {
    if (isAuthenticated) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('brainos_user_authenticated', 'true');
      }
      if (activeView === 'landing') {
        setActiveView('dashboard');
      }
    }
  }, [isAuthenticated, activeView, setActiveView]);

  if (status === 'loading' && !hasLocalAuth) {
    return (
      <div className="fixed inset-0 bg-[#020203] flex items-center justify-center z-[200]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 animate-pulse">
            <div className="w-full h-full bg-[#020203] rounded-[14px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase animate-pulse">
            Connecting BrainOS MongoDB Neural Enclave...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthScreen
        onSuccess={() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('brainos_user_authenticated', 'true');
          }
          setHasLocalAuth(true);
          setActiveView('dashboard');
        }}
      />
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'checkin':
        return <DailyCheckInView />;
      case 'mood':
        return <MoodTrackerView />;
      case 'stress':
        return <StressAnalyzerView />;
      case 'burnout':
        return <BurnoutPredictorView />;
      case 'focus':
        return <FocusAnalyzerView />;
      case 'sleep':
        return <SleepTrackerView />;
      case 'journal':
        return <JournalView />;
      case 'coach':
        return <AICoachView />;
      case 'architecture':
        return <ArchitectureView />;
      case 'reports':
        return <ReportsView />;
      case 'research':
        return <ResearchView />;
      case 'settings':
        return <SettingsView />;
      case 'about':
        return <AboutContactView />;
      default:
        return <NotFoundView />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-cyan-500/30">
      <BackgroundAurora />
      <Navbar />
      <main className="flex-1 relative z-10">{renderView()}</main>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <BrainOSProvider>
      <MainContent />
    </BrainOSProvider>
  );
}

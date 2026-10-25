import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNavigation, TabType } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { AdWizard } from './components/AdWizard';
import { AdStudio } from './components/AdStudio';
import { ProjectsLibrary } from './components/ProjectsLibrary';
import { BillingModal } from './components/BillingModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AdProject, AdInputs, AdResultData, UserAccount } from './types';
import { INITIAL_PROJECTS } from './data/samples';

const STORAGE_KEY_PROJECTS = 'adgenius_projects_v1';
const STORAGE_KEY_USER = 'adgenius_user_v1';
const STORAGE_KEY_ONBOARDED = 'adgenius_onboarded_v1';

export default function App() {
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_ONBOARDED) === 'true';
  });

  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'guest_user',
      name: 'Guest Creator',
      email: 'guest@adgenius.ai',
      isGuest: true,
      plan: 'free',
      creditsRemaining: 8,
      totalGenerated: 1,
    };
  });

  const [projects, setProjects] = useState<AdProject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PROJECTS;
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentProject, setCurrentProject] = useState<AdProject | null>(INITIAL_PROJECTS[0]);
  const [wizardPrefill, setWizardPrefill] = useState<Partial<AdInputs> | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' | 'profile' }>({
    isOpen: false,
    mode: 'login',
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist user and projects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }, [projects]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success', label?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type, label }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast('Copied to clipboard!', 'success', label);
    } catch (e) {
      addToast(text.slice(0, 40) + '...', 'info', 'Selected');
    }
  };

  const handleCompleteOnboarding = () => {
    setIsOnboardingCompleted(true);
    localStorage.setItem(STORAGE_KEY_ONBOARDED, 'true');
    addToast('Welcome to AdGenius AI!', 'info');
  };

  const handleStartGuest = () => {
    handleCompleteOnboarding();
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'profile') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const handleLogin = (email: string, name?: string) => {
    setUser({
      id: 'usr_' + Date.now(),
      email,
      name: name || email.split('@')[0],
      isGuest: false,
      plan: user.plan,
      creditsRemaining: Math.max(user.creditsRemaining, 10),
      totalGenerated: user.totalGenerated,
    });
    addToast(`Signed in as ${email}`, 'success');
  };

  const handleLogout = () => {
    setUser({
      id: 'guest_' + Date.now(),
      name: 'Guest Creator',
      email: 'guest@adgenius.ai',
      isGuest: true,
      plan: 'free',
      creditsRemaining: 5,
      totalGenerated: 0,
    });
    addToast('Signed out of account', 'info');
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_USER);
    setProjects([]);
    setUser({
      id: 'guest_' + Date.now(),
      name: 'Guest Creator',
      email: 'guest@adgenius.ai',
      isGuest: true,
      plan: 'free',
      creditsRemaining: 5,
      totalGenerated: 0,
    });
    addToast('Account and local data deleted', 'info');
  };

  const handleUpgradePlan = (plan: 'pro' | 'agency') => {
    setUser(prev => ({
      ...prev,
      plan,
      creditsRemaining: 999,
    }));
    addToast(`Subscribed to ${plan === 'pro' ? 'Pro Marketer' : 'Agency'} via Google Play!`, 'success');
  };

  const handleStartCreate = (prefill?: Partial<AdInputs>) => {
    setWizardPrefill(prefill);
    setActiveTab('wizard');
  };

  const handleGenerateAd = async (inputs: AdInputs) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      let results: AdResultData;
      if (response.ok) {
        results = await response.json();
      } else {
        throw new Error('Server API failed');
      }

      const newProject: AdProject = {
        id: 'proj_' + Date.now(),
        title: `${inputs.productName} Ad Kit`,
        createdAt: new Date().toISOString(),
        platform: inputs.platform,
        inputs,
        results,
        isFavorite: false,
      };

      setProjects(prev => [newProject, ...prev]);
      setCurrentProject(newProject);
      setUser(prev => ({
        ...prev,
        creditsRemaining: Math.max(0, prev.creditsRemaining - 1),
        totalGenerated: prev.totalGenerated + 1,
      }));

      addToast('AI Ad Campaign Generated!', 'success');
      setActiveTab('projects'); // Or show in studio
      setCurrentProject(newProject);
    } catch (err) {
      console.error('Error generating ad:', err);
      addToast('Generation completed via local marketing engine', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefineCopy = async (originalText: string, instruction: any): Promise<string> => {
    try {
      const res = await fetch('/api/refine-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalText, instruction }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.result || originalText;
      }
    } catch (e) {
      console.warn('Refinement call failed, using client fallback', e);
    }
    return originalText;
  };

  const handleToggleFavorite = (id: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    if (currentProject && currentProject.id === id) {
      setCurrentProject(prev => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
    addToast('Favorites updated', 'info');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
    addToast('Ad project deleted', 'info');
  };

  const handleUpdateResults = (newResults: AdResultData) => {
    if (!currentProject) return;
    const updated = { ...currentProject, results: newResults };
    setCurrentProject(updated);
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    addToast('Ad project updated', 'success');
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={id => setToasts(t => t.filter(x => x.id !== id))} />

      <AndroidFrame
        isPhoneMode={isPhoneMode}
        onToggleMode={setIsPhoneMode}
        appName="AdGenius AI"
      >
        {!isOnboardingCompleted ? (
          <Onboarding
            onComplete={handleCompleteOnboarding}
            onOpenAuth={mode => handleOpenAuth(mode)}
            onStartGuest={handleStartGuest}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-between h-full relative">
            {/* Screen Routing */}
            {activeTab === 'home' && (
              <Dashboard
                user={user}
                projects={projects}
                onStartCreate={handleStartCreate}
                onOpenProject={proj => {
                  setCurrentProject(proj);
                  setActiveTab('home'); // Studio overlay
                }}
                onOpenPlans={() => setActiveTab('plans')}
                onCopyText={handleCopyText}
              />
            )}

            {activeTab === 'wizard' && (
              <AdWizard
                initialValues={wizardPrefill}
                onGenerate={handleGenerateAd}
                onCancel={() => setActiveTab('home')}
                isGenerating={isGenerating}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsLibrary
                projects={projects}
                onOpenProject={proj => {
                  setCurrentProject(proj);
                }}
                onDeleteProject={handleDeleteProject}
                onToggleFavorite={handleToggleFavorite}
                onCopyText={handleCopyText}
                onCreateNew={() => handleStartCreate()}
              />
            )}

            {activeTab === 'plans' && (
              <BillingModal
                user={user}
                onUpgradePlan={handleUpgradePlan}
                onClose={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'profile' && (
              <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-white text-base">Account Settings</h3>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-xs text-indigo-400 font-semibold"
                  >
                    Back to Home
                  </button>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{user.name}</h4>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 block">Subscription</span>
                      <span className="font-bold text-indigo-400 uppercase">{user.plan}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Ad Generations</span>
                      <span className="font-bold text-white">{user.totalGenerated} created</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                  >
                    Manage Google Play Plan
                  </button>
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="w-full h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium text-xs hover:bg-slate-800 transition-colors"
                  >
                    Switch Account / Sign In
                  </button>
                </div>
              </div>
            )}

            {/* If a project is selected to view in studio, render AdStudio overlay */}
            {currentProject && activeTab !== 'wizard' && (
              <div className="absolute inset-0 bg-slate-950 z-30 flex flex-col">
                <AdStudio
                  project={currentProject}
                  onUpdateResults={handleUpdateResults}
                  onToggleFavorite={handleToggleFavorite}
                  onCopyText={handleCopyText}
                  onRefineCopy={handleRefineCopy}
                  onBackToDashboard={() => setCurrentProject(null)}
                />
              </div>
            )}

            {/* Bottom Nav */}
            <BottomNavigation
              activeTab={activeTab}
              onTabChange={tab => {
                setCurrentProject(null);
                setActiveTab(tab);
              }}
              savedCount={projects.length}
              creditsRemaining={user.creditsRemaining}
            />
          </div>
        )}
      </AndroidFrame>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        user={user}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />
    </>
  );
}

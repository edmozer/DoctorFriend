import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { CalendarView } from './components/CalendarView';
import { LandingPage } from './components/LandingPage';
import { Appointment, Patient, ViewState, UserProfile, UserRole } from './types';
import { fetchAppointments, fetchPatients, updateAppointment, createPatient, createAppointment } from './services/dataService';
import { fetchUserProfile, signOut } from './services/authService';
import { Loader2 } from 'lucide-react';
import { AdminBar } from './components/AdminBar';
import { CURRENT_USER } from './constants'; // Still used for Layout display fallback if profile missing

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Data State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Check active session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setPatients([]);
        setAppointments([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (uid: string) => {
    const profile = await fetchUserProfile(uid);
    setUserProfile(profile);
  };

  // Determine effective User ID (Real or Impersonated)
  const effectiveUserId = impersonatedUserId || session?.user?.id;

  // Load data when we have an effective user
  useEffect(() => {
    if (effectiveUserId) {
      loadData(effectiveUserId);
    }
  }, [effectiveUserId]);

  const loadData = async (userId: string) => {
    setIsLoadingData(true);
    try {
      const [pats, appts] = await Promise.all([
        fetchPatients(userId),
        fetchAppointments(userId)
      ]);
      setPatients(pats);
      setAppointments(appts);
    } catch (error) {
      console.error("Failed to load initial data", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
  };

  const handleUpdateAppointment = async (updated: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
    await updateAppointment(updated);
  };

  const handleCreatePatient = async (data: any) => {
      if (!effectiveUserId) return;
      const newPatient = await createPatient(data, effectiveUserId);
      if (newPatient) {
          setPatients(prev => [...prev, newPatient]);
      }
  };

  const handleCreateAppointment = async (data: any) => {
      if (!effectiveUserId) return;
      const newAppt = await createAppointment(data, effectiveUserId);
      if (newAppt) {
          setAppointments(prev => [...prev, newAppt]);
          const sorted = [...appointments, newAppt].sort((a,b) => a.time.localeCompare(b.time));
          setAppointments(sorted);
      }
  };

  const handleLogout = async () => {
    await signOut();
    setImpersonatedUserId(null);
    setCurrentView('dashboard');
  };

  if (!session) {
    return <LandingPage onLoginSuccess={() => {}} />;
  }

  // Update CONSTANTS for Layout display if we have a real profile
  // In a real refactor, we'd pass userProfile down to Layout props instead of relying on CONSTANTS
  if (userProfile) {
      CURRENT_USER.name = userProfile.full_name || 'Dr. Unknown';
      CURRENT_USER.email = userProfile.email || '';
      CURRENT_USER.id = userProfile.id;
  }

  const isAdmin = userProfile?.role === UserRole.ADMIN;

  const renderContent = () => {
    if (isLoadingData) {
        return (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          </div>
        );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            appointments={appointments} 
            patients={patients}
            onNavigate={handleNavigate}
            onUpdateAppointment={handleUpdateAppointment}
            onCreateAppointment={handleCreateAppointment}
          />
        );
      case 'patients':
        return (
            <PatientList 
                patients={patients} 
                onAddPatient={handleCreatePatient}
            />
        );
      case 'calendar':
        return (
            <CalendarView 
                appointments={appointments} 
                onUpdateAppointment={handleUpdateAppointment}
            />
        );
      default:
        return null;
    }
  };

  return (
    <>
        <Layout currentView={currentView} onNavigate={handleNavigate} onLogout={handleLogout}>
          {renderContent()}
        </Layout>
        
        {isAdmin && (
            <AdminBar 
                currentImpersonation={impersonatedUserId}
                onImpersonate={setImpersonatedUserId}
            />
        )}
    </>
  );
};

export default App;
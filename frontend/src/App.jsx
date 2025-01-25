import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect, useState } from "react";

import { Loader2 as Loader } from "lucide-react"; // Fixed import
import { Toaster } from "react-hot-toast";
import { useRegisterSW } from 'virtual:pwa-register/react';

const App = () => {
  // Destructure only needed values
  const {
    offlineReady: [ offlineReady ],
    needRefresh: [ needRefresh ],
    updateServiceWorker,
  } = useRegisterSW();

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const [ installPrompt, setInstallPrompt ] = useState( null );

  // Install prompt handler
  useEffect( () => {
    const handleInstallPrompt = ( e ) => {
      e.preventDefault();
      setInstallPrompt( e );
    };
    window.addEventListener( "beforeinstallprompt", handleInstallPrompt );
    return () => window.removeEventListener( "beforeinstallprompt", handleInstallPrompt );
  }, [] );

  const handleInstall = async () => {
    if ( !installPrompt ) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if ( outcome === "accepted" ) console.log( "PWA installed" );
    setInstallPrompt( null );
  };

  useEffect( () => {
    checkAuth();
  }, [ checkAuth ] );

  if ( isCheckingAuth && !authUser ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="min-h-screen">
      {/* PWA Update Toast */}
      {needRefresh && (
        <div className="fixed bottom-4 right-4 bg-base-200 p-4 rounded-lg shadow-lg flex gap-4 items-center">
          <p>New content available!</p>
          <button
            onClick={() => updateServiceWorker( true )}
            className="btn btn-primary btn-sm"
          >
            Update
          </button>
        </div>
      )}

      {/* Offline Ready Toast */}
      {offlineReady && (
        <div className="fixed bottom-4 right-4 bg-base-200 p-4 rounded-lg shadow-lg">
          <p>App ready to work offline!</p>
        </div>
      )}

      {/* Install Prompt */}
      {installPrompt && (
        <div className="fixed top-4 right-4 bg-base-200 p-4 rounded-lg shadow-lg">
          <button
            onClick={handleInstall}
            className="btn btn-primary btn-sm"
          >
            Install App
          </button>
        </div>
      )}

      <Navbar />

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default App;
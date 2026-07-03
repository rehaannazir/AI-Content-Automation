import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { AuthModal } from "./components/auth/AuthModal";
import { Dashboard } from "./components/dashboard/Dashboard";
import { HistoryList } from "./components/history/HistoryList";
import { Hero } from "./components/hero/Hero";
import { Features } from "./components/layout/Features";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { useAuth } from "./hooks/useAuth";

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [historyRefreshSignal, setHistoryRefreshSignal] = useState(0);
  const { isAuthenticated } = useAuth();

  const scrollToDashboard = useCallback(() => {
    if (isAuthenticated) {
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setAuthModalOpen(true);
    }
  }, [isAuthenticated]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="bg-surface">
      <Navbar onAuthClick={() => setAuthModalOpen(true)} />
      <Hero onPrimaryCta={scrollToDashboard} />
      <Features />
      <Dashboard
        onAuthClick={() => setAuthModalOpen(true)}
        onGenerated={() => setHistoryRefreshSignal((n) => n + 1)}
      />
      <HistoryList refreshSignal={historyRefreshSignal} />
      <Footer />

      <AnimatePresence>
        {authModalOpen && <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;

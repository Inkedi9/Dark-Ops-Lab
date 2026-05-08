import { Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import LessonsPage from "./pages/LessonsPage";
import LessonPage from "./pages/LessonPage";
import TracksPage from "./pages/TracksPage";
import TrackDetailPage from "./pages/TrackDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import HandbookItemPage from "./pages/HandbookItemPage";

import ResourcesPage from "./pages/ResourcesPage";
import GlossaryPage from "./pages/GlossaryPage";
import GlossaryTermPage from "./pages/GlossaryTermPage";
import PciCompliancePage from "./pages/PciCompliancePage";
import ScrollToTop from "./components/layout/ScrollToTop";
import CommandPaletteProvider from "./components/layout/CommandPaletteProvider";
import LandingPage from "./pages/LandingPage";
import CertificatePage from "./pages/CertificatePage";
import OnboardingModal from "./components/onboarding/OnboardingModal";
import { useOnboarding } from "./hooks/useOnboarding";
import ProfilePage from "./pages/ProfilePage";
import { ToastProvider } from "@dark/ui/components/ToastContext";

export default function App() {
  const { isOnboardingOpen, completeOnboarding } = useOnboarding();
  return (
    <CommandPaletteProvider>
      <ToastProvider>
        <AppShell>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/tracks" element={<TracksPage />} />
            <Route path="/tracks/:trackId" element={<TrackDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/glossary" element={<GlossaryPage />} />
            <Route path="/resources/glossary/:termId" element={<GlossaryTermPage />} />
            <Route path="/resources/pci-compliance" element={<PciCompliancePage />} />
            <Route path="/resources/handbook/:itemId" element={<HandbookItemPage />} />
            <Route path="/certificates/:trackId" element={<CertificatePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <OnboardingModal
            isOpen={isOnboardingOpen}
            onClose={completeOnboarding}
          />
        </AppShell>
      </ToastProvider>
    </CommandPaletteProvider>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CueExposureSessionProvider } from "../contexts/CueExposureSessionContext";
import { RouteGuard } from "../auth/guards/RouteGuard";
import { LicenseGuard } from "../auth/guards/LicenseGuard";
import LicenseRequiredPage from "../auth/pages/LicenseRequiredPage";

import CortexaHomePage from "../pages/CortexaHomePage";
import MainMenuPage from "../pages/MainMenuPage";
import LoginPage from "../auth/pages/LoginPage";
import HomePage from "../pages/HomePage";
import InstructionsPage from "../pages/InstructionsPage";
import CountdownPage from "../pages/CountdownPage";
import TestPage from "../pages/TestPage";
import FinishPage from "../pages/FinishPage";
import ResultsPage from "../pages/ResultsPage";
import EvaluationResultsPage from "../pages/EvaluationResultsPage";
import TrainingResultsPage from "../pages/TrainingResultsPage";
import UrgeSurfingPage from "../pages/UrgeSurfingPage";
import UrgeSurfingInitialCravingPage from "../pages/urgeSurfing/pages/UrgeSurfingInitialCravingPage";
import UrgeSurfingSessionPage from "../pages/urgeSurfing/pages/UrgeSurfingSessionPage";
import UrgeSurfingResultsPage from "../pages/urgeSurfing/pages/UrgeSurfingResultsPage";
import UrgeSurfingSummaryPage from "../pages/urgeSurfing/pages/UrgeSurfingSummaryPage";
import CueExposureHome from "../pages/cueExposure/CueExposureHome";
import CueExposureFinalCraving from "../pages/cueExposure/CueExposureFinalCraving";
import CueExposureResultsPage from "../pages/cueExposure/CueExposureResultsPage";
import CueExposureSession from "../pages/cueExposure/CueExposureSession";
import CueExposureSummary from "../pages/cueExposure/CueExposureSummary";
import MindfulnessConfigPage from "../modules/mindfulness/screens/MindfulnessConfigPage";
import MindfulnessFinalAssessmentPage from "../modules/mindfulness/screens/MindfulnessFinalAssessmentPage";
import MindfulnessInitialAssessmentPage from "../modules/mindfulness/screens/MindfulnessInitialAssessmentPage";
import MindfulnessResultsPage from "../modules/mindfulness/screens/MindfulnessResultsPage";
import MindfulnessSessionPage from "../modules/mindfulness/screens/MindfulnessSessionPage";
import MindfulnessSessionSummaryPage from "../modules/mindfulness/screens/MindfulnessSessionSummaryPage";
import {
  BreathingConfigPage,
  BreathingResultsPage,
  BreathingSessionPage,
  BreathingSummaryPage,
} from "../modules/breathing";
import RenaceRouter from "../modules/renace/router/RenaceRouter";

function AppRouter() {
  return (
    <CueExposureSessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/license-required" element={<LicenseRequiredPage />} />

          <Route element={<RouteGuard />}>
            <Route element={<LicenseGuard />}>
              <Route path="/" element={<CortexaHomePage />} />
              <Route path="/reconecta" element={<MainMenuPage />} />
              <Route path="/renace/*" element={<RenaceRouter />} />
              <Route path="/go-no-go" element={<HomePage />} />
              <Route path="/instructions" element={<InstructionsPage />} />
              <Route path="/countdown" element={<CountdownPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/finish" element={<FinishPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/evaluation-results" element={<EvaluationResultsPage />} />
              <Route path="/training-results" element={<TrainingResultsPage />} />
              <Route path="/urge-surfing" element={<UrgeSurfingPage />} />
              <Route path="/urge-surfing/initial-craving" element={<UrgeSurfingInitialCravingPage />} />
              <Route path="/urge-surfing/session" element={<UrgeSurfingSessionPage />} />
              <Route path="/urge-surfing/results" element={<UrgeSurfingResultsPage />} />
              <Route path="/urge-surfing/summary" element={<UrgeSurfingSummaryPage />} />
              <Route path="/cue-exposure" element={<CueExposureHome />} />
              <Route path="/cue-exposure/results" element={<CueExposureResultsPage />} />
              <Route path="/cue-exposure/session" element={<CueExposureSession />} />
              <Route path="/cue-exposure/final-craving" element={<CueExposureFinalCraving />} />
              <Route path="/cue-exposure/summary" element={<CueExposureSummary />} />
              <Route path="/mindfulness" element={<MindfulnessConfigPage />} />
              <Route path="/mindfulness/initial-assessment" element={<MindfulnessInitialAssessmentPage />} />
              <Route path="/mindfulness/session" element={<MindfulnessSessionPage />} />
              <Route path="/mindfulness/final-assessment" element={<MindfulnessFinalAssessmentPage />} />
              <Route path="/mindfulness/results" element={<MindfulnessResultsPage />} />
              <Route path="/mindfulness/summary" element={<MindfulnessSessionSummaryPage />} />
              <Route path="/breathing" element={<BreathingConfigPage />} />
              <Route path="/breathing/session" element={<BreathingSessionPage />} />
              <Route path="/breathing/summary" element={<BreathingSummaryPage />} />
              <Route path="/breathing/results" element={<BreathingResultsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </CueExposureSessionProvider>
  );
}

export default AppRouter;
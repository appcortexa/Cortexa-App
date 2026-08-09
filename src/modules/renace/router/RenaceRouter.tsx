import { Route, Routes } from "react-router-dom";

import { RenaceSessionProvider } from "../context/RenaceSessionContext";
import RelapsePreventionConfigPage from "../tools/relapsePrevention/pages/RelapsePreventionConfigPage";
import RelapsePreventionExerciseCatalogPage from "../tools/relapsePrevention/pages/RelapsePreventionExerciseCatalogPage";
import RiskSignalsFinalPage from "../tools/relapsePrevention/pages/RiskSignalsFinalPage";
import RiskSignalsIntroPage from "../tools/relapsePrevention/pages/RiskSignalsIntroPage";
import RiskSignalsRegisterPage from "../tools/relapsePrevention/pages/RiskSignalsRegisterPage";
import RiskSignalsSummaryPage from "../tools/relapsePrevention/pages/RiskSignalsSummaryPage";
import ProtectiveFactorsFinalPage from "../tools/relapsePrevention/pages/ProtectiveFactorsFinalPage";
import ProtectiveFactorsIntroPage from "../tools/relapsePrevention/pages/ProtectiveFactorsIntroPage";
import ProtectiveFactorsRegisterPage from "../tools/relapsePrevention/pages/ProtectiveFactorsRegisterPage";
import ProtectiveFactorsSummaryPage from "../tools/relapsePrevention/pages/ProtectiveFactorsSummaryPage";
import CopingPlanFinalPage from "../tools/relapsePrevention/pages/CopingPlanFinalPage";
import CopingPlanIntroPage from "../tools/relapsePrevention/pages/CopingPlanIntroPage";
import CopingPlanRegisterPage from "../tools/relapsePrevention/pages/CopingPlanRegisterPage";
import CopingPlanSummaryPage from "../tools/relapsePrevention/pages/CopingPlanSummaryPage";
import MentalRehearsalFinalPage from "../tools/relapsePrevention/pages/MentalRehearsalFinalPage";
import MentalRehearsalIntroPage from "../tools/relapsePrevention/pages/MentalRehearsalIntroPage";
import MentalRehearsalRegisterPage from "../tools/relapsePrevention/pages/MentalRehearsalRegisterPage";
import MentalRehearsalSummaryPage from "../tools/relapsePrevention/pages/MentalRehearsalSummaryPage";
import RelapsePersonalPlanFinalPage from "../tools/relapsePrevention/pages/RelapsePersonalPlanFinalPage";
import RelapsePersonalPlanIntroPage from "../tools/relapsePrevention/pages/RelapsePersonalPlanIntroPage";
import RelapsePersonalPlanPage from "../tools/relapsePrevention/pages/RelapsePersonalPlanPage";
import RelapsePersonalPlanSummaryPage from "../tools/relapsePrevention/pages/RelapsePersonalPlanSummaryPage";
import BehavioralActivationActivitySchedulingFinalPage from "../tools/behavioralActivation/pages/BehavioralActivationActivitySchedulingFinalPage";
import BehavioralActivationActivitySchedulingIntroPage from "../tools/behavioralActivation/pages/BehavioralActivationActivitySchedulingIntroPage";
import BehavioralActivationActivitySchedulingRegisterPage from "../tools/behavioralActivation/pages/BehavioralActivationActivitySchedulingRegisterPage";
import BehavioralActivationActivitySchedulingSummaryPage from "../tools/behavioralActivation/pages/BehavioralActivationActivitySchedulingSummaryPage";
import BehavioralActivationActivityHierarchyFinalPage from "../tools/behavioralActivation/pages/BehavioralActivationActivityHierarchyFinalPage";
import BehavioralActivationActivityHierarchyIntroPage from "../tools/behavioralActivation/pages/BehavioralActivationActivityHierarchyIntroPage";
import BehavioralActivationActivityHierarchyPrioritiesPage from "../tools/behavioralActivation/pages/BehavioralActivationActivityHierarchyPrioritiesPage";
import BehavioralActivationActivityHierarchyRegisterPage from "../tools/behavioralActivation/pages/BehavioralActivationActivityHierarchyRegisterPage";
import BehavioralActivationActivityHierarchySummaryPage from "../tools/behavioralActivation/pages/BehavioralActivationActivityHierarchySummaryPage";
import BehavioralActivationConfigPage from "../tools/behavioralActivation/pages/BehavioralActivationConfigPage";
import BehavioralActivationExerciseCatalogPage from "../tools/behavioralActivation/pages/BehavioralActivationExerciseCatalogPage";
import BehavioralActivationAvoidanceIdentificationFinalPage from "../tools/behavioralActivation/pages/BehavioralActivationAvoidanceIdentificationFinalPage";
import BehavioralActivationAvoidanceIdentificationIntroPage from "../tools/behavioralActivation/pages/BehavioralActivationAvoidanceIdentificationIntroPage";
import BehavioralActivationAvoidanceIdentificationRegisterPage from "../tools/behavioralActivation/pages/BehavioralActivationAvoidanceIdentificationRegisterPage";
import BehavioralActivationAvoidanceIdentificationSummaryPage from "../tools/behavioralActivation/pages/BehavioralActivationAvoidanceIdentificationSummaryPage";
import BehavioralActivationPleasureAchievementFinalPage from "../tools/behavioralActivation/pages/BehavioralActivationPleasureAchievementFinalPage";
import BehavioralActivationPleasureAchievementIntroPage from "../tools/behavioralActivation/pages/BehavioralActivationPleasureAchievementIntroPage";
import BehavioralActivationPleasureAchievementRegisterPage from "../tools/behavioralActivation/pages/BehavioralActivationPleasureAchievementRegisterPage";
import BehavioralActivationPleasureAchievementSummaryPage from "../tools/behavioralActivation/pages/BehavioralActivationPleasureAchievementSummaryPage";
import BehavioralActivationWeeklyPlanFinalPage from "../tools/behavioralActivation/pages/BehavioralActivationWeeklyPlanFinalPage";
import BehavioralActivationWeeklyPlanIntroPage from "../tools/behavioralActivation/pages/BehavioralActivationWeeklyPlanIntroPage";
import BehavioralActivationWeeklyPlanRegisterPage from "../tools/behavioralActivation/pages/BehavioralActivationWeeklyPlanRegisterPage";
import BehavioralActivationWeeklyPlanSummaryPage from "../tools/behavioralActivation/pages/BehavioralActivationWeeklyPlanSummaryPage";
import BehavioralActivationResultsPage from "../tools/behavioralActivation/pages/BehavioralActivationResultsPage";
import BehavioralActivationSessionPage from "../tools/behavioralActivation/pages/BehavioralActivationSessionPage";
import BehavioralActivationSummaryPage from "../tools/behavioralActivation/pages/BehavioralActivationSummaryPage";
import AntiRuminationConfigPage from "../tools/antiRumination/pages/AntiRuminationConfigPage";
import AntiRuminationDetectionFinalPage from "../tools/antiRumination/pages/AntiRuminationDetectionFinalPage";
import AntiRuminationDetectionIntroPage from "../tools/antiRumination/pages/AntiRuminationDetectionIntroPage";
import AntiRuminationDetectionRegisterPage from "../tools/antiRumination/pages/AntiRuminationDetectionRegisterPage";
import AntiRuminationDetectionSummaryPage from "../tools/antiRumination/pages/AntiRuminationDetectionSummaryPage";
import AntiRuminationExerciseCatalogPage from "../tools/antiRumination/pages/AntiRuminationExerciseCatalogPage";
import AntiRuminationBreakCycleFinalPage from "../tools/antiRumination/pages/AntiRuminationBreakCycleFinalPage";
import AntiRuminationBreakCycleIntroPage from "../tools/antiRumination/pages/AntiRuminationBreakCycleIntroPage";
import AntiRuminationBreakCycleRegisterPage from "../tools/antiRumination/pages/AntiRuminationBreakCycleRegisterPage";
import AntiRuminationBreakCycleSummaryPage from "../tools/antiRumination/pages/AntiRuminationBreakCycleSummaryPage";
import AntiRuminationAttentionShiftFinalPage from "../tools/antiRumination/pages/AntiRuminationAttentionShiftFinalPage";
import AntiRuminationAttentionShiftIntroPage from "../tools/antiRumination/pages/AntiRuminationAttentionShiftIntroPage";
import AntiRuminationAttentionShiftRegisterPage from "../tools/antiRumination/pages/AntiRuminationAttentionShiftRegisterPage";
import AntiRuminationAttentionShiftSummaryPage from "../tools/antiRumination/pages/AntiRuminationAttentionShiftSummaryPage";
import AntiRuminationActionWithMeaningFinalPage from "../tools/antiRumination/pages/AntiRuminationActionWithMeaningFinalPage";
import AntiRuminationActionWithMeaningIntroPage from "../tools/antiRumination/pages/AntiRuminationActionWithMeaningIntroPage";
import AntiRuminationActionWithMeaningRegisterPage from "../tools/antiRumination/pages/AntiRuminationActionWithMeaningRegisterPage";
import AntiRuminationActionWithMeaningSummaryPage from "../tools/antiRumination/pages/AntiRuminationActionWithMeaningSummaryPage";
import AntiRuminationPersonalPlanFinalPage from "../tools/antiRumination/pages/AntiRuminationPersonalPlanFinalPage";
import AntiRuminationPersonalPlanIntroPage from "../tools/antiRumination/pages/AntiRuminationPersonalPlanIntroPage";
import AntiRuminationPersonalPlanPage from "../tools/antiRumination/pages/AntiRuminationPersonalPlanPage";
import AntiRuminationPersonalPlanSummaryPage from "../tools/antiRumination/pages/AntiRuminationPersonalPlanSummaryPage";
import CognitiveRestructuringAutomaticThoughtsFinalPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringAutomaticThoughtsFinalPage";
import CognitiveRestructuringAutomaticThoughtsIntroPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringAutomaticThoughtsIntroPage";
import CognitiveRestructuringAutomaticThoughtsRegisterPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringAutomaticThoughtsRegisterPage";
import CognitiveRestructuringAutomaticThoughtsSummaryPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringAutomaticThoughtsSummaryPage";
import CognitiveRestructuringAlternativeThoughtsFinalPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringAlternativeThoughtsFinalPage";
import CognitiveRestructuringAlternativeThoughtsIntroPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringAlternativeThoughtsIntroPage";
import CognitiveRestructuringAlternativeThoughtsRegisterPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringAlternativeThoughtsRegisterPage";
import CognitiveRestructuringAlternativeThoughtsSummaryPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringAlternativeThoughtsSummaryPage";
import CognitiveRestructuringEvidenceAnalysisFinalPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringEvidenceAnalysisFinalPage";
import CognitiveRestructuringEvidenceAnalysisIntroPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringEvidenceAnalysisIntroPage";
import CognitiveRestructuringEvidenceAnalysisRegisterPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringEvidenceAnalysisRegisterPage";
import CognitiveRestructuringEvidenceAnalysisSummaryPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringEvidenceAnalysisSummaryPage";
import CognitiveRestructuringCopingCardFinalPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringCopingCardFinalPage";
import CognitiveRestructuringCopingCardIntroPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringCopingCardIntroPage";
import CognitiveRestructuringCopingCardRegisterPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringCopingCardRegisterPage";
import CognitiveRestructuringCopingCardSummaryPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringCopingCardSummaryPage";
import CognitiveRestructuringReframingFinalPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringReframingFinalPage";
import CognitiveRestructuringReframingIntroPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringReframingIntroPage";
import CognitiveRestructuringReframingRegisterPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringReframingRegisterPage";
import CognitiveRestructuringReframingSummaryPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringReframingSummaryPage";
import CognitiveRestructuringConfigPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringConfigPage";
import CognitiveRestructuringExerciseCatalogPage from "../tools/cognitiveRestructuring/pages/CognitiveRestructuringExerciseCatalogPage";
import EmotionRegulationConfigPage from "../tools/emotionRegulation/pages/EmotionRegulationConfigPage";
import EmotionRegulationExerciseCatalogPage from "../tools/emotionRegulation/pages/EmotionRegulationExerciseCatalogPage";
import EmotionRegulationFinalPage from "../tools/emotionRegulation/pages/EmotionRegulationFinalPage";
import EmotionRegulationIntroPage from "../tools/emotionRegulation/pages/EmotionRegulationIntroPage";
import EmotionRegulationRegisterPage from "../tools/emotionRegulation/pages/EmotionRegulationRegisterPage";
import EmotionRegulationSummaryPage from "../tools/emotionRegulation/pages/EmotionRegulationSummaryPage";
import EmotionDifferenceFinalPage from "../tools/emotionRegulation/pages/EmotionDifferenceFinalPage";
import PositiveAttentionCatalogPage from "../tools/positiveAttention/pages/PositiveAttentionCatalogPage";
import PositiveAttentionConfigPage from "../tools/positiveAttention/pages/PositiveAttentionConfigPage";
import PositiveAttentionDetectionFinalPage from "../tools/positiveAttention/pages/PositiveAttentionDetectionFinalPage";
import PositiveAttentionDetectionIntroPage from "../tools/positiveAttention/pages/PositiveAttentionDetectionIntroPage";
import PositiveAttentionDetectionRegisterPage from "../tools/positiveAttention/pages/PositiveAttentionDetectionRegisterPage";
import PositiveAttentionDetectionSummaryPage from "../tools/positiveAttention/pages/PositiveAttentionDetectionSummaryPage";
import PositiveAttentionGratitudeFinalPage from "../tools/positiveAttention/pages/PositiveAttentionGratitudeFinalPage";
import PositiveAttentionGratitudeIntroPage from "../tools/positiveAttention/pages/PositiveAttentionGratitudeIntroPage";
import PositiveAttentionGratitudeRegisterPage from "../tools/positiveAttention/pages/PositiveAttentionGratitudeRegisterPage";
import PositiveAttentionGratitudeSummaryPage from "../tools/positiveAttention/pages/PositiveAttentionGratitudeSummaryPage";
import PositiveAttentionPersonalPlanFinalPage from "../tools/positiveAttention/pages/PositiveAttentionPersonalPlanFinalPage";
import PositiveAttentionPersonalPlanIntroPage from "../tools/positiveAttention/pages/PositiveAttentionPersonalPlanIntroPage";
import PositiveAttentionPersonalPlanPage from "../tools/positiveAttention/pages/PositiveAttentionPersonalPlanPage";
import PositiveAttentionPersonalPlanSummaryPage from "../tools/positiveAttention/pages/PositiveAttentionPersonalPlanSummaryPage";
import PositiveAttentionSavoringFinalPage from "../tools/positiveAttention/pages/PositiveAttentionSavoringFinalPage";
import PositiveAttentionSavoringIntroPage from "../tools/positiveAttention/pages/PositiveAttentionSavoringIntroPage";
import PositiveAttentionSavoringRegisterPage from "../tools/positiveAttention/pages/PositiveAttentionSavoringRegisterPage";
import PositiveAttentionSavoringSummaryPage from "../tools/positiveAttention/pages/PositiveAttentionSavoringSummaryPage";
import PositiveAttentionStrengthsFinalPage from "../tools/positiveAttention/pages/PositiveAttentionStrengthsFinalPage";
import PositiveAttentionStrengthsIntroPage from "../tools/positiveAttention/pages/PositiveAttentionStrengthsIntroPage";
import PositiveAttentionStrengthsRegisterPage from "../tools/positiveAttention/pages/PositiveAttentionStrengthsRegisterPage";
import PositiveAttentionStrengthsSummaryPage from "../tools/positiveAttention/pages/PositiveAttentionStrengthsSummaryPage";
import SelfCompassionConfigPage from "../tools/selfCompassion/pages/SelfCompassionConfigPage";
import SelfCompassionDetectionFinalPage from "../tools/selfCompassion/pages/SelfCompassionDetectionFinalPage";
import SelfCompassionDetectionIntroPage from "../tools/selfCompassion/pages/SelfCompassionDetectionIntroPage";
import SelfCompassionDetectionRegisterPage from "../tools/selfCompassion/pages/SelfCompassionDetectionRegisterPage";
import SelfCompassionDetectionSummaryPage from "../tools/selfCompassion/pages/SelfCompassionDetectionSummaryPage";
import SelfCompassionExerciseCatalogPage from "../tools/selfCompassion/pages/SelfCompassionExerciseCatalogPage";
import SelfCompassionKindnessFinalPage from "../tools/selfCompassion/pages/SelfCompassionKindnessFinalPage";
import SelfCompassionKindnessIntroPage from "../tools/selfCompassion/pages/SelfCompassionKindnessIntroPage";
import SelfCompassionKindnessRegisterPage from "../tools/selfCompassion/pages/SelfCompassionKindnessRegisterPage";
import SelfCompassionKindnessSummaryPage from "../tools/selfCompassion/pages/SelfCompassionKindnessSummaryPage";
import SelfCompassionCommonHumanityFinalPage from "../tools/selfCompassion/pages/SelfCompassionCommonHumanityFinalPage";
import SelfCompassionCommonHumanityIntroPage from "../tools/selfCompassion/pages/SelfCompassionCommonHumanityIntroPage";
import SelfCompassionCommonHumanityRegisterPage from "../tools/selfCompassion/pages/SelfCompassionCommonHumanityRegisterPage";
import SelfCompassionCommonHumanitySummaryPage from "../tools/selfCompassion/pages/SelfCompassionCommonHumanitySummaryPage";
import SelfCompassionLetterFinalPage from "../tools/selfCompassion/pages/SelfCompassionLetterFinalPage";
import SelfCompassionLetterIntroPage from "../tools/selfCompassion/pages/SelfCompassionLetterIntroPage";
import SelfCompassionLetterRegisterPage from "../tools/selfCompassion/pages/SelfCompassionLetterRegisterPage";
import SelfCompassionLetterSummaryPage from "../tools/selfCompassion/pages/SelfCompassionLetterSummaryPage";
import SelfCompassionPersonalPlanFinalPage from "../tools/selfCompassion/pages/SelfCompassionPersonalPlanFinalPage";
import SelfCompassionPersonalPlanIntroPage from "../tools/selfCompassion/pages/SelfCompassionPersonalPlanIntroPage";
import SelfCompassionPersonalPlanRegisterPage from "../tools/selfCompassion/pages/SelfCompassionPersonalPlanRegisterPage";
import SelfCompassionPersonalPlanSummaryPage from "../tools/selfCompassion/pages/SelfCompassionPersonalPlanSummaryPage";
import EmotionDifferenceIntroPage from "../tools/emotionRegulation/pages/EmotionDifferenceIntroPage";
import EmotionDifferenceRegisterPage from "../tools/emotionRegulation/pages/EmotionDifferenceRegisterPage";
import EmotionDifferenceSummaryPage from "../tools/emotionRegulation/pages/EmotionDifferenceSummaryPage";
import EmotionPhysiologicalFinalPage from "../tools/emotionRegulation/pages/EmotionPhysiologicalFinalPage";
import EmotionPhysiologicalIntroPage from "../tools/emotionRegulation/pages/EmotionPhysiologicalIntroPage";
import EmotionPhysiologicalRegisterPage from "../tools/emotionRegulation/pages/EmotionPhysiologicalRegisterPage";
import EmotionPhysiologicalSummaryPage from "../tools/emotionRegulation/pages/EmotionPhysiologicalSummaryPage";
import EmotionPersonalPlanFinalPage from "../tools/emotionRegulation/pages/EmotionPersonalPlanFinalPage";
import EmotionPersonalPlanIntroPage from "../tools/emotionRegulation/pages/EmotionPersonalPlanIntroPage";
import EmotionPersonalPlanPage from "../tools/emotionRegulation/pages/EmotionPersonalPlanPage";
import EmotionPersonalPlanSummaryPage from "../tools/emotionRegulation/pages/EmotionPersonalPlanSummaryPage";
import EmotionReevaluationFinalPage from "../tools/emotionRegulation/pages/EmotionReevaluationFinalPage";
import EmotionReevaluationIntroPage from "../tools/emotionRegulation/pages/EmotionReevaluationIntroPage";
import EmotionReevaluationRegisterPage from "../tools/emotionRegulation/pages/EmotionReevaluationRegisterPage";
import EmotionReevaluationSummaryPage from "../tools/emotionRegulation/pages/EmotionReevaluationSummaryPage";
import RenaceComingSoonPage from "../pages/RenaceComingSoonPage";
import RenaceMainMenuPage from "../pages/RenaceMainMenuPage";
import MindfulnessConfigPage from "../tools/mindfulness/pages/MindfulnessConfigPage";
import MindfulnessExerciseCatalogPage from "../tools/mindfulness/pages/MindfulnessExerciseCatalogPage";
import BreathingAttentionIntroPage from "../tools/mindfulness/pages/BreathingAttentionIntroPage";
import BreathingAttentionRegisterPage from "../tools/mindfulness/pages/BreathingAttentionRegisterPage";
import BreathingAttentionSummaryPage from "../tools/mindfulness/pages/BreathingAttentionSummaryPage";
import BreathingAttentionFinalPage from "../tools/mindfulness/pages/BreathingAttentionFinalPage";
import BodyScanFinalPage from "../tools/mindfulness/pages/BodyScanFinalPage";
import BodyScanIntroPage from "../tools/mindfulness/pages/BodyScanIntroPage";
import BodyScanRegisterPage from "../tools/mindfulness/pages/BodyScanRegisterPage";
import BodyScanSummaryPage from "../tools/mindfulness/pages/BodyScanSummaryPage";
import ObservationWithoutJudgmentFinalPage from "../tools/mindfulness/pages/ObservationWithoutJudgmentFinalPage";
import ObservationWithoutJudgmentIntroPage from "../tools/mindfulness/pages/ObservationWithoutJudgmentIntroPage";
import ObservationWithoutJudgmentRegisterPage from "../tools/mindfulness/pages/ObservationWithoutJudgmentRegisterPage";
import ObservationWithoutJudgmentSummaryPage from "../tools/mindfulness/pages/ObservationWithoutJudgmentSummaryPage";
import PresentMomentAcceptanceFinalPage from "../tools/mindfulness/pages/PresentMomentAcceptanceFinalPage";
import PresentMomentAcceptanceIntroPage from "../tools/mindfulness/pages/PresentMomentAcceptanceIntroPage";
import PresentMomentAcceptanceRegisterPage from "../tools/mindfulness/pages/PresentMomentAcceptanceRegisterPage";
import PresentMomentAcceptanceSummaryPage from "../tools/mindfulness/pages/PresentMomentAcceptanceSummaryPage";
import MindfulnessPersonalPlanFinalPage from "../tools/mindfulness/pages/MindfulnessPersonalPlanFinalPage";
import MindfulnessPersonalPlanIntroPage from "../tools/mindfulness/pages/MindfulnessPersonalPlanIntroPage";
import MindfulnessPersonalPlanPage from "../tools/mindfulness/pages/MindfulnessPersonalPlanPage";
import MindfulnessPersonalPlanSummaryPage from "../tools/mindfulness/pages/MindfulnessPersonalPlanSummaryPage";

function RenaceRouter() {
	return (
		<RenaceSessionProvider>
			<Routes>
				<Route index element={<RenaceMainMenuPage />} />
				<Route path="mindfulness/configuracion" element={<MindfulnessConfigPage />} />
				<Route path="mindfulness/catalogo" element={<MindfulnessExerciseCatalogPage />} />
				<Route path="mindfulness/atencion-respiracion/introduccion" element={<BreathingAttentionIntroPage />} />
				<Route path="mindfulness/atencion-respiracion/registro" element={<BreathingAttentionRegisterPage />} />
				<Route path="mindfulness/atencion-respiracion/resumen" element={<BreathingAttentionSummaryPage />} />
				<Route path="mindfulness/atencion-respiracion/final" element={<BreathingAttentionFinalPage />} />
				<Route path="mindfulness/escaneo-corporal/introduccion" element={<BodyScanIntroPage />} />
				<Route path="mindfulness/escaneo-corporal/registro" element={<BodyScanRegisterPage />} />
				<Route path="mindfulness/escaneo-corporal/resumen" element={<BodyScanSummaryPage />} />
				<Route path="mindfulness/escaneo-corporal/final" element={<BodyScanFinalPage />} />
				<Route path="mindfulness/observacion-sin-juicio/introduccion" element={<ObservationWithoutJudgmentIntroPage />} />
				<Route path="mindfulness/observacion-sin-juicio/registro" element={<ObservationWithoutJudgmentRegisterPage />} />
				<Route path="mindfulness/observacion-sin-juicio/resumen" element={<ObservationWithoutJudgmentSummaryPage />} />
				<Route path="mindfulness/observacion-sin-juicio/final" element={<ObservationWithoutJudgmentFinalPage />} />
				<Route path="mindfulness/aceptacion-momento-presente/introduccion" element={<PresentMomentAcceptanceIntroPage />} />
				<Route path="mindfulness/aceptacion-momento-presente/registro" element={<PresentMomentAcceptanceRegisterPage />} />
				<Route path="mindfulness/aceptacion-momento-presente/resumen" element={<PresentMomentAcceptanceSummaryPage />} />
				<Route path="mindfulness/aceptacion-momento-presente/final" element={<PresentMomentAcceptanceFinalPage />} />
				<Route path="mindfulness/plan-personal/introduccion" element={<MindfulnessPersonalPlanIntroPage />} />
				<Route path="mindfulness/plan-personal/registro" element={<MindfulnessPersonalPlanPage />} />
				<Route path="mindfulness/plan-personal/resumen" element={<MindfulnessPersonalPlanSummaryPage />} />
				<Route path="mindfulness/plan-personal/final" element={<MindfulnessPersonalPlanFinalPage />} />
				<Route path="activacion-conductual/configuracion" element={<BehavioralActivationConfigPage />} />
				<Route path="activacion-conductual/catalogo" element={<BehavioralActivationExerciseCatalogPage />} />
				<Route
					path="activacion-conductual/agenda-actividades/introduccion"
					element={<BehavioralActivationActivitySchedulingIntroPage />}
				/>
				<Route
					path="activacion-conductual/agenda-actividades/programacion"
					element={<BehavioralActivationActivitySchedulingRegisterPage />}
				/>
				<Route
					path="activacion-conductual/agenda-actividades/resumen"
					element={<BehavioralActivationActivitySchedulingSummaryPage />}
				/>
				<Route
					path="activacion-conductual/agenda-actividades/final"
					element={<BehavioralActivationActivitySchedulingFinalPage />}
				/>
				<Route
					path="activacion-conductual/jerarquia-actividades/introduccion"
					element={<BehavioralActivationActivityHierarchyIntroPage />}
				/>
				<Route
					path="activacion-conductual/jerarquia-actividades/registro"
					element={<BehavioralActivationActivityHierarchyRegisterPage />}
				/>
				<Route
					path="activacion-conductual/jerarquia-actividades/prioridades"
					element={<BehavioralActivationActivityHierarchyPrioritiesPage />}
				/>
				<Route
					path="activacion-conductual/jerarquia-actividades/resumen"
					element={<BehavioralActivationActivityHierarchySummaryPage />}
				/>
				<Route
					path="activacion-conductual/jerarquia-actividades/final"
					element={<BehavioralActivationActivityHierarchyFinalPage />}
				/>
				<Route
					path="activacion-conductual/registro-placer-logro/introduccion"
					element={<BehavioralActivationPleasureAchievementIntroPage />}
				/>
				<Route
					path="activacion-conductual/registro-placer-logro/registro"
					element={<BehavioralActivationPleasureAchievementRegisterPage />}
				/>
				<Route
					path="activacion-conductual/registro-placer-logro/resumen"
					element={<BehavioralActivationPleasureAchievementSummaryPage />}
				/>
				<Route
					path="activacion-conductual/registro-placer-logro/final"
					element={<BehavioralActivationPleasureAchievementFinalPage />}
				/>
				<Route
					path="activacion-conductual/identificacion-evitacion/introduccion"
					element={<BehavioralActivationAvoidanceIdentificationIntroPage />}
				/>
				<Route
					path="activacion-conductual/identificacion-evitacion/registro"
					element={<BehavioralActivationAvoidanceIdentificationRegisterPage />}
				/>
				<Route
					path="activacion-conductual/identificacion-evitacion/resumen"
					element={<BehavioralActivationAvoidanceIdentificationSummaryPage />}
				/>
				<Route
					path="activacion-conductual/identificacion-evitacion/final"
					element={<BehavioralActivationAvoidanceIdentificationFinalPage />}
				/>
				<Route
					path="activacion-conductual/plan-semanal/introduccion"
					element={<BehavioralActivationWeeklyPlanIntroPage />}
				/>
				<Route
					path="activacion-conductual/plan-semanal/registro"
					element={<BehavioralActivationWeeklyPlanRegisterPage />}
				/>
				<Route
					path="activacion-conductual/plan-semanal/resumen"
					element={<BehavioralActivationWeeklyPlanSummaryPage />}
				/>
				<Route
					path="activacion-conductual/plan-semanal/final"
					element={<BehavioralActivationWeeklyPlanFinalPage />}
				/>
				<Route path="activacion-conductual/sesion" element={<BehavioralActivationSessionPage />} />
				<Route path="activacion-conductual/resumen" element={<BehavioralActivationSummaryPage />} />
				<Route path="activacion-conductual/resultados" element={<BehavioralActivationResultsPage />} />
				<Route path="antirrumiacion/configuracion" element={<AntiRuminationConfigPage />} />
				<Route path="prevencion-recaidas/configuracion" element={<RelapsePreventionConfigPage />} />
				<Route path="prevencion-recaidas/catalogo" element={<RelapsePreventionExerciseCatalogPage />} />
				<Route path="prevencion-recaidas/identificacion-senales-riesgo/introduccion" element={<RiskSignalsIntroPage />} />
				<Route path="prevencion-recaidas/identificacion-senales-riesgo/registro" element={<RiskSignalsRegisterPage />} />
				<Route path="prevencion-recaidas/identificacion-senales-riesgo/resumen" element={<RiskSignalsSummaryPage />} />
				<Route path="prevencion-recaidas/identificacion-senales-riesgo/final" element={<RiskSignalsFinalPage />} />
				<Route path="prevencion-recaidas/factores-protectores/introduccion" element={<ProtectiveFactorsIntroPage />} />
				<Route path="prevencion-recaidas/factores-protectores/registro" element={<ProtectiveFactorsRegisterPage />} />
				<Route path="prevencion-recaidas/factores-protectores/resumen" element={<ProtectiveFactorsSummaryPage />} />
				<Route path="prevencion-recaidas/factores-protectores/final" element={<ProtectiveFactorsFinalPage />} />
				<Route path="prevencion-recaidas/plan-afrontamiento/introduccion" element={<CopingPlanIntroPage />} />
				<Route path="prevencion-recaidas/plan-afrontamiento/registro" element={<CopingPlanRegisterPage />} />
				<Route path="prevencion-recaidas/plan-afrontamiento/resumen" element={<CopingPlanSummaryPage />} />
				<Route path="prevencion-recaidas/plan-afrontamiento/final" element={<CopingPlanFinalPage />} />
				<Route path="prevencion-recaidas/ensayo-mental/introduccion" element={<MentalRehearsalIntroPage />} />
				<Route path="prevencion-recaidas/ensayo-mental/registro" element={<MentalRehearsalRegisterPage />} />
				<Route path="prevencion-recaidas/ensayo-mental/resumen" element={<MentalRehearsalSummaryPage />} />
				<Route path="prevencion-recaidas/ensayo-mental/final" element={<MentalRehearsalFinalPage />} />
				<Route path="prevencion-recaidas/plan-personal-prevencion-recaidas/introduccion" element={<RelapsePersonalPlanIntroPage />} />
				<Route path="prevencion-recaidas/plan-personal-prevencion-recaidas/plan" element={<RelapsePersonalPlanPage />} />
				<Route path="prevencion-recaidas/plan-personal-prevencion-recaidas/resumen" element={<RelapsePersonalPlanSummaryPage />} />
				<Route path="prevencion-recaidas/plan-personal-prevencion-recaidas/final" element={<RelapsePersonalPlanFinalPage />} />
				<Route path="antirrumiacion/catalogo" element={<AntiRuminationExerciseCatalogPage />} />
				<Route
					path="antirrumiacion/deteccion-rumiacion/introduccion"
					element={<AntiRuminationDetectionIntroPage />}
				/>
				<Route
					path="antirrumiacion/deteccion-rumiacion/registro"
					element={<AntiRuminationDetectionRegisterPage />}
				/>
				<Route
					path="antirrumiacion/deteccion-rumiacion/resumen"
					element={<AntiRuminationDetectionSummaryPage />}
				/>
				<Route
					path="antirrumiacion/deteccion-rumiacion/final"
					element={<AntiRuminationDetectionFinalPage />}
				/>
				<Route
					path="antirrumiacion/romper-ciclo/introduccion"
					element={<AntiRuminationBreakCycleIntroPage />}
				/>
				<Route
					path="antirrumiacion/romper-ciclo/registro"
					element={<AntiRuminationBreakCycleRegisterPage />}
				/>
				<Route
					path="antirrumiacion/romper-ciclo/resumen"
					element={<AntiRuminationBreakCycleSummaryPage />}
				/>
				<Route
					path="antirrumiacion/romper-ciclo/final"
					element={<AntiRuminationBreakCycleFinalPage />}
				/>
				<Route
					path="antirrumiacion/cambio-atencion/introduccion"
					element={<AntiRuminationAttentionShiftIntroPage />}
				/>
				<Route
					path="antirrumiacion/cambio-atencion/registro"
					element={<AntiRuminationAttentionShiftRegisterPage />}
				/>
				<Route
					path="antirrumiacion/cambio-atencion/resumen"
					element={<AntiRuminationAttentionShiftSummaryPage />}
				/>
				<Route
					path="antirrumiacion/cambio-atencion/final"
					element={<AntiRuminationAttentionShiftFinalPage />}
				/>
				<Route
					path="antirrumiacion/accion-con-sentido/introduccion"
					element={<AntiRuminationActionWithMeaningIntroPage />}
				/>
				<Route
					path="antirrumiacion/accion-con-sentido/registro"
					element={<AntiRuminationActionWithMeaningRegisterPage />}
				/>
				<Route
					path="antirrumiacion/accion-con-sentido/resumen"
					element={<AntiRuminationActionWithMeaningSummaryPage />}
				/>
				<Route
					path="antirrumiacion/accion-con-sentido/final"
					element={<AntiRuminationActionWithMeaningFinalPage />}
				/>
				<Route
					path="antirrumiacion/aprendizajes/introduccion"
					element={<AntiRuminationPersonalPlanIntroPage />}
				/>
				<Route
					path="antirrumiacion/aprendizajes/plan-personal"
					element={<AntiRuminationPersonalPlanPage />}
				/>
				<Route
					path="antirrumiacion/aprendizajes/resumen"
					element={<AntiRuminationPersonalPlanSummaryPage />}
				/>
				<Route
					path="antirrumiacion/aprendizajes/final"
					element={<AntiRuminationPersonalPlanFinalPage />}
				/>
				<Route path="reestructuracion-cognitiva/configuracion" element={<CognitiveRestructuringConfigPage />} />
				<Route path="reestructuracion-cognitiva/catalogo" element={<CognitiveRestructuringExerciseCatalogPage />} />
				<Route path="atencion-positiva/configuracion" element={<PositiveAttentionConfigPage />} />
				<Route path="atencion-positiva/catalogo" element={<PositiveAttentionCatalogPage />} />
				<Route path="atencion-positiva/deteccion-experiencias/introduccion" element={<PositiveAttentionDetectionIntroPage />} />
				<Route path="atencion-positiva/deteccion-experiencias/registro" element={<PositiveAttentionDetectionRegisterPage />} />
				<Route path="atencion-positiva/deteccion-experiencias/resumen" element={<PositiveAttentionDetectionSummaryPage />} />
				<Route path="atencion-positiva/deteccion-experiencias/final" element={<PositiveAttentionDetectionFinalPage />} />
				<Route path="atencion-positiva/fortalezas-personales/introduccion" element={<PositiveAttentionStrengthsIntroPage />} />
				<Route path="atencion-positiva/fortalezas-personales/registro" element={<PositiveAttentionStrengthsRegisterPage />} />
				<Route path="atencion-positiva/fortalezas-personales/resumen" element={<PositiveAttentionStrengthsSummaryPage />} />
				<Route path="atencion-positiva/fortalezas-personales/final" element={<PositiveAttentionStrengthsFinalPage />} />
				<Route path="atencion-positiva/gratitud-consciente/introduccion" element={<PositiveAttentionGratitudeIntroPage />} />
				<Route path="atencion-positiva/gratitud-consciente/registro" element={<PositiveAttentionGratitudeRegisterPage />} />
				<Route path="atencion-positiva/gratitud-consciente/resumen" element={<PositiveAttentionGratitudeSummaryPage />} />
				<Route path="atencion-positiva/gratitud-consciente/final" element={<PositiveAttentionGratitudeFinalPage />} />
				<Route path="atencion-positiva/saboreo-experiencias/introduccion" element={<PositiveAttentionSavoringIntroPage />} />
				<Route path="atencion-positiva/saboreo-experiencias/registro" element={<PositiveAttentionSavoringRegisterPage />} />
				<Route path="atencion-positiva/saboreo-experiencias/resumen" element={<PositiveAttentionSavoringSummaryPage />} />
				<Route path="atencion-positiva/saboreo-experiencias/final" element={<PositiveAttentionSavoringFinalPage />} />
				<Route path="atencion-positiva/plan-personal/introduccion" element={<PositiveAttentionPersonalPlanIntroPage />} />
				<Route path="atencion-positiva/plan-personal/registro" element={<PositiveAttentionPersonalPlanPage />} />
				<Route path="atencion-positiva/plan-personal/resumen" element={<PositiveAttentionPersonalPlanSummaryPage />} />
				<Route path="atencion-positiva/plan-personal/final" element={<PositiveAttentionPersonalPlanFinalPage />} />
				<Route path="autocompasion/configuracion" element={<SelfCompassionConfigPage />} />
				<Route path="autocompasion/catalogo" element={<SelfCompassionExerciseCatalogPage />} />
				<Route
					path="autocompasion/deteccion-dialogo-autocritico/introduccion"
					element={<SelfCompassionDetectionIntroPage />}
				/>
				<Route
					path="autocompasion/deteccion-dialogo-autocritico/registro"
					element={<SelfCompassionDetectionRegisterPage />}
				/>
				<Route
					path="autocompasion/deteccion-dialogo-autocritico/resumen"
					element={<SelfCompassionDetectionSummaryPage />}
				/>
				<Route
					path="autocompasion/deteccion-dialogo-autocritico/final"
					element={<SelfCompassionDetectionFinalPage />}
				/>
				<Route
					path="autocompasion/responderse-con-amabilidad/introduccion"
					element={<SelfCompassionKindnessIntroPage />}
				/>
				<Route
					path="autocompasion/responderse-con-amabilidad/registro"
					element={<SelfCompassionKindnessRegisterPage />}
				/>
				<Route
					path="autocompasion/responderse-con-amabilidad/resumen"
					element={<SelfCompassionKindnessSummaryPage />}
				/>
				<Route
					path="autocompasion/responderse-con-amabilidad/final"
					element={<SelfCompassionKindnessFinalPage />}
				/>
				<Route
					path="autocompasion/humanidad-compartida/introduccion"
					element={<SelfCompassionCommonHumanityIntroPage />}
				/>
				<Route
					path="autocompasion/humanidad-compartida/registro"
					element={<SelfCompassionCommonHumanityRegisterPage />}
				/>
				<Route
					path="autocompasion/humanidad-compartida/resumen"
					element={<SelfCompassionCommonHumanitySummaryPage />}
				/>
				<Route
					path="autocompasion/humanidad-compartida/final"
					element={<SelfCompassionCommonHumanityFinalPage />}
				/>
				<Route
					path="autocompasion/carta-compasiva/introduccion"
					element={<SelfCompassionLetterIntroPage />}
				/>
				<Route path="autocompasion/carta-compasiva/registro" element={<SelfCompassionLetterRegisterPage />} />
				<Route path="autocompasion/carta-compasiva/resumen" element={<SelfCompassionLetterSummaryPage />} />
				<Route path="autocompasion/carta-compasiva/final" element={<SelfCompassionLetterFinalPage />} />
				<Route path="autocompasion/plan-personal/introduccion" element={<SelfCompassionPersonalPlanIntroPage />} />
				<Route path="autocompasion/plan-personal/registro" element={<SelfCompassionPersonalPlanRegisterPage />} />
				<Route path="autocompasion/plan-personal/resumen" element={<SelfCompassionPersonalPlanSummaryPage />} />
				<Route path="autocompasion/plan-personal/final" element={<SelfCompassionPersonalPlanFinalPage />} />
				<Route path="regulacion-emocional/configuracion" element={<EmotionRegulationConfigPage />} />
				<Route path="regulacion-emocional/catalogo" element={<EmotionRegulationExerciseCatalogPage />} />
				<Route
					path="regulacion-emocional/identificacion-emocional/introduccion"
					element={<EmotionRegulationIntroPage />}
				/>
				<Route
					path="regulacion-emocional/identificacion-emocional/registro"
					element={<EmotionRegulationRegisterPage />}
				/>
				<Route
					path="regulacion-emocional/identificacion-emocional/resumen"
					element={<EmotionRegulationSummaryPage />}
				/>
				<Route
					path="regulacion-emocional/identificacion-emocional/final"
					element={<EmotionRegulationFinalPage />}
				/>
				<Route
					path="regulacion-emocional/diferenciacion-emocional/introduccion"
					element={<EmotionDifferenceIntroPage />}
				/>
				<Route
					path="regulacion-emocional/diferenciacion-emocional/registro"
					element={<EmotionDifferenceRegisterPage />}
				/>
				<Route
					path="regulacion-emocional/diferenciacion-emocional/resumen"
					element={<EmotionDifferenceSummaryPage />}
				/>
				<Route
					path="regulacion-emocional/diferenciacion-emocional/final"
					element={<EmotionDifferenceFinalPage />}
				/>
				<Route
					path="regulacion-emocional/regulacion-fisiologica/introduccion"
					element={<EmotionPhysiologicalIntroPage />}
				/>
				<Route
					path="regulacion-emocional/regulacion-fisiologica/registro"
					element={<EmotionPhysiologicalRegisterPage />}
				/>
				<Route
					path="regulacion-emocional/regulacion-fisiologica/resumen"
					element={<EmotionPhysiologicalSummaryPage />}
				/>
				<Route
					path="regulacion-emocional/regulacion-fisiologica/final"
					element={<EmotionPhysiologicalFinalPage />}
				/>
				<Route
					path="regulacion-emocional/reevaluacion-emocional/introduccion"
					element={<EmotionReevaluationIntroPage />}
				/>
				<Route
					path="regulacion-emocional/reevaluacion-emocional/registro"
					element={<EmotionReevaluationRegisterPage />}
				/>
				<Route
					path="regulacion-emocional/reevaluacion-emocional/resumen"
					element={<EmotionReevaluationSummaryPage />}
				/>
				<Route
					path="regulacion-emocional/reevaluacion-emocional/final"
					element={<EmotionReevaluationFinalPage />}
				/>
				<Route
					path="regulacion-emocional/plan-personal-regulacion/introduccion"
					element={<EmotionPersonalPlanIntroPage />}
				/>
				<Route
					path="regulacion-emocional/plan-personal-regulacion/registro"
					element={<EmotionPersonalPlanPage />}
				/>
				<Route
					path="regulacion-emocional/plan-personal-regulacion/resumen"
					element={<EmotionPersonalPlanSummaryPage />}
				/>
				<Route
					path="regulacion-emocional/plan-personal-regulacion/final"
					element={<EmotionPersonalPlanFinalPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/deteccion-pensamientos-automaticos/introduccion"
					element={<CognitiveRestructuringAutomaticThoughtsIntroPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/deteccion-pensamientos-automaticos/registro"
					element={<CognitiveRestructuringAutomaticThoughtsRegisterPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/deteccion-pensamientos-automaticos/resumen"
					element={<CognitiveRestructuringAutomaticThoughtsSummaryPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/deteccion-pensamientos-automaticos/final"
					element={<CognitiveRestructuringAutomaticThoughtsFinalPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/analisis-evidencias/introduccion"
					element={<CognitiveRestructuringEvidenceAnalysisIntroPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/analisis-evidencias/registro"
					element={<CognitiveRestructuringEvidenceAnalysisRegisterPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/analisis-evidencias/resumen"
					element={<CognitiveRestructuringEvidenceAnalysisSummaryPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/analisis-evidencias/final"
					element={<CognitiveRestructuringEvidenceAnalysisFinalPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/pensamientos-alternativos/introduccion"
					element={<CognitiveRestructuringAlternativeThoughtsIntroPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/pensamientos-alternativos/registro"
					element={<CognitiveRestructuringAlternativeThoughtsRegisterPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/pensamientos-alternativos/resumen"
					element={<CognitiveRestructuringAlternativeThoughtsSummaryPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/pensamientos-alternativos/final"
					element={<CognitiveRestructuringAlternativeThoughtsFinalPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/reencuadre-cognitivo/introduccion"
					element={<CognitiveRestructuringReframingIntroPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/reencuadre-cognitivo/registro"
					element={<CognitiveRestructuringReframingRegisterPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/reencuadre-cognitivo/resumen"
					element={<CognitiveRestructuringReframingSummaryPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/reencuadre-cognitivo/final"
					element={<CognitiveRestructuringReframingFinalPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/tarjeta-afrontamiento/introduccion"
					element={<CognitiveRestructuringCopingCardIntroPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/tarjeta-afrontamiento/registro"
					element={<CognitiveRestructuringCopingCardRegisterPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/tarjeta-afrontamiento/resumen"
					element={<CognitiveRestructuringCopingCardSummaryPage />}
				/>
				<Route
					path="reestructuracion-cognitiva/tarjeta-afrontamiento/final"
					element={<CognitiveRestructuringCopingCardFinalPage />}
				/>
				<Route path="proximamente" element={<RenaceComingSoonPage />} />
			</Routes>
		</RenaceSessionProvider>
	);
}

export default RenaceRouter;

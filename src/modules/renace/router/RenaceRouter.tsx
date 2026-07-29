import { Route, Routes } from "react-router-dom";

import { RenaceSessionProvider } from "../context/RenaceSessionContext";
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
import RenaceComingSoonPage from "../pages/RenaceComingSoonPage";
import RenaceMainMenuPage from "../pages/RenaceMainMenuPage";

function RenaceRouter() {
	return (
		<RenaceSessionProvider>
			<Routes>
				<Route index element={<RenaceMainMenuPage />} />
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

import SessionPromptCard from "../../../../components/common/SessionPromptCard";
import type { MindfulnessPromptViewModel } from "../../models/MindfulnessPromptViewModel";

type PromptViewerProps = {
	viewModel: MindfulnessPromptViewModel | null;
};

function PromptViewer({ viewModel }: PromptViewerProps) {
	if (viewModel === null) {
		return null;
	}

	return <SessionPromptCard title={viewModel.title} message={viewModel.message} />;
}

export default PromptViewer;

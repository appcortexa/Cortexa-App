/**
 * Provides an ordered prompt sequence for a specific session configuration.
 */
export interface IPromptProvider<TConfig, TPrompt> {
	getPromptSequence(config: TConfig): readonly TPrompt[];
}

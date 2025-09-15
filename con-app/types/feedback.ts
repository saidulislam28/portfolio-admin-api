export type FeedbackFormData = {
  // Band scores
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;

  // Fluency & Coherence feedback
  mark_assignment_complete: boolean;
  fluencyFluent: boolean;
  fluencyNaturalFlow: boolean;
  fluencyNeedsCoherence: boolean;
  fluencyRepeatsIdeas: boolean;

  // Lexical Resource feedback
  lexicalGoodVariety: boolean;
  lexicalRepetitive: boolean;
  lexicalTopicMismatch: boolean;
  lexicalLimitedRange: boolean;

  // Grammatical Range & Accuracy feedback
  grammarFrequentErrors: boolean;
  grammarTenseIssues: boolean;
  grammarLimitedRange: boolean;
  grammarMostlyAccurate: boolean;

  // Pronunciation feedback
  pronunciationClearSounds: boolean;
  pronunciationGoodStress: boolean;
  pronunciationMispronunciations: boolean;
  pronunciationAccentIssues: boolean;

  // Part 1 feedback
  part1Confident: boolean;
  part1ShortAnswer: boolean;
  part1NeedsMoreDetails: boolean;

  // Part 2 feedback
  part2WellOrganized: boolean;
  part2MissedPoints: boolean;
  part2TooShort: boolean;

  // Part 3 feedback
  part3Insightful: boolean;
  part3Repetitive: boolean;
  part3WellDeveloped: boolean;
  part3TooShort: boolean;

  // Recommendations
  recPracticeCueCard: boolean;
  recExpandTopicVocab: boolean;
  recReduceGrammarMistakes: boolean;
  recWatchNativeConversations: boolean;
  recUseLinkingPhrases: boolean;
  recImproveFluency: boolean;
  recImprovePronunciation: boolean;

  // Additional notes
  additionalNotes: string;

  // Overall level
  overallLevel?: string;
};

export const defaultInitialFeedback: FeedbackFormData = {
  // Band scores
  fluencyCoherence: 0,
  lexicalResource: 0,
  grammaticalRange: 0,
  pronunciation: 0,

  mark_assignment_complete: false,

  // Fluency & Coherence feedback
  fluencyFluent: false,
  fluencyNaturalFlow: false,
  fluencyNeedsCoherence: false,
  fluencyRepeatsIdeas: false,

  // Lexical Resource feedback
  lexicalGoodVariety: false,
  lexicalRepetitive: false,
  lexicalTopicMismatch: false,
  lexicalLimitedRange: false,

  // Grammatical Range & Accuracy feedback
  grammarFrequentErrors: false,
  grammarTenseIssues: false,
  grammarLimitedRange: false,
  grammarMostlyAccurate: false,

  // Pronunciation feedback
  pronunciationClearSounds: false,
  pronunciationGoodStress: false,
  pronunciationMispronunciations: false,
  pronunciationAccentIssues: false,

  // Part 1 feedback
  part1Confident: false,
  part1ShortAnswer: false,
  part1NeedsMoreDetails: false,

  // Part 2 feedback
  part2WellOrganized: false,
  part2MissedPoints: false,
  part2TooShort: false,

  // Part 3 feedback
  part3Insightful: false,
  part3Repetitive: false,
  part3WellDeveloped: false,
  part3TooShort: false,

  // Recommendations
  recPracticeCueCard: false,
  recExpandTopicVocab: false,
  recReduceGrammarMistakes: false,
  recWatchNativeConversations: false,
  recUseLinkingPhrases: false,
  recImproveFluency: false,
  recImprovePronunciation: false,

  // Additional notes
  additionalNotes: '',
};
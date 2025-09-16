export interface FeedbackComment {
  id: string;
  title: string;
  desc: string;
}

export interface FeedbackData {
  appointment_id: string | null;
  consultant_id: string | null;
  testTakerName: string;
  // Fluency & Coherence
  speaksFluently: boolean;
  occasionalPauses: boolean;
  mark_assignment_complete: boolean;
  oftenPauses: boolean;
  disorganizedIdeas: boolean;
  needsLongerAnswers: boolean;
  fluencyUseLinkingWords: boolean;
  fluencyPracticeThinking: boolean;
  fluencySpeakWithDetails: boolean;
  // Vocabulary
  wideVocabularyRange: boolean;
  repeatsBasicWords: boolean;
  usesTopicTerms: boolean;
  wordChoiceErrors: boolean;
  lacksParaphrasing: boolean;
  vocabBuildList: boolean;
  vocabPracticeSynonyms: boolean;
  vocabUseGames: boolean;
  // Grammar
  mostlyCorrectGrammar: boolean;
  errorsDontAffect: boolean;
  limitedSentenceTypes: boolean;
  frequentGrammarMistakes: boolean;
  needsComplexStructures: boolean;
  grammarFocusTenses: boolean;
  grammarUseConditionals: boolean;
  grammarWriteThenSpeak: boolean;
  // Pronunciation
  pronunciationClear: boolean;
  minorPronunciationIssues: boolean;
  mispronouncesKeyWords: boolean;
  lacksIntonation: boolean;
  strongL1Influence: boolean;
  pronShadowSpeakers: boolean;
  pronRecordAndCheck: boolean;
  pronPracticePhonemes: boolean;
  // Overall
  overallLevel: string;
  generalComments: string;
}

// Initial feedback state as a constant to avoid recreation
export const getInitialFeedbackState = (): FeedbackData => ({
  appointment_id: null,
  consultant_id: null,
  testTakerName: '',
  // Fluency & Coherence
  speaksFluently: false,
  mark_assignment_complete: false,
  occasionalPauses: false,
  oftenPauses: false,
  disorganizedIdeas: false,
  needsLongerAnswers: false,
  fluencyUseLinkingWords: false,
  fluencyPracticeThinking: false,
  fluencySpeakWithDetails: false,
  // Vocabulary
  wideVocabularyRange: false,
  repeatsBasicWords: false,
  usesTopicTerms: false,
  wordChoiceErrors: false,
  lacksParaphrasing: false,
  vocabBuildList: false,
  vocabPracticeSynonyms: false,
  vocabUseGames: false,
  // Grammar
  mostlyCorrectGrammar: false,
  errorsDontAffect: false,
  limitedSentenceTypes: false,
  frequentGrammarMistakes: false,
  needsComplexStructures: false,
  grammarFocusTenses: false,
  grammarUseConditionals: false,
  grammarWriteThenSpeak: false,
  // Pronunciation
  pronunciationClear: false,
  minorPronunciationIssues: false,
  mispronouncesKeyWords: false,
  lacksIntonation: false,
  strongL1Influence: false,
  pronShadowSpeakers: false,
  pronRecordAndCheck: false,
  pronPracticePhonemes: false,
  // Overall
  overallLevel: '',
  generalComments: '',
});
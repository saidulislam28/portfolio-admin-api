const PDFDocument = require('pdfkit');

export function generateFeedbackPDF(feedback): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // ----- Helper mapping -----
    const sectionMap = {
      fluency: {
        title: 'FLUENCY & COHERENCE',
        items: [
          { key: 'speaksFluently', label: 'Speaks fluently and confidently' },
          { key: 'occasionalPauses', label: 'Occasional pauses and self-correction' },
          { key: 'oftenPauses', label: 'Often pauses, hesitates, or repeats ideas' },
          { key: 'disorganizedIdeas', label: 'Ideas are not clearly organized' },
          { key: 'needsLongerAnswers', label: 'Needs to improve answer length' }
        ],
        suggestions: [
          { key: 'fluencyUseLinkingWords', label: 'Use more linking words' },
          { key: 'fluencyPracticeThinking', label: 'Practice thinking quickly under time pressure' },
          { key: 'fluencySpeakWithDetails', label: 'Try speaking in full answers with details' }
        ]
      },
      vocabulary: {
        title: 'VOCABULARY (LEXICAL RESOURCE)',
        items: [
          { key: 'wideVocabularyRange', label: 'Uses a wide range of vocabulary appropriately' },
          { key: 'repeatsBasicWords', label: 'Repeats basic words' },
          { key: 'usesTopicTerms', label: 'Uses some topic-related terms' },
          { key: 'wordChoiceErrors', label: 'Makes word choice errors' },
          { key: 'lacksParaphrasing', label: 'Lacks paraphrasing skills' }
        ],
        suggestions: [
          { key: 'vocabBuildList', label: 'Build a personal vocabulary list by topic' },
          { key: 'vocabPracticeSynonyms', label: 'Practice using synonyms and collocations' },
          { key: 'vocabUseGames', label: 'Play vocabulary games or apps for variety' }
        ]
      },
      grammar: {
        title: 'GRAMMAR',
        items: [
          { key: 'mostlyCorrectGrammar', label: 'Mostly correct grammar' },
          { key: 'errorsDontAffect', label: 'Errors do not affect meaning' },
          { key: 'limitedSentenceTypes', label: 'Limited range of sentence types' },
          { key: 'frequentGrammarMistakes', label: 'Frequent grammar mistakes' },
          { key: 'needsComplexStructures', label: 'Needs more complex structures' }
        ],
        suggestions: [
          { key: 'grammarFocusTenses', label: 'Focus on verb tenses and subject-verb agreement' },
          { key: 'grammarUseConditionals', label: 'Use conditionals and complex sentences' },
          { key: 'grammarWriteThenSpeak', label: 'Write and then speak your ideas aloud' }
        ]
      },
      pronunciation: {
        title: 'PRONUNCIATION',
        items: [
          { key: 'pronunciationClear', label: 'Clear and easy to understand' },
          { key: 'minorPronunciationIssues', label: 'Minor issues with word stress or sounds' },
          { key: 'mispronouncesKeyWords', label: 'Mispronounces key words' },
          { key: 'lacksIntonation', label: 'Lacks natural intonation and rhythm' },
          { key: 'strongL1Influence', label: 'Strong first-language influence' }
        ],
        suggestions: [
          { key: 'pronShadowSpeakers', label: 'Shadow native speakers (repeat after audio)' },
          { key: 'pronRecordAndCheck', label: 'Record yourself and check stress/intonation' },
          { key: 'pronPracticePhonemes', label: 'Practice key sounds using phonemic chart' }
        ]
      }
    };

    // ----- Header -----
    doc.fontSize(18).text('SpeakingMate', { align: 'center' });
    doc.fontSize(16).text(' Master IELTS Speaking with Confidence', { align: 'center' });
    doc.moveDown();

    // Test taker / Instructor / Date / Time
    doc.fontSize(12).text(`Test Taker Name: ${feedback?.Appointment?.User?.full_name || ''}`);
    doc.text(`Date: ${new Date(feedback?.Appointment?.start_at).toLocaleDateString()}`);
    doc.text(`Time: ${feedback?.Appointment?.slot_time || ''}`);
    doc.text(`Instructor: Consultant #${feedback?.Consultant?.full_name || ''}`);
    doc.moveDown(2);

    // ----- Section renderer -----
    const renderSection = (section) => {
      const { title, items, suggestions } = section;

      // Render section title
      doc.fontSize(14).text(`• ${title}`, { underline: true });

      // Render checked items
      const checkedItems = items.filter(item => feedback[item.key]);
      if (checkedItems.length > 0) {
        checkedItems.forEach(item => {
          doc.fontSize(12).text(`☑ ${item.label}`);
        });
      }

      // Render suggestions if any
      const checkedSuggestions = suggestions.filter(suggestion => feedback[suggestion.key]);
      if (checkedSuggestions.length > 0) {
        doc.moveDown(0.5);
        doc.fontSize(12).text('Suggestions:', { underline: true });
        checkedSuggestions.forEach(suggestion => {
          doc.fontSize(12).text(`☐ ${suggestion.label}`);
        });
      }

      doc.moveDown();
    };

    // Render all sections
    Object.values(sectionMap).forEach(renderSection);

    // ----- Overall level -----
    if (feedback.overallLevel) {
      doc.fontSize(14).text(`OVERALL SPEAKING LEVEL: ${feedback.overallLevel}`);
      doc.moveDown();
    }

    // ----- General comments -----
    if (feedback.generalComments) {
      doc.fontSize(12).text(`General Comments by Instructor:`);
      doc.text(feedback.generalComments);
      doc.moveDown();
    }

    // ----- Footer -----
    doc.moveDown(2);
    doc.fontSize(10).text('(Pre-installed signature)', { align: 'right' });
    doc.text('Director - Speaking Test', { align: 'right' });
    doc.text('SpeakingMate', { align: 'right' });

    doc.end();
  });
}
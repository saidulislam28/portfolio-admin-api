const PDFDocument = require('pdfkit');
const path = require('path');

export function MockFeedbackPdfGenerate(feedback): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const chunks: Buffer[] = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // -------- HEADER --------
        doc.fontSize(18).text('SpeakingMate', { align: 'center' });
        doc.fontSize(14).text('Master IELTS Speaking with Confidence', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12)
            .text(`Test Taker Name: ${feedback?.Appointment?.User?.full_name || ''}`)
            .text(`Date: ${new Date(feedback?.testDate || feedback?.createdAt).toLocaleDateString()}`)
            .text(`Time: ${feedback?.Appointment?.slot_time || ''}`)
            .text(`Instructor: ${feedback?.Consultant?.full_name || ''}`)
            .moveDown(1.5);

        // -------- BAND DESCRIPTORS --------
        doc.fontSize(14).text('Speaking Mock Test Report Card', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).text('Band Descriptors – Rating (1.0 to 9.0)');
        doc.moveDown();

        const bandDescriptors = [
            {
                criteria: 'Fluency & Coherence',
                stars: feedback.fluencyCoherence || 0,
                feedbacks: [
                    { label: 'Fluent', value: feedback.fluencyFluent },
                    { label: 'Natural flow', value: feedback.fluencyNaturalFlow },
                    { label: 'Needs coherence', value: feedback.fluencyNeedsCoherence },
                    { label: 'Repeats ideas', value: feedback.fluencyRepeatsIdeas }
                ].filter(f => f.value)
            },
            {
                criteria: 'Lexical Resource',
                stars: feedback.lexicalResource || 0,
                feedbacks: [
                    { label: 'Good variety', value: feedback.lexicalGoodVariety },
                    { label: 'Repetitive', value: feedback.lexicalRepetitive },
                    { label: 'Topic mismatch', value: feedback.lexicalTopicMismatch },
                    { label: 'Limited range', value: feedback.lexicalLimitedRange }
                ].filter(f => f.value)
            },
            {
                criteria: 'Grammatical Range & Accuracy',
                stars: feedback.grammaticalRange || 0,
                feedbacks: [
                    { label: 'Frequent errors', value: feedback.grammarFrequentErrors },
                    { label: 'Tense issues', value: feedback.grammarTenseIssues },
                    { label: 'Limited range', value: feedback.grammarLimitedRange },
                    { label: 'Mostly Accurate', value: feedback.grammarMostlyAccurate }
                ].filter(f => f.value)
            },
            {
                criteria: 'Pronunciation',
                stars: feedback.pronunciation || 0,
                feedbacks: [
                    { label: 'Clear sounds', value: feedback.pronunciationClearSounds },
                    { label: 'Good stress', value: feedback.pronunciationGoodStress },
                    { label: 'Mispronunciations', value: feedback.pronunciationMispronunciations },
                    { label: 'Accent issues', value: feedback.pronunciationAccentIssues }
                ].filter(f => f.value)
            }
        ];

        bandDescriptors.forEach(descriptor => {
            const starsText = descriptor.stars ? descriptor.stars.toString() : '-';
            const feedbackText = descriptor.feedbacks.map(f => f.label).join(', ');

            doc.fontSize(10)
                .text(descriptor.criteria, { continued: true, width: 150 })
                .text(starsText, { continued: true, width: 100 })
                .text(feedbackText || '-', { width: 200 });
            doc.moveDown(0.3);
        });

        doc.moveDown(1.5);

        // -------- OVERALL BAND SCORE --------
        doc.fontSize(14).text('Overall Band Score', { align: 'center' });
        doc.fontSize(10).text('(Average of 4 criteria, rounded to nearest 0.5)', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`${feedback.overallBandScore || 0}`, { align: 'center' });
        doc.moveDown(1.5);

        // -------- SECTION-WISE FEEDBACK --------
        doc.fontSize(12).text('Section Wise Feedback', { underline: true });
        doc.moveDown(0.5);

        const sectionFeedbacks = [
            {
                title: 'Part 1: Introduction & Interview',
                items: [
                    { label: 'Confident', value: feedback.part1Confident },
                    { label: 'Short Answer', value: feedback.part1ShortAnswer },
                    { label: 'Needs more details', value: feedback.part1NeedsMoreDetails }
                ]
            },
            {
                title: 'Part 2: Cue Card',
                items: [
                    { label: 'Well-organized', value: feedback.part2WellOrganized },
                    { label: 'Missed points', value: feedback.part2MissedPoints },
                    { label: 'Too short', value: feedback.part2TooShort }
                ]
            },
            {
                title: 'Part 3: Discussion',
                items: [
                    { label: 'Insightful', value: feedback.part3Insightful },
                    { label: 'Repetitive', value: feedback.part3Repetitive },
                    { label: 'Well-developed', value: feedback.part3WellDeveloped },
                    { label: 'Too short', value: feedback.part3TooShort }
                ]
            }
        ];

        sectionFeedbacks.forEach(section => {
            const selected = section.items.filter(i => i.value).map(i => i.label);
            if (selected.length > 0) {
                doc.fontSize(10).text(`${section.title} – ${selected.join(', ')}`, { width: 500 });
            }
        });

        doc.moveDown(1.5);

        // -------- RECOMMENDATIONS --------
        doc.fontSize(12).text('Recommendations', { underline: true });
        doc.moveDown(0.5);

        const recommendations = [
            { label: 'Practice cue card strategy', value: feedback.recPracticeCueCard },
            { label: 'Expand topic vocabulary', value: feedback.recExpandTopicVocab },
            { label: 'Reduce Grammatical mistakes', value: feedback.recReduceGrammarMistakes },
            { label: 'Watch native conversations', value: feedback.recWatchNativeConversations },
            { label: 'Use Linking Phrases', value: feedback.recUseLinkingPhrases },
            { label: 'Improve fluency', value: feedback.recImproveFluency },
            { label: 'Improve pronunciation', value: feedback.recImprovePronunciation }
        ].filter(f => f.value);

        recommendations.forEach(rec => {
            doc.fontSize(10).text(`- ${rec.label}`, { width: 500 });
        });

        doc.moveDown(2);

        // Additional Notes
        if (feedback.additionalNotes) {
            doc.fontSize(12).text('Additional Notes:', { underline: true });
            doc.fontSize(10).text(feedback.additionalNotes, { align: 'left', width: 500 });
            doc.moveDown(2);
        }

        // -------- FOOTER --------
        doc.fontSize(10)
            .text('(Pre-installed signature)', { align: 'right' })
            .text('Director - Speaking Test', { align: 'right' })
            .text('SpeakingMate', { align: 'right' });

        doc.end();
    });
}

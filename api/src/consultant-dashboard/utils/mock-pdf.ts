/* eslint-disable */
import path from "path";

const PDFDocument = require('pdfkit');
const fs = require('fs');

export function MockFeedbackPdfGenerate(feedback): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            margin: 40,
            size: 'A4',
            bufferPages: true,
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Colors
        const primaryColor = '#f25a29'; // orange from screenshot
        const darkGray = '#333333';      
        
        
        // Page setup
        const pageWidth = doc.page.width;
        const margin = 40;
        const contentWidth = pageWidth - margin * 2;
        let currentY = 0;
        const logoPath = path.join(__dirname, "../../../public/img/Logo512.png");
        // const logoPath = path.join(process.cwd(), "public", "img", "Logo512.png");

        console.log("logo path", logoPath);
        // Helper: draw checkbox
        function drawCheckbox(x, y, label, checked = false) {
            doc.rect(x, y, 10, 10).stroke();
            if (checked) {
                doc.moveTo(x + 2, y + 5).lineTo(x + 5, y + 8).lineTo(x + 9, y + 2).stroke();
            }
            doc.fontSize(9).fillColor(darkGray).text(label, x + 15, y - 1);
        }

        // ---------------- HEADER ----------------
        doc.rect(0, 0, pageWidth, 100).fill(primaryColor);

        doc.image(logoPath, margin, 20, { width: 60, height: 60 });


        doc.fillColor('white').font('Helvetica-Bold').fontSize(16).text('SpeakingMate', margin + 70, 30);
        doc.font('Helvetica').fontSize(9).text('MASTER IELTS SPEAKING WITH CONFIDENCE', margin + 70, 50);

        doc.fontSize(9).text('+88 09678 771912', pageWidth - margin - 120, 30);
        doc.text('Info.speakingmate@gmail.co', pageWidth - margin - 120, 45);

        // ---------------- TITLE ----------------
        currentY = 120;
        doc.fillColor(primaryColor).fontSize(20).font('Helvetica-Bold').text('Speaking Mock Test Report', margin, currentY, { align: 'center', width: contentWidth });

        // ---------------- MOCK TEST INFO ----------------
        currentY += 30;
        const infoBoxHeight = 80;
        doc.rect(margin, currentY, contentWidth, infoBoxHeight).stroke('#d9d9d9');

        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('MOCK TEST INFORMATION', margin + 10, currentY + 10);

        doc.fillColor(darkGray).fontSize(10).font('Helvetica');
        doc.text(`Test Taker Name: ${feedback?.Appointment?.User?.full_name || '__________'}`, margin + 10, currentY + 30);
        doc.text(`Examiner: ${feedback?.Consultant?.full_name || '__________'}`, margin + 10, currentY + 50);
        doc.text(`Date: ${new Date(feedback?.testDate || feedback?.createdAt).toLocaleDateString()}`, margin + 280, currentY + 30);
        doc.text(`Time: ${feedback?.Appointment?.slot_time || '__________'}`, margin + 280, currentY + 50);

        currentY += infoBoxHeight + 30;

        // ---------------- CRITERIA TABLE ----------------
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('Criteria', margin, currentY);
        doc.text('Star Rating (1.0–9.0)', margin + 200, currentY);
        doc.text('Feedback', margin + 380, currentY);

        currentY += 40;

        const criteria = [
            {
                title: 'Fluency & Coherence',
                rating: feedback.fluencyCoherence || '★★★★★★★☆☆☆',
                checks: [
                    { label: 'Fluent', val: feedback.fluencyFluent },
                    { label: 'Natural flow', val: feedback.fluencyNaturalFlow },
                    { label: 'Needs coherence', val: feedback.fluencyNeedsCoherence },
                    { label: 'Repeats ideas', val: feedback.fluencyRepeatsIdeas },
                ],
            },
            {
                title: 'Lexical Resource',
                rating: feedback.lexicalResource || '★★★★★★☆☆☆☆',
                checks: [
                    { label: 'Good variety', val: feedback.lexicalGoodVariety },
                    { label: 'Repetitive', val: feedback.lexicalRepetitive },
                    { label: 'Topic mismatch', val: feedback.lexicalTopicMismatch },
                    { label: 'Limited range', val: feedback.lexicalLimitedRange },
                ],
            },
            {
                title: 'Grammatical Range & Accuracy',
                rating: feedback.grammaticalRange || '★★★★★☆☆☆☆☆',
                checks: [
                    { label: 'Frequent errors', val: feedback.grammarFrequentErrors },
                    { label: 'Tense issues', val: feedback.grammarTenseIssues },
                    { label: 'Limited Range', val: feedback.grammarLimitedRange },
                    { label: 'Mostly Accurate', val: feedback.grammarMostlyAccurate },
                ],
            },
            {
                title: 'Pronunciation',
                rating: feedback.pronunciation || '★★★★★★★☆☆☆',
                checks: [
                    { label: 'Sound Clear', val: feedback.pronunciationClearSounds },
                    { label: 'Good Stress', val: feedback.pronunciationGoodStress },
                    { label: 'Mispronunciation', val: feedback.pronunciationMispronunciations },
                    { label: 'Accent issues', val: feedback.pronunciationAccentIssues },
                ],
            },
        ];

        criteria.forEach((c) => {
            doc.fillColor(darkGray).font('Helvetica-Bold').text(c.title, margin, currentY);
            doc.font('Helvetica').text(c.rating, margin + 200, currentY);
            let y = currentY;
            c.checks.forEach((chk, i) => {
                drawCheckbox(margin + 380, y + i * 14, chk.label, chk.val);
            });
            currentY += 50;
        });

        // ---------------- OVERALL SCORE ----------------
        const scoreBoxX = pageWidth - margin - 120;
        const scoreBoxY = 150;
        doc.rect(scoreBoxX, scoreBoxY, 100, 80).stroke(primaryColor);
        doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(12).text('Overall Band Score', scoreBoxX, scoreBoxY + 5, { width: 100, align: 'center' });
        doc.fontSize(32).text(`${feedback.overallBandScore || '0'}`, scoreBoxX, scoreBoxY + 30, { width: 100, align: 'center' });

        currentY += 30;

        // ---------------- SECTION FEEDBACK ----------------
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('Section Wise Feedback', margin, currentY);
        currentY += 20;

        const sectionFeedbacks = [
            {
                title: 'Part 1: Introduction & Interview',
                items: [
                    { label: 'Confident', val: feedback.part1Confident },
                    { label: 'Short Answer', val: feedback.part1ShortAnswer },
                    { label: 'Needs more details', val: feedback.part1NeedsMoreDetails },
                ],
            },
            {
                title: 'Part 2: Cue Card',
                items: [
                    { label: 'Well-organized', val: feedback.part2WellOrganized },
                    { label: 'Missed points', val: feedback.part2MissedPoints },
                    { label: 'Too short', val: feedback.part2TooShort },
                ],
            },
            {
                title: 'Part 3: Discussion',
                items: [
                    { label: 'Insightful', val: feedback.part3Insightful },
                    { label: 'Repetitive', val: feedback.part3Repetitive },
                    { label: 'Well-developed', val: feedback.part3WellDeveloped },
                    { label: 'Too short', val: feedback.part3TooShort },
                ],
            },
        ];

        sectionFeedbacks.forEach((s) => {
            doc.fontSize(10).fillColor(darkGray).font('Helvetica-Bold').text(s.title, margin, currentY, { continued: true });
            const selected = s.items.filter((i) => i.val).map((i) => i.label);
            if (selected.length) {
                doc.font('Helvetica').text(' – ' + selected.join(', '));
            } else {
                doc.text('');
            }
            currentY += 18;
        });

        // ---------------- RECOMMENDATIONS ----------------
        currentY += 15;
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('Recommendation', margin, currentY);
        currentY += 20;

        const recs = [
            { label: 'Practice cue card strategy', val: feedback.recPracticeCueCard },
            { label: 'Expand topic vocabulary', val: feedback.recExpandTopicVocab },
            { label: 'Reduce Grammatical mistake', val: feedback.recReduceGrammarMistakes },
            { label: 'Watch native conversations', val: feedback.recWatchNativeConversations },
            { label: 'Use Linking Phrases', val: feedback.recUseLinkingPhrases },
            { label: 'Improve fluency', val: feedback.recImproveFluency },
            { label: 'Improve pronunciation', val: feedback.recImprovePronunciation },
        ].filter((f) => f.val);

        const colWidth = contentWidth / 2;
        const col1X = margin;
        const col2X = margin + colWidth;
        for (let i = 0; i < recs.length; i += 2) {
            // First column
            doc.fontSize(10).fillColor(darkGray).text(`• ${recs[i].label}`, col1X, currentY, {
                width: colWidth - 10,
            });

            // Second column (if exists)
            if (recs[i + 1]) {
                doc.text(`• ${recs[i + 1].label}`, col2X, currentY, {
                    width: colWidth - 10,
                });
            }

            // Move to next row
            currentY += 15;
        }

        // ---------------- EXAMINER COMMENT ----------------
        currentY += 15;
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('Examiner Comment', margin, currentY);
        currentY += 20;

        // Measure text height
        const examinerText = feedback.additionalNotes || '__________________________';
        const examinerTextOptions = {
            width: contentWidth - 20,
        };
        const textHeight = doc.heightOfString(examinerText, examinerTextOptions);

        // Draw border rectangle with dynamic height
        const rectHeight = textHeight + 20; // add padding
        doc.rect(margin, currentY, contentWidth, rectHeight).stroke('#d9d9d9');

        // Write text inside box
        doc.fontSize(10).fillColor(darkGray).font('Helvetica').text(examinerText, margin + 10, currentY + 10, examinerTextOptions);

        // Update currentY
        currentY += rectHeight + 20;


        const footerY = doc.page.height - 100;
        try {
            doc.image('qr.png', margin, footerY, { width: 50, height: 50 }); // QR placeholder
        } catch {
            doc.fontSize(8).text('[QR]', margin, footerY + 20);
        }

        doc.fontSize(9).fillColor(darkGray).text('Director-Speaking Test', pageWidth - margin - 150, footerY + 10, { width: 150, align: 'right' });
        doc.font('Helvetica-Bold').text('SpeakingMate.org', pageWidth - margin - 150, footerY + 25, { width: 150, align: 'right' });

        doc.end();
    });
}

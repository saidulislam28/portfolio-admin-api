/* eslint-disable */
const PDFDocument = require('pdfkit');

export function MockFeedbackPdfGenerate(feedback): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ 
            margin: 40, 
            size: 'A4',
            bufferPages: true
        });
        const chunks: Buffer[] = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Colors
        const primaryColor = '#2c3e50';
        const accentColor = '#e74c3c';
        const lightGray = '#ecf0f1';
        const darkGray = '#7f8c8d';

        // Page dimensions
        const pageWidth = doc.page.width;
        const margin = 40;
        const contentWidth = pageWidth - (margin * 2);

        // Helper function to create table rows
        const createTableRow = (y, criteria, rating, feedback, isHeader = false) => {
            const fontSize = isHeader ? 11 : 10;
            const textColor = isHeader ? 'white' : '#2c3e50';
            const bgColor = isHeader ? primaryColor : (y % 60 < 30 ? '#f8f9fa' : 'white');
            const rowHeight = 25;
            
            // Draw background
            doc.rect(margin, y - 5, contentWidth, rowHeight).fill(bgColor);
            
            // Add border
            doc.rect(margin, y - 5, contentWidth, rowHeight).stroke('#ddd');
            
            doc.fillColor(textColor)
               .fontSize(fontSize)
               .font(isHeader ? 'Helvetica-Bold' : 'Helvetica');
            
            // Column widths
            const col1Width = 180;
            const col2Width = 80;
            const col3Width = contentWidth - col1Width - col2Width;
            
            // Draw vertical lines
            doc.moveTo(margin + col1Width, y - 5)
               .lineTo(margin + col1Width, y + rowHeight - 5)
               .stroke('#ddd');
            
            doc.moveTo(margin + col1Width + col2Width, y - 5)
               .lineTo(margin + col1Width + col2Width, y + rowHeight - 5)
               .stroke('#ddd');
            
            // Add text content
            doc.text(criteria, margin + 5, y, { width: col1Width - 10, align: 'left' });
            doc.text(rating, margin + col1Width + 5, y, { width: col2Width - 10, align: 'center' });
            doc.text(feedback, margin + col1Width + col2Width + 5, y, { width: col3Width - 10, align: 'left' });
            
            return y + rowHeight;
        };

        let currentY = margin;

        // -------- HEADER SECTION --------
        doc.fillColor(primaryColor)
           .fontSize(24)
           .font('Helvetica-Bold')
           .text('SpeakingMate', margin, currentY, { width: contentWidth, align: 'center' });
        
        currentY += 30;
        
        doc.fontSize(14)
           .font('Helvetica')
           .text('Live Speaking Tests – Practice Like the Real Exam', margin, currentY, { width: contentWidth, align: 'center' });
        
        currentY += 20;
        
        doc.fontSize(12)
           .fillColor(accentColor)
           .text('MASTER IELTS SPEAKING WITH CONFIDENCE', margin, currentY, { width: contentWidth, align: 'center' });

        currentY += 40;

        // Test Information Box
        const infoBoxHeight = 100;
        doc.rect(margin, currentY, contentWidth, infoBoxHeight)
           .fillAndStroke(lightGray, darkGray);
        
        doc.fillColor(primaryColor)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('MOCK TEST INFORMATION', margin + 10, currentY + 15);

        const infoY = currentY + 40;
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#2c3e50')
           .text(`Test Taker Name: ${feedback?.Appointment?.User?.full_name || 'N/A'}`, margin + 10, infoY)
           .text(`Date: ${new Date(feedback?.testDate || feedback?.createdAt).toLocaleDateString() || 'N/A'}`, margin + 280, infoY)
           .text(`Examiner: ${feedback?.Consultant?.full_name || 'N/A'}`, margin + 10, infoY + 20)
           .text(`Time: ${feedback?.Appointment?.slot_time || 'N/A'}`, margin + 280, infoY + 20);

        currentY += infoBoxHeight + 30;

        // -------- TITLE AND OVERALL SCORE SECTION --------
        // Title on the left, score box on the right
        doc.fillColor(primaryColor)
           .fontSize(16)
           .font('Helvetica-Bold')
           .text('Speaking Mock Test Report Card', margin, currentY);

        // Overall Band Score Box (positioned on the right)
        const scoreBoxWidth = 135;
        const scoreBoxHeight = 80;
        const scoreBoxX = pageWidth - margin - scoreBoxWidth;
        
        doc.rect(scoreBoxX, currentY - 10, scoreBoxWidth, scoreBoxHeight)
           .fillAndStroke('#fff5f5', accentColor);
        
        doc.fillColor(accentColor)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('Overall Band Score', scoreBoxX + 10, currentY + 5, { width: scoreBoxWidth - 20, align: 'center' });
        
        doc.fontSize(36)
           .text(`${feedback.overallBandScore || '0'}`, scoreBoxX + 10, currentY + 25, { width: scoreBoxWidth - 20, align: 'center' });

        currentY += 50;

        // -------- CRITERIA TABLE --------
        // Table header
        currentY = createTableRow(currentY, 'Criteria', 'Star Rating (1.0-9.0)', 'Feedback', true);

        // Band descriptors data
        const bandDescriptors = [
            {
                criteria: 'Fluency & Coherence',
                rating: feedback.fluencyCoherence || '-',
                feedbacks: [
                    { label: 'Fluent', value: feedback.fluencyFluent },
                    { label: 'Natural flow', value: feedback.fluencyNaturalFlow },
                    { label: 'Needs coherence', value: feedback.fluencyNeedsCoherence },
                    { label: 'Repeats ideas', value: feedback.fluencyRepeatsIdeas }
                ].filter(f => f.value).map(f => f.label)
            },
            {
                criteria: 'Lexical Resource',
                rating: feedback.lexicalResource || '-',
                feedbacks: [
                    { label: 'Good variety', value: feedback.lexicalGoodVariety },
                    { label: 'Repetitive', value: feedback.lexicalRepetitive },
                    { label: 'Topic mismatch', value: feedback.lexicalTopicMismatch },
                    { label: 'Limited range', value: feedback.lexicalLimitedRange }
                ].filter(f => f.value).map(f => f.label)
            },
            {
                criteria: 'Grammatical Range & Accuracy',
                rating: feedback.grammaticalRange || '-',
                feedbacks: [
                    { label: 'Frequent errors', value: feedback.grammarFrequentErrors },
                    { label: 'Tense issues', value: feedback.grammarTenseIssues },
                    { label: 'Limited Range', value: feedback.grammarLimitedRange },
                    { label: 'Mostly Accurate', value: feedback.grammarMostlyAccurate }
                ].filter(f => f.value).map(f => f.label)
            },
            {
                criteria: 'Pronunciation',
                rating: feedback.pronunciation || '-',
                feedbacks: [
                    { label: 'Sound Clear', value: feedback.pronunciationClearSounds },
                    { label: 'Good Stress', value: feedback.pronunciationGoodStress },
                    { label: 'Mispronunciation', value: feedback.pronunciationMispronunciations },
                    { label: 'Accent issues', value: feedback.pronunciationAccentIssues }
                ].filter(f => f.value).map(f => f.label)
            }
        ];

        // Draw table rows
        bandDescriptors.forEach((descriptor) => {
            const feedbackText = descriptor.feedbacks.length > 0 ? descriptor.feedbacks.join(', ') : '-';
            currentY = createTableRow(currentY, descriptor.criteria, descriptor.rating.toString(), feedbackText);
        });

        currentY += 30;

        // -------- SECTION WISE FEEDBACK --------
        doc.fillColor(primaryColor)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('Section Wise Feedback', margin, currentY);

        currentY += 25;

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
                doc.fontSize(10)
                   .fillColor('#2c3e50')
                   .font('Helvetica-Bold')
                   .text(`${section.title} – `, margin, currentY, { continued: true })
                   .font('Helvetica')
                   .text(selected.join(', '), { width: contentWidth });
                currentY += 20;
            }
        });

        currentY += 20;

        // -------- RECOMMENDATIONS --------
        doc.fillColor(primaryColor)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('Recommendation', margin, currentY);

        currentY += 25;

        const recommendations = [
            { label: 'Practice cue card strategy', value: feedback.recPracticeCueCard },
            { label: 'Expand topic vocabulary', value: feedback.recExpandTopicVocab },
            { label: 'Reduce Grammatical mistake', value: feedback.recReduceGrammarMistakes },
            { label: 'Watch native conversations', value: feedback.recWatchNativeConversations },
            { label: 'Use Linking Phrases', value: feedback.recUseLinkingPhrases },
            { label: 'Improve fluency', value: feedback.recImproveFluency },
            { label: 'Improve pronunciation', value: feedback.recImprovePronunciation }
        ].filter(f => f.value);

        // Display recommendations in a single column for better readability
        recommendations.forEach(rec => {
            doc.fontSize(10)
               .fillColor('#2c3e50')
               .font('Helvetica')
               .text(`• ${rec.label}`, margin, currentY, { width: contentWidth });
            currentY += 18;
        });

        // -------- EXAMINER COMMENT --------
        if (feedback.additionalNotes && feedback.additionalNotes.trim()) {
            currentY += 20;
            
            doc.fillColor(primaryColor)
               .fontSize(14)
               .font('Helvetica-Bold')
               .text('Examiner Comment', margin, currentY);

            currentY += 20;
            
            const commentHeight = 60;
            doc.rect(margin, currentY, contentWidth, commentHeight)
               .fillAndStroke('#f8f9fa', darkGray);

            doc.fontSize(10)
               .fillColor('#2c3e50')
               .font('Helvetica')
               .text(feedback.additionalNotes, margin + 10, currentY + 15, { 
                   width: contentWidth - 20, 
                   height: commentHeight - 30
               });

            currentY += commentHeight + 20;
        }

        // -------- FOOTER --------
        // Calculate footer position (ensure it's at the bottom)
        const footerY = Math.max(currentY + 40, doc.page.height - 120);
        
        // Contact info centered
        doc.fontSize(10)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text('+8801711-779687', margin, footerY, { width: contentWidth, align: 'center' });

        // Left side - website info
        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#2c3e50')
           .text('www.speakingmate.org', margin, footerY + 25)
           .text('info@speakingmate.org', margin, footerY + 40);

        // Right side - signature
        doc.fontSize(9)
           .text('(Pre-installed signature)', pageWidth - margin - 150, footerY + 15, { width: 150, align: 'right' })
           .text('Director-Speaking Test', pageWidth - margin - 150, footerY + 30, { width: 150, align: 'right' })
           .font('Helvetica-Bold')
           .text('SpeakingMate.org', pageWidth - margin - 150, footerY + 45, { width: 150, align: 'right' });

        // Bottom brand name
        doc.fillColor(primaryColor)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('Speakingmate.0', margin, footerY + 60);

        doc.end();
    });
}
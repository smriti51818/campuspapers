import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Paper from '../models/Paper.js';

dotenv.config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;
const MONGO_URI = process.env.MONGO_URI;

if (!AI_SERVICE_URL || !MONGO_URI) {
    console.error("Error: AI_SERVICE_URL and MONGO_URI must be set in .env");
    process.exit(1);
}

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");

        // Sort EVERYTHING by date to ensure we process chronologically
        const papers = await Paper.find({}).sort({ createdAt: 1 });
        console.log(`Processing ${papers.length} papers for chronological authenticity re-evaluation.`);

        for (const paper of papers) {
            console.log(`Processing Paper: ${paper.subject} (${paper._id}) - ${paper.createdAt}`);
            try {
                // Fetch papers uploaded BEFORE this one
                const previousPapers = await Paper.find({ createdAt: { $lt: paper.createdAt } }).select('extractedText');
                const existingTexts = previousPapers.map(p => p.extractedText).filter(t => t);

                const response = await axios.post(`${AI_SERVICE_URL}/check`, {
                    metadata: { subject: paper.subject, department: paper.department, year: paper.year, semester: paper.semester },
                    file_url: paper.fileUrl,
                    existing_texts: existingTexts
                });

                const { extractedText, authenticityScore, isAuthentic, aiFeedback } = response.data;

                paper.extractedText = extractedText;
                paper.aiResult = {
                    authenticityScore,
                    isAuthentic,
                    aiFeedback: aiFeedback
                };

                await paper.save();
                console.log(`✅ Success for ${paper._id} - Score: ${authenticityScore}% - ${aiFeedback}`);
            } catch (err) {
                console.error(`❌ Failed for ${paper._id}: ${err.message}`);
            }
        }

        console.log("Migration completed.");
        process.exit(0);
    } catch (err) {
        console.error("Migration error:", err);
        process.exit(1);
    }
}

migrate();

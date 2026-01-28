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

        const papers = await Paper.find({ $or: [{ extractedText: "" }, { extractedText: { $exists: false } }] });
        console.log(`Found ${papers.length} papers needing text extraction.`);

        for (const paper of papers) {
            console.log(`Processing Paper: ${paper.subject} (${paper._id})`);
            try {
                // Call AI service to get text and score
                // We send an empty existing_texts for now to at least get the text extracted
                const response = await axios.post(`${AI_SERVICE_URL}/check`, {
                    metadata: { subject: paper.subject, department: paper.department, year: paper.year, semester: paper.semester },
                    file_url: paper.fileUrl,
                    existing_texts: []
                });

                const { extractedText, authenticityScore, isAuthentic, aiFeedback } = response.data;

                paper.extractedText = extractedText;
                paper.aiResult = {
                    authenticityScore,
                    isAuthentic,
                    aiFeedback: "Migrated: " + aiFeedback
                };

                await paper.save();
                console.log(`✅ Success for ${paper._id}`);
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

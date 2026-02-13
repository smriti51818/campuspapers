import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Paper from '../models/Paper.js';

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Rename views to downloads in all documents
        const result = await Paper.updateMany(
            { views: { $exists: true } },
            [
                { $set: { downloads: "$views" } },
                { $unset: "views" }
            ]
        );

        console.log(`Successfully migrated ${result.modifiedCount} documents.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();

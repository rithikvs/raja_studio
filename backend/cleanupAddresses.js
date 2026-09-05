import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function cleanupAddresses() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        
        const database = client.db(process.env.MONGODB_DB_NAME || 'raja_studio');
        
        // Delete all addresses
        const result = await database.collection('addresses').deleteMany({});
        
        console.log(`✅ Deleted ${result.deletedCount} addresses from database`);
        console.log('Addresses collection is now empty and ready for fresh data');
        
    } catch (error) {
        console.error('❌ Error cleaning up addresses:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

cleanupAddresses();

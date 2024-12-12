'use strict';
import mongoose from 'mongoose';
import config from '../config/mongodb.config';

class Database {
    public static instance: Database;

    constructor() {
        this.connect();
    }

    async connect() {
        const logging = process.env.NODE_ENV === 'dev' ? console.log : false;
        const uri = process.env.DEV_DB_URI as string;
    
        try {
            await mongoose.connect(uri,{
                dbName: config.db.name,
            });
            console.log('Connected to MongoDB');
        } catch (err) {
            console.error('Error connecting to MongoDB', err);
        }
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new Database();
        }
        return this.instance;
    }
}

export default Database;
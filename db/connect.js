const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');

let prisma;

const dbConnect = () => {
    try {
        if (!prisma) {
            prisma = new PrismaClient();
        }
        console.log("SQLite database connected via Prisma..");
        return prisma;
    } catch (error) {
        console.log("SQLite connection failed.", error);
        throw error;
    }
}

const getPrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
}

module.exports = { dbConnect, getPrismaClient }

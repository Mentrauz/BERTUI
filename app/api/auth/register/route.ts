import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const result = await usersCollection.insertOne({
            email,
            password: hashedPassword,
            name: name || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json(
            { message: 'User created successfully', userId: result.insertedId },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

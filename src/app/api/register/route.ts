import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, password, role } = await req.json();

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await db.insert(users).values({
            name: `${firstName} ${lastName}`,
            email,
        }).returning();

        const userId = newUser[0].id;

        // Create account
        await db.insert(accounts).values({
            userId,
            accountId: email,
            providerId: "credentials",
            password: hashedPassword,
        });

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

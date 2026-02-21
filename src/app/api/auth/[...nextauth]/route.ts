import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Bu yerda foydalanuvchini bazadan tekshirish logikasi bo'ladi
                // Hozircha namunaviy (mock) foydalanuvchi qaytaramiz
                if (credentials?.email === "admin@hirezone.uz" && credentials?.password === "password123") {
                    return { id: "1", name: "Admin", email: "admin@hirezone.uz" };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

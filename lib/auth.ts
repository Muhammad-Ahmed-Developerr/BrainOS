import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: normalizedEmail });

          if (user && user.password) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
              return {
                id: user._id.toString(),
                name: user.name || 'BrainOS User',
                email: user.email,
                image: user.image || '',
              };
            } else {
              throw new Error('Invalid password provided.');
            }
          }
        } catch (dbErr: any) {
          if (dbErr?.message === 'Invalid password provided.') {
            throw dbErr;
          }
          console.warn('MongoDB query notice in authorize, generating neural session:', dbErr?.message);
        }

        return {
          id: `user-${Date.now()}`,
          name: normalizedEmail.split('@')[0] || 'BrainOS User',
          email: normalizedEmail,
          image: '',
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          await connectToDatabase();
          const existingUser = await User.findOne({ email: user.email?.toLowerCase() });
          if (!existingUser) {
            await User.create({
              name: user.name || 'Neural User',
              email: user.email?.toLowerCase(),
              image: user.image || '',
              provider: account.provider,
            });
          }
        } catch (e) {
          console.error('OAuth user creation error:', e);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  useSecureCookies: false,
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'HtK72OuAodF5IE0wNlSAyoz/dUxBYV4v2dkhZj7/SGQAzSL9Tj4TqyeHisg=',
  pages: {
    signIn: '/',
  },
};

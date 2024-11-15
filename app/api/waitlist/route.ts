import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import WaitlistEmail from '@/components/email/WaitlistEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const WaitlistSchema = z.object({
  email: z.string().email()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = WaitlistSchema.parse(body);

    // Check if email already exists
    const existingSubscriber = await prisma.waitlist.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Add to waitlist
    await prisma.waitlist.create({
      data: { email }
    });

    // Send welcome email
    await resend.emails.send({
      from: 'Pouparia <hey@pouparia.com>',
      to: email,
      subject: 'Welcome to Pouparia Waitlist!',
      react: WaitlistEmail({ userEmail: email })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
  message: z.string().min(10).max(4000),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = ContactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload', errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const receivedAt = new Date().toISOString();
  const payload = { ...parsed.data, receivedAt };

  // Check if Resend API key is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    // Dev mode - just log
    console.log('[contact][dev]', payload);
    return NextResponse.json({
      success: true,
      message: 'Message received (dev mode - no email sent).',
    });
  }

  try {
    const resend = new Resend(resendApiKey);
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Magnus Platform <onboarding@resend.dev>', // Use your verified domain later
      to: process.env.CONTACT_TO_EMAIL || 'magnus@example.com',
      replyTo: parsed.data.email,
      subject: `Contact from ${parsed.data.name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${parsed.data.name} (${parsed.data.email})</p>
        <p><strong>Received:</strong> ${receivedAt}</p>
        <hr />
        <p>${parsed.data.message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    if (error) {
      console.error('[contact][resend_error]', error);
      return NextResponse.json(
        { success: false, message: 'Failed to send message. Please try again later.' },
        { status: 502 }
      );
    }

    console.log('[contact][sent]', { id: data?.id, email: parsed.data.email });
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully! I\'ll get back to you soon.' 
    });
    
  } catch (err) {
    console.error('[contact][error]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to send message. Please try again later.' },
      { status: 502 }
    );
  }
}

'use server';
/**
 * @fileOverview Genkit flows for authentication and security verification.
 *
 * - sendOTP - Generates and sends a verification code to a user's email using Resend.
 * - verifyOTP - Validates a provided code (simulated for prototype).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

const OTPInputSchema = z.object({
  email: z.string().email(),
});

const OTPOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  isSimulated: z.boolean(),
});

/**
 * Sends a 6-digit verification code to the user's email via Resend.
 * Falls back to console log if RESEND_API_KEY is not configured.
 */
export async function sendOTP(input: { email: string }): Promise<OTPOutputSchema> {
  return sendOTPFlow(input);
}

const sendOTPFlow = ai.defineFlow(
  {
    name: 'sendOTPFlow',
    inputSchema: OTPInputSchema,
    outputSchema: OTPOutputSchema,
  },
  async (input) => {
    // Generate a secure 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey && apiKey !== 're_your_api_key_here') {
      try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
          from: 'DeebData Trading <onboarding@resend.dev>',
          to: [input.email],
          subject: 'Security Authorization Code | DeebData Trading',
          html: `
            <div style="font-family: sans-serif; background-color: #020617; color: #ffffff; padding: 40px; border-radius: 8px;">
              <h1 style="color: #8b5cf6; margin-bottom: 24px;">Security Verification</h1>
              <p style="font-size: 16px; margin-bottom: 24px;">Your institutional access code for DeebData Trading is:</p>
              <div style="background-color: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6; padding: 20px; border-radius: 12px; text-align: center;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #8b5cf6;">${code}</span>
              </div>
              <p style="font-size: 12px; color: #64748b; margin-top: 24px;">This code was dispatched at ${new Date().toISOString()}. If you did not request this, please ignore this email.</p>
              <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;" />
              <p style="font-size: 10px; color: #475569; text-align: center;">Powered by Hassan Deeb</p>
            </div>
          `,
        });
        
        if (error) {
           console.error('[AUTH] Resend API Error:', error);
           throw error;
        }

        console.log(`[AUTH] Real email dispatched to ${input.email}.`);
        return {
          success: true,
          message: `A secure authorization code has been dispatched to ${input.email}.`,
          isSimulated: false,
        };
      } catch (error) {
        console.error('[AUTH] Failed to send real email via Resend:', error);
      }
    }

    // FALLBACK: If no API key is provided, we log to the terminal so developers aren't locked out.
    console.log(`
------------------------------------------------------------
[SECURITY PROTOCOL] Verification Code for ${input.email}
CODE: ${code}
SENT AT: ${new Date().toISOString()}
ACTION: Add RESEND_API_KEY to your .env file for real email delivery.
------------------------------------------------------------
    `);

    return {
      success: true,
      message: `A verification code was logged to the terminal for ${input.email}.`,
      isSimulated: true,
    };
  }
);

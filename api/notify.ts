import type { VercelRequest, VercelResponse } from '@vercel/node';

// This would typically use Resend or another email provider
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body } = request.body;

  if (!to || !subject || !body) {
    return response.status(400).json({ error: 'Missing parameters' });
  }

  try {
    console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
    console.log(`[MOCK EMAIL] Body: ${body}`);

    // In a real implementation:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: 'Verto <notifications@verto.campus>', to, subject, html: body });

    return response.status(200).json({ success: true, message: 'Notification sent (mock)' });
  } catch (error: any) {
    return response.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
}

export interface Env {
  RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json<{
      to: string;
      subject: string;
      text: string;
      html?: string;
    }>();

    const { to, subject, text, html } = body;

    if (!to || !subject || !text) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Only allow sending to our own inboxes — without this, the endpoint is
    // an open relay anyone could use to send mail from our domain.
    const ALLOWED_RECIPIENTS = [
      'support@dunnluxuryselections.com',
      'online@dunnluxuryselections.com',
    ];
    if (!ALLOWED_RECIPIENTS.includes(to.toLowerCase().trim())) {
      return new Response(JSON.stringify({ error: 'Recipient not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if RESEND_API_KEY is set
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Dunn\'s Luxury Selections <online@dunnluxuryselections.com>',
        to: to,
        subject: subject,
        text: text,
        html: html || text.replace(/\n/g, '<br>'),
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Resend API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await resendResponse.json();

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Send email function error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

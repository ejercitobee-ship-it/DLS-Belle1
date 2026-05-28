export interface Env {
  BREVO_API_KEY: string;
  BREVO_LIST_ID?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json<{ name: string; email: string; phone: string }>();

    const { name, email, phone } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add contact to Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: name.split(' ')[0] || name,
          LASTNAME: name.split(' ').slice(1).join(' ') || '',
          PHONE: phone || '',
          SOURCE: 'Website Popup Form',
        },
        listIds: env.BREVO_LIST_ID ? [parseInt(env.BREVO_LIST_ID)] : undefined,
        updateEnabled: true, // Update contact if already exists
      }),
    });

    if (!brevoResponse.ok && brevoResponse.status !== 409) { // 409 = contact already exists
      const errorData = await brevoResponse.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Brevo API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to add contact. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact function error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

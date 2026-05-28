export interface Env {
  BREVO_API_KEY: string;
  BREVO_LIST_ID?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json<{ firstName: string; lastName: string; email: string; phone: string }>();

    const { firstName, lastName, email, phone } = body;

    if (!email.trim()) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if BREVO_API_KEY is set
    if (!env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ error: 'Server configuration error. Please contact support.' }), {
        status: 500,
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
        email: email.trim(),
        attributes: {
          FIRSTNAME: firstName.trim() || '',
          LASTNAME: lastName.trim() || '',
          PHONE: phone.trim() || '',
          SOURCE: 'Website Popup Form',
        },
        listIds: env.BREVO_LIST_ID ? [parseInt(env.BREVO_LIST_ID)] : undefined,
        updateEnabled: true, // Update contact if already exists
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Brevo API error:', errorData);
      
      // If contact already exists (409), that's fine
      if (brevoResponse.status === 409) {
        return new Response(JSON.stringify({ success: true, message: 'Contact already exists' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
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

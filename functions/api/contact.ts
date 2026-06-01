export interface Env {
  KLAVIYO_API_KEY: string;
  KLAVIYO_LIST_ID?: string;
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

    // Check if KLAVIYO_API_KEY is set
    if (!env.KLAVIYO_API_KEY) {
      console.error('KLAVIYO_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ error: 'Server configuration error. Please contact support.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create profile in Klaviyo
    const profileData = {
      data: {
        type: 'profile',
        attributes: {
          email: email.trim(),
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          phone_number: phone.trim() || undefined,
          properties: {
            source: 'Website Popup Form',
          },
        },
      },
    };

    // Create or update profile
    const klaviyoResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_API_KEY}`,
        'revision': '2024-06-15',
      },
      body: JSON.stringify(profileData),
    });

    let profileId: string | null = null;

    if (klaviyoResponse.ok) {
      const responseData = await klaviyoResponse.json();
      profileId = responseData.data?.id;
    } else if (klaviyoResponse.status === 409) {
      // Profile already exists - get the existing profile ID
      const searchResponse = await fetch(
        `https://a.klaviyo.com/api/profiles/?filter=equals(email,"${encodeURIComponent(email.trim())}")`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_API_KEY}`,
            'revision': '2024-06-15',
          },
        }
      );
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        profileId = searchData.data?.[0]?.id;
      }
    } else {
      const errorData = await klaviyoResponse.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Klaviyo API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to add contact. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add profile to list if list ID is configured
    if (profileId && env.KLAVIYO_LIST_ID) {
      const listResponse = await fetch(
        `https://a.klaviyo.com/api/lists/${env.KLAVIYO_LIST_ID}/relationships/profiles/`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_API_KEY}`,
            'revision': '2024-06-15',
          },
          body: JSON.stringify({
            data: [
              {
                type: 'profile',
                id: profileId,
              },
            ],
          }),
        }
      );

      if (!listResponse.ok) {
        console.error('Failed to add profile to list:', await listResponse.text());
      }
    }

    // Track "Joined the Circle" event
    const eventData = {
      data: {
        type: 'event',
        attributes: {
          metric: {
            data: {
              type: 'metric',
              attributes: {
                name: 'Joined the Circle',
              },
            },
          },
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: email.trim(),
                first_name: firstName.trim() || undefined,
                last_name: lastName.trim() || undefined,
                phone_number: phone.trim() || undefined,
              },
            },
          },
          timestamp: new Date().toISOString(),
          properties: {
            source: 'Website Popup Form',
          },
        },
      },
    };

    const eventResponse = await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_API_KEY}`,
        'revision': '2024-06-15',
      },
      body: JSON.stringify(eventData),
    });

    if (!eventResponse.ok) {
      console.error('Failed to track event:', await eventResponse.text());
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

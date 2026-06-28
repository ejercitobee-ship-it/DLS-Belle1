export interface Env {
  KLAVIYO_API_KEY: string;
  KLAVIYO_LIST_ID?: string;
  RESEND_API_KEY: string;
}

// Helper to format phone number to E.164 format
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 1 and has 11 digits, it's likely US/Canada
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If it has 10 digits, assume US/Canada and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // If it already starts with +, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Otherwise, just add + prefix
  return `+${digits}`;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json<{ firstName: string; lastName: string; email: string; phone: string; collectorType?: string }>();

    const { firstName, lastName, email, phone, collectorType } = body;

    if (!email.trim()) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Phone is optional
    const formattedPhone = phone.trim() ? formatPhoneNumber(phone.trim()) : undefined;

    // Klaviyo integration (optional - only if API key is configured)
    if (env.KLAVIYO_API_KEY) {
      const profileData = {
        data: {
          type: 'profile',
          attributes: {
            email: email.trim(),
            first_name: firstName.trim() || undefined,
            last_name: lastName.trim() || undefined,
            ...(formattedPhone && { phone_number: formattedPhone }),
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

          // Update the existing profile with new phone number if provided
          if (profileId && formattedPhone) {
            const updateResponse = await fetch(
              `https://a.klaviyo.com/api/profiles/${profileId}/`,
              {
                method: 'PATCH',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_API_KEY}`,
                  'revision': '2024-06-15',
                },
                body: JSON.stringify({
                  data: {
                    type: 'profile',
                    id: profileId,
                    attributes: {
                    ...(formattedPhone && { phone_number: formattedPhone }),
                      first_name: firstName.trim() || undefined,
                      last_name: lastName.trim() || undefined,
                    },
                  },
                }),
              }
            );

            if (!updateResponse.ok) {
              console.error('Failed to update profile phone number:', await updateResponse.text());
            }
          }
        }
      } else {
        console.error('Klaviyo API error:', await klaviyoResponse.json().catch(() => ({ message: 'Unknown error' })));
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
                  ...(formattedPhone && { phone_number: formattedPhone }),
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
    }

    // Send lead info to support via Resend API
    if (env.RESEND_API_KEY) {
      const collectorTypeMap: Record<string, string> = {
        desktop: 'Desktop Collection',
        cabinet: 'Cabinet Installation',
        walkin: 'Walk-in Sanctuary',
        travel: 'Travel Preservation',
        investment: 'Investment Pieces',
        other: 'Bespoke Solutions',
      };

      const collectorTypeLabel = collectorType ? collectorTypeMap[collectorType] || collectorType : 'Not specified';

      const emailHtml = `
        <h2>New Lead from Collection Preview Form</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Collector Type:</strong> ${collectorTypeLabel}</p>
        <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
        <hr>
        <p>Follow up with this lead about their ${collectorTypeLabel.toLowerCase()} needs.</p>
      `;

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@dunnluxuryselections.com',
          to: 'support@dunnluxuryselections.com',
          subject: `New Lead: ${firstName} - ${collectorTypeLabel}`,
          html: emailHtml,
          reply_to: email,
        }),
      });

      if (!resendResponse.ok) {
        console.error('Failed to send lead email via Resend:', await resendResponse.text());
      }
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

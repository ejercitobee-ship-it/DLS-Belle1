# Form Submissions & Email Forwarding Setup

## Overview

The theme includes two form submission points:
1. **Newsletter signup** - Appears on all pages
2. **Contact form** - Full contact page at `/contact`

Both forms are configured to forward to **support@dunnluxuryselections.com**.

---

## Forms in the Theme

### 1. Newsletter Signup Form

**Where it appears:**
- Footer of every page (included in newsletter section)
- Homepage
- Product pages
- Collection pages
- Contact page

**What it collects:**
- Email address only
- Automatically tagged as "newsletter" in Shopify

**How it submits:**
- Posts to Shopify's native `/contact` endpoint
- Shopify forwards to configured email

### 2. Contact Form

**Where it appears:**
- `/contact` page (contact template)

**What it collects:**
- Name (required)
- Email (required)
- Phone (optional)
- Message/Subject (required)

**How it submits:**
- Posts to Shopify's native `/contact` endpoint
- Shopify forwards to configured email
- Includes form submission details

---

## Setup: Configure Email Forwarding in Shopify

### Step 1: Create Contact Page (if not exists)

1. Go to **Shopify Admin** → **Online Store** → **Pages**
2. Click **Add page**
3. Enter details:
   - **Title**: Contact
   - **URL handle**: contact
   - **Content**: Leave blank (theme handles it)
4. Click **Save**

### Step 2: Configure Email Recipient

1. Go to **Shopify Admin** → **Settings** → **Email**
   - OR **Settings** → **Notifications** (depending on Shopify version)
2. Look for **"Contact form submissions"** or **"Contact requests"**
3. Set email recipient to: **support@dunnluxuryselections.com**
4. Save settings

### Step 3: Configure Store Email (if needed)

1. Go to **Shopify Admin** → **Settings** → **General**
2. Find **"Store email"** setting
3. Set to: **support@dunnluxuryselections.com**
4. Save

### Step 4: Test Form Submissions

1. Visit your storefront: **www.dunnluxuryselections.com/contact**
2. Fill out the contact form:
   - Name: Test Name
   - Email: test@email.com
   - Subject: Test Message
   - Message: This is a test
3. Click **Send Message**
4. Should see "Thank you" message
5. Check **support@dunnluxuryselections.com** inbox for submission

---

## Email Examples

### Newsletter Signup Email

```
Contact form submission from your online store

From: subscriber@example.com
Date: [Date]

They added the tag: newsletter
```

### Contact Form Email

```
Contact form submission from your online store

Name:
John Smith

Email:
john@example.com

Phone:
+1 (555) 123-4567

Subject:
Product Inquiry

Message:
I'm interested in learning more about your premium humidors.

Date: [Date]
```

---

## Email Configuration Locations (by Shopify version)

### Shopify Plus / Advanced

**Settings → Notifications:**
1. Look for "Contact form submissions"
2. Find the recipient field
3. Update to: support@dunnluxuryselections.com

### Standard Shopify Plan

**Settings → Email:**
1. Scroll to "Contact form"
2. Update recipient
3. Save

**OR Settings → General:**
1. Find "Store email"
2. Update to: support@dunnluxuryselections.com

### If You Don't See Contact Form Settings

1. Make sure contact page exists (`/contact`)
2. Make sure at least one contact form submission was made
3. Sometimes settings only appear after first submission

---

## Troubleshooting

### Not Receiving Form Submissions

**Problem**: Forms submit but no emails arrive
**Causes**:
- Email recipient not configured
- Contact page doesn't exist
- Email in spam folder

**Solution**:
1. Verify contact page exists: Visit www.dunnluxuryselections.com/contact
2. Check Shopify Settings → Email for "Contact form" recipient
3. Check spam folder for @noreply.shopify.com emails
4. Try submitting test form again

### Form Says "Thank You" but No Email

**Problem**: Form shows success message but no email received
**Causes**:
- Email correctly configured but going to spam
- Email configured to different address
- Spam filter blocking

**Solution**:
1. Check **spam/junk folder** in support@dunnluxuryselections.com
2. Add noreply@shopify.com to contacts
3. Verify email in Shopify Settings matches
4. Try resubmitting form

### Newsletter Signup Not Working

**Problem**: Newsletter form doesn't submit
**Causes**:
- Contact page missing
- JavaScript error in browser
- Email field validation

**Solution**:
1. Create contact page if missing
2. Check browser console (F12) for JS errors
3. Try using a different email address
4. Try in incognito mode (clear cache)

---

## Form Configuration in Code

### Newsletter Form

**File**: `sections/newsletter.liquid`

**Current configuration:**
```liquid
<form class="newsletter-form" method="POST" action="/contact#newsletter" data-track-newsletter>
  <input type="hidden" name="form_type" value="customer" />
  <input type="hidden" name="contact[email]" name="contact[email]" />
  <input type="hidden" name="contact[tags]" value="newsletter" />
```

**This sends to**: `/contact` endpoint with `newsletter` tag

### Contact Form

**File**: `templates/contact.liquid`

**Current configuration:**
```liquid
<form method="post" action="/contact" class="contact-form">
  <input name="contact[name]" ... />
  <input name="contact[email]" ... />
  <textarea name="contact[body]" ... />
```

**This sends to**: `/contact` endpoint with full submission details

---

## Best Practices

✅ **DO:**
- Monitor support@dunnluxuryselections.com inbox daily
- Respond to contact form submissions within 2-4 hours
- Add noreply@shopify.com to email contacts
- Test forms quarterly
- Keep contact page description updated
- Add phone number to contact page

❌ **DON'T:**
- Use a personal Gmail for business emails
- Leave contact form offline
- Ignore "newsletter" tagged emails
- Filter Shopify emails to spam

---

## Monitoring Form Submissions

### Daily

- Check support@dunnluxuryselections.com inbox
- Response time: < 2 hours for inquiries

### Weekly

- Review all form submissions
- Identify common questions
- Update FAQ if needed

### Monthly

- Analyze form submission trends
- See which topics are most common
- Improve contact page based on patterns

---

## Optional Enhancements

### Add Discord/Slack Notification

You can set up automation to notify you instantly when forms are submitted:

1. **Zapier** (easiest)
   - Connect Shopify contact forms to Slack/Discord
   - Get instant notifications
   - https://zapier.com/apps/shopify/integrations/discord

2. **Webhook** (advanced)
   - Configure Shopify webhook
   - Send form data to custom endpoint
   - Process notifications programmatically

---

## Quick Setup Checklist

- [ ] Contact page created in Shopify
- [ ] Email recipient configured (support@dunnluxuryselections.com)
- [ ] Test contact form submitted
- [ ] Test email received
- [ ] Test newsletter signup submitted
- [ ] Newsletter test email received
- [ ] Added noreply@shopify.com to contacts
- [ ] Inbox monitored daily

---

## Support

If forms aren't working:

1. **Verify page exists**: Visit `/contact`
2. **Check Settings**: Shopify Admin → Settings → Email/Notifications
3. **Test form**: Submit test message
4. **Check spam**: Look in spam folder
5. **Contact Shopify**: Support if still not working

---

## Remember

All form submissions are now configured to go to: **support@dunnluxuryselections.com**

Make sure you:
- Monitor this inbox daily
- Respond promptly to inquiries
- Add Shopify to your contacts so emails don't go to spam

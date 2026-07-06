# Shopify Admin Setup Guide

## Overview

Before the theme can fully display, you need to set up collections and navigation in Shopify Admin. This guide walks through the 3 essential setup steps.

## Step 1: Create Collections

Collections organize your products into categories (e.g., "Electronic Humidors", "Cabinet Humidors").

### 1.1 Create First Collection

1. Log into **Shopify Admin** (admin.shopify.com)
2. Go to **Products** → **Collections** (left sidebar)
3. Click **Create collection** button
4. Enter collection details:
   - **Title**: `Electronic Humidors`
   - **Description**: `High-tech electronic humidors with digital controls`
   - **Collection type**: Choose "Manual" (you'll add products manually)
   - **Products**: Search and add products to this collection
5. Click **Save collection**

### 1.2 Create Remaining Collections

Repeat the above for each category:

| Collection Name | Description |
|---|---|
| Electronic Humidors | Humidors with digital humidity controls |
| Cabinet Humidors | Large cabinet-style premium humidors |
| Desktop Humidors | Desktop-sized luxury humidors |
| Travel Humidors | Portable humidors for on-the-go |
| Accessories | Cigar accessories and tools |

**Tip**: After creating collections, use the **Products** page to assign products to multiple collections.

### 1.3 Verify Collections

After creating:
1. Go to **Products** → **Collections**
2. You should see all 5+ collections listed
3. Each collection should have products assigned

---

## Step 2: Configure Navigation Menu

Navigation menus tell the header where the "Electronic", "Cabinet", etc. buttons should link.

### 2.1 Create Main Menu

1. Go to **Online Store** → **Navigation** (or **Menus** in older Shopify)
2. Click **Create menu** button
3. Menu name: `Main Menu`
4. Click **Save**

### 2.2 Add Menu Items

Now add menu links:

1. Click **Add menu item**
2. For each item:

   **Item 1: Electronic**
   - **Menu item name**: `Electronic`
   - **Link to**: Select **Collections** → **Electronic Humidors**
   - Click **Add**

   **Item 2: Cabinet**
   - **Menu item name**: `Cabinet`
   - **Link to**: Select **Collections** → **Cabinet Humidors**
   - Click **Add**

   **Item 3: Desktop**
   - **Menu item name**: `Desktop`
   - **Link to**: Select **Collections** → **Desktop Humidors**
   - Click **Add**

   **Item 4: Travel**
   - **Menu item name**: `Travel`
   - **Link to**: Select **Collections** → **Travel Humidors**
   - Click **Add**

   **Item 5: Accessories**
   - **Menu item name**: `Accessories`
   - **Link to**: Select **Collections** → **Accessories**
   - Click **Add**

   **Item 6: About**
   - **Menu item name**: `About`
   - **Link to**: Select **Pages** → **About** (or create the About page first)
   - Click **Add**

3. Click **Save menu** when done

### 2.3 Assign Menu to Header

1. Still in **Navigation** settings
2. Look for **Header menu** or **Main navigation**
3. Select the **Main Menu** you just created
4. Click **Save**

### 2.4 Verify Menu

1. Go to your storefront (www.dunnluxuryselections.com)
2. Refresh the page
3. Check the header - the navigation buttons should now be clickable
4. Click each button to verify it goes to the right collection

---

## Step 3: Add Products to Collections

Now that collections exist, assign your products to them.

### 3.1 Bulk Assign Products

1. Go to **Products** → **Products** (all products)
2. For each product:
   - Click the product name
   - Scroll down to **Collections** section
   - Check the boxes for relevant collections
   - Click **Save**

### 3.2 Verify Products in Collections

1. Go to **Products** → **Collections**
2. Click on a collection (e.g., "Electronic Humidors")
3. Verify products are listed
4. Click **Save** if you made any changes

---

## Step 4: Verify Theme Sync

Make sure the updated theme is activated.

### 4.1 Check Active Theme

1. Go to **Sales channels** → **Online store** → **Themes**
2. Look for the theme labeled **Active** (should be green)
3. If not "shopify-liquid-theme", click **Customize** on that theme to activate it

### 4.2 Push Latest Code (if using Git)

If you're using GitHub sync:

```bash
cd C:\Users\ejerc\DLS-Belle1
git push origin shopify-liquid-theme
```

Then in Shopify:
1. **Themes** → Your active theme → **Edit code**
2. Look for Git indicator (should show latest commit)
3. If not synced, Shopify will prompt you to pull latest changes

---

## Step 5: Test the Homepage

Once collections and menu are set up:

1. Go to your storefront: **www.dunnluxuryselections.com**
2. You should see:
   - ✅ Hero banner (no errors)
   - ✅ Newsletter signup section
   - ✅ Header navigation links are clickable
   - ✅ Clicking a navigation button goes to that collection

3. If you see errors:
   - Hard refresh browser (Ctrl+Shift+R)
   - Clear browser cache
   - Try in incognito mode

---

## Troubleshooting

### "404 Not Found" on Navigation Links

**Problem**: Clicking header buttons still shows 404
**Solution**:
1. Verify the menu was saved
2. Check the menu assignment (Navigation settings → Header menu)
3. Refresh Shopify Admin and try again
4. Hard refresh your storefront browser

### Collections Don't Appear in Menu

**Problem**: When adding menu item, collections aren't showing
**Solution**:
1. Create collections first (Step 1)
2. Make sure collections have at least one product
3. Try browser refresh or clear cache
4. Collections need to be "Active" to show up

### Theme Still Shows Errors

**Problem**: Still seeing "section not found" errors
**Solution**:
1. Make sure latest code was pushed: `git push origin shopify-liquid-theme`
2. In Shopify Admin → Themes → **Edit code**
3. Refresh the browser
4. Check the sidebar - all sections should be there
5. Verify you're editing the **Active** theme (not a draft)

### Navigation Menu Items Appear but Wrong Order

**Problem**: Menu items not in the order you want
**Solution**:
1. In **Navigation** settings
2. Drag menu items to reorder them
3. Click **Save**

---

## Adding the Full Homepage Later

Once collections are set up, we can add back the full homepage sections:
- Featured products carousel
- Financing banner
- Customer testimonials
- Trust signals

Just edit `templates/index.liquid` and uncomment those sections. The site will be much more impressive once products are visible!

---

## Quick Checklist

- [ ] Created 5+ collections (Electronic, Cabinet, Desktop, Travel, Accessories)
- [ ] Added products to each collection (minimum 3 per collection)
- [ ] Created "Main Menu" in Navigation
- [ ] Added 6 menu items (Electronic, Cabinet, Desktop, Travel, Accessories, About)
- [ ] Assigned Main Menu to Header
- [ ] Verified navigation links are clickable
- [ ] Verified links go to correct collections
- [ ] Pushed latest code: `git push origin shopify-liquid-theme`
- [ ] Theme is marked as "Active" in Shopify Admin
- [ ] Homepage displays with no errors

---

## Next Steps After Setup

Once collections and navigation are configured:

1. **Email me** - I'll uncomment the full homepage sections
2. **Add featured products** - Pick which products should appear on homepage
3. **Configure financing** - Set which products show the financing widget
4. **Add testimonials** - Gather customer quotes and add them
5. **Test everything** - Run the full testing checklist

---

## Need Help?

If you get stuck on any step:
1. Check the **Troubleshooting** section above
2. Screenshot the error
3. Tell me which step you're on
4. I'll fix it right away

You've got this! 💪

---

**Estimated time**: 20-30 minutes  
**Difficulty**: Easy  
**Support**: Ask me anything - I'm here to help!

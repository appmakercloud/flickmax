# URL Integration Summary

## Header Updates

### Updated Links
1. **Help Link**: 
   - Changed from: `/help`
   - Changed to: `https://www.secureserver.net/help?plid=590175`

2. **Sign In / Create Account**:
   - Changed from: `/signup` and `/login`
   - Changed to: `https://sso.secureserver.net/?plid=590175&prog_id=590175&realm=idp&path=%2Fproducts&app=account`
   - Both "Create My Account" and "Sign In" buttons now use the same SSO URL

3. **Mobile Menu**:
   - Added "My Products" link: `https://www.secureserver.net/products?plid=590175`
   - Combined Sign In/Create Account button

## Footer Updates

### New Footer Structure
The footer has been completely redesigned with a modern layout including:

1. **Logo Section**:
   - Matching gradient logo from header
   - Company description
   - Trust indicators (Secure & Reliable, Global Infrastructure)

2. **Newsletter Signup**:
   - Email subscription form
   - Modern styling with gradient button

3. **Five Column Layout**:
   - Products
   - Support
   - Company
   - My Account
   - Legal

### Account Section URLs
- **My Products**: `https://www.secureserver.net/products?plid=590175`
- **Account Settings**: `https://account.secureserver.net/profile?plid=590175`
- **Create Account**: `https://sso.secureserver.net/?plid=590175&prog_id=590175&realm=idp&path=%2Fproducts&app=account`
- **Sign In**: `https://sso.secureserver.net/?plid=590175&prog_id=590175&realm=idp&path=%2Fproducts&app=account`

### Support Section
- **Help Center**: `https://www.secureserver.net/help?plid=590175`

### Additional Footer Features
1. **Contact Information**:
   - Phone: (480) 624-2500
   - Email: support@flickmax.com
   - 24/7 Global Support indicator

2. **Social Media Links**:
   - Facebook, Twitter, YouTube, Instagram

3. **Payment Methods**:
   - Visa, Mastercard, PayPal, Bitcoin

4. **Legal Notice**:
   - Copyright notice
   - GoDaddy reseller disclaimer
   - PLID: 590175 displayed

## Technical Implementation

### External Links
- All GoDaddy URLs open with proper parameters
- External links marked with `external: true` flag
- External links open in new tab with `target="_blank"` and `rel="noopener noreferrer"`

### Responsive Design
- Footer adapts to mobile with stacked columns
- Contact info and social links properly spaced
- Newsletter form responsive on mobile

### Visual Design
- Dark gradient background (gray-900 to black)
- Blue and cyan accent colors matching header
- Proper spacing and typography
- Hover effects on all links

## URL Parameters
All GoDaddy URLs include the required parameters:
- `plid=590175` - Partner/Reseller ID
- `prog_id=590175` - Program ID
- `realm=idp` - Identity Provider realm
- `path` - Return path after login
- `app` - Application identifier

These URLs ensure proper tracking and commission attribution for the reseller account.
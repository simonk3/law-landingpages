# Analytics Setup Guide - Lex Duo

## 🎯 **Recommended Analytics Stack**

### **1. Google Analytics 4 (GA4) - Essential** ✅
- **Cost**: Free
- **Purpose**: Traffic analysis, user behavior, conversions
- **Status**: Already configured via GTM

### **2. Hotjar - Highly Recommended** 🔥
- **Cost**: Free tier (2,000 pageviews/month)
- **Purpose**: Heatmaps, session recordings, user feedback
- **Status**: Ready to configure

### **3. Google Tag Manager (GTM) - Already Installed** ✅
- **Cost**: Free
- **Purpose**: Manage all analytics tools
- **Status**: Already configured

## 🚀 **Hotjar Setup Instructions**

### **Step 1: Create Hotjar Account**
1. Go to [hotjar.com](https://hotjar.com)
2. Sign up for free account
3. Create a new site: `www.lexduo.com.ua`
4. Copy your Hotjar Site ID (looks like: `1234567`)

### **Step 2: Configure Environment Variables**
Create a `.env` file in your project root:
```bash
# Analytics Configuration
PUBLIC_GTM_ID=GTM-WL4BWZLZ
PUBLIC_HOTJAR_ID=YOUR_HOTJAR_ID_HERE
```

### **Step 3: Deploy and Test**
1. Deploy your changes
2. Visit your website
3. Check browser console for "🔥 Hotjar loaded" message
4. Verify in Hotjar dashboard that data is flowing

## 📊 **What Hotjar Will Track**

### **Heatmaps**
- **Click Maps**: See where visitors click most
- **Move Maps**: Track mouse movements
- **Scroll Maps**: Understand how far users scroll

### **Session Recordings**
- Watch real user sessions
- Identify usability issues
- See how users interact with forms

### **Feedback Widget**
- Collect user feedback
- Gather testimonials
- Understand user needs

### **Conversion Funnels**
- Track contact form submissions
- Monitor phone number clicks
- Analyze service page visits

## 🎯 **Legal-Specific Tracking Events**

### **Contact Form Tracking**
```javascript
// Track when contact form is submitted
window.hj('event', 'contact_form_submitted');

// Track phone number clicks
window.hj('event', 'phone_clicked');

// Track service page visits
window.hj('event', 'service_page_visited', {
  service: 'criminal_law'
});
```

### **Privacy Considerations**
- ✅ Form inputs are masked by default
- ✅ Sensitive data is not recorded
- ✅ Compliant with GDPR requirements
- ✅ Users can opt out

## 📈 **Google Analytics 4 Setup**

### **Current Status**
- GTM is already configured
- GA4 should be connected via GTM

### **Recommended Events to Track**
1. **Contact Form Submissions**
2. **Phone Number Clicks**
3. **Service Page Views**
4. **Blog Post Reads**
5. **File Downloads** (if any)

### **Conversion Goals**
- Contact form submissions
- Phone calls
- Email inquiries
- Service page visits

## 🔧 **Advanced Analytics Features**

### **Custom Dimensions**
Track important legal-specific data:
- Practice area (criminal, civil, military law)
- User location (Kyiv, Ukraine, etc.)
- Traffic source (organic, paid, social)

### **Enhanced Ecommerce** (if applicable)
- Track consultation bookings
- Monitor service inquiries
- Analyze client acquisition costs

## 📊 **Reporting Dashboard**

### **Key Metrics to Monitor**
1. **Traffic Sources**
   - Organic search
   - Direct traffic
   - Referral traffic
   - Social media

2. **User Behavior**
   - Page views per session
   - Average session duration
   - Bounce rate
   - Exit pages

3. **Conversions**
   - Contact form submissions
   - Phone number clicks
   - Service page visits

4. **Content Performance**
   - Most popular blog posts
   - Service page engagement
   - Contact page conversion rate

## 🚀 **Implementation Timeline**

### **Week 1: Basic Setup**
- [ ] Set up Hotjar account
- [ ] Configure environment variables
- [ ] Deploy and test tracking
- [ ] Verify data collection

### **Week 2: Advanced Configuration**
- [ ] Set up custom events
- [ ] Configure conversion goals
- [ ] Create custom reports
- [ ] Set up alerts

### **Week 3: Optimization**
- [ ] Analyze initial data
- [ ] Identify improvement opportunities
- [ ] A/B test changes
- [ ] Optimize conversion funnels

## 💡 **Pro Tips for Law Firms**

### **1. Focus on Conversion Tracking**
- Track every contact form submission
- Monitor phone number clicks
- Analyze consultation requests

### **2. Understand User Journey**
- See how visitors find your services
- Identify drop-off points
- Optimize for better conversions

### **3. Content Performance**
- Track which blog posts drive traffic
- Monitor service page engagement
- Optimize content based on data

### **4. Client Privacy**
- Ensure GDPR compliance
- Mask sensitive form fields
- Respect user privacy preferences

## 🔍 **Monitoring & Maintenance**

### **Daily Checks**
- Verify tracking is working
- Check for any errors
- Monitor real-time data

### **Weekly Reviews**
- Analyze conversion rates
- Review user feedback
- Check traffic trends

### **Monthly Reports**
- Comprehensive performance review
- Identify improvement opportunities
- Plan optimization strategies

## 📞 **Support & Troubleshooting**

### **Common Issues**
1. **Tracking not working**: Check environment variables
2. **No data in Hotjar**: Verify site ID is correct
3. **Privacy concerns**: Review masking settings

### **Getting Help**
- Hotjar support: [support.hotjar.com](https://support.hotjar.com)
- Google Analytics: [support.google.com/analytics](https://support.google.com/analytics)
- GTM support: [support.google.com/tagmanager](https://support.google.com/tagmanager)

---

**Next Steps**: Set up your Hotjar account and add the Site ID to your environment variables!

// ============================================
// EXTRACT GOOGLE BUSINESS PROFILE DATA
// ============================================
// Run this script in the browser console on the Google Business Profile page
// This extracts business information, reviews, and other details

(function() {
  console.log('🔍 Extracting Google Business Profile data...\n');

  const businessData = {
    name: null,
    rating: null,
    reviewCount: null,
    phone: null,
    address: null,
    hours: null,
    website: null,
    category: null,
    reviews: [],
    photos: []
  };

  // Extract business name
  const nameElement = document.querySelector('h1') || document.querySelector('[data-attrid="title"]');
  if (nameElement) {
    businessData.name = nameElement.textContent.trim();
    console.log(`✓ Business Name: ${businessData.name}`);
  }

  // Extract rating
  const ratingElement = document.querySelector('[aria-label*="Rated"]') || 
                       document.querySelector('[aria-label*="out of 5"]');
  if (ratingElement) {
    const ratingText = ratingElement.getAttribute('aria-label') || ratingElement.textContent;
    const ratingMatch = ratingText.match(/(\d+\.?\d*)\s*out of 5/);
    if (ratingMatch) {
      businessData.rating = parseFloat(ratingMatch[1]);
      console.log(`✓ Rating: ${businessData.rating}`);
    }
  }

  // Extract review count
  const reviewElement = document.querySelector('[aria-label*="review"]') ||
                       document.querySelector('a[href*="reviews"]');
  if (reviewElement) {
    const reviewText = reviewElement.textContent || reviewElement.getAttribute('aria-label');
    const reviewMatch = reviewText.match(/(\d+)\s*(Google\s*)?review/);
    if (reviewMatch) {
      businessData.reviewCount = parseInt(reviewMatch[1]);
      console.log(`✓ Review Count: ${businessData.reviewCount}`);
    }
  }

  // Extract phone number
  const phoneLinks = Array.from(document.querySelectorAll('a[href^="tel:"]'));
  if (phoneLinks.length > 0) {
    const phoneText = phoneLinks[0].textContent.trim();
    businessData.phone = phoneText;
    console.log(`✓ Phone: ${businessData.phone}`);
  }

  // Extract address
  const addressElement = document.querySelector('[data-value="Address"]') ||
                        document.querySelector('span[data-value*="Address"]') ||
                        document.querySelector('a[href*="maps"]');
  if (addressElement) {
    businessData.address = addressElement.textContent.trim();
    console.log(`✓ Address: ${businessData.address}`);
  }

  // Extract hours
  const hoursButton = document.querySelector('button[aria-label*="hours"]') ||
                     document.querySelector('button[aria-label*="Hours"]');
  if (hoursButton) {
    businessData.hours = hoursButton.getAttribute('aria-label') || hoursButton.textContent;
    console.log(`✓ Hours: ${businessData.hours}`);
  }

  // Extract website
  const websiteLink = document.querySelector('a[href*="website"]') ||
                     document.querySelector('a[data-value="Website"]');
  if (websiteLink) {
    businessData.website = websiteLink.href;
    console.log(`✓ Website: ${businessData.website}`);
  }

  // Extract category
  const categoryElement = document.querySelector('[data-attrid="kc:/location/location:category"]') ||
                         document.querySelector('span[data-value*="category"]');
  if (categoryElement) {
    businessData.category = categoryElement.textContent.trim();
    console.log(`✓ Category: ${businessData.category}`);
  }

  // Extract reviews
  const reviewElements = document.querySelectorAll('[data-review-id]') ||
                        document.querySelectorAll('[jsname="fk8dgd"]');
  reviewElements.forEach((review, index) => {
    try {
      const reviewData = {
        author: null,
        rating: null,
        text: null,
        date: null
      };

      // Extract author name
      const authorElement = review.querySelector('span[aria-label*="review"]') ||
                           review.querySelector('.fontBodyMedium');
      if (authorElement) {
        reviewData.author = authorElement.textContent.trim();
      }

      // Extract rating
      const ratingImg = review.querySelector('img[alt*="star"]');
      if (ratingImg) {
        const altText = ratingImg.getAttribute('alt');
        const ratingMatch = altText.match(/(\d+)/);
        if (ratingMatch) {
          reviewData.rating = parseInt(ratingMatch[1]);
        }
      }

      // Extract review text
      const textElement = review.querySelector('[data-review-text]') ||
                         review.querySelector('.review-full-text');
      if (textElement) {
        reviewData.text = textElement.textContent.trim();
      }

      // Extract date
      const dateElement = review.querySelector('span[aria-label*="ago"]') ||
                         review.querySelector('.review-date');
      if (dateElement) {
        reviewData.date = dateElement.textContent.trim();
      }

      if (reviewData.author || reviewData.text) {
        businessData.reviews.push(reviewData);
        console.log(`✓ Review ${index + 1}: ${reviewData.author} - ${reviewData.rating} stars`);
      }
    } catch (e) {
      console.error(`Error extracting review ${index + 1}:`, e);
    }
  });

  // Extract photos
  const photoLinks = Array.from(document.querySelectorAll('img[src*="googleusercontent"]'));
  photoLinks.forEach((img, index) => {
    const src = img.getAttribute('src');
    if (src && src.includes('googleusercontent')) {
      businessData.photos.push({
        url: src,
        alt: img.getAttribute('alt') || `Photo ${index + 1}`
      });
    }
  });

  console.log(`\n✅ Extracted ${businessData.reviews.length} reviews`);
  console.log(`✅ Extracted ${businessData.photos.length} photos\n`);

  // Create JSON output
  const jsonOutput = JSON.stringify(businessData, null, 2);

  console.log('📋 JSON Output:\n');
  console.log(jsonOutput);

  // Copy to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      console.log('\n✅ ✅ ✅ COPIED TO CLIPBOARD! ✅ ✅ ✅\n');
      console.log('💾 Save this to: scraping/data/google-share/business-data.json');
    }).catch(() => {
      console.log('\n⚠️  Could not copy automatically. Please copy the JSON above manually.');
    });
  } else {
    console.log('\n⚠️  Clipboard not available. Please copy the JSON above manually.');
  }

  // Make available globally
  window.extractedBusinessData = businessData;
  window.extractedBusinessDataJSON = jsonOutput;

  return businessData;
})();


const opencage = require('opencage-api-client');

class RateLimitedGeocoder {
  constructor(requestsPerSecond = 1) {
    this.queue = [];
    this.processing = false;
    this.interval = 1000 / requestsPerSecond; // milliseconds between requests
  }

  async geocode(query) {
    return new Promise((resolve, reject) => {
      this.queue.push({ query, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const { query, resolve, reject } = this.queue.shift();

      try {
        const data = await opencage.geocode(query);
        resolve(data);
      } catch (error) {
        reject(error);
      }

      // Wait before processing next request
      if (this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.interval));
      }
    }

    this.processing = false;
  }
}

// Usage example
const geocoder = new RateLimitedGeocoder(1); // 1 request per second

// Make multiple requests - they'll be automatically rate limited
geocoder
  .geocode({
    q: '37.4396, -122.1864',
    language: 'fr',
    key: '6d0e711d72d74daeb2b0bfd2a5cdfdba',
  })
  .then((data) => {
    if (data.status.code === 200 && data.results.length > 0) {
      const place = data.results[0];
      console.log(place.formatted);
      console.log(place.components.road);
      console.log(place.annotations.timezone.name);
    } else {
      console.log('status', data.status.message);
      console.log('total_results', data.total_results);
    }
  })
  .catch((error) => {
    console.log('error', error.message);
    if (error.status.code === 402) {
      console.log('hit free trial daily limit');
      console.log('become a customer: https://opencagedata.com/pricing');
    }
  });

// Add more requests - they'll queue up automatically
geocoder
  .geocode({
    q: 'Theresienhöhe 11, München',
    key: '6d0e711d72d74daeb2b0bfd2a5cdfdba',
  })
  .then((data) => {
    if (data.status.code === 200 && data.results.length > 0) {
      const place = data.results[0];
      console.log(place.formatted);
      console.log(place.geometry);
    }
  })
  .catch((error) => {
    console.log('error', error.message);
  });

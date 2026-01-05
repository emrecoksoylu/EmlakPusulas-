
import puppeteer from 'puppeteer';

export interface House {
  id: string;
  title: string;
  price: string;
  location: string;
  imageUrl: string;
  features: string[];
  source: string;
  url: string;
}

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
];

export async function scrapeHouses(): Promise<House[]> {
  console.log('Starting scrape for Hepsiemlak...');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1366, height: 768 });

    // Target: Hepsiemlak Istanbul Satılık
    const url = 'https://www.hepsiemlak.com/istanbul-satilik';
    console.log(`Navigating to ${url}`);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const title = await page.title();
    console.log(`Page title: ${title}`);

    if (title.includes('Just a moment') || title.includes('Challenge') || title.includes('Access denied')) {
      throw new Error('Blocked by Cloudflare/Anti-bot protection');
    }

    // Attempt to wait for listing items
    // Hepsiemlak uses different class names. 
    // Based on common knowledge/inspection: .listing-item, .list-view-content, etc.
    // Note: This is a best-effort guess without live inspection capability.
    try {
      await page.waitForSelector('.list-view-content', { timeout: 10000 });
    } catch (e) {
      console.log('Could not find .list-view-content. Might be blocked.');
    }

    const houses = await page.evaluate(() => {
      const items = document.querySelectorAll('.list-item'); // Main container often has this class or similar
      const results: any[] = [];

      items.forEach((item) => {
        try {
          const id = item.getAttribute('data-id') || Math.random().toString(36).substr(2, 9);

          // Heuristic selectors based on typical structure
          const titleEl = item.querySelector('.list-view-header') || item.querySelector('h1') || item.querySelector('h2') || item.querySelector('div[title]');
          const title = titleEl?.textContent?.trim() || 'No Title';

          const priceEl = item.querySelector('.list-view-price') || item.querySelector('.price');
          const price = priceEl?.textContent?.trim() || 'No Price';

          const locEl = item.querySelector('.list-view-location') || item.querySelector('.location');
          const location = locEl?.textContent?.trim().replace(/\s+/g, ' ') || 'No Location';

          const imgEl = item.querySelector('img.list-view-image') as HTMLImageElement || item.querySelector('img');
          const imageUrl = imgEl?.src || imgEl?.getAttribute('data-src') || '';

          const linkEl = item.querySelector('a');
          const relativeLink = linkEl?.getAttribute('href') || '#';
          const url = relativeLink.startsWith('http') ? relativeLink : `https://www.hepsiemlak.com${relativeLink}`;

          const features: string[] = [];
          const feats = item.querySelectorAll('.list-view-features span, .features span');
          feats.forEach(f => { if (f.textContent) features.push(f.textContent.trim()) });

          if (title !== 'No Title') {
            results.push({
              id,
              title,
              price,
              location,
              imageUrl,
              features,
              source: 'hepsiemlak.com',
              url
            });
          }
        } catch (err) {
          console.error('Error parsing item', err);
        }
      });
      return results;
    });

    if (houses.length === 0) {
      console.log('No houses found. Likely blocked or selector mismatch.');
      throw new Error('No items found - falling back to mock');
    }

    console.log(`Found ${houses.length} houses.`);
    return houses;

  } catch (error) {
    console.error('Scraping failed:', error);
    console.log('Falling back to mock data...');
    return [
      {
        id: '1',
        title: 'Modern Daire (Hepsiemlak Mock)',
        price: '6,250,000 ₺',
        location: 'Istanbul, Kadikoy',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        features: ['3+1', '145 m2', '2. Kat'],
        source: 'Hepsiemlak (Mock)',
        url: '#'
      },
      {
        id: '2',
        title: 'Lüks Villa (Hepsiemlak Mock)',
        price: '35,000,000 ₺',
        location: 'Istanbul, Sariyer',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        features: ['5+2', '450 m2', 'Havuzlu'],
        source: 'Hepsiemlak (Mock)',
        url: '#'
      },
      {
        id: '3',
        title: 'Merkezi Stüdyo (Hepsiemlak Mock)',
        price: '4,100,000 ₺',
        location: 'Istanbul, Besiktas',
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        features: ['1+0', '60 m2'],
        source: 'Hepsiemlak (Mock)',
        url: '#'
      }
    ];
  } finally {
    if (browser) await browser.close();
  }
}

import { ApifyClient } from "apify-client";

const apifyClient = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

export interface ScrapeResult {
  url: string;
  title?: string;
  description?: string;
  text?: string;
  html?: string;
  metadata?: Record<string, string>;
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

  const attempt = async (): Promise<ScrapeResult> => {
    const run = await apifyClient.actor("apify/web-scraper").call({
      startUrls: [{ url: normalizedUrl }],
      maxCrawlingDepth: 0,
      maxPagesPerCrawl: 1,
      pageFunction: `
        async function pageFunction(context) {
          const { page, request } = context;
          const title = await page.title();
          const description = await page.$eval(
            'meta[name="description"]',
            el => el.getAttribute('content')
          ).catch(() => '');

          const headings = await page.$$eval('h1, h2, h3', els =>
            els.slice(0, 10).map(el => el.innerText.trim())
          );

          const paragraphs = await page.$$eval('p', els =>
            els.slice(0, 20).map(el => el.innerText.trim()).filter(t => t.length > 20)
          );

          const links = await page.$$eval('a', els =>
            els.slice(0, 30).map(el => ({ href: el.href, text: el.innerText.trim() }))
          );

          const buttons = await page.$$eval('button, [class*="btn"], [class*="cta"]', els =>
            els.slice(0, 10).map(el => el.innerText.trim())
          );

          return {
            url: request.url,
            title,
            description,
            headings,
            paragraphs,
            links,
            buttons,
          };
        }
      `,
    });

    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
    const item = items[0] as Record<string, unknown>;

    if (!item) {
      return { url: normalizedUrl, title: "", text: "" };
    }

    const headings = Array.isArray(item.headings)
      ? (item.headings as string[]).join("\n")
      : "";
    const paragraphs = Array.isArray(item.paragraphs)
      ? (item.paragraphs as string[]).join("\n")
      : "";
    const buttons = Array.isArray(item.buttons)
      ? (item.buttons as string[]).join(", ")
      : "";

    return {
      url: normalizedUrl,
      title: typeof item.title === "string" ? item.title : "",
      description:
        typeof item.description === "string" ? item.description : "",
      text: `HEADINGS:\n${headings}\n\nPARAGRAPHS:\n${paragraphs}\n\nBUTTONS/CTAs:\n${buttons}`,
    };
  };

  try {
    return await attempt();
  } catch {
    try {
      await new Promise((r) => setTimeout(r, 2000));
      return await attempt();
    } catch {
      return {
        url: normalizedUrl,
        title: "Unknown",
        text: "Unable to scrape website",
      };
    }
  }
}

export async function searchMetaAds(
  brandName: string
): Promise<Record<string, unknown>[]> {
  try {
    const run = await apifyClient.actor("apify/facebook-ads-scraper").call({
      searchQuery: brandName,
      maxItems: 20,
    });

    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();
    return items as Record<string, unknown>[];
  } catch {
    return [];
  }
}

export default apifyClient;

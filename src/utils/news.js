function stripHtml(html) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function parseXML(xmlString) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "text/xml");
  const items = xml.querySelectorAll("item");
  return Array.from(items).map(item => ({
    title: item.querySelector("title")?.textContent || "",
    link: item.querySelector("link")?.textContent || "",
    pubDate: item.querySelector("pubDate")?.textContent || "",
    description: item.querySelector("description")?.textContent || "",
    source: item.querySelector("source")?.textContent || ""
  }));
}

async function fetchWithTimeout(url, timeout = 8000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]);
}

async function fetchFeed(query) {
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
  try {
    const res = await fetchWithTimeout(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
    if (!res.ok) throw new Error('rss2json failed');
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('rss2json status not ok');
    return (data.items || []).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      summary: stripHtml(item.description || ""),
      source: item.source || (item.author ? item.author : 'Google News')
    }));
  } catch (err) {
    console.warn('Fallback to allorigins for', query);
    try {
      const res = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`);
      if (!res.ok) throw new Error('allorigins failed');
      const text = await res.text();
      return parseXML(text).map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        summary: stripHtml(item.description || ""),
        source: item.source || 'Google News'
      }));
    } catch (e) {
      console.error('All feeds failed for', query);
      return [];
    }
  }
}

export async function fetchCityNews(city, force = false) {
  if (!city || !city.name) return [];
  const cacheKey = `homestreet_news_${city.id}`;
  
  if (!force) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 20 * 60 * 1000) {
          return parsed.articles;
        }
      } catch (e) { /* ignore */ }
    }
  }

  const queries = [
    `${city.name} traffic`,
    `${city.name} road`,
    `${city.name} waterlogging OR flooding`,
    `${city.name} accident OR road closure`
  ];

  const results = await Promise.all(queries.map(q => fetchFeed(q)));
  let articles = results.flat();

  if (articles.length === 0 && city.news) {
    return city.news.map(n => ({
      ...n,
      isSample: true
    }));
  }

  // Deduplicate
  const seen = new Set();
  articles = articles.filter(a => {
    const key = a.title.toLowerCase().substring(0, 30);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort newest first
  articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Filter last 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  articles = articles.filter(a => new Date(a.pubDate).getTime() >= sevenDaysAgo);

  // Keep latest 10
  articles = articles.slice(0, 10);

  // Shorten summaries to 2 lines approx (we'll do CSS line-clamp, but trim text here too)
  articles = articles.map(a => ({
    ...a,
    summary: a.summary.substring(0, 200) + (a.summary.length > 200 ? '...' : '')
  }));

  localStorage.setItem(cacheKey, JSON.stringify({
    timestamp: Date.now(),
    articles
  }));

  return articles;
}

export function detectWarning(article, city) {
  if (!article || !city) return null;
  const text = (article.title + " " + article.summary).toLowerCase();

  // 1. Find Areas / Corridors
  const foundAreas = new Set();
  
  if (city.corridors) {
    city.corridors.forEach(c => {
      if (text.includes(c.name.toLowerCase())) foundAreas.add(c.name);
      if (c.aliases) {
        c.aliases.forEach(a => {
          if (text.includes(a.toLowerCase())) foundAreas.add(c.name); // Add primary name
        });
      }
    });
  }
  
  if (city.areas) {
    city.areas.forEach(a => {
      if (text.includes(a.name.toLowerCase())) foundAreas.add(a.name);
    });
  }

  // 2. Find Issue
  const issueKeywords = [
    { name: "Heavy traffic", kw: ["heavy traffic", "traffic jam", "congestion"], severity: "medium" },
    { name: "Accident", kw: ["accident", "collision", "crash"], severity: "high" },
    { name: "Waterlogging", kw: ["waterlogging", "flooding", "heavy rain"], severity: "high" },
    { name: "Road closure or diversion", kw: ["road closed", "closure", "diversion", "barricade", "metro work", "digging"], severity: "high" },
    { name: "Damaged road", kw: ["pothole", "road damage"], severity: "medium" },
    { name: "Event or protest disruption", kw: ["protest", "rally", "procession", "vip movement"], severity: "low" },
    { name: "Hazard", kw: ["power cut", "fire", "landslide"], severity: "low" }
  ];

  let detectedIssue = null;
  for (const issue of issueKeywords) {
    if (issue.kw.some(kw => text.includes(kw))) {
      detectedIssue = issue;
      break;
    }
  }

  if (!detectedIssue) return null;

  const areas = Array.from(foundAreas);
  
  return {
    areas: areas.length > 0 ? areas : [],
    issue: detectedIssue.name,
    severity: detectedIssue.severity
  };
}

export function getRelativeTime(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const diffInSeconds = Math.floor((new Date() - date) / 1000);
  
  if (diffInSeconds < 3600) {
    const m = Math.floor(diffInSeconds / 60);
    return `${m}m ago`;
  } else if (diffInSeconds < 86400) {
    const h = Math.floor(diffInSeconds / 3600);
    return `${h}h ago`;
  } else {
    const d = Math.floor(diffInSeconds / 86400);
    return `${d}d ago`;
  }
}

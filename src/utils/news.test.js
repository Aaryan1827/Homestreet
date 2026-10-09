import { detectWarning } from './news';
import { describe, test, expect } from 'vitest';

describe('detectWarning', () => {
  const city = {
    name: 'TestCity',
    corridors: [
      { name: 'Alpha Road', aliases: ['alpha', 'a-road'] },
      { name: 'Beta Highway', aliases: ['beta bypass'] }
    ],
    areas: [
      { name: 'Gamma Sector' }
    ]
  };

  test('detects area and issue with high severity', () => {
    const article = {
      title: 'Major accident on Alpha Road today',
      summary: 'A collision between two trucks blocked the road.'
    };
    const res = detectWarning(article, city);
    expect(res).not.toBeNull();
    expect(res.areas).toContain('Alpha Road');
    expect(res.issue).toBe('Accident');
    expect(res.severity).toBe('high');
  });

  test('detects alias and medium severity', () => {
    const article = {
      title: 'Heavy traffic near a-road',
      summary: 'Expect congestion.'
    };
    const res = detectWarning(article, city);
    expect(res.areas).toContain('Alpha Road');
    expect(res.issue).toBe('Heavy traffic');
    expect(res.severity).toBe('medium');
  });

  test('no match returns null', () => {
    const article = {
      title: 'Mayor inaugurates new park in Gamma Sector',
      summary: 'A beautiful day.'
    };
    const res = detectWarning(article, city);
    expect(res).toBeNull();
  });

  test('city with no corridors still matches issue', () => {
    const stubCity = { name: 'Stub' };
    const article = { title: 'Flooding in the city', summary: 'waterlogging everywhere' };
    const res = detectWarning(article, stubCity);
    expect(res).not.toBeNull();
    expect(res.areas).toEqual([]);
    expect(res.issue).toBe('Waterlogging');
    expect(res.severity).toBe('high');
  });
});

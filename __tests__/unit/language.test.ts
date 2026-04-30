import { getTranslation } from '@/lib/language';

describe('Language Utilities', () => {
  it('getTranslation("en", "welcome") returns English text', () => {
    expect(getTranslation('en', 'welcome')).toBe('Welcome');
  });

  it('getTranslation("hi", "welcome") returns Hindi text', () => {
    expect(getTranslation('hi', 'welcome')).toBe('स्वागत है');
  });

  it('getTranslation("en", "unknown_key") returns key itself (fallback)', () => {
    expect(getTranslation('en', 'unknown_key')).toBe('unknown_key');
  });
});

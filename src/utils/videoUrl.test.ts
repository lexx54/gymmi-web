import { describe, expect, it } from 'vitest';
import { MAX_EXERCISE_VIDEO_URL, toSafeVideoUrl } from './videoUrl';

describe('toSafeVideoUrl', () => {
  it('accepts and trims http(s) links', () => {
    expect(toSafeVideoUrl('  https://www.youtube.com/watch?v=abc ')).toBe(
      'https://www.youtube.com/watch?v=abc',
    );
    expect(toSafeVideoUrl('http://youtu.be/abc')).toBe('http://youtu.be/abc');
  });

  it.each([
    null,
    undefined,
    '',
    '   ',
    'javascript:alert(1)',
    'data:text/html,hi',
    'ftp://example.com/a.mp4',
    'youtube.com/watch?v=abc',
    'https://localhost/video',
    `https://example.com/${'a'.repeat(MAX_EXERCISE_VIDEO_URL)}`,
  ])('rejects %s', (value) => {
    expect(toSafeVideoUrl(value)).toBeNull();
  });
});

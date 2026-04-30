import '@testing-library/jest-dom';

// Mocks for Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: () => null,
      replace: () => null,
      back: () => null,
      forward: () => null,
      refresh: () => null,
      pathname: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

import { render, screen, fireEvent, act } from '@testing-library/react';
import ChecklistPage from '@/app/checklist/page';

// Mock Firebase
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, cb) => {
    cb(null); // Guest user
    return () => {};
  }),
  getAuth: jest.fn(),
}));
jest.mock('@/lib/firebase', () => ({
  auth: {},
  getUserProgress: jest.fn(),
  updateChecklistItem: jest.fn(),
}));

// Mock Language Context
jest.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({ t: (en: string) => en, isHindi: false }),
}));

describe('Checklist Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Checklist renders 8 items', async () => {
    render(<ChecklistPage />);
    expect(await screen.findByText('Check voter registration status')).toBeInTheDocument();
    expect(screen.getByText('Understand what NOTA means')).toBeInTheDocument();
  });

  it('Clicking checkbox marks item complete', async () => {
    render(<ChecklistPage />);
    const firstItem = await screen.findByText('Check voter registration status');
    act(() => {
      fireEvent.click(firstItem);
    });
    
    // Check for the checkmark character
    const checkmarks = await screen.findAllByText('✓');
    expect(checkmarks.length).toBe(1);
  });

  it('Progress counter updates: "1/8"', async () => {
    render(<ChecklistPage />);
    const firstItem = await screen.findByText('Check voter registration status');
    act(() => {
      fireEvent.click(firstItem);
    });
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('/8')).toBeInTheDocument();
  });

  it('Progress bar width updates', async () => {
    render(<ChecklistPage />);
    const firstItem = await screen.findByText('Check voter registration status');
    act(() => {
      fireEvent.click(firstItem);
    });
    
    // 1 / 8 is 13%
    expect(screen.getByText('13% complete')).toBeInTheDocument();
  });
});

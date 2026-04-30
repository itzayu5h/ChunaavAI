import { render, screen, fireEvent } from '@testing-library/react';
import QuizPage from '@/app/quiz/page';

// Mock Firebase
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(() => () => {}),
  getAuth: jest.fn(),
}));
jest.mock('@/lib/firebase', () => ({
  auth: {},
  saveQuizScore: jest.fn(),
}));

describe('Quiz Component', () => {
  it('Quiz renders topic selection buttons', () => {
    render(<QuizPage />);
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('EVM & VVPAT')).toBeInTheDocument();
  });

  it('Clicking "Voter Registration" selects it', () => {
    render(<QuizPage />);
    fireEvent.click(screen.getByText('Voter Registration'));
    expect(screen.getByText('Voter Registration')).toHaveClass('bg-indigo-50');
  });

  it('"Start Quiz" button is disabled until topic selected', () => {
    render(<QuizPage />);
    expect(screen.getByRole('button', { name: /Start Challenge/i })).toBeDisabled();
    
    fireEvent.click(screen.getByText('Voter Registration'));
    expect(screen.getByRole('button', { name: /Start Challenge/i })).not.toBeDisabled();
  });

  it('Difficulty buttons render correctly', () => {
    render(<QuizPage />);
    expect(screen.getByText('basic')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
    expect(screen.getByText('advanced')).toBeInTheDocument();
  });

  it('runs full quiz flow', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          data: [{ question: 'Test Q?', options: ['A', 'B'], correctIndex: 0, points: 10, explanation: 'Test explanation' }]
        })
      })
    ) as jest.Mock;

    render(<QuizPage />);
    
    // Select topic and start
    fireEvent.click(screen.getByText('Voter Registration'));
    fireEvent.click(screen.getByRole('button', { name: /Start Challenge/i }));

    // Wait for the quiz question to render
    await screen.findByText('Test Q?');

    // Select the correct answer 'A'
    fireEvent.click(screen.getByText('A'));
    
    // Verify explanation appears
    expect(screen.getByText('Test explanation')).toBeInTheDocument();

    // Click next / finish
    fireEvent.click(screen.getByText(/Finish/i));

    // Verify finished screen
    await screen.findByText('Challenge Complete!');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});

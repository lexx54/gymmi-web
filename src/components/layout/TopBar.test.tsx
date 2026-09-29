import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TopBar } from './TopBar';
import * as i18nModule from '../../i18n';

vi.mock('../../i18n', () => ({
  setAppLanguage: vi.fn(),
  default: {},
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
    t: (key: string) => key,
  }),
}));

describe('TopBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a text title when title prop is provided as a string', () => {
    render(<TopBar title="Settings & Profile" />);
    expect(screen.getByRole('heading', { name: 'Settings & Profile' })).toBeInTheDocument();
  });

  it('renders a custom React node title when title prop is a node', () => {
    render(<TopBar title={<div data-testid="custom-title">Custom Title</div>} />);
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
  });

  it('renders cleanly without a title heading when title prop is omitted', () => {
    render(<TopBar />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders action elements when actions prop is passed', () => {
    render(
      <TopBar
        title="Workouts"
        actions={<button type="button">Create Routine</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Create Routine' })).toBeInTheDocument();
  });

  it('displays the language toggle pill with EN and ES buttons', () => {
    render(<TopBar title="Dashboard" />);
    const enBtn = screen.getByTestId('lang-btn-en');
    const esBtn = screen.getByTestId('lang-btn-es');

    expect(enBtn).toBeInTheDocument();
    expect(esBtn).toBeInTheDocument();
    expect(enBtn).toHaveAttribute('aria-pressed', 'true');
    expect(esBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('invokes setAppLanguage when clicking on an alternate language button', () => {
    render(<TopBar title="Dashboard" />);
    const esBtn = screen.getByTestId('lang-btn-es');

    fireEvent.click(esBtn);
    expect(i18nModule.setAppLanguage).toHaveBeenCalledWith('es');
  });

  it('does not re-invoke setAppLanguage if clicking the already active language', () => {
    render(<TopBar title="Dashboard" />);
    const enBtn = screen.getByTestId('lang-btn-en');

    fireEvent.click(enBtn);
    expect(i18nModule.setAppLanguage).not.toHaveBeenCalled();
  });
});

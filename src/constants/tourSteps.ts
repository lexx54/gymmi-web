export type TourPlacement = 'right' | 'bottom' | 'top' | 'left' | 'center';

export interface TourStep {
  id: string;
  targetSelector: string;
  fallbackSelector?: string;
  titleKey: string;
  descriptionKey: string;
  placement?: TourPlacement;
}

export const CLIENT_TOUR_STEPS: TourStep[] = [
  {
    id: 'client-workouts',
    targetSelector: '[data-tour="nav-workouts"]',
    fallbackSelector: '[data-tour="active-workout"]',
    titleKey: 'tour.client.workouts.title',
    descriptionKey: 'tour.client.workouts.description',
    placement: 'right',
  },
  {
    id: 'client-exercises',
    targetSelector: '[data-tour="nav-exercises"]',
    titleKey: 'tour.client.exercises.title',
    descriptionKey: 'tour.client.exercises.description',
    placement: 'right',
  },
  {
    id: 'client-community',
    targetSelector: '[data-tour="nav-trainers"]',
    titleKey: 'tour.client.community.title',
    descriptionKey: 'tour.client.community.description',
    placement: 'right',
  },
  {
    id: 'client-analytics',
    targetSelector: '[data-tour="nav-analytics"]',
    fallbackSelector: '[data-tour="weekly-progress"]',
    titleKey: 'tour.client.analytics.title',
    descriptionKey: 'tour.client.analytics.description',
    placement: 'right',
  },
];

export const TRAINER_TOUR_STEPS: TourStep[] = [
  {
    id: 'trainer-clients',
    targetSelector: '[data-tour="nav-clients"]',
    titleKey: 'tour.trainer.clients.title',
    descriptionKey: 'tour.trainer.clients.description',
    placement: 'right',
  },
  {
    id: 'trainer-workouts',
    targetSelector: '[data-tour="nav-workouts"]',
    titleKey: 'tour.trainer.workouts.title',
    descriptionKey: 'tour.trainer.workouts.description',
    placement: 'right',
  },
  {
    id: 'trainer-exercises',
    targetSelector: '[data-tour="nav-exercises"]',
    titleKey: 'tour.trainer.exercises.title',
    descriptionKey: 'tour.trainer.exercises.description',
    placement: 'right',
  },
  {
    id: 'trainer-classifications',
    targetSelector: '[data-tour="nav-classifications"]',
    titleKey: 'tour.trainer.classifications.title',
    descriptionKey: 'tour.trainer.classifications.description',
    placement: 'right',
  },
];

export const GYM_TOUR_STEPS: TourStep[] = [
  {
    id: 'gym-dashboard',
    targetSelector: '[data-tour="gym-banner"]',
    fallbackSelector: '[data-tour="nav-dashboard"]',
    titleKey: 'tour.gym.dashboard.title',
    descriptionKey: 'tour.gym.dashboard.description',
    placement: 'bottom',
  },
  {
    id: 'gym-members',
    targetSelector: '[data-tour="nav-members"]',
    titleKey: 'tour.gym.members.title',
    descriptionKey: 'tour.gym.members.description',
    placement: 'right',
  },
  {
    id: 'gym-coaches',
    targetSelector: '[data-tour="nav-coaches"]',
    titleKey: 'tour.gym.coaches.title',
    descriptionKey: 'tour.gym.coaches.description',
    placement: 'right',
  },
  {
    id: 'gym-catalog',
    targetSelector: '[data-tour="nav-catalog"]',
    titleKey: 'tour.gym.catalog.title',
    descriptionKey: 'tour.gym.catalog.description',
    placement: 'right',
  },
  {
    id: 'gym-articles',
    targetSelector: '[data-tour="nav-articles"]',
    titleKey: 'tour.gym.articles.title',
    descriptionKey: 'tour.gym.articles.description',
    placement: 'right',
  },
];

export const ADMIN_TOUR_STEPS: TourStep[] = [
  {
    id: 'admin-dashboard',
    targetSelector: '[data-tour="nav-dashboard"]',
    titleKey: 'tour.admin.dashboard.title',
    descriptionKey: 'tour.admin.dashboard.description',
    placement: 'right',
  },
  {
    id: 'admin-permissions',
    targetSelector: '[data-tour="nav-permissions"]',
    titleKey: 'tour.admin.permissions.title',
    descriptionKey: 'tour.admin.permissions.description',
    placement: 'right',
  },
  {
    id: 'admin-users',
    targetSelector: '[data-tour="nav-users"]',
    titleKey: 'tour.admin.users.title',
    descriptionKey: 'tour.admin.users.description',
    placement: 'right',
  },
  {
    id: 'admin-payments',
    targetSelector: '[data-tour="nav-payments"]',
    titleKey: 'tour.admin.payments.title',
    descriptionKey: 'tour.admin.payments.description',
    placement: 'right',
  },
];

/**
 * Resolves the relevant onboarding steps for the current user role.
 */
export function getWebTourSteps(roleName?: string): TourStep[] {
  switch (roleName) {
    case 'Trainer':
      return TRAINER_TOUR_STEPS;
    case 'Gym':
      return GYM_TOUR_STEPS;
    case 'Admin':
      return ADMIN_TOUR_STEPS;
    case 'Client':
    default:
      return CLIENT_TOUR_STEPS;
  }
}

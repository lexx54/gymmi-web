import { Flame, Timer, Droplets } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EditorialHeader } from '../components/dashboard/EditorialHeader';
import { WeeklyProgressCard } from '../components/dashboard/WeeklyProgressCard';
import { StatTile } from '../components/dashboard/StatTile';
import { RecentActivitySection } from '../components/dashboard/RecentActivitySection';
import type { Activity, ChartBar, StatTileProps } from '../types/dashboard';

const GYM_BG_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCkOeTRBB8h_F99FYdmvrOun11-5nMUiJ19dGQag5kFShe_OeyMNiogCkypnmKcyo6dtGhMUrieJM3D2W9K2G7XdyUdgjIddxVYglGjDP4iQFYCfPbEwQM2Nw9Lrr5vzoHc4_z473fCZyQEksYgm3kHe3FF2trzV2w7sstGLhBfINeS-lcEOFTMzRVvhtBepS5eJD-Z1yl9y9OY6JWIxZhprkLSJE-Hhf3NW6VoJHDz5n4KzKWQpVWlDcNY07RY2fL4talyra1f-Fk';

const WEEKLY_BARS: ChartBar[] = [
  { day: 'MON', heightPct: 40 },
  { day: 'TUE', heightPct: 65 },
  { day: 'WED', heightPct: 30 },
  { day: 'THU', heightPct: 90 },
  { day: 'FRI', heightPct: 75, active: true },
  { day: 'SAT', heightPct: 50 },
  { day: 'SUN', heightPct: 20 },
];

const STATS: StatTileProps[] = [
  { icon: Flame, label: 'CALORIES', value: '1,842', unit: 'KCAL', accent: 'primary' },
  { icon: Timer, label: 'ACTIVE TIME', value: '124', unit: 'MINS', accent: 'tertiary' },
  { icon: Droplets, label: 'HYDRATION', value: '2.8', unit: 'LITERS', accent: 'secondary' },
];

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    when: 'YESTERDAY',
    title: 'Urban Trail Run',
    meta: '5.2 km • 28:14',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxKDXwPahbg-02jDADRG5ECnNSzlJK0_R7znPPXv4TsCvPnGegMnc1JsXY0cwqE07gTEWwByIa6SuT7BOTn8VZSp_QrtfYvVCofIk9MoIj8GfxMTAwwVDJxNw5W9YGqh9QHRNyZNkNZqsl5iWB-rf1vRz4xbQJp7qp9UNeEd5Qcrn5fy0UXafoiQ6vMsdZs-sAqy7fxYgkbErwxuL5SvDm-B9HYN4NLR_qxntWe7xHO5DZouYf9bzYU2o4OUyNMbxIMRtwXwGZ9Iw',
  },
  {
    id: '2',
    when: '2 DAYS AGO',
    title: 'Recovery Flow',
    meta: '45 min • Low Intensity',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCi9AG6dIpHrgKi_cWhHNxORhBf20mxnfaksQmTFkSoed_JT0_ZoC6J2w9aN1Mhf3LJCG5P5kpwLbYt0BBEj0Jtqvod_uh5lX8VhY-aWX3lM7b8O7cwC2uQjAFkEe52Z2P54j4j8zOKezYFnX_xUrKg8QCjlkDZ1QsOikGYe7673-Sd5Vnujq_t6IvHaYws6jJfVQbymHOVVLqJ5KP-JuCjqUEnbve78NoRnKRGO7ca41KVGWaD_A7_1sA3DoJDQ0idoH2WMcHb-3k',
  },
  {
    id: '3',
    when: '3 DAYS AGO',
    title: 'Power Lifting',
    meta: '65 min • 1,200kg Vol',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoNwcfeUaJJYk5WPEVjbo9yWYHSaqG5R_141Qw_0Ygp8qP_Mdz3VeKFlpINoMMkpuM2fGpPkvFFrIFEEXhnSfHT4XwNX-KddMspz4XLFGiAB35GgLDGcehpLRKlQ9M9S5vmJ3JtCbbyPVgQaGYjPLFJrr--HJXCOpXRzhvKXyWTXxiDUzlymAG_E_6HnmAvxnjKaTcXfn1pE0CN6Zqni4M6T4LaKFa1R9NY4d1_qU9R69DD63Jl1u1CYiKzznmVnKMfOsx07Byt7E',
  },
];

/**
 * Time-aware uppercase greeting prefix.
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

/**
 * Authenticated dashboard landing page composed of:
 * editorial greeting -> weekly progress card + right column of stat tiles
 * -> recent activity strip. All data is currently static mock data.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const name = (user?.username ?? 'Athlete').toUpperCase();
  const greeting = getGreeting();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <EditorialHeader
        greeting={greeting}
        name={name}
        line1="YOU'RE IN THE"
        accent="PEAK ZONE"
        line2Suffix="TODAY."
      />

      <WeeklyProgressCard
        subtitle="Weekly Progress"
        title="VOLUME TRAINING"
        percent={84}
        bars={WEEKLY_BARS}
        bgImageUrl={GYM_BG_URL}
      />

      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
        {STATS.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </div>

      <RecentActivitySection activities={ACTIVITIES} />
    </div>
  );
}

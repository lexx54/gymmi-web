import { ChevronRight, Flame, Timer, Droplets } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const gymBgUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCkOeTRBB8h_F99FYdmvrOun11-5nMUiJ19dGQag5kFShe_OeyMNiogCkypnmKcyo6dtGhMUrieJM3D2W9K2G7XdyUdgjIddxVYglGjDP4iQFYCfPbEwQM2Nw9Lrr5vzoHc4_z473fCZyQEksYgm3kHe3FF2trzV2w7sstGLhBfINeS-lcEOFTMzRVvhtBepS5eJD-Z1yl9y9OY6JWIxZhprkLSJE-Hhf3NW6VoJHDz5n4KzKWQpVWlDcNY07RY2fL4talyra1f-Fk';

const activities = [
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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'GOOD MORNING';
  if (h < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const name = (user?.username ?? 'Athlete').toUpperCase();
  const greeting = getGreeting();

  return (
    <>
      <section className="mb-12 relative">
        <div className="absolute -left-12 top-0 text-[120px] font-black text-surface-container-highest/10 select-none leading-none pointer-events-none font-headline">
          ELITE
        </div>
        <p className="text-primary font-label font-bold tracking-[0.2em] mb-2">
          {greeting}, {name}
        </p>
        <h2 className="text-5xl lg:text-7xl font-black font-headline tracking-tighter italic leading-none text-on-surface">
          YOU&apos;RE IN THE <br />{' '}
          <span className="text-[#ef233c]">PEAK ZONE</span> TODAY.
        </h2>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-container-low rounded-[2rem] p-8 relative overflow-hidden editorial-shadow group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-primary font-label font-bold tracking-widest text-xs mb-1 uppercase">
                  Weekly Progress
                </p>
                <h3 className="text-3xl font-bold font-headline text-on-surface">VOLUME TRAINING</h3>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black italic font-headline text-primary">84%</span>
                <p className="text-[10px] font-label text-on-surface-variant font-bold tracking-widest">
                  GOAL REACHED
                </p>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              <div className="w-full bg-surface-container-highest h-[40%] rounded-t-xl group-hover:h-[60%] transition-all duration-700" />
              <div className="w-full bg-surface-container-highest h-[65%] rounded-t-xl group-hover:h-[45%] transition-all duration-700" />
              <div className="w-full bg-surface-container-highest h-[30%] rounded-t-xl group-hover:h-[80%] transition-all duration-700" />
              <div className="w-full bg-surface-container-highest h-[90%] rounded-t-xl group-hover:h-[70%] transition-all duration-700" />
              <div className="w-full bg-gradient-to-t from-primary-container to-primary h-[75%] rounded-t-xl group-hover:h-[95%] transition-all duration-700 shadow-[0_0_20px_rgba(255,83,90,0.3)]" />
              <div className="w-full bg-surface-container-highest h-[50%] rounded-t-xl group-hover:h-[30%] transition-all duration-700" />
              <div className="w-full bg-surface-container-highest h-[20%] rounded-t-xl group-hover:h-[40%] transition-all duration-700" />
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant font-label tracking-widest px-1">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span className="text-primary">FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 grayscale pointer-events-none">
            <img alt="" className="w-full h-full object-cover" src={gymBgUrl} />
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
          <div className="bg-surface-container rounded-[2rem] p-6 flex flex-col justify-between border-b-4 border-primary">
            <div className="flex justify-between items-center">
              <Flame className="size-7 text-primary" strokeWidth={2} aria-hidden />
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant font-label">
                CALORIES
              </span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black font-headline text-on-surface">1,842</span>
              <span className="text-sm font-bold text-on-surface-variant ml-1">KCAL</span>
            </div>
          </div>
          <div className="bg-surface-container rounded-[2rem] p-6 flex flex-col justify-between border-b-4 border-tertiary">
            <div className="flex justify-between items-center">
              <Timer className="size-7 text-tertiary" strokeWidth={2} aria-hidden />
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant font-label">
                ACTIVE TIME
              </span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black font-headline text-on-surface">124</span>
              <span className="text-sm font-bold text-on-surface-variant ml-1">MINS</span>
            </div>
          </div>
          <div className="bg-surface-container rounded-[2rem] p-6 flex flex-col justify-between border-b-4 border-secondary">
            <div className="flex justify-between items-center">
              <Droplets className="size-7 text-secondary" strokeWidth={2} aria-hidden />
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant font-label">
                HYDRATION
              </span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black font-headline text-on-surface">2.8</span>
              <span className="text-sm font-bold text-on-surface-variant ml-1">LITERS</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 mt-4">
          <div className="flex justify-between items-end mb-8">
            <h4 className="text-2xl font-bold font-headline tracking-tight uppercase text-on-surface">
              Recent Activity
            </h4>
            <a
              className="text-primary text-xs font-bold tracking-widest hover:underline uppercase"
              href="#"
            >
              View History
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((a) => (
              <div key={a.id} className="bg-surface-container-low p-1 rounded-[2.5rem]">
                <div className="bg-surface-container-high rounded-[2.2rem] p-6 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl overflow-hidden shrink-0">
                    <img
                      alt=""
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                      src={a.image}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-primary mb-0.5">{a.when}</p>
                    <h5 className="font-bold font-headline text-lg text-on-surface">{a.title}</h5>
                    <p className="text-xs text-on-surface-variant">{a.meta}</p>
                  </div>
                  <ChevronRight
                    className="size-6 shrink-0 text-on-surface-variant/30"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

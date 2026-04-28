import type { PropsWithChildren, ReactNode } from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface AuthCardProps extends PropsWithChildren {
  title: string;
  description: string;
  footer?: ReactNode;
  panelCaption?: string;
}

function AuthIllustration() {
  return (
    <img
      src="https://docsslidessheets.com/wp-content/uploads/2025/04/Free-Editable-Employee-Mental-Health-Policy-Template-1024x768.png"
      alt="Mental wellness illustration"
      loading="lazy"
      className="h-full w-full object-cover object-center"
    />
  );
}

function AuthShowcasePanel({ caption }: { caption: string }) {
  return (
    <aside className="relative hidden overflow-hidden rounded-[28px] bg-[#edf1ec] p-8 lg:flex lg:min-h-[760px] lg:flex-col">
      <div className="absolute left-8 top-10 h-16 w-16 rounded-full border border-black/10 bg-[#c7e4c0] p-1 shadow-sm">
        <div className="grid h-full w-full place-items-center rounded-full bg-white text-sm font-bold text-[#375f34]">U1</div>
      </div>
      <div className="absolute bottom-52 right-8 h-16 w-16 rounded-full border border-black/10 bg-white p-1 shadow-sm">
        <div className="grid h-full w-full place-items-center rounded-full bg-[#d3e6d0] text-sm font-bold text-[#375f34]">U2</div>
      </div>

      <div className="mt-12 flex flex-1 items-center justify-center">
        <div className="w-full overflow-hidden rounded-[22px] border border-black/10 bg-white/70 shadow-[0_16px_34px_-24px_rgba(0,0,0,0.55)] aspect-[4/3]">
          <AuthIllustration />
        </div>
      </div>

      <div className="absolute left-12 top-[48%] rounded-[24px] border border-black/20 bg-white/92 px-5 py-4 shadow-[0_20px_35px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm">
        <p className="text-3xl font-bold text-[#111111]">Smart Match</p>
        <p className="mt-1 text-sm text-black/50">10 Tasks</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="rounded-full border border-black/25 px-3 py-1 text-xs font-semibold">Design</span>
          <div className="relative h-8 w-8">
            <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e7e7e7" strokeWidth="4" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#8ecb86" strokeWidth="4" strokeDasharray="88 12" />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-black/70">84%</span>
          </div>
        </div>
      </div>

      <div className="mt-auto px-4 pb-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Circle className="h-2.5 w-2.5 fill-black/10 stroke-none" />
          <Circle className="h-2.5 w-2.5 fill-black/10 stroke-none" />
          <div className="h-2.5 w-6 rounded-full bg-black" />
        </div>
        <p className="flex items-center justify-center text-2xl font-medium leading-tight tracking-tight text-[#131313] xl:text-4xl">
          Never Lose What Matters <img src="/verto-logo.png" alt="Verto" className="ml-4 h-8 xl:h-12 w-auto" />
        </p>
        <p className="mt-3 text-sm font-medium text-black/45">{caption}</p>
      </div>
    </aside>
  );
}

export function AuthCard({ title, description, footer, children, panelCaption = "Securely recover lost items faster across your campus network." }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-[1160px] rounded-[32px] border border-black/10 bg-[#f8f8f8]/95 p-3 shadow-[0_20px_60px_-38px_rgba(0,0,0,0.45)]">
      <div className="grid gap-3 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[28px] bg-[#f9f9f9] px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
          <div className="mb-8 space-y-3 text-center lg:mb-10">
            <h1 className="text-4xl font-black tracking-tight text-[#090909] sm:text-5xl">{title}</h1>
            <p className="mx-auto max-w-md text-lg font-medium leading-relaxed text-black/55">{description}</p>
          </div>
          {children}
          {footer ? <div className="mt-9 text-center">{footer}</div> : null}
        </div>
        <AuthShowcasePanel caption={panelCaption} />
      </div>
      <div className="pointer-events-none mt-3 flex items-center justify-center gap-2 text-sm text-black/45 lg:hidden">
        <CheckCircle2 className="h-4 w-4 text-[#6ca667]" />
        Built for effortless campus recovery workflows.
      </div>
    </div>
  );
}

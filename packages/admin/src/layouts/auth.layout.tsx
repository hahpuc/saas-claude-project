import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left: Gradient hero */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-purple-600 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative z-10 max-w-md text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            SaaS Admin
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Manage your platform with confidence. Monitor users, configure settings, and keep everything running smoothly.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex w-full items-center justify-center bg-background p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
              <span className="text-xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">SaaS Admin</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

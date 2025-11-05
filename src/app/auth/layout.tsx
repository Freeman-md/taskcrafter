export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/40 text-foreground relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/30 via-transparent to-primary/10" />
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            TaskCrafter
          </span>
          <h1 className="text-2xl font-semibold">Plan smarter with AI</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to craft goals, automate steps, and stay on track.
          </p>
        </div>
        <div className="w-full p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

import { SignIn } from "@clerk/nextjs";

import { authAppearance } from "@/features/auth/auth-appearance";

export default function SignInPage() {
  return (
    <div className="space-y-4">
      <SignIn path="/auth/sign-in" routing="path" appearance={authAppearance} />
    </div>
  );
}

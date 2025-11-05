import { SignUp } from "@clerk/nextjs";

import { authAppearance } from "@/components/auth/auth-appearance";

export default function SignUpPage() {
  return (
    <div className="space-y-4">
      <SignUp path="/auth/sign-up" routing="path" appearance={authAppearance} />
    </div>
  );
}

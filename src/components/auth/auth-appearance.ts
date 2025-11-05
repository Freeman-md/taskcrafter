import type { SignInProps } from "@clerk/types";

type Appearance = NonNullable<SignInProps["appearance"]>;

export const authAppearance: Appearance = {
  variables: {
    colorPrimary: "#2563eb",
    colorText: "#0f172a",
    colorTextSecondary: "#475569",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#0f172a",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-source-sans), system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full [&>*]:w-full",
    card: "bg-card/80 border border-border shadow-xl backdrop-blur-sm",
    headerTitle: "text-foreground text-xl font-semibold",
    headerSubtitle: "text-muted-foreground text-sm",
    formFieldLabel: "text-sm font-medium text-muted-foreground",
    formFieldInput:
      "bg-background border border-border text-foreground shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20",
    formButtonPrimary:
      "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary transition-colors",
    socialButtonsBlockButton:
      "border border-border bg-background text-foreground hover:border-primary/40 hover:text-primary transition-colors",
    footerAction: "text-sm text-muted-foreground",
    footerActionLink: "text-primary font-medium hover:text-primary/80",
    badge: "hidden",
  },
};

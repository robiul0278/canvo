import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login?redirect=%2Fcheckout");
  }

  return (
    <CheckoutForm
      initialName={session.user.name ?? undefined}
      initialEmail={session.user.email}
    />
  );
}

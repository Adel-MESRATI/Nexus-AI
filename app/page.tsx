import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPageClient from "./landing-client";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LandingPageClient />;
}

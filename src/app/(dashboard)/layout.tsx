import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main>{children}</main>
    </div>
  );
}

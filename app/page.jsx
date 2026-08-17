import { redirect } from "next/navigation";
import { getCustomer } from "@/lib/customer-auth";
import ClientApp from "@/components/ClientApp";

export default async function Page() {
  const customer = await getCustomer();
  if (!customer) redirect("/customer/login?next=/");
  return <ClientApp />;
}
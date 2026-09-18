import { getBESSData } from "@/lib/mockData";
import BESSDetailClient from "./BESSDetailClient";

export default async function BESSDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBESSData();
  return <BESSDetailClient data={data} id={id} />;
}

import { notFound } from "next/navigation";
import { getEVTelemetry, getV2GData } from "@/lib/mockData";
import V2GDetailClient from "./V2GDetailClient";

export async function generateStaticParams() {
  const data = await getV2GData();
  return data.sessions.map((session) => ({
    id: session.vehicleId,
  }));
}

export default async function V2GDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const telemetry = await getEVTelemetry(id);
  
  if (!telemetry) {
    notFound();
  }

  return <V2GDetailClient initialData={telemetry} />;
}

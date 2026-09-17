import { getV2GData } from "@/lib/mockData";
import V2GClient from "./V2GClient";

export default async function V2GPage() {
  const data = await getV2GData();
  return <V2GClient data={data} />;
}

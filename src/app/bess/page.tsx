import { getBESSData } from "@/lib/mockData";
import BESSClient from "./BESSClient";

export default async function BESSPage() {
  const data = await getBESSData();
  return <BESSClient data={data} />;
}

import { getMicrogrids } from "@/lib/mockData";
import MicrogridsClient from "./MicrogridsClient";

export default async function MicrogridsPage() {
  const microgrids = await getMicrogrids();
  return <MicrogridsClient microgrids={microgrids} />;
}

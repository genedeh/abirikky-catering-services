import { frontendEndpoints } from "@/config/endpoints";
import { fetchJson } from "@/services/apiClient";
import type { ClientMeta } from "@/types/cms";

export function getClientMeta() {
  return fetchJson<ClientMeta>(frontendEndpoints.clientMeta);
}

import type { ModelPageData } from "entities/model/types";
import { pageContent } from "entities/model/pageContent";
import { panoramaTours } from "entities/model/panoramas";
import { sceneConfigs } from "entities/model/scenes";

export const modelIds = ["moto", "pickup", "bus", "kamaz", "kater", "moskvich", "velo"] as const;

export type ModelId = (typeof modelIds)[number];

function createPage(id: ModelId): ModelPageData {
  const content = pageContent[id];
  const scene = sceneConfigs[id];
  if (!content || !scene) {
    throw new Error(`Нет данных страницы ${id}`);
  }
  return { id, ...content, scene, panorama: panoramaTours[id] ?? null };
}

export const pages = {
  moto: createPage("moto"),
  pickup: createPage("pickup"),
  bus: createPage("bus"),
  kamaz: createPage("kamaz"),
  kater: createPage("kater"),
  moskvich: createPage("moskvich"),
  velo: createPage("velo"),
};

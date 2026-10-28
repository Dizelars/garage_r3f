import type { PanoramaTour } from "entities/model/types";

const hotspot = "media/images/modelPage/aframe_360/hotspot.svg";

function singleRoom(src: string, phiStart: number): PanoramaTour {
  return {
    initialRoom: "room1",
    rooms: [
      {
        id: "room1",
        src,
        phiStart,
        spots: [],
      },
    ],
  };
}

export const panoramaTours: Record<string, PanoramaTour | null> = {
  moto: null,
  velo: null,
  pickup: singleRoom("media/images/modelPage/aframe_360/pickup/pickup.jpg", 187),
  kater: singleRoom("media/images/modelPage/aframe_360/kater/kater.jpg", -90.5),
  moskvich: singleRoom("media/images/modelPage/aframe_360/moskvich/moscvich.jpg", -88),
  bus: {
    initialRoom: "room1",
    rooms: [
      {
        id: "room1",
        src: "media/images/modelPage/aframe_360/bus/bus_1.jpg",
        phiStart: 271,
        spots: [{ toRoom: "room2", position: [0, 0, -10], phiStart: 280 }],
      },
      {
        id: "room2",
        src: "media/images/modelPage/aframe_360/bus/bus_2.jpg",
        phiStart: 280,
        spots: [
          { toRoom: "room1", position: [-0.25, 0, 10], phiStart: 271 },
          { toRoom: "room3", position: [0, 0, -10], phiStart: 275 },
        ],
      },
      {
        id: "room3",
        src: "media/images/modelPage/aframe_360/bus/bus_3.jpg",
        phiStart: 275,
        spots: [{ toRoom: "room2", position: [0, 1, 10], phiStart: 280 }],
      },
    ],
  },
  kamaz: {
    initialRoom: "room1",
    rooms: [
      {
        id: "room1",
        src: "media/images/modelPage/aframe_360/kamaz/kamaz_1.jpg",
        phiStart: 304,
        spots: [{ toRoom: "room2", position: [-5, 1, 2.5], phiStart: 160 }],
      },
      {
        id: "room2",
        src: "media/images/modelPage/aframe_360/kamaz/kamaz_2.jpg",
        phiStart: 160,
        spots: [
          { toRoom: "room3", position: [-5, 1, 2], phiStart: 160 },
          { toRoom: "room1", position: [5, 1, -2], phiStart: 304 },
        ],
      },
      {
        id: "room3",
        src: "media/images/modelPage/aframe_360/kamaz/kamaz_3.jpg",
        phiStart: 160,
        spots: [{ toRoom: "room2", position: [6.5, 1, -3], phiStart: 160 }],
      },
    ],
  },
};

export const panoramaHotspotSrc = hotspot;

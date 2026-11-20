import * as studioModule from "@theatre/studio";
import r3fExtension from "@theatre/r3f/dist/extension";

type Studio = {
  initialize: () => void;
  extend: (extension: unknown) => void;
  default?: Studio;
};

function unwrapStudio(value: Studio): Studio {
  if (typeof value.initialize === "function") {
    return value;
  }
  if (value.default) {
    return unwrapStudio(value.default);
  }
  throw new Error("Theatre studio: initialize not found");
}

const studio = unwrapStudio(studioModule as unknown as Studio);

studio.extend(r3fExtension);
studio.initialize();

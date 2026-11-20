import { SpotLightHelper } from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

// Базовые helper.clone() падают: Object3D.clone() конструирует
// новый инстанс без аргументов, а update() в конструкторе
// требует light. Theatre r3f extension клонирует всю сцену
// для snapshot — в том числе клонирует уже-клонированные
// объекты, поэтому instance-override не спасает: он не
// переживает Object3D.copy(). Патчим прототипы один раз.
// Заодно прячем хелперы в клоне: snapshot-просмотрщик
// не должен показывать отладочные визуализации ламп.

type HelperWithLight = { light: SpotLightHelper["light"]; color?: unknown };

SpotLightHelper.prototype.clone = function clone(this: SpotLightHelper) {
  const helper = new SpotLightHelper(this.light, this.color);
  helper.visible = false;
  return helper;
};

RectAreaLightHelper.prototype.clone = function clone(this: RectAreaLightHelper) {
  const self = this as RectAreaLightHelper & HelperWithLight;
  const helper = new RectAreaLightHelper(self.light, self.color as RectAreaLightHelper["color"]);
  helper.visible = false;
  return helper;
};

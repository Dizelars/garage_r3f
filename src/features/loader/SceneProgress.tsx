import { useProgress } from "@react-three/drei";
import { useState } from "react";
import { LoaderField } from "./LoaderField";

export function SceneProgress() {
  const { active, progress } = useProgress();
  const [visible, setVisible] = useState(true);
  const percent = Math.max(0, Math.min(100, Math.round(progress)));
  const ready = !active && progress >= 100;

  if (!visible) {
    return null;
  }

  return (
    <div className="loader-field" role="status" aria-live="polite">
      <LoaderField progress={percent} />
      <span className="loader-field__percent">{percent}%</span>
      {ready ? (
        <button
          className="loader-field__enter"
          type="button"
          onClick={() => setVisible(false)}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            event.currentTarget.style.setProperty("--glow-x", `${x}%`);
            event.currentTarget.style.setProperty("--glow-y", `${y}%`);
          }}
        >
          В гараж
        </button>
      ) : null}
    </div>
  );
}

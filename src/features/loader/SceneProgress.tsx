import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export function SceneProgress() {
  const { active, progress } = useProgress();
  const [visible, setVisible] = useState(true);
  const percent = Math.max(1, Math.min(100, Math.round(progress)));

  useEffect(() => {
    if (!active && progress >= 100) {
      setVisible(false);
    }
  }, [active, progress]);

  if (!visible) {
    return null;
  }

  return (
    <div className="progress-bar">
      <div className="progress-bar-container">
        <div className="image">
          <img
            className="no_animated"
            src="media/images/modelPage/loader/logo.gif"
            alt="цодд"
            fetchPriority="high"
          />
        </div>
        <span id="progress-label">{percent}%</span>
        <div id="hellopreloader_barWrapper">
          <progress id="progress-bar" value={percent} max={100} style={{ width: `${percent}%` }} />
        </div>
        <label htmlFor="progress-bar" id="progress_text">
          Загружаем модель в высоком разрешении.
          <br />
          Пожалуйста, дождитесь завершения
        </label>
      </div>
    </div>
  );
}

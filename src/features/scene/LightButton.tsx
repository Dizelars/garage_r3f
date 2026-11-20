type LightButtonProps = {
  enabled: boolean;
  hidden: boolean;
  onClick: () => void;
};

export function LightButton({ enabled, hidden, onClick }: LightButtonProps) {
  const className = ["scene-lights", enabled ? "is-on" : "", hidden ? "hidden" : ""].filter(Boolean).join(" ");

  return (
    <button type="button" className={className} aria-pressed={enabled} onClick={onClick}>
      {enabled ? "Свет вкл" : "Свет выкл"}
    </button>
  );
}

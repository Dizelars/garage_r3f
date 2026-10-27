type AnimationButtonProps = {
  playing: boolean;
  hidden: boolean;
  onClick: () => void;
};

export function AnimationButton({ playing, hidden, onClick }: AnimationButtonProps) {
  const className = ["scene-animation", hidden ? "hidden" : ""].filter(Boolean).join(" ");

  return (
    <button type="button" className={className} onClick={onClick}>
      {playing ? "Стоп" : "Анимация"}
    </button>
  );
}

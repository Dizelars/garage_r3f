type GyroDialogProps = {
  open: boolean;
  onAllow: () => void;
  onDeny: () => void;
};

export function GyroDialog({ open, onAllow, onDeny }: GyroDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="panorama-dialog">
      <p className="panorama-dialog__text">
        Разрешите этому сайту использовать гироскопы вашего устройства для ориентации в&nbsp;пространстве.
        Так экскурсия станет гораздо интерактивней и&nbsp;увлекательней.
      </p>
      <div className="panorama-dialog__actions">
        <button type="button" className="panorama-dialog__allow" onClick={onAllow}>
          Разрешить
        </button>
        <button type="button" className="panorama-dialog__deny" onClick={onDeny}>
          Отказаться
        </button>
      </div>
    </div>
  );
}

type ModelHeaderProps = {
  backHref: string;
};

export function ModelHeader({ backHref }: ModelHeaderProps) {
  return (
    <div className="header">
      <a className="header__logo" href={backHref}>
        <img className="header__logo-img" src="media/images/logo/header_logo.svg" alt="logo" />
        <p className="header__logo-text">Гараж ЦОДД</p>
      </a>
    </div>
  );
}

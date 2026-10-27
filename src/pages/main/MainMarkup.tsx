export function MainMarkup() {
  return (
    <>
    <div className="progress-bar main">
      <div className="progress-bar-container">
        <div className="image">
          <img className="no_animated" src="media/images/modelPage/loader/logo.gif" alt="цодд" fetchPriority="high" />
        </div>
        <span id="progress-label">
          {"1%"}
        </span>
        <div id="hellopreloader_barWrapper">
          <progress id="progress-bar" value="1" max="100" />
        </div>
      </div>
    </div>
    <header className="header_main">
      <div className="container_main">
        <div className="header__wrapper">
          <div className="header__logo">
            <img className="header__logo-img" src="media/images/logo/header_logo.svg" alt="logo" />
            <p className="header__logo-text">
              {"Гараж ЦОДД"}
            </p>
          </div>
          <div className="header__menu">
            <div className="burger-menu burger-menu--closed">
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </div>
          </div>
        </div>
      </div>
    </header>
    <div className="menu">
      <div className="container_main">
        <div className="menu__logo">
          <img className="menu__logo-img" src="media/images/logo/header_logo.svg" alt="logo" />
          <p className="menu__logo-text">
            {"Гараж ЦОДД"}
          </p>
        </div>
        <nav className="menu_navigation">
          <ul className="menu_navigation-list">
            <li className="menu_navigation-item">
              <div className="menu_wrapper_img">
                <img src="media/images/mainPage/menu_icon/police.svg" alt="дорожный патруль ЦОДД" className="menu_nav-img" />
              </div>
              <a className="menu_navigation-link" href="#traffic_patrol">
                {"дорожный патруль ЦОДД"}
              </a>
              <div className="menu_preview-block">
                <div className="block-wrapper-video">
                  <video className="menu_preview-video" src="media/video/traffik_menu.mp4" muted loop playsInline />
                </div>
              </div>
            </li>
            <li className="menu_navigation-item">
              <div className="menu_wrapper_img">
                <img src="media/images/mainPage/menu_icon/bus.svg" alt="мобильный ситуационный центр ЦОДД" className="menu_nav-img" />
              </div>
              <a className="menu_navigation-link" href="#situation_centre">
                {"мобильный ситуационный центр"}
              </a>
              <div className="menu_preview-block">
                <div className="block-wrapper-video">
                  <video className="menu_preview-video" src="media/video/bus.mp4" muted loop playsInline />
                </div>
              </div>
            </li>
            <li className="menu_navigation-item">
              <div className="menu_wrapper_img">
                <img src="media/images/mainPage/menu_icon/boat.svg" alt="водный патруль ЦОДД" className="menu_nav-img" />
              </div>
              <a className="menu_navigation-link" href="#water_patrol">
                {"водный патруль"}
              </a>
              <div className="menu_preview-block">
                <div className="block-wrapper-video">
                  <video className="menu_preview-video" src="media/video/kater.mp4" muted loop playsInline />
                </div>
              </div>
            </li>
            <li className="menu_navigation-item">
              <div className="menu_wrapper_img">
                <img src="media/images/mainPage/menu_icon/bicycle.svg" alt="велопатруль" className="menu_nav-img" />
              </div>
              <a className="menu_navigation-link" href="#velo_patrol">
                {"велопатруль"}
              </a>
              <div className="menu_preview-block">
                <div className="block-wrapper-video">
                  <video className="menu_preview-video" src="media/video/velo.mp4" muted loop playsInline />
                </div>
              </div>
            </li>
            <li className="menu_navigation-item">
              <div className="menu_wrapper_img">
                <img src="media/images/mainPage/menu_icon/firstaid.svg" alt="служба помощи ЦОДД" className="menu_nav-img" />
              </div>
              <a className="menu_navigation-link" href="#help_desk">
                {"служба помощи"}
              </a>
              <div className="menu_preview-block">
                <div className="block-wrapper-video">
                  <video className="menu_preview-video" src="media/video/moskvich.mp4" muted loop playsInline />
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <div className="flex-filler" />
        <div className="menu-media">
          <a className="media-wrapper" href="https://gucodd.ru/?utm-source=garage_codd" target="_blank" rel="noopener">
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
            <img className="media-img" src="media/images/mainPage/footer/contact_internet.svg" alt="gucodd" />
          </a>
          <a className="media-wrapper" href="https://vk.com/mosroad/?utm-source=garage_codd" target="_blank" rel="noopener">
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
            <img className="media-img" src="media/images/mainPage/footer/media_vk.svg" alt="vk" />
          </a>
          <a className="media-wrapper" href="https://t.me/DtRoad/?utm-source=garage_codd" target="_blank" rel="noopener">
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
            <img className="media-img" src="media/images/mainPage/footer/media_telegram.svg" alt="telegram" />
          </a>
          <a className="media-wrapper" href="tel:3210">
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
            <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
            <img className="media-img" src="media/images/mainPage/footer/media_tel.svg" alt="Телефон" />
          </a>
        </div>
      </div>
    </div>
    <div className="block_blur" />
    <main className="gradient_move">
      <section className="main">
        <div className="main_intro_media">
          <video className="preview_video" preload="" playsInline muted loop />
        </div>
        <div className="main_intro_content">
          <div className="container_main">
            <div className="main_bg">
              <h1 className="main_title">
                <span className="main_title-animation-1">
                  {"ЦОДД 26 лет"}
                </span>
                <span className="main_title-animation-2">
                  {"делаем дор"}
                  <span className="large_letter" />
                  {"ги Москвы"}
                </span>
                <span className="main_title-animation-3">
                  {"безопасными и удобными"}
                </span>
              </h1>
              <div className="main_grid-wrapper">
                <div className="main_text-1">
                  <p className="main_info-text">
                    {"\r\n                                    Сегодня здесь находится одна из самых современных в мире систем управления дорожным движением с крупными инфраструктурными и ИТ‑проектами\r\n                                "}
                  </p>
                </div>
                <div className="main_text-2">
                  <p className="main_info-text">
                    {"\r\n                                    Для эффективного выполнения задач в ЦОДД создан уникальный транспортный парк: от брутальных пикапов до электровелосипедов, от мобильного центра управления городом до речного катера\r\n                                "}
                  </p>
                </div>
                <div className="main_text-mobile">
                  <p className="main_info-text">
                    {"\r\n                                    Сегодня здесь находится одна из самых современных в мире систем управления дорожным движением с крупными инфраструктурными и ИТ‑проектами\r\n                                "}
                  </p>
                  <p className="main_info-text">
                    {"\r\n                                    Для эффективного выполнения задач в ЦОДД создан уникальный транспортный парк: от брутальных пикапов до электровелосипедов, от мобильного центра управления городом до речного катера\r\n                                "}
                  </p>
                </div>
                <div className="main_button-3">
                  <a className="main_info-link" href="moto.html">
                    {"в виртуальный гараж"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="traffic_patrol" id="traffic_patrol">
        <div className="container_main">
          <div className="traffic_patrol_grid-wrapper">
            <div className="traffic_patrol-1">
              <h1 className="traffic_patrol-title title">
                <span className="traffic_patrol-animation-1">
                  {"дорожный"}
                </span>
                <span className="traffic_patrol-animation-2">
                  {"патруль"}
                </span>
              </h1>
            </div>
            <div className="traffic_patrol-text-2">
              <p className="traffic_patrol-text">
                {"\r\n                            Ежедневно 36 экипажей Дорожного патруля ЦОДД курсируют по Москве."}
                <br />
                {"Задача — регулировать движение на сложных участках, помогать водителям при поломке или аварии\r\n                        "}
              </p>
            </div>
            <div className="traffic_patrol-text-4">
              <p className="traffic_patrol-text">
                {"\r\n                            В гараже Дорожного патруля 58 автомобилей: грузовики, пикапы. А также 12 мотоциклов и 20 велосипедов\r\n                        "}
              </p>
            </div>
            <div className="traffic_patrol-text-5">
              <p className="traffic_patrol-text">
                {"\r\n                            В гараже Дорожного патруля 58 автомобилей: грузовики, пикапы. А также 12 мотоциклов и 20 велосипедов. На всех транспортных средствах изображен логотипом ЦОДД. Дорожный патруль нельзя вызвать. Задания экипажи получают от дежурных Ситуационного центра ЦОДД\r\n                            "}
                {/* На&nbsp;всех транспортных средствах изображен логотипом ЦОДД. Дорожный патруль нельзя вызвать. Задания экипажи получают от&nbsp;дежурных Ситуационного центра ЦОДД */}
              </p>
            </div>
            {/* <div class="traffic_patrol-text-combo">
                        <p class="traffic_patrol-text">
                            В&nbsp;гараже Дорожного патруля 58&nbsp;автомобилей: грузовики, пикапы. А&nbsp;также 12&nbsp;мотоциклов и&nbsp;20&nbsp;велосипедов. На&nbsp;всех транспортных средствах изображен логотипом ЦОДД. Дорожный патруль нельзя вызвать. Задания экипажи получают от&nbsp;дежурных Ситуационного центра ЦОДД
                        </p>
                    </div> */}
            <div className="traffic_patrol-slide-kamaz_NOSLIDER">
              <a className="garage_model_card parentCardForLargeMonitor model_1" href="moto.html">
                <div className="slid_img">
                  <picture>
                    <img className="menu_preview-img" src="media/images/modelPage/slider/moto.png" alt="Мотопатруль" fetchPriority="high" />
                  </picture>
                  <video className="menu_preview-video" src="media/video/moto.mp4" muted loop playsInline />
                </div>
                <div className="slid_info">
                  <div className="slid_info-desc">
                    <p className="slid_info-title">
                      {"Дорожный патруль"}
                    </p>
                    <p className="slid_info-text">
                      {"Мотоцикл"}
                    </p>
                  </div>
                  <div className="slid_info-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                        <rect width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_1137_313)">
                        <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                      </g>
                    </svg>
                  </div>
                </div>
              </a>
              <a className="garage_model_card parentCardForLargeMonitor model_2" href="kamaz.html">
                <div className="slid_img">
                  <picture>
                    <img className="menu_preview-img" src="media/images/modelPage/slider/kamaz.png" alt="Грузовик" fetchPriority="high" />
                  </picture>
                  <video className="menu_preview-video" src="media/video/kamaz.mp4" muted loop playsInline />
                </div>
                <div className="slid_info">
                  <div className="slid_info-desc">
                    <p className="slid_info-title">
                      {"Дорожный патруль"}
                    </p>
                    <p className="slid_info-text">
                      {"Грузовик"}
                    </p>
                  </div>
                  <div className="slid_info-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                        <rect width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_1137_313)">
                        <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                      </g>
                    </svg>
                  </div>
                </div>
              </a>
              <div className="model_3">
                <div className="model_3_text_1">
                  <p className="traffic_patrol-text">
                    {"\r\n                                    В гараже Дорожного патруля 58 автомобилей: грузовики, пикапы. А также 12 мотоциклов и 20 велосипедов\r\n                                "}
                  </p>
                </div>
                <div className="model_3_text_2">
                  <p className="traffic_patrol-text">
                    {"\r\n                                    На всех транспортных средствах изображен логотипом ЦОДД. Дорожный патруль нельзя вызвать. Задания экипажи получают от дежурных Ситуационного центра ЦОДД\r\n                                "}
                  </p>
                </div>
                <div className="model_3_text_combo">
                  <p className="traffic_patrol-text">
                    {"\r\n                                    В гараже Дорожного патруля 58 автомобилей: грузовики, пикапы. А также 12 мотоциклов и 20 велосипедов. На всех транспортных средствах изображен логотипом ЦОДД. Дорожный патруль нельзя вызвать. Задания экипажи получают от дежурных Ситуационного центра ЦОДД\r\n                                "}
                  </p>
                </div>
              </div>
              <a className="garage_model_card parentCardForLargeMonitor model_4" href="./pickup.html">
                <div className="slid_img">
                  <picture>
                    <img className="menu_preview-img" src="media/images/modelPage/slider/pickup.png" alt="Патрульный пикап" fetchPriority="high" />
                  </picture>
                  <video className="menu_preview-video" src="media/video/pickup.mp4" muted loop playsInline />
                </div>
                <div className="slid_info">
                  <div className="slid_info-desc">
                    <p className="slid_info-title">
                      {"Дорожный патруль"}
                    </p>
                    <p className="slid_info-text">
                      {"Пикап"}
                    </p>
                  </div>
                  <div className="slid_info-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                        <rect width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_1137_313)">
                        <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                      </g>
                    </svg>
                  </div>
                </div>
              </a>
              
            </div>
            <div className="traffic_patrol-slide-kamaz">
              <div className="traffic_patrol_slider-wrapper swiper1">
                <div className="traffic_patrol_slider swiper-wrapper">
                  <a className="garage_model_card swiper-slide parentCardForLargeMonitor" href="moto.html">
                    <div className="slid_img">
                      <picture>
                        <img className="menu_preview-img" src="media/images/modelPage/slider/moto.png" alt="Мотопатруль" fetchPriority="high" />
                      </picture>
                      <video className="menu_preview-video" src="media/video/moto.mp4" muted loop playsInline />
                    </div>
                    <div className="slid_info">
                      <div className="slid_info-desc">
                        <p className="slid_info-title">
                          {"Дорожный патруль"}
                        </p>
                        <p className="slid_info-text">
                          {"Мотоцикл"}
                        </p>
                      </div>
                      <div className="slid_info-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                            <rect width="18" height="18" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_1137_313)">
                            <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <a className="garage_model_card swiper-slide parentCardForLargeMonitor" href="kamaz.html">
                    <div className="slid_img">
                      <picture>
                        <img className="menu_preview-img" src="media/images/modelPage/slider/kamaz.png" alt="Грузовик" fetchPriority="high" />
                      </picture>
                      <video className="menu_preview-video" src="media/video/kamaz.mp4" muted loop playsInline />
                    </div>
                    <div className="slid_info">
                      <div className="slid_info-desc">
                        <p className="slid_info-title">
                          {"Дорожный патруль"}
                        </p>
                        <p className="slid_info-text">
                          {"Грузовик"}
                        </p>
                      </div>
                      <div className="slid_info-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                            <rect width="18" height="18" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_1137_313)">
                            <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <a className="garage_model_card swiper-slide parentCardForLargeMonitor" href="./pickup.html">
                    <div className="slid_img">
                      <picture>
                        <img className="menu_preview-img" src="media/images/modelPage/slider/pickup.png" alt="Патрульный пикап" fetchPriority="high" />
                      </picture>
                      <video className="menu_preview-video" src="media/video/pickup.mp4" muted loop playsInline />
                    </div>
                    <div className="slid_info">
                      <div className="slid_info-desc">
                        <p className="slid_info-title">
                          {"Дорожный патруль"}
                        </p>
                        <p className="slid_info-text">
                          {"Пикап"}
                        </p>
                      </div>
                      <div className="slid_info-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                            <rect width="18" height="18" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_1137_313)">
                            <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </a>
                  
                </div>
                <div className="swiper-pagination1" />
                {/* <div class="traffic_patrol-slider-buttons">
                                <div class="btn_prev">
                                    <img class="prev_img" src="media/images/modelPage/slider/arrow_green.svg" alt="btn_prev">
                                </div>
                                <div class="btn_next">
                                    <img class="next_img" src="media/images/modelPage/slider/arrow_green.svg" alt="btn_next">
                                </div>
                            </div> */}
              </div>
            </div>
            <div className="traffic_patrol-text-mobile-1">
              <p className="traffic_patrol-text">
                {/* Ежедневно 36&nbsp;экипажей Дорожного патруля ЦОДД курсируют по&nbsp;Москве. Задача&nbsp;&mdash; регулировать движение на&nbsp;сложных участках, помогать водителям при&nbsp;поломке или&nbsp;аварии */}
                {"\r\n                             Ежедневно 36 экипажей Дорожного патруля ЦОДД курсируют по Москве\r\n                        "}
              </p>
              <p className="traffic_patrol-text">
                {"\r\n                            Задача — регулировать движение на сложных участках, помогать водителям при поломке или аварии\r\n                        "}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="situation_centre" id="situation_centre">
        <div className="container_main">
          <div className="situation_centre_grid-wrapper">
            <div className="situation-1">
              <h1 className="situation_centre-title title">
                <span className="situation_centre-animation-1">
                  {"мобильный"}
                </span>
                <span className="situation_centre-animation-2">
                  {"ситуационный"}
                </span>
                <span className="situation_centre-animation-3">
                  {"центр"}
                </span>
              </h1>
            </div>
            <div className="brain_heart-2">
              <p className="brain_heart-title">
                {"Ситуационный центр ЦОДД — «мозг и сердце» Интеллектуальной транспортной системы Москвы"}
              </p>
              <p className="brain_heart-text">
                {"Отсюда 24/7 следят за движением на дорогах, управляют светофорами, координируют работу Дорожного патруля, собирают данные о трафике и заторах, выводят информацию на электронные табло, координируют разные службы при крупных ДТП и ЧП"}
              </p>
              <img src="media/images/mainPage/situationCenter/bus_vector.svg" alt="Ситуационный центр рама" />
            </div>
            <div className="major_events-3">
              <p className="major_events-text">
                {"Когда в городе проходят крупные мероприятия, и нужна максимальная оперативность, на месте работает мобильный Ситуационный центр. Полный аналог стационарного — только на колесах"}
              </p>
            </div>
            <div className="employ-4">
              <picture>
                <img src="media/images/mainPage/situationCenter/BusRight_skale.png" alt="Работник Мобильного Ситуационного центра" fetchPriority="high" className="employ" />
              </picture>
            </div>
            <div className="slider-5">
              <a className="garage_model_card" href="bus.html">
                <div className="slid_img">
                  <picture>
                    <img className="menu_preview-img" src="media/images/modelPage/slider/bus.png" alt="Ситуационный центр" fetchPriority="high" />
                  </picture>
                  <video className="menu_preview-video" src="media/video/bus.mp4" muted loop playsInline />
                </div>
                <div className="slid_info">
                  <div className="slid_info-desc">
                    <p className="slid_info-title">
                      {"Ситуационный центр"}
                    </p>
                    <p className="slid_info-text">
                      {"Автобус"}
                    </p>
                  </div>
                  <div className="slid_info-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                        <rect width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_1137_313)">
                        <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                      </g>
                    </svg>
                  </div>
                </div>
              </a>
            </div>
            <div className="bus-6">
              <picture>
                <img src="media/images/mainPage/situationCenter/BusLeft_skale.png" alt="Ситуационный центр" fetchPriority="high" className="bus" />
              </picture>
            </div>
            <div className="man_text-7">
              <p className="man_text-text">
                {"Мобильный Ситцентр построен на базе автобуса MAN. В его салоне размещены рабочие места для специалистов, зал совещаний, системы связи и проч. Он полностью автономен и может работать как во время стоянки, так и в движении"}
              </p>
            </div>
            <div className="man_plus_major_events-8">
              <p className="man_plus_major_events-text">
                {"Мобильный Ситцентр построен на базе автобуса MAN. В его салоне размещены рабочие места для специалистов, зал совещаний, системы связи и проч. Он полностью автономен и может работать как во время стоянки, так и в движении"}
              </p>
              <p className="man_plus_major_events-text">
                {"Когда в городе проходят крупные мероприятия, и нужна максимальная оперативность, на месте работает мобильный Ситуационный центр. Полный аналог стационарного — только на колесах"}
              </p>
            </div>
            <div className="employ_text">
              <div className="employ_text-wrapper">
                <div className="employ_text_img">
                  <picture>
                    <img src="media/images/mainPage/situationCenter/BusRight_skale.png" alt="Работник Мобильного Ситуационного центра" loading="lazy" decoding="async" className="employ" />
                  </picture>
                </div>
                <div className="employ_text_info">
                  <p className="employ_descr">
                    {"\r\n                                    Когда в городе проходят крупные мероприятия, и нужна максимальная оперативность, на месте работает мобильный Ситуационный центр. Полный аналог стационарного — только на колесах\r\n                                "}
                  </p>
                </div>
              </div>
            </div>
            <div className="bus_text">
              <div className="bus_text-wrapper">
                <div className="bus_text_img">
                  <picture>
                    <img src="media/images/mainPage/situationCenter/BusLeft_skale.png" alt="Ситуационный центр" loading="lazy" decoding="async" className="bus" />
                  </picture>
                </div>
                <div className="bus_text_info">
                  <p className="bus_descr">
                    {"\r\n                                    Мобильный Ситцентр построен на базе автобуса MAN. В его салоне размещены рабочие места для специалистов, зал совещаний, системы связи и проч. Он полностью автономен\r\n                                "}
                  </p>
                </div>
              </div>
            </div>
            <div className="employ_plus_bus_slider">
              <div className="situation_centre_slider-wrapper swiper2">
                <div className="situation_centre_slider swiper-wrapper">
                  <div className="situation_centre-card swiper-slide">
                    <div className="slid_img">
                      <picture>
                        <img src="media/images/mainPage/situationCenter/BusRight_skale.png" alt="Работник Мобильного Ситуационного центра" fetchPriority="high" className="employ" />
                      </picture>
                    </div>
                    <div className="slid_info">
                      <p className="slider-text">
                        {"\r\n                                            Когда в городе проходят крупные мероприятия, и нужна максимальная оперативность, на месте работает мобильный Ситуационный центр. Полный аналог стационарного — только на колесах\r\n                                        "}
                      </p>
                    </div>
                  </div>
                  <div className="situation_centre-card swiper-slide">
                    <div className="slid_img">
                      <picture>
                        <img src="media/images/mainPage/situationCenter/BusLeft_skale.png" alt="Ситуационный центр" fetchPriority="high" className="bus" />
                      </picture>
                    </div>
                    <div className="slid_info">
                      <p className="slider-text">
                        {"\r\n                                            Мобильный Ситцентр построен на базе автобуса MAN. В его салоне размещены рабочие места для специалистов, зал совещаний, системы связи и проч. Он полностью автономен\r\n                                        "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="swiper-pagination2" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="water_patrol" id="water_patrol">
        <div className="container_main">
          <div className="water_patrol_grid-wrapper">
            <div className="water_patrol_title">
              <h1 className="water_patrol-title title">
                <span className="water_patrol-animation-1">
                  {"водный"}
                </span>
                <span className="water_patrol-animation-2">
                  {"патруль"}
                </span>
              </h1>
            </div>
            <div className="water_patrol_card parentCardForLargeMonitor">
              <a className="garage_model_card" href="kater.html">
                <div className="slid_img">
                  <picture>
                    <img className="menu_preview-img" src="media/images/modelPage/slider/kater.png" alt="Катер" fetchPriority="high" />
                  </picture>
                  <video className="menu_preview-video" src="media/video/kater.mp4" muted loop playsInline />
                </div>
                <div className="slid_info">
                  <div className="slid_info-desc">
                    <p className="slid_info-title">
                      {"Водный патруль"}
                    </p>
                    <p className="slid_info-text">
                      {"Катер"}
                    </p>
                  </div>
                  <div className="slid_info-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                        <rect width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_1137_313)">
                        <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                      </g>
                    </svg>
                  </div>
                </div>
              </a>
            </div>
            <div className="water_patrol_history">
              <div className="water_patrol_history_top">
                <p className="water_patrol_history-title">
                  {"Водный патруль ЦОДД начал свою работу весной 2022 года"}
                </p>
                <p className="water_patrol_history-text">
                  {"Зеленый катер ежедневно патрулирует акваторию города"}
                </p>
              </div>
              <p className="water_patrol_history-text">
                {"В его задачи входит фиксация нарушений движения и стоянки в акватории, оперативное взаимодействие с контрольно-надзорными и правоохранительными органами, проведение профилактических бесед о правилах поведения на воде"}
              </p>
            </div>
            <div className="water_patrol_text_1">
              <p className="water_patrol-text">
                {"У каждого члена экипажа есть жилет, а на катере — все необходимое для связи между судоводителями и Речным ситуационном центром ЦОДД, а также для навигации. Еще на катере есть спасательный круг, аптечка, багор и линь"}
              </p>
            </div>
            <div className="water_patrol_text_2">
              <p className="water_patrol-text">
                {"За прошлый летний сезон Водный патруль прошел 17 тысяч километров. Совместно с Речным ситуационном центром зафиксировали 136 событий с признаками нарушений"}
              </p>
            </div>
            <div className="water_patrol_text_mobile">
              <p className="water_patrol-text">
                {"У каждого члена экипажа есть жилет, а на катере — все необходимое для связи между судоводителями и Речным ситуационном центром ЦОДД, а также для навигации. Еще на катере есть спасательный круг, аптечка, багор и линь"}
              </p>
              <p className="water_patrol-text">
                {"За прошлый летний сезон Водный патруль прошел 17 тысяч километров. Совместно с Речным ситуационном центром зафиксировали 136 событий с признаками нарушений"}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="velo_patrol" id="velo_patrol">
        <div className="container_main">
          <div className="velo_patrol_grid-wrapper">
            <div className="velo_patrol_title">
              <h1 className="velo_patrol-title title">
                <span className="velo_patrol-animation-1">
                  {"велопатруль"}
                </span>
              </h1>
            </div>
            <div className="velo_patrol_about">
              <p className="velo_patrol_about-subtitle">
                {"Когда наступает теплый сезон, в Москве начинает работать велопатруль"}
              </p>
              <div className="velo_patrol_about-descr">
                <div className="velo_patrol_about-text">
                  {"Это сотрудники ЦОДД на велосипедах, которые ездят по улицам столицы и помогают всем участникам дорожного движения"}
                </div>
                <div className="velo_patrol_about-text">
                  {"Патрульные объезжают всю территорию Москвы в пределах МКАД. Суммарный дневной пробег всех патрульных — порядка 350 км"}
                </div>
              </div>
            </div>
            <div className="velo_patrol_text_1">
              <p>
                {"Велопатруль оборудован всем необходимым для оперативной помощи на дороге: аптечкой и водой, ремонтным комплектом для велосипеда, огнетушителем, бланками европротокола. Сотрудники знают, как помочь в экстренной ситуации и оказать доврачебную помощь"}
              </p>
            </div>
            <div className="velo_patrol_text_2">
              <p>
                {"Патруль следит за дорожной инфраструктурой: состоянием знаков, светофоров, навигационных стел, велопарковок и проч. Кроме того, в обязанности велопатруля входит освобождать велополосы, тротуары и пешеходные переходы от припаркованных автомобилей"}
              </p>
            </div>
            <div className="velo_patrol_text_mobile">
              <p>
                {"Велопатруль оборудован всем необходимым для оперативной помощи на дороге: аптечкой и водой, ремонтным комплектом для велосипеда, огнетушителем, бланками европротокола. Сотрудники знают, как помочь в экстренной ситуации и оказать доврачебную помощь"}
              </p>
              <p>
                {"Патруль следит за дорожной инфраструктурой: состоянием знаков, светофоров, навигационных стел, велопарковок и проч. Кроме того, в обязанности велопатруля входит освобождать велополосы, тротуары и пешеходные переходы от припаркованных автомобилей"}
              </p>
            </div>
            <div className="velo_patrol_card parentCardForLargeMonitor">
              <a className="garage_model_card" href="velo.html">
                <div className="slid_img">
                  <picture>
                    <img className="menu_preview-img" src="media/images/modelPage/slider/velo.png" alt="Патрульный пикап" fetchPriority="high" />
                  </picture>
                  <video className="menu_preview-video" src="media/video/velo.mp4" muted loop playsInline />
                </div>
                <div className="slid_info">
                  <div className="slid_info-desc">
                    <p className="slid_info-title">
                      {"Велопатруль"}
                    </p>
                    <p className="slid_info-text">
                      {"Велосипед"}
                    </p>
                  </div>
                  <div className="slid_info-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                        <rect width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_1137_313)">
                        <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                      </g>
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="help_desk" id="help_desk">
        <div className="container_main">
          <div className="help_desk_grid-wrapper">
            <div className="help_desk-1">
              <h1 className="help_desk-title title">
                <span className="help_desk-animation-1">
                  {"служба"}
                </span>
                <span className="help_desk-animation-2">
                  {"помощи"}
                </span>
              </h1>
            </div>
            <div className="parkon_border parkon-2">
              <p className="parkon_title">
                {"Создана на базе мобильных комплексов фотовидеофиксации"}
              </p>
              {/* <div class="parkon_descr">
                            <p class="parkon_text">137 автомобилей патрулируют город 24/7 и&nbsp;приезжают к&nbsp;водителям, которые попали в&nbsp;ДТП или столкнулись со&nbsp;сложностями на&nbsp;дороге</p>
                            <p class="parkon_text">На&nbsp;машинах установлены камеры, которые автоматически следят за&nbsp;соблюдением ПДД, а&nbsp;также распознают транспорт, который находится в&nbsp;розыске</p>
                        </div> */}
              <p className="parkon_text">
                {"137 автомобилей патрулируют город 24/7 и приезжают к водителям, которые попали в ДТП или столкнулись со сложностями на дороге"}
              </p>
            </div>
            <div className="parkon_border parkon-2_tablet">
              <p className="parkon_title">
                {"Создана на базе мобильных комплексов фотовидеофиксации"}
              </p>
              <p className="parkon_text">
                {"137 автомобилей патрулируют город 24/7 и приезжают к водителям, которые попали в ДТП или столкнулись со сложностями на дороге. На машинах установлены камеры, которые автоматически следят за соблюдением ПДД, а также распознают транспорт, который находится в розыске"}
              </p>
            </div>
            <div className="parkon_border parkon-2_mobile">
              <p className="parkon_title">
                {"Создана на базе мобильных комплексов фотовидеофиксации"}
              </p>
              <div className="parkon_text_wrapper">
                <p className="parkon_text">
                  {"137 автомобилей патрулируют город 24/7 и приезжают к водителям, которые попали в ДТП или столкнулись со сложностями на дороге"}
                </p>
                <p className="parkon_text">
                  {"На машинах установлены камеры, которые автоматически следят за соблюдением ПДД, а также распознают транспорт, который находится в розыске"}
                </p>
              </div>
            </div>
            {/* <div class="driver-3">
                        <p class="driver_text">Мониторит состояние дорожной инфраструктуры. Следит за&nbsp;знаками, светофорами и&nbsp;прочими объектами</p>
                        <p class="driver_text">С&nbsp;2023 года автопарк Службы помощи пополнился электрическими кроссоверами Москвич&nbsp;3е</p>
                    </div> */}
            <div className="driver-3">
              <p className="driver_text">
                {"На машинах установлены камеры, которые автоматически следят за соблюдением ПДД, а также распознают транспорт, который находится в розыске"}
              </p>
              <p className="driver_text">
                {"Мониторит состояние дорожной инфраструктуры. Следит за знаками, светофорами и прочими объектами"}
              </p>
            </div>
            <div className="driver-tablet-1">
              <p className="driver_text">
                {"Мониторит состояние дорожной инфраструктуры. Следит за знаками, светофорами и прочими объектами"}
              </p>
            </div>
            <div className="driver-tablet-2">
              <p className="driver_text">
                {"С 2023 года автопарк Службы помощи пополнился электрическими кроссоверами Москвич 3е"}
              </p>
            </div>
            <div className="mobile_text_combo">
              <p className="mobile_text_combo-text">
                {"Мониторит состояние дорожной инфраструктуры. Следит за знаками, светофорами и прочими объектами"}
              </p>
              <p className="mobile_text_combo-text">
                {"С 2023 года автопарк Службы помощи пополнился электрическими кроссоверами Москвич 3е"}
              </p>
            </div>
            
            <div className="slide-moskvich parentCardForLargeMonitor">
              <a className="garage_model_card" href="moskvich.html">
                <div className="slid_img">
                  <picture>
                    <img className="menu_preview-img" src="media/images/modelPage/slider/moskvich.png" alt="Служба помощи ЦОДД" fetchPriority="high" />
                  </picture>
                  <video className="menu_preview-video" src="media/video/moskvich.mp4" muted loop playsInline />
                </div>
                <div className="slid_info">
                  <div className="slid_info-desc">
                    <p className="slid_info-title">
                      {"Служба помощи"}
                    </p>
                    <p className="slid_info-text">
                      {"Кроссовер"}
                    </p>
                  </div>
                  <div className="slid_info-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <mask id="mask0_1137_313" style={{ "maskType": "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                        <rect width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_1137_313)">
                        <path d="M4.80049 13.5L3.75049 12.45L10.9505 5.25H4.50049V3.75H13.5005V12.75H12.0005V6.3L4.80049 13.5Z" fill="#090909" />
                      </g>
                    </svg>
                  </div>
                </div>
              </a>
            </div>
            
          </div>
        </div>
      </section>
    </main>
    <footer className="footer_main">
      <div className="container_main">
        <div className="footer_main_grid-wrapper">
          <div className="footer-title-1">
            <div className="header__logo">
              <img className="header__logo-img" src="media/images/logo/header_logo.svg" alt="logo" />
              <p className="header__logo-text">
                {"Гараж ЦОДД"}
              </p>
            </div>
          </div>
          <div className="footer-menu-2">
            <div className="footer-menu-wrapper">
              <div className="footer-menu-links">
                <a href="#traffic_patrol" className="footer-menu-link">
                  {"Дорожный патруль"}
                </a>
                <a href="#situation_centre" className="footer-menu-link">
                  {"Мобильный ситуационный центр"}
                </a>
                <a href="#water_patrol" className="footer-menu-link">
                  {"Водный патруль"}
                </a>
                <a href="#velo_patrol" className="footer-menu-link">
                  {"Велопатруль"}
                </a>
                <a href="#help_desk" className="footer-menu-link">
                  {"Служба помощи"}
                </a>
              </div>
            </div>
          </div>
          <div className="footer-contacts-3">
            <a className="contacts-1" href="https://gucodd.ru/?utm-source=garage_codd" target="_blank" rel="noopener">
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
              <p className="contact-link">
                {"Сайт ЦОДД"}
              </p>
            </a>
            <a className="contacts-2" href="tel:74955395454">
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
              <p className="contact-link">
                {"+7 (495) 539-54-54"}
              </p>
            </a>
            <a className="contacts-3" href="mailto:codd@transport.mos.ru">
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
              <p className="contact-link">
                {"codd@transport.mos.ru"}
              </p>
            </a>
          </div>
          <div className="footer-media-4">
            <a className="media-wrapper" href="https://vk.com/mosroad/?utm-source=garage_codd" target="_blank" rel="noopener">
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
              <img className="media-img" src="media/images/mainPage/footer/media_vk.svg" alt="vk" />
            </a>
            <a className="media-wrapper" href="https://t.me/DtRoad/?utm-source=garage_codd" target="_blank" rel="noopener">
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
              <img className="media-img" src="media/images/mainPage/footer/media_telegram.svg" alt="telegram" />
            </a>
            <a className="media-wrapper" href="tel:3210">
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-2" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-3" />
              <img src="media/images/modelPage/arrows/corner.svg" alt="стрелки" className="corner-4" />
              <img className="media-img" src="media/images/mainPage/footer/media_tel.svg" alt="Телефон" />
            </a>
          </div>
        </div>
      </div>
      <a className="secure_transportation" href="https://ictransport.ru/?utm-source=garage_codd" target="_blank" rel="noopener">
        <div className="secure_transportation__logo">
          <img src="media/images/logo/save_logo.svg" alt="Безопасный транспорт" />
        </div>
        <p className="secure_transportation__text">
          {"Сайт разработан Инновационным центром «Безопасный транспорт»"}
        </p>
      </a>
    </footer>
    </>
  );
}

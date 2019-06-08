// import 'jquery';

import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/collapse';

import '@fancyapps/fancybox';

// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel';

import Swiper from 'swiper';


import 'whatwg-fetch';
import noUiSlider from 'nouislider';
import YandexMapsLoader from 'ymaps';

import iconPoint from './../img/map-point.svg';

$.fancybox.defaults.closeExisting = true;
$.fancybox.defaults.lang = 'ru';
$.fancybox.defaults.i18n.ru = {
  CLOSE: 'Закрыть',
  NEXT: 'Вперед',
  PREV: 'Назад',
  ERROR: 'Запрашиваемый контент не может быть загружен. <br/> Пожалуйста, повторите позднее.',
  PLAY_START: 'Начать слайд-шоу',
  PLAY_STOP: 'Остановить слайд-шоу',
  FULL_SCREEN: 'На полный экран',
  THUMBS: 'Thumbnails',
  DOWNLOAD: 'Скачать',
  SHARE: 'Поделиться',
  ZOOM: 'Увеличить',
};

// import 'nouislider/distribute/nouislider.css';
const watch = ({
                 target = window,
                 propertyName,
                 onChange,
                 value = target[propertyName],
               }) => {
  Object.defineProperty(target, propertyName, {
    get: () => {
      return value;
    },
    set: (newValue) => {
      if (newValue !== value) {
        value = newValue;
        onChange(value);
      }
    },
  });
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

class Menu {
  constructor() {
    this.isOpen = false;
    this.menuButton = document.querySelector('.menu-button');
    this.menu = document.querySelector('.header__nav');

    this.menuButton.addEventListener('click', this.toggleMenu);
  };

  toggleMenu = () => {
    if (!this.isOpen) {
      this.menuButton.classList.add('active');
      this.menu.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
    } else {
      this.menuButton.classList.remove('active');
      this.menu.classList.remove('active');
      document.body.style.overflow = '';
      this.isOpen = false;
    }
  };
}

class Calculator {
  constructor() {
    this.calcElem = document.querySelectorAll('.js-calc-item');
    this.calcTotalEl = document.querySelector('.calculator-card__total-value');

    // window.fitText(this.calcTotalEl);

    this.valueArray = [];

    this.init();
  }

  init() {

    Object.values(app.calculator.data).map((el) => {
      const inputEl = document.getElementById(el.id).querySelector('.calculator-card__range');
      const valueEl = document.getElementById(el.id).querySelector('.calculator-card__val');

      noUiSlider.create(inputEl, {
        start: el.value || 0,
        step: el.step || 1,
        connect: [true, false],
        range: {
          'min': el.min || 0,
          'max': el.max || 10000,
        },
        cssPrefix: 'input-range',
        cssClasses: {
          target: '',
          base: '__base',
          origin: '__origin',
          handle: '__handle',
          handleLower: '__handle_lower',
          handleUpper: '__handle_upper',
          touchArea: '__touch-area',
          horizontal: '_horizontal',
          vertical: '_vertical',
          background: '__background',
          connect: '__connect',
          connects: '__connects',
          ltr: '_ltr',
          rtl: '_rtl',
          draggable: '_draggable',
          drag: '_state-drag',
          tap: '_state-tap',
          active: '__active',
          tooltip: '__tooltip',

          // // Шкала
          // pips: '__pips',
          // pipsHorizontal: '__pips_horizontal',
          // pipsVertical: '__pips_vertical',
          //
          // // Деления на шкале
          // marker: '__marker',
          // markerHorizontal: '__marker_horizontal',
          // markerVertical: '__marker_vertical',
          // markerNormal: '__marker_normal',
          // markerLarge: '__marker_large',
          // markerSub: '__marker_sub',
          //
          // // Значения на шкале
          // value: '__value',
          // valueHorizontal: '__value_horizontal',
          // valueVertical: '__value_vertical',
          // valueNormal: '__value_normal',
          // valueLarge: '__value_large',
          // valueSub: '__value_sub',
        },
      });

      inputEl.noUiSlider.on('update', value => (el.value = Number(value)));

      watch({
        target: el,
        propertyName: 'value',
        onChange: this.recalculate,
      });

      el.inputEl = inputEl;
      el.valueEl = valueEl;
    });

    this.recalculate();
  }

  // setVelues() {
  //   const totalEl = document.getElementById(app.calculator.total.id);
  //   totalEl.innerText = Calculator.convertToType(app.calculator.total.formula(), app.calculator.total.type);
  // }

  recalculate() {
    Object.values(app.calculator.data).map((el) => {
      if (!el.valueEl) return;
      el.valueEl.innerText = Calculator.convertToType(el.convert ? el.convert(el.value) : el.value, el.type);
    });

    document.getElementById(app.calculator.total.id).innerText = Calculator.convertToType(app.calculator.total.formula(), app.calculator.total.type);
  }

  static convertToType(value, type) {
    if (!type) {
      return value.toLocaleString();
    }

    return `${value.toLocaleString()} ${Calculator.declOfNum(value, app.units[type])}`;
  }

  static declOfNum(n, titles) {
    if (typeof n !== 'number') {
      n = parseInt(n, 10);
    }

    if (typeof titles === 'string' || titles.length !== 3) {
      return titles;
    }

    return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
  }
}

function sendForm(event) {
  event.preventDefault();
  event.stopPropagation();

  const form = event.target;

  fetch(form.getAttribute('action') || '/form.php', {
    method: form.getAttribute('method') || 'POST',
    body: new FormData(form),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      form.reset();

      $.fancybox.open({
        src: '#thanks',
        type: 'inline',
      });


      if (window.yaCounter53509429) window.yaCounter53509429.reachGoal('order');
      if (window.gtag) gtag('event', 'order', { event_category: 'lead' });
    })
    .catch((error) => {
      // alert('Ошибка при отправке. Пожалуйста, повторите позднее');
      console.log(error);
    });
}

ready(() => {
  new Menu();
  new Calculator();


  const mapContainer = document.getElementById('footer-map');

  if (mapContainer) {
    YandexMapsLoader.load('https://api-maps.yandex.ru/2.1/?lang=ru_RU').then(Maps => {
        const map = new Maps.Map(mapContainer, app.mapOptions);

        // const placemark = new Maps.Placemark(map.getCenter(), {}, {
        //   iconLayout: 'default#image',
        //   iconImageHref: require('../img/map-point.svg'),
        //   iconImageSize: [47, 63],
        //   iconImageOffset: [-23, -65],
        // });
        const placemark = new Maps.Placemark(map.getCenter());

        map.geoObjects.add(placemark);
      })
      .catch(error => console.log('Failed to load Yandex Maps', error));
  }

  // const formList = document.querySelectorAll('form');
  //
  // [...formList].map.addEventListener('submit', function(event) {
  // });

  $('form').on('submit', sendForm);

  const mySwiper = new Swiper('.swiper-container', {
    loop: true,
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    // slidesPerView: 3,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 280,
      modifier: 1,
      slideShadows: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // $('.s-reviews__slider').owlCarousel({
  //   loop: true,
  //   margin: 10,
  //   nav: true,
  //   autoWidth:true,
  //   // items: 3,
  // });
});

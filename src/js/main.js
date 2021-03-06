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

class Calculator {
  constructor() {
    if (typeof app === 'undefined' || !document.querySelector('.calculator-card')) {
      return;
    }
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

class Header {
  constructor() {

    this.$header = $('.header');
    this.$menuButton = $('[data-menu="button"]');
    this.$dropdownLink = $('[data-menu="dropdown"]');
    this.$dropdownBody = $('[data-menu="second-level"]');

    this.headerControl();
    document.addEventListener('scroll', this.headerControl);


    this.$menuButton.on('click', (event) => {
      event.preventDefault();

      if (this.$menuButton.hasClass('menu-button_back')) { // Назад
        this.$dropdownBody.removeClass('active');
        this.$dropdownLink.removeClass('active');
        this.$header.removeClass('header_open-menu');
        this.$menuButton.removeClass('menu-button_back');

      } else if (this.$menuButton.hasClass('menu-button_active')) { // Закрыть меню
        this.closeMenu();

      } else { // Открыть меню
        this.openMenu();
      }
    });


    this.$dropdownLink.on('click', (event) => {
      event.preventDefault();

      const selector = event.currentTarget.getAttribute('data-src');

      if ($(selector).hasClass('active')) {
        $(selector).removeClass('active');
        $(event.currentTarget).removeClass('active');
        this.$header.removeClass('header_open-menu');
        this.$menuButton.removeClass('menu-button_back');
      } else {
        this.$dropdownBody.removeClass('active');
        $(selector).addClass('active');

        this.$dropdownLink.removeClass('active');
        $(event.currentTarget).addClass('active');

        this.$header.addClass('header_open-menu');
        this.$menuButton.addClass('menu-button_back');
      }
    });
  }

  headerControl = () => {
    if (window.scrollY > 200) {
      this.$header.addClass('header_compact');
    } else {
      this.$header.removeClass('header_compact');
    }
  };

  closeMenu() {
    this.$menuButton.removeClass('menu-button_active');
    this.$header.removeClass('header_active');
    $('html').removeClass('noscroll');
  }

  openMenu() {
    this.$menuButton.addClass('menu-button_active');
    this.$header.addClass('header_active');
    $('html').addClass('noscroll');
  }
}

function initMap(id) {
  YandexMapsLoader
    .load(app.mapOptions.url)
    .then((Maps) => {
      const myPlacemark = new Maps.Placemark(
        app.mapOptions.center,
        {
          iconCaption: 'ArtMoney',
        },
        {
          preset: 'islands#icon',
          iconColor: '#75c045',
        },
      );

      const map = new Maps.Map(id, {
        center: app.mapOptions.center,
        zoom: app.mapOptions.zoom,
        controls: app.mapOptions.controls,
      });

      map.geoObjects.add(myPlacemark);
    })
    .catch(error => console.log('Failed to load Yandex Maps', error));
}

ready(() => {
  new Calculator();
  new Header();

  if (document.getElementById('map')) {
    initMap('map');
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

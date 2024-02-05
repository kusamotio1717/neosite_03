// const $ = require('jquery');
import jump from 'jump.js';
import { easeOutExpo } from 'ez.js';
import Splide from '@splidejs/splide';
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
gsap.registerPlugin(CSSRulePlugin);
import { CustomEase } from "gsap/CustomEase";

class MyFunc {
  /**
   * タッチデバイス判定
   */
  hasTouchScreen() {
    if (navigator.maxTouchPoints > 0) {
      return true;
    }
    if (window.matchMedia('(pointer:coarse)').matches) {
      return true;
    }
    return false;
  }
  /**
   * メディアクエリでスマホサイズを判定
   */
  mediaSp() {
    let val;
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    handle();
    mediaQuery.addEventListener('change', handle);
    function handle() {
      if (mediaQuery.matches) {
        val = true;
      } else {
        val = false;
      }
    }
    return val;
  }

  slider(){
    const arrowEl = document.querySelector('.splide-arrow') as HTMLElement;
    const widthXL = Number(getComputedStyle(arrowEl).getPropertyValue("--widthXL").replace(/[^0-9]/g, '')) - 1;
    const widthLG = Number(getComputedStyle(arrowEl).getPropertyValue("--widthLG").replace(/[^0-9]/g, '')) - 1;
    const widthTab = Number(getComputedStyle(arrowEl).getPropertyValue("--widthTab").replace(/[^0-9]/g, '')) - 1;
    
    const splide = new Splide( '.splide', {
      type     : 'loop',
      focus    : 'center',
      autoWidth: true,
      padding: { right: '60%' },
      updateOnMove: true,
      pagination: false,
      drag: true,
      arrows: false,
      breakpoints: {
        [widthXL]: {
          padding: { right: 'calc(50% + (50% - 540px))' },
        },
        [widthLG]: {
          padding: { right: 'calc(50% + (50% - 520px))' },
        },
        [widthTab]: {
          perPage: 1,
          padding: '30%',
          autoWidth: false,
          gap: 30,
        },
      }
    } );

    splide.on( 'resized', () => {
      this.adjustArrow()
    } );

    splide.mount();

    arrowEl.addEventListener('click', function(){
      splide.go('+1');
    });

  };

  adjustArrow(){
    const splideEl = document.querySelector('.splide') as HTMLElement;
    const arrowEl = document.querySelector('.splide-arrow') as HTMLElement;
    const activeEl = document.querySelector('.splide__slide.is-active.is-visible');
    
    const activeElWidth = activeEl.clientWidth;
    let splideElWidth = splideEl.clientWidth;
    const val = splideElWidth * 0.4 + splideElWidth * 0.4 - activeElWidth + 80;

    arrowEl.style.right = `${val}px`;
  }

  /**
   * スムーススクロール
   */
  smoothScroll() {
    const _this = this;
    const aEl = document.querySelectorAll('a');
    aEl.forEach((a) => {
      a.addEventListener('click', function (e) {
        _this.scrollEvent(this, e);
      });
    });
  }

  /**
   * スクロールイベント
   * @param aEl aタグ
   * @param e click event
   */
  scrollEvent(aEl?: HTMLElement, e?: any) {
    if (aEl != null) {
      let href = aEl.getAttribute('href');

      if (href != undefined) {
        // lightboxなどリンク以外のa対策;
        if (href.match('#')) {
          const firstbite = href.slice(0, 1);
          // hrefが'#'から始まってたらそのまま格納、そうでなければ加工して格納
          let hrefStr = href;
          if (firstbite === '#') {
            hrefStr = href;
          } else {
            // 絶対パスで同じURLをたたいた時に対応（Wordpress対策）
            const spl = href.split('#');
            const url = location.href;
            const urlSpr = url.split('#');
            // 最後に'/'がついてて一致しないときがあるため検査(必要ならこっちに変更)
            // let lastStr = urlSpr[0].slice(-1);
            // let urlString = lastStr === '/' ? urlSpr[0].slice(0,-1) : urlSpr[0];
            const urlString = urlSpr[0];
            // ルートパスに対応
            const pathname = location.pathname;

            if (spl[0] === urlString || spl[0] === pathname) {
              hrefStr = '#' + spl[1];
            } else {
              hrefStr = '';
            }
          }
          if (hrefStr) {
            this.move(hrefStr);
            /* 移動先が#とか''以外ならハッシュ付け替え */
            //ハッシュがいる場合はこっちに変更
            // if(!(href === '')&&!(href === '#')){
            // 	history.pushState(null, null, href);
            // }else{
            //   e.preventDefault();
            // }
            e.preventDefault();
          }
        }
      }
    } else {
      const hash = location.hash;
      if (hash != '' && hash.length) {
        this.move(hash);
      }
    }
  }

  move(hash: string) {
    const speed = 700;
    const target = hash === '#' || hash === '' ? 'body' : hash;
    const targetEl = document.getElementById(target.replace('#', '')) || 'body';
    if (!targetEl) {
      return false;
    }
    // ヘッダー分の調整;
    const offset = this.mediaSp() ? 0 : 0;

    jump(target, {
      duration: speed,
      offset: offset,
      callback: undefined,
      easing: easeOutExpo,
      a11y: false,
    });
    return false;
  }

  /**
   * スマホはtelクラスで電話番号にリンクがつくように
   */
  spPhoneLink() {
    if (this.hasTouchScreen()) {
      const telEl = document.querySelectorAll('.tel');
      telEl.forEach(function (e) {
        const str = e.innerHTML;
        const aHtml = document.createElement('a') as any;
        if (e.children.length && e.children[0].tagName === 'IMG') {
          const telnumber = e?.children?.[0].getAttribute('alt')?.replace(/-/g, '');
          aHtml.innerHTML = str;
          aHtml.setAttribute('href', 'tel:' + telnumber);
          e.textContent = '';
          e.insertAdjacentElement('afterbegin', aHtml);
        } else {
          const telnumber = e.innerHTML.replace(/-/g, '');
          aHtml.innerHTML = str;
          aHtml.setAttribute('href', 'tel:' + telnumber);
          e.textContent = '';
          e.insertAdjacentElement('afterbegin', aHtml);
        }
      });
    }
  }

  /**
   * ドロワーメニュー ボタンクリック
   */
  drawerMenu() {
    const btn = document.querySelector('.dwMenu');
    const gNavi = document.querySelector('.gNavi');

    if (!btn) {
      return false;
    }
    // createFilter();

    function createFilter() {
      const container = document.querySelector('#container');
      container?.insertAdjacentHTML('afterbegin', '<div class="filter"></div>');
    }
    function toggleClass() {
      if (!document.body.classList.contains('dwMenu-active')) {
        document.body.classList.add('dwMenu-active');
        btn.setAttribute('aria-expanded', 'true');
        gNavi.setAttribute('aria-hidden', 'false');
      } else {
        document.body.classList.remove('dwMenu-active');
        btn.setAttribute('aria-expanded', 'false');
        gNavi.setAttribute('aria-hidden', 'true');
      }
    }

    const targetEl = [btn, document.querySelector('.filter')];
    targetEl.forEach((el) => {
      el?.addEventListener('click', function () {
        toggleClass();
      });
    });
  }

  /**
   * スクロールでクラス付け
   */
  scrollBodyClass() {
    const val = this.mediaSp() ? 30 : 100; //どれだけスクロールした時にクラスがつくか
    const scrolltop = window.scrollY;
    if (scrolltop > val) {
      document.body.classList.add('is-scroll');
    } else {
      document.body.classList.remove('is-scroll');
    }
  }

  isAndroidBodyClass() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Android') > 0) {
      document.body.classList.add('is-android');
    }
  }

  numberShowAnimation() {
    const targetEl = document.querySelectorAll('.js-show');
    gsap.set(targetEl, { 
      opacity: 0,
      transform: 'matrix(4.02, -1.39, -1.21, 2.26, 315, 139)'
    })
    targetEl.forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
        },
        opacity: 1,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        duration: .3,
      });
    });
  }
}

const myFunc = new MyFunc();
window.addEventListener('load', function () {
  myFunc.smoothScroll();
  myFunc.drawerMenu();
  myFunc.scrollBodyClass();
  myFunc.spPhoneLink();
  myFunc.scrollEvent();
  myFunc.isAndroidBodyClass();
  myFunc.slider();
  myFunc.numberShowAnimation();
});

// window.addEventListener('resize', function () {
// });
window.addEventListener('scroll', function () {
  myFunc.scrollBodyClass();
});

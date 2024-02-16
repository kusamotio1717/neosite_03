// const $ = require('jquery');
import jump from 'jump.js';
import { easeOutExpo } from 'ez.js';
import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { CSSRulePlugin } from 'gsap/CSSRulePlugin';
gsap.registerPlugin(CSSRulePlugin);
import { ArrowPositionExtension } from './ArrowPositionExtension';

let toolkitFilterType = 'ul';

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

  getMediaQuery() {
    const widthXL = Number(
      getComputedStyle(document.body)
        .getPropertyValue('--widthXL')
        .replace(/[^0-9]/g, '')
    );
    const widthLG = Number(
      getComputedStyle(document.body)
        .getPropertyValue('--widthLG')
        .replace(/[^0-9]/g, '')
    );
    const widthTab =
      Number(
        getComputedStyle(document.body)
          .getPropertyValue('--widthTab')
          .replace(/[^0-9]/g, '')
      ) - 1;
    return { widthXL, widthLG, widthTab };
  }

  slider() {
    const splideEl = document.getElementById('slider1');
    if (!splideEl) {
      return false;
    }
    const widthTab = this.getMediaQuery().widthTab;

    const splide = new Splide('#slider1', {
      type: 'loop',
      focus: 0,
      autoWidth: true,
      padding: { left: '5%' },
      updateOnMove: true,
      pagination: false,
      cloneStatus: false,
      gap: 50,
      arrowPositionExtension: {
        offsetLeft: -30,
      },
      breakpoints: {
        [widthTab]: {
          focus: 'center',
          padding: { left: '10%', right: '10%' },
          gap: '15%',
          arrowPositionExtension: {
            offsetLeft: -20,
          },
        },
      },
    });

    splide.mount({
      ArrowPositionExtension,
    });
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
        btn?.setAttribute('aria-expanded', 'true');
        gNavi?.setAttribute('aria-hidden', 'false');
      } else {
        document.body.classList.remove('dwMenu-active');
        btn?.setAttribute('aria-expanded', 'false');
        gNavi?.setAttribute('aria-hidden', 'true');
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
      transform: 'matrix(4.02, -1.39, -1.21, 2.26, 315, 139)',
    });
    targetEl.forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
        },
        opacity: 1,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        duration: 0.3,
      });
    });
  }

  accordion() {
    const accordion = document.querySelectorAll('.js-accordion');

    let openAnimation = [
      { height: '0', opacity: '0' },
      { height: '0', opacity: '1' },
    ];
    let closeAnimation = [
      { height: '0', opacity: '1' },
      { height: '0', opacity: '0' },
    ];
    let animationOption = {
      duration: 300,
      fill: 'both',
      easing: 'ease-in-out',
    };

    let closeAnimationOption;
    let openAnimationOption;
    let accordionFlg = true;

    const accordionToggle = (accordionItem, e?) => {
      if (accordionFlg) {
        e.preventDefault(); //summaryだとアニメーションせずにすぐ閉じてしまうので、デフォルトの動きを無効化する
        accordionFlg = false;
        let accordionContent = accordionItem.querySelector('.js-accordion-content');
        let contentHeight;

        if (accordionItem.classList.contains('is-open')) {
          //閉じる
          closeAnimation[0]['height'] = contentHeight + 'px';
          closeAnimationOption = accordionContent.animate(closeAnimation, animationOption);
          //アニメーションが終わったら
          closeAnimationOption.finished.then((anim) => {
            if (anim.playState) {
              accordionItem.classList.remove('is-open');
              accordionFlg = true;
            }
          });
          //ボタンのテキストを「開く」に戻す
          const btn = accordionItem.querySelector('.js-accordion-more');
          btn.textContent = btn.getAttribute('data-open');
        } else {
          //開く
          accordionItem.open = true;
          //アコーディオンコンテンツの高さを取得
          contentHeight = accordionItem.querySelector('.js-accordion-content-inner').clientHeight;

          openAnimation[1]['height'] = contentHeight + 'px';
          openAnimationOption = accordionContent.animate(openAnimation, animationOption);
          //アニメーションが終わったら
          openAnimationOption.finished.then((anim) => {
            if (anim.playState) {
              accordionItem.classList.add('is-open');
              accordionFlg = true;
            }
          });
          //ボタンのテキストを「閉じる」に変更
          const btn = accordionItem.querySelector('.js-accordion-more');
          btn.textContent = btn.getAttribute('data-close');
        }
      }
    };

    accordion.forEach((accordionItem) => {
      const title = accordionItem.querySelector('.js-accordion-title');
      title.addEventListener('click', (e) => {
        accordionToggle(accordionItem, e);
      });
      if (accordionItem.hasAttribute('open')) {
        accordionToggle(accordionItem);
      }
    });
  }

  tabChange() {
    const tabWrap = document.querySelector<HTMLElement>('.js-tab-wrap');
    if (!tabWrap) {
      return false;
    }
    const tabContentsWrap = tabWrap.querySelector<HTMLElement>('.js-tabContents-wrap');
    const tabs = tabWrap.querySelectorAll('.js-tabone');
    const tabContents = tabWrap.querySelectorAll<HTMLElement>('.js-tabContents');

    const contentHeights = [...tabContents].map((tabContent) => tabContent.clientHeight);
    const contentStyle = getComputedStyle(tabContentsWrap);

    clickTab_lsr(tabWrap.querySelector<HTMLElement>('.js-tabone.is-current'));

    tabs.forEach((tab) => {
      tab.addEventListener('click', function (e) {
        tabs.forEach((t) => t.classList.remove('is-current'));
        const target = e.target as HTMLElement;
        clickTab_lsr(target);
      });
    });

    function clickTab_lsr(target: HTMLElement) {
      if (!tabWrap) {
        return false;
      }

      //targetのid属性を取得する
      const tabId = target.getAttribute('id');
      target.classList.add('is-current');

      tabContents.forEach((tabContent) => {
        //tabContentのクラスにtabIDを含んでいたら
        if (tabContent.classList.contains(tabId)) {
          tabContent.classList.add('is-current');
        } else {
          tabContent.classList.remove('is-current');
        }
      });

      //高さを変える
      const index = Array.from(tabs).indexOf(target);
      const padding =
        Number(contentStyle.paddingTop.replace('px', '')) + Number(contentStyle.paddingBottom.replace('px', ''));
      tabContentsWrap.style.height = `${contentHeights[index] + padding}px`;
    }
  }

  sliderAuto() {
    const splideEl = document.getElementById('slider2');
    if (!splideEl) {
      return false;
    }
    const splide = new Splide('#slider2', {
      type: 'loop',
      focus: 'center',
      pagination: false,
      arrows: false,
      cloneStatus: false,
      autoWidth: true,
      drag: false,
      autoScroll: {
        pauseOnHover: false,
        speed: 2,
      },
    });

    splide.mount({
      AutoScroll,
    });
  }

  changeToolFilterType() {
    let isChange = false;
    let type = 'ul';
    const widthLG = this.getMediaQuery().widthLG;
    if (widthLG > window.innerWidth) {
      type = 'select';
    }
    if (toolkitFilterType !== type) {
      isChange = true;
      type = toolkitFilterType;
    }
    return { type, isChange };
  }

  // ulをselectに変換
  convertSelect() {
    const widthLG = this.getMediaQuery().widthLG;
    const jsConvert = document.querySelector('.js-convert');
    if (!jsConvert) {
      return false;
    }
    const jsConvertUl = jsConvert?.querySelector('.js-convert-ul');
    if (widthLG > window.innerWidth) {
      const selectEl = document.querySelector('.js-converted-select');
      if (selectEl) {
        return false;
      }
      const optionItemsEl = jsConvert?.querySelectorAll<HTMLElement>('.js-convert-option');
      const optionItemsTextArr = Array.from(optionItemsEl).map((el) => el.textContent);
      const dataIndexes = Array.from(optionItemsEl).map((el) => el.closest('button').dataset.index);
      const newSelectEl = document.createElement('select');
      newSelectEl.classList.add('js-converted-select');
      newSelectEl.setAttribute('aria-hidden', 'true');
      newSelectEl.setAttribute('tabindex', '-1');
      newSelectEl.setAttribute('aria-label', '選択してください');
      newSelectEl.innerHTML = optionItemsTextArr
        .map((text, i) => {
          return `<option value="${dataIndexes[i]}">${text}</option>`;
        })
        .join('');
      jsConvertUl.classList.add('is-hidden');
      jsConvert?.appendChild(newSelectEl);
    } else {
      const selectEl = jsConvert?.querySelector('.js-converted-select');
      if (!selectEl) {
        return false;
      }
      selectEl.remove();
      jsConvertUl?.classList.remove('is-hidden');
    }
  }

  toolkitFilter() {
    const toolkitFilter = document.querySelector<HTMLElement>('.js-toolkit-filter');
    if (!toolkitFilter) {
      return false;
    }

    const li = toolkitFilter.querySelectorAll('li');
    const select = toolkitFilter.querySelector<HTMLSelectElement>('.js-converted-select');

    if (!select) {
      li.forEach((el) => {
        const btn = el.querySelectorAll('button');

        btn.forEach((btnEl) => {
          const classStr = btnEl.classList;
          if (classStr.contains('is-active')) {
            const defaultIndex = btnEl.dataset.index;
            filtering(defaultIndex);
          }
          btnEl.addEventListener('click', function () {
            const index = this.dataset.index;
            filtering(index);
            li.forEach((el) => {
              const childBtn = el.querySelector('button');
              childBtn.classList.remove('is-active');
            });
            btnEl.classList.add('is-active');
          });
        });
      });
    } else {
      filtering('1');
      select.addEventListener('change', function () {
        const index = this.value;
        filtering(index);
      });
    }

    function filtering(index: string) {
      const panels = document.querySelector('.js-filter-panels');
      const panelItems = panels?.querySelectorAll<HTMLElement>('.js-filter-panel');
      panelItems.forEach((el) => {
        el.classList.remove('is-active');
        const arr = el.dataset.filter?.split(',');
        if (arr?.includes(index)) {
          el.classList.add('is-active');
        }
      });
    }
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
  myFunc.accordion();
  myFunc.tabChange();
  myFunc.sliderAuto();
  myFunc.convertSelect();
  myFunc.toolkitFilter();
});

window.addEventListener('resize', function () {
  myFunc.tabChange();
  myFunc.changeToolFilterType();
});
window.addEventListener('scroll', function () {
  myFunc.scrollBodyClass();
});

import type { Splide, Components, Options, BaseComponent } from '@splidejs/splide';

interface ArrowPositionExtensionOptions {
  disable?: boolean;
  offsetLeft?: number;
}

declare module '@splidejs/splide' {
  interface Options {
    arrowPositionExtension?: ArrowPositionExtensionOptions;
  }
}

export function ArrowPositionExtension(Splide: Splide, Components: Components, options: Options): BaseComponent {
  function mount() {
    Splide.on('resized', () => {
      if (options.arrowPositionExtension?.disable) return;
      adjustArrow();
    });

    Splide.on('mounted', () => {
      if (options.arrowPositionExtension?.disable) return;
      adjustArrow();
    });
  }

  function adjustArrow() {
    const arrowEl = Components.Elements.next;
    const activeElIndex = Components.Controller.getIndex();
    const activeElWidth = Components.Layout.slideSize(activeElIndex);
    const positionL = Components.Slides.getAt(activeElIndex).slide.getBoundingClientRect().left;
    const offset = options.arrowPositionExtension?.offsetLeft || 0;
    const val = positionL + activeElWidth + offset;

    arrowEl.style.left = `${val}px`;
  }

  return {
    mount,
  };
}

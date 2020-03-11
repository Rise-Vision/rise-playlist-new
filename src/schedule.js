/* eslint-disable no-console */
/* eslint-disable newline-after-var */
class DefaultTransition {

  reset(element) {
    if (element && element.style) {
      element.style.transition = "none";
      element.style.overflow = "hidden";
      element.style.opacity = 1;
      element.style.left = 0;
      element.style.top = 0;
      element.style.visibility = "hidden";

      element.classList = "";
    }
  }

  run(from, to) {
    this.reset(from);

    if (from && from.style) {
      from.stop();
      from.style.visibility = "hidden";
    }

    if (to && to.style) {
      to.play();
      to.style.visibility = "visible";
    }
  }
}

class FadeInTransition extends DefaultTransition {
  run(from, to) {

    to.play();

    to.style.visibility = "visible";
    to.style.opacity = 0;
    requestAnimationFrame(() => {
      to.style.transition = "opacity 1s";
      to.style.opacity = 1;
    });

    to.addEventListener("transitionend", () => {
      super.reset(from);
      from.stop();
    }, { once: true });
  }
}

class ZoomInTransition extends DefaultTransition {
  run(from, to) {

    to.play();

    to.style.visibility = "visible";
    to.style.transform = "scale(0)";
    requestAnimationFrame(() => {
      to.style.transition = "transform 1s";
      to.style.transform = "scale(1)";
    });

    to.addEventListener("transitionend", () => {
      super.reset(from);
      from.stop();
    }, { once: true });
  }
}

class HorizontalSlideTransition extends DefaultTransition {

  constructor(fromMultiplier, toMultiplier) {
    super();
    this.fromMultiplier = fromMultiplier;
    this.toMultiplier = toMultiplier;
  }

  run(from, to) {
    if (from) {
      from.style.left = "0px";
      requestAnimationFrame(() => {
        from.style.transition = "left 1s";
        from.style.left = `${this.fromMultiplier * from.parentElement.clientWidth}px`;
      });

      from.addEventListener("transitionend", () => {
        super.reset(from);
        from.stop();
      }, { once: true });
    }

    to.play();

    to.style.visibility = "visible";
    to.style.left = `${this.toMultiplier * to.parentElement.clientWidth}px`;

    requestAnimationFrame(() => {
      to.style.transition = "left 1s";
      to.style.left = "0px";
    });
  }
}

class SlideFromLeftTransition extends HorizontalSlideTransition  {
  constructor() {
    super(1, -1);
  }
}

class SlideFromRightTransition extends HorizontalSlideTransition  {
  constructor() {
    super(-1, 1);
  }
}

const transitions = {
  "normal": new DefaultTransition(),
  "fadeIn": new FadeInTransition(),
  "zoomIn": new ZoomInTransition(),
  "slideFromLeft": new SlideFromLeftTransition(),
  "slideFromRight": new SlideFromRightTransition()
}

class TransitionHandler {

  transition(from, to) {
    const transitionType = to.transitionType;
    const transition = transitions[transitionType];

    console.log(`RisePlaylist - transition ${from} ${to} ${transitionType}`);
    transition.run(from, to);
  }

}

class Schedule {
  constructor(transitionHandler = new TransitionHandler(), doneListener = () => {}) {
    this.transitionHandler = transitionHandler;
    this.doneListener = doneListener;
    this.items = [];
    this.playingItems = [];
    this.playingItem = null;
    this.firstItem = null;
    this.itemDurationTimer = null;
  }

  start() {
    this.reset();
    this.play();
  }

  stop() {
    this.reset();
    this.playingItems.forEach(item => {
      item.element.style.display = "none";
      item.element.stop();
    });
  }

  reset() {
    clearTimeout(this.itemDurationTimer);
    this.playingItem = null;
    this.firstItem = this.items ? this.items[0] : undefined;
    this.playingItems = this.items ? this.items.slice() : [];
  }

  play() {
    if (!this.playingItems || this.playingItems.length === 0) {
      return;
    }

    clearTimeout(this.itemDurationTimer);

    if (this.playingItem && this.playingItem.playUntilDone) {
      if (this.playingItem.element.isDone()) {
        this.playingItem.element.resetDone();
      } else {
        this.itemDurationTimer = setTimeout(() => this.play(), 1000);
        return;
      }
    }

    let nextItem = this.playingItems.shift();
    this.playingItems.push(nextItem);

    let previousItem = this.playingItem;
    this.playingItem = nextItem;

    if (!previousItem || previousItem !== nextItem) {
      const previousElement = previousItem ? previousItem.element : null;

      this.transitionHandler.transition(previousElement, nextItem.element);
    }

    if (previousItem && nextItem === this.firstItem) {
      this.doneListener();
    }

    this.itemDurationTimer = setTimeout(() => this.play(), nextItem.playUntilDone ? 1000 : nextItem.duration * 1000);
  }
}

export { Schedule, TransitionHandler };

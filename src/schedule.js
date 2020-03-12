/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable newline-after-var */
class DefaultTransition {

  constructor(durationInSeconds = 1) {
    this.durationInSeconds = durationInSeconds;
  }

  reset(element) {
    if (element && element.style) {
      element.style.transition = "none";
      element.style.overflow = "hidden";
      element.style.opacity = 1;
      element.style.left = 0;
      element.style.top = 0;
      element.style.transform = "none"
      element.style.visibility = "hidden";

      element.classList = "";
    }
  }

  run(from, to) {
    this.onTransitionStart(from, to);

    this.animate(from, to);

    setTimeout(() => this.onTransitionEnd(from, to), this.durationInSeconds * 1000);
  }

  animate(from, to) {
    to.style.visibility = "hidden";
    requestAnimationFrame(() => {
      to.style.transition = `visibility ${this.durationInSeconds}s`;
      to.style.visibility = "visible";
    });
  }

  onTransitionStart(from, to) {
    to.play();
  }

  onTransitionEnd(from, to) {
    if (from) {
      this.reset(from);
      from.stop();
    }
  }
}

class FadeInTransition extends DefaultTransition {
  animate(from, to) {
    to.style.visibility = "visible";
    to.style.opacity = 0;
    requestAnimationFrame(() => {
      to.style.transition = "opacity 1s";
      to.style.opacity = 1;
    });
  }
}

class ZoomInTransition extends DefaultTransition {
  animate(from, to) {
    to.style.visibility = "visible";
    to.style.transform = "scale(0)";
    requestAnimationFrame(() => {
      to.style.transition = "transform 1s";
      to.style.transform = "scale(1)";
    });
  }
}

class HorizontalSlideTransition extends DefaultTransition {

  constructor(fromMultiplier, toMultiplier) {
    super();
    this.fromMultiplier = fromMultiplier;
    this.toMultiplier = toMultiplier;
  }

  animate(from, to) {
    if (from) {
      from.style.left = "0px";
      requestAnimationFrame(() => {
        from.style.transition = "left 1s";
        from.style.left = `${this.fromMultiplier * from.parentElement.clientWidth}px`;
      });
    }

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

class VerticalSlideTransition extends DefaultTransition {

  constructor(fromMultiplier, toMultiplier) {
    super();
    this.fromMultiplier = fromMultiplier;
    this.toMultiplier = toMultiplier;
  }

  animate(from, to) {
    if (from) {
      from.style.top = "0px";
      requestAnimationFrame(() => {
        from.style.transition = "top 1s";
        from.style.top = `${this.fromMultiplier * from.parentElement.clientHeight}px`;
      });
    }

    to.style.visibility = "visible";
    to.style.top = `${this.toMultiplier * to.parentElement.clientHeight}px`;
    requestAnimationFrame(() => {
      to.style.transition = "top 1s";
      to.style.top = "0px";
    });
  }
}

class SlideFromBottomTransition extends VerticalSlideTransition  {
  constructor() {
    super(-1, 1);
  }
}

class SlideFromTopTransition extends VerticalSlideTransition  {
  constructor() {
    super(1, -1);
  }
}

const transitions = {
  "normal": new DefaultTransition(),
  "fadeIn": new FadeInTransition(),
  "zoomIn": new ZoomInTransition(),
  "slideFromLeft": new SlideFromLeftTransition(),
  "slideFromRight": new SlideFromRightTransition(),
  "slideFromBottom": new SlideFromBottomTransition(),
  "slideFromTop": new SlideFromTopTransition()
}

class TransitionHandler {

  transition(from, to) {
    const transitionType = to.transitionType;
    const transition = transitions[transitionType];

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

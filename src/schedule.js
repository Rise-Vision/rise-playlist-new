/* eslint-disable newline-after-var */
class DefaultTransition {
  run(from, to) {
    if (from && from.style) {
      from.style.display = "none";
    }

    if (to && to.style) {
      to.style.display = "block";
    }
  }
}

class FadeInTransition {
  run(from, to) {
    if (from && from.style) {
      from.style.display = "none";
    }

    to.style.display = "block";
    to.style.opacity = 0;
    requestAnimationFrame(() => {
      to.style.transition = "opacity 1s";
      to.style.opacity = 1;
    });
  }
}

class ZoomInTransition {
  run(from, to) {
    if (from && from.style) {
      from.style.display = "none";
    }

    to.style.display = "block";
    to.style.transform = "scale(0)";
    requestAnimationFrame(() => {
      to.style.transition = "transform 1s";
      to.style.transform = "scale(1)";
    });
  }
}

const transitions = {
  "normal": new DefaultTransition(),
  "fadeIn": new FadeInTransition(),
  "zoomIn": new ZoomInTransition()
}

class TransitionHandler {

  transition(from, to) {
    if (from) {
      from.stop();
    }

    if (to) {
      to.play();
    }

    const transition = transitions[from ? from.transitionType : "normal"];
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

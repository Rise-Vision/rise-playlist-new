/* eslint-disable newline-after-var */

class TransitionHandler {

  transition(from, to) {
    if (from && from.style) {
      from.style.display = "none";
    }

    if (to && to.style) {
      to.style.display = "block";
    }
  }

}

class Schedule {
  constructor(transitionHandler = new TransitionHandler()) {
    this.transitionHandler = transitionHandler;
    this.items = [];
    this.playingItem = null;
    this.itemDurationTimer = null;
  }

  start() {
    this.stop();
    this.play();
  }

  stop() {
    clearTimeout(this.itemDurationTimer);
    this.playingItem = null;
  }

  play() {
    clearTimeout(this.itemDurationTimer);

    let nextItem = this.items.shift();
    this.items.push(nextItem);

    let previousItem = this.playingItem;
    this.playingItem = nextItem;

    if (!previousItem || previousItem !== nextItem) {
      const previousElement = previousItem ? previousItem.element : null;

      this.transitionHandler.transition(previousElement, nextItem.element);
    }

    this.itemDurationTimer= setTimeout(() => this.play(), nextItem.duration * 1000);
  }
}

export { Schedule, TransitionHandler };

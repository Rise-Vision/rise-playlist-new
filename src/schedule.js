/* eslint-disable newline-after-var */

class TransitionHandler {

  transition(from, to) {
    if (from && from.style) {
      from.style.display = "none";
      from.stop();
    }

    if (to && to.style) {
      to.style.display = "block";
      to.play();
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
    this.reset();
    this.play();
  }

  stop() {
    this.reset();
    this.items.forEach(item => {
      item.element.style.display = "none";
      item.element.stop();
    });
  }

  reset() {
    clearTimeout(this.itemDurationTimer);
    this.playingItem = null;
  }

  play() {
    if (!this.items || this.items.length === 0) {
      return;
    }

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

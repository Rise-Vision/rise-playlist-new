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

    this.itemDurationTimer= setTimeout(() => this.play(), nextItem.duration * 1000);
  }
}

export { Schedule, TransitionHandler };

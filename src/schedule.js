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

    setTimeout(() => this.onTransitionEnd(from), this.durationInSeconds * 1000);
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

  onTransitionEnd(from) {
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
      to.style.transition = `opacity ${this.durationInSeconds}s`;
      to.style.opacity = 1;
    });
  }
}

class ZoomInTransition extends DefaultTransition {
  animate(from, to) {
    to.style.visibility = "visible";
    to.style.transform = "scale(0)";
    requestAnimationFrame(() => {
      to.style.transition = `transform ${this.durationInSeconds}s`;
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
        from.style.transition = `left ${this.durationInSeconds}s`;
        from.style.left = `${this.fromMultiplier * from.parentElement.clientWidth}px`;
      });
    }

    to.style.visibility = "visible";
    to.style.left = `${this.toMultiplier * to.parentElement.clientWidth}px`;
    requestAnimationFrame(() => {
      to.style.transition = `left ${this.durationInSeconds}s`;
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
        from.style.transition = `top ${this.durationInSeconds}s`;
        from.style.top = `${this.fromMultiplier * from.parentElement.clientHeight}px`;
      });
    }

    to.style.visibility = "visible";
    to.style.top = `${this.toMultiplier * to.parentElement.clientHeight}px`;
    requestAnimationFrame(() => {
      to.style.transition = `top ${this.durationInSeconds}s`;
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

class StripesTransition extends DefaultTransition {
  animate(from, to) {

    const overlay = document.createElement("div");

    overlay.style.position = "absolute";
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";

    this.setUpBackground(overlay);

    to.appendChild(overlay);

    to.style.visibility = "visible";

    this.animateStripes(overlay);
  }

  animateStripes(overlay) {
    let animationId = null, step = 0, frames = 60;

    function animateStep() {
      step = step + 1;
      let percent = step / frames;

      overlay.style.setProperty("--step", `${(percent*100).toFixed(2)}%`);

      if(!(step % frames)) {
        cancelAnimationFrame(animationId);
        overlay.remove();
        return;
      }

      animationId = requestAnimationFrame(animateStep);
    }

    animateStep();
  }

  setUpBackground() { }
}

class VerticalStripesTransition extends StripesTransition {

  setUpBackground(overlay) {
    overlay.style.background = "linear-gradient(90deg, #00000000 var(--step, 0%), #000000ff 0)";
    overlay.style.backgroundSize = "10%";
    overlay.style.backgroundRepeat = "repeat-x";
  }

}

class HorizontalStripesTransition extends StripesTransition {

  setUpBackground(overlay) {
    overlay.style.background = "linear-gradient(to bottom, #00000000 var(--step, 0%), #000000ff 0)";
    overlay.style.backgroundSize = "100% 10%";
    overlay.style.backgroundRepeat = "repeat-y";
  }

}

const transitions = {
  "normal": new DefaultTransition(),
  "fadeIn": new FadeInTransition(),
  "zoomIn": new ZoomInTransition(),
  "slideFromLeft": new SlideFromLeftTransition(),
  "slideFromRight": new SlideFromRightTransition(),
  "slideFromBottom": new SlideFromBottomTransition(),
  "slideFromTop": new SlideFromTopTransition(),
  "stripesVertical": new VerticalStripesTransition(),
  "stripesHorizontal": new HorizontalStripesTransition()
}

class TransitionHandler {

  transition(from, to) {
    this.getTransitionObject(to).run(from, to);
  }

  reset(element) {
    this.getTransitionObject(element).reset(element);
  }

  getTransitionObject(element) {
    const transitionType = element.transitionType;

    return transitions[transitionType];
  }

}

class Schedule {
  constructor(transitionHandler = new TransitionHandler(), doneListener = () => {}) {
    this.transitionHandler = transitionHandler;
    this.doneListener = doneListener;
    this.doneIsCalled = false;
    this.items = [];
    this.playingItems = [];
    this.playingItem = null;
    this.firstItem = null;
    this.itemDurationTimer = null;
    this.startTime = null;
  }

  start() {
    this.startTime = new Date();
    this.reset();
    this.play();
  }

  stop() {
    this.reset();
    this.playingItems.forEach(item => {
      this.transitionHandler.reset(item.element);
      item.element.stop();
    });
  }

  reset() {
    clearTimeout(this.itemDurationTimer);
    this.playingItem = null;
    this.firstItem = this.items ? this.items[0] : undefined;
    this.playingItems = this.items ? this.items.slice() : [];
    this.doneIsCalled = false;
  }

  play() {
    console.log("schedule.play");

    if (!this.playingItems || this.playingItems.length === 0) {
      console.log("Playlist is empty");
      setTimeout(() => this._sendDoneEvent(), 1000);
      return;
    }

    clearTimeout(this.itemDurationTimer);

    let allTemplatesReturnedError = this.playingItems.every(item => item.element.isError());

    if (allTemplatesReturnedError) {
      // this condition occurs when Viewer runs without Player in the Shared Schedules mode
      // and all embedded templates have unsupported components like Video or Financial
      console.log("All templates faild to load");
      setTimeout(() => this._sendDoneEvent(), 1000);
      return;
    }

    const PLAYLIST_LOAD_TIMEOUT_MS = 30000;
    let allTemplatesNotReady = this.playingItems.every(item => item.element.isNotReady());

    if (allTemplatesNotReady && (new Date().getTime() - this.startTime.getTime()) > PLAYLIST_LOAD_TIMEOUT_MS) {
      console.log("Playlist timed out");
      this._sendDoneEvent();
      return;
    }

    if (this.playingItem && this.playingItem.playUntilDone &&
      !this.playingItem.element.isDone()) {
        this.itemDurationTimer = setTimeout(() => this.play(), 1000);
        return;
    }

    let nextItem = this.playingItems.shift();
    let previousItem = this.playingItem;

    this.playingItems.push(nextItem);

    if (previousItem && nextItem === this.firstItem) {
      this._sendDoneEvent();
    }

    if (nextItem.element.isNotReady() || nextItem.element.isError()) {
      console.log(`${nextItem.element.id} is not ready`);
      this.itemDurationTimer = setTimeout(() => this.play(), 1000);
      return;
    }

    this.playingItem = nextItem;

    if (!previousItem || previousItem !== nextItem) {
      const previousElement = previousItem ? previousItem.element : null;

      this.transitionHandler.transition(previousElement, nextItem.element);
    }

    this.itemDurationTimer = setTimeout(() => this.play(), nextItem.playUntilDone ? 1000 : nextItem.duration * 1000);
  }

  _sendDoneEvent() {
    //call done only once
    if (!this.doneIsCalled) {
      this.doneIsCalled = true;
      this.doneListener();
    }
  }

}

export { Schedule, TransitionHandler };

import { html } from "@polymer/polymer";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { RiseElement } from "rise-common-component/src/rise-element.js";
import { version } from "./rise-playlist-version.js";
import { Schedule } from "./schedule.js";

export class RisePlaylistItem extends RiseElement {

  static get template() {
    return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
          position: absolute;
          visibility: hidden;
          top: 0px;
          left: 0px;
        }
      </style>
      <slot></slot>
    `;
  }

  static get properties() {
    return {
      duration: {
        type: Number,
        value: 10
      },
      playUntilDone: {
        type: Boolean,
        value: false
      },
      transitionType: {
        type: String,
        value: "normal"
      }
    }
  }

  constructor() {
    super();
    this._done = false;
    this._isPlaying = false;
    this._isReady = false;
    this._isError = false;
  }

  ready() {
    super.ready();
    if (this.firstElementChild) {
      // Skip unsupported Shared Schedule components (i.e. rise-video)
      if (RisePlayerConfiguration && RisePlayerConfiguration.Helpers.isSharedSchedule()
          && this.firstElementChild.tagName.toLowerCase() === "rise-video") {
        this._isError = true;
        return;
      }
      if (this.playUntilDone) {
        this.firstElementChild.addEventListener("report-done", () => this._setDone());
      }

      this.firstElementChild.addEventListener("rise-components-ready", () => this._setReady());
      this.firstElementChild.addEventListener("rise-components-error", () => this._isError = true);

      RisePlayerConfiguration.Helpers.sendStartEvent( this.firstElementChild );
    }
  }

  _setReady() {
    this._isReady = true;
    console.log(`item is ready. ID=${this.id}`);
  }

  isNotReady() {
    return !this._isReady;
  }

  isError() {
    return this._isError;
  }

  _setDone() {
    if (this._isPlaying) {
      this._done = true;
    }
  }

  isDone() {
    return this._done;
  }

  play() {
    this._done = false;
    this._sendEventToChild(RiseElement.EVENT_RISE_PRESENTATION_PLAY);
    this._isPlaying = true;
  }

  stop() {
    this._sendEventToChild(RiseElement.EVENT_RISE_PRESENTATION_STOP);
    this._isPlaying = false;
  }

  _sendEventToChild(eventName) {
    if (this.firstElementChild) {
      console.log(`dispatching ${eventName}. ID=${this.id}`);
      this.firstElementChild.dispatchEvent(new Event(eventName));
    }
  }

}

customElements.define("rise-playlist-item", RisePlaylistItem);

export default class RisePlaylist extends RiseElement {

  static get template() {
    return html`
      <style>
        :host {
          position: relative;
          overflow: hidden;
          display: block;
          height: 100%;
          width: 100%;
        }
        #previewPlaceholder {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: #F2F2F2;
        }
        #previewPlaceholder svg {
          height: 120px;
          width: 100%;
        }
        #previewPlaceholder h1 {
          color: #020620;
          font-size: 48px;
          text-transform: initial;
          font-family: Helvetica, Arial, sans-serif;
        }
      </style>
      <template is="dom-if" if="{{isInEditor()}}">
      <div id="previewPlaceholder">
        <svg viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="1.-Atoms" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Desktop/Icons" transform="translate(-423.000000, -1232.000000)" fill="#020620" fill-rule="nonzero">
                  <g id="icon-embedded-templates" transform="translate(423.000000, 1232.000000)">
                      <path d="M55,0 C57.6887547,0 59.8818181,2.12230671 59.9953805,4.78311038 L60,5 L60,55 C60,57.6887547 57.8776933,59.8818181 55.2168896,59.9953805 L55,60 L5,60 C2.3112453,60 0.118181885,57.8776933 0.00461951385,55.2168896 L0,55 L0,5 C0,2.3112453 2.12230671,0.118181885 4.78311038,0.00461951385 L5,0 L55,0 Z M53.75,32.5 L33.75,32.5 C33.0596441,32.5 32.5,33.0596441 32.5,33.75 L32.5,33.75 L32.5,53.75 C32.5,54.4403559 33.0596441,55 33.75,55 L33.75,55 L53.75,55 C54.4403559,55 55,54.4403559 55,53.75 L55,53.75 L55,33.75 C55,33.0596441 54.4403559,32.5 53.75,32.5 L53.75,32.5 Z" id="Shape"></path>
                  </g>
              </g>
          </g>
        </svg>
        <h1>Embedded Presentation</h1>
      </div>
      </template>
      <slot></slot>
    `;
  }

  static get properties() {
    return {
      items: {
        type: Array,
        observer: "_itemsChanged"
      }
    }
  }

  constructor() {
    super();
    this._isPlaying = false;
    this.schedule = new Schedule();
    this.schedule.doneListener = () => this._onScheduleDone();
    this._setVersion( version );
  }

  isInEditor() {
    return RisePlayerConfiguration && RisePlayerConfiguration.Helpers.isEditorPreview();
  }

  _handleRisePresentationPlay() {
    super._handleRisePresentationPlay();

    this._startSchedule();
  }

  _handleRisePresentationStop() {
    super._handleRisePresentationStop();

    this._stopSchedule();
  }

  _startSchedule() {
    if (!this.isInEditor()) {
      this._isPlaying = true;
      this.schedule.start();
    }
  }

  _stopSchedule() {
    this._isPlaying = false;
    this.schedule.stop();
  }

  _onScheduleDone() {
    if (this.hasAttribute("play-until-done")) {
      super._sendDoneEvent(true);
    }
  }

  _removeAllItems() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  _itemsChanged(items) {
    this._removeAllItems();

    const validItems = items.filter(item => {
      return item.element && item.element.tagName && item.element.tagName !== "";
    });

    let itemIndex = 0;

    validItems.map(item => {
      itemIndex++;

      let playListItemId = this.id + "_" + itemIndex;

      const playListItem = document.createElement("rise-playlist-item");

      playListItem.setAttribute("id", playListItemId);

      if (item["duration"]) {
        playListItem.setAttribute("duration", item["duration"]);
      }

      if (item["play-until-done"]) {
        playListItem.setAttribute("play-until-done", item["play-until-done"]);
      }

      if (item["transition-type"]) {
        playListItem.setAttribute("transition-type", item["transition-type"]);
      }

      const element = document.createElement(item.element.tagName);

      element.setAttribute("id", playListItemId + "_" + item.element.tagName);

      Object.entries(item.element.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });

      playListItem.appendChild(element);

      return playListItem;
    }).forEach(element => {
      this.appendChild(element);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._observer = new FlattenedNodesObserver(this, (info) => {

      const playlistItems = info.addedNodes.filter(node => node.tagName === "RISE-PLAYLIST-ITEM");

      playlistItems.forEach(element => {
        const scheduleItem = {
          duration: parseInt(element.getAttribute("duration"), 10) || 10,
          playUntilDone: element.hasAttribute("play-until-done"),
          element
        };

        this.schedule.items.push(scheduleItem);
      });

      this.schedule.items = this.schedule.items.filter(item => !info.removedNodes.includes(item.element));

      if (this._isPlaying) {
        this._startSchedule();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
  }

}

customElements.define("rise-playlist", RisePlaylist);

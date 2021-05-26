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
          display: none;
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
      <div id="previewPlaceholder">
        <svg width="66px" height="58px" viewBox="0 0 66 58" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>47836883-D56E-4B18-9A67-FA2E3150D764@1x</title>
          <g id="1.-Atoms" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Desktop/Icons" transform="translate(-80.000000, -1789.000000)" fill="#020620" fill-rule="nonzero">
              <g id="list-bullets-1" transform="translate(80.000000, 1789.000000)">
                <path d="M23.1818182,9.90909091 L62.7272727,9.90909091 C64.2335039,9.90909091 65.4545455,8.68804932 65.4545455,7.18181818 C65.4545455,5.67558705 64.2335039,4.45454545 62.7272727,4.45454545 L23.1818182,4.45454545 C21.675587,4.45454545 20.4545455,5.67558705 20.4545455,7.18181818 C20.4545455,8.68804932 21.675587,9.90909091 23.1818182,9.90909091 Z" id="Path"></path>
                <path d="M62.7272727,26.2727273 L23.1818182,26.2727273 C21.675587,26.2727273 20.4545455,27.4937689 20.4545455,29 C20.4545455,30.5062311 21.675587,31.7272727 23.1818182,31.7272727 L62.7272727,31.7272727 C64.2335039,31.7272727 65.4545455,30.5062311 65.4545455,29 C65.4545455,27.4937689 64.2335039,26.2727273 62.7272727,26.2727273 Z" id="Path"></path>
                <path d="M62.7272727,48.0909091 L23.1818182,48.0909091 C21.675587,48.0909091 20.4545455,49.3119507 20.4545455,50.8181818 C20.4545455,52.324413 21.675587,53.5454545 23.1818182,53.5454545 L62.7272727,53.5454545 C64.2335039,53.5454545 65.4545455,52.324413 65.4545455,50.8181818 C65.4545455,49.3119507 64.2335039,48.0909091 62.7272727,48.0909091 Z" id="Path"></path>
                <rect id="Rectangle" x="2.72727273" y="3.08545455" width="8.18181818" height="8.18181818" rx="1.5"></rect>
                <path d="M9.54545455,0.363636364 L4.09090909,0.363636364 C1.83156239,0.363636364 0,2.19519875 0,4.45454545 L0,9.90909091 C0,12.1684376 1.83156239,14 4.09090909,14 L9.54545455,14 C11.8048012,14 13.6363636,12.1684376 13.6363636,9.90909091 L13.6363636,4.45454545 C13.6363636,2.19519875 11.8048012,0.363636364 9.54545455,0.363636364 Z M10.9090909,9.90909091 C10.9090909,10.6622065 10.2985701,11.2727273 9.54545455,11.2727273 L4.09090909,11.2727273 C3.33779352,11.2727273 2.72727273,10.6622065 2.72727273,9.90909091 L2.72727273,4.45454545 C2.72727273,3.70142989 3.33779352,3.09090909 4.09090909,3.09090909 L9.54545455,3.09090909 C10.2985701,3.09090909 10.9090909,3.70142989 10.9090909,4.45454545 L10.9090909,9.90909091 Z" id="Shape"></path>
                <rect id="Rectangle" x="2.72727273" y="24.9036364" width="8.18181818" height="8.18181818" rx="1.5"></rect>
                <path d="M9.54545455,22.1818182 L4.09090909,22.1818182 C1.83156239,22.1818182 0,24.0133806 0,26.2727273 L0,31.7272727 C0,33.9866194 1.83156239,35.8181818 4.09090909,35.8181818 L9.54545455,35.8181818 C11.8048012,35.8181818 13.6363636,33.9866194 13.6363636,31.7272727 L13.6363636,26.2727273 C13.6363636,24.0133806 11.8048012,22.1818182 9.54545455,22.1818182 Z M10.9090909,31.7272727 C10.9090909,32.4803883 10.2985701,33.0909091 9.54545455,33.0909091 L4.09090909,33.0909091 C3.33779352,33.0909091 2.72727273,32.4803883 2.72727273,31.7272727 L2.72727273,26.2727273 C2.72727273,25.5196117 3.33779352,24.9090909 4.09090909,24.9090909 L9.54545455,24.9090909 C10.2985701,24.9090909 10.9090909,25.5196117 10.9090909,26.2727273 L10.9090909,31.7272727 Z" id="Shape"></path>
                <rect id="Rectangle" x="2.72727273" y="46.7218182" width="8.18181818" height="8.18181818" rx="1.5"></rect>
                <path d="M9.54545455,44 L4.09090909,44 C1.83156239,44 0,45.8315624 0,48.0909091 L0,53.5454545 C0,55.8048012 1.83156239,57.6363636 4.09090909,57.6363636 L9.54545455,57.6363636 C11.8048012,57.6363636 13.6363636,55.8048012 13.6363636,53.5454545 L13.6363636,48.0909091 C13.6363636,45.8315624 11.8048012,44 9.54545455,44 Z M10.9090909,53.5454545 C10.9090909,54.2985701 10.2985701,54.9090909 9.54545455,54.9090909 L4.09090909,54.9090909 C3.33779352,54.9090909 2.72727273,54.2985701 2.72727273,53.5454545 L2.72727273,48.0909091 C2.72727273,47.3377935 3.33779352,46.7272727 4.09090909,46.7272727 L9.54545455,46.7272727 C10.2985701,46.7272727 10.9090909,47.3377935 10.9090909,48.0909091 L10.9090909,53.5454545 Z" id="Shape"></path>
              </g>
            </g>
          </g>
        </svg>
        <h1>Playlist</h1>
      </div>
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
    this.schedule.logEvent = (...args) => this._logEvent(...args);
    this._setVersion( version );
  }

  _shouldNotRender() {
    return RisePlayerConfiguration && RisePlayerConfiguration.Helpers.isEditorPreview() && this.schedule.items.length === 0;
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
    this._isPlaying = true;
    if (this._shouldNotRender()) {
      this.$.previewPlaceholder.style.display = "flex";
    } else {
      this.$.previewPlaceholder.style.display = "none";
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

  _convertHyphensToCamelCase (string) {
    return string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
  }

  _setPropertiesNative( element, attributes ) {
    const updatedAttributes = {};

    Object.entries(attributes).forEach(([key, value]) => {
      updatedAttributes[this._convertHyphensToCamelCase(key)] = value;
    });

    console.log(`Setting attributes component=${element.tagName.toLowerCase()}, id=${element.id} to value`, updatedAttributes);

    element.setProperties(updatedAttributes);
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

      if (item["play-until-done"]) {
        element.setAttribute("play-until-done", item["play-until-done"]);
      }

      this._setPropertiesNative( element, item.element.attributes );

      playListItem.appendChild(element);

      return playListItem;
    }).forEach(element => {
      this.appendChild(element);
    });
  }

  _logEvent(type, event, details = null, additionalFields) {
    super.log(type, event, details, additionalFields);
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

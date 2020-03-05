/* eslint-disable no-console */
import { html } from "@polymer/polymer";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
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

  play() {
    this._sendEventToChildren("rise-playlist-play");
  }

  stop() {
    this._sendEventToChildren("rise-playlist-stop");
  }

  _sendEventToChildren(eventName) {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].dispatchEvent(new Event(eventName));
    }
  }

}

customElements.define("rise-playlist-item", RisePlaylistItem);

export default class RisePlaylist extends RiseElement {

  static get template() {
    return html`
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
    this.schedule = new Schedule();
    this._setVersion( version );
  }

  ready() {
    super.ready();

    this.addEventListener( "rise-presentation-play", () => this.schedule.start());
    this.addEventListener( "rise-presentation-stop", () => this.schedule.stop());
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

    validItems.map(item => {

      const playListItem = document.createElement("rise-playlist-item");

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

      const hideElement = element => {
        if (element.style) {
          element.style.display = "none";
        }
      };

      info.addedNodes.forEach(hideElement);

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
      this.schedule.start();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
  }

}

customElements.define("rise-playlist", RisePlaylist);

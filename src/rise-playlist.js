import { html } from "@polymer/polymer";
import { RiseElement } from "rise-common-component/src/rise-element.js";
import { version } from "./rise-playlist-version.js";

export default class RisePlaylist extends RiseElement {

  static get template() {
    return html`RisePlaylist`;
  }

  static get properties() {
    return {
      items: {
        type: Array
      }
    }
  }

  constructor() {
    super();

    this._setVersion( version );
  }

  ready() {
    super.ready();

    // eslint-disable-next-line no-console
    console.log(this.items);
  }
}

customElements.define("rise-playlist", RisePlaylist);

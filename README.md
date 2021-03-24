# rise-playlist [![Coverage Status](https://coveralls.io/repos/github/Rise-Vision/rise-playlist/badge.svg?branch=master)](https://coveralls.io/github/Rise-Vision/rise-playlist?branch=master)

`rise-playlist` is a Polymer 3 Web Component that renders a playlist of Rise components. The `rise-playlist` component renders `rise-playlist-item` components defined as child or as part of the `items` attribute.

#### Example

```
  <rise-playlist items='[{
          "duration": 1,
          "transition-type": "fadeIn",
          "element": {
            "tagName": "rise-embedded-template",
            "attributes": {
              "template-id": "a429c126-598d-4251-9c0e-b49821056608"
            }
          }
        }]'>
  </rise-playlist>
```

or

```
  <rise-playlist>
    <rise-playlist-item duration="5" transition-type="fadeIn">
      <rise-embedded-template id="first" template-id="ba89703cf3df3379b124b199a97dc37af354e3e1"></rise-embedded-template>
    </rise-playlist-item>
    <rise-playlist-item play-until-done transition-type="fadeIn">
      <rise-embedded-template id="second" template-id="24198274875578bed3a3282f19ebde588e540e86"></rise-embedded-template>
    </rise-playlist-item>
  </rise-playlist>
```

### Labels

The component may define a 'label' attribute that defines the text that will appear for this instance in the template editor.

This attribute holds a literal value, for example:

```
  <rise-playlist
    id="playlist"
    label="Embedded Template">
  </rise-playlist>
```

If it's not set, the label for the component defaults to "Embedded Template", which is applied via the [generate_blueprint.js](https://github.com/Rise-Vision/html-template-library/blob/master/generate_blueprint.js) file for a HTML Template build/deployment.

### Attributes

This component receives the following list of attributes:

- **id**: ( string / required ): Unique HTMLElement id.
- **items**: ( string / optional ): Playlist items.
- **label**: ( string / optional ): An optional label key for the text that will appear in the template editor. See 'Labels' section above.
- **non-editable**: ( empty / optional ): If present, it indicates this component is not available for customization in the template editor.


### Events

The component sends the following events:

- **_configured_**: The component has initialized what it requires to and is ready to handle a _start_ event.

## Built With
- [Polymer 3](https://www.polymer-project.org/)
- [Polymer CLI](https://github.com/Polymer/tools/tree/master/packages/cli)
- [WebComponents Polyfill](https://www.webcomponents.org/polyfills/)
- [npm](https://www.npmjs.org)

## Development

### Local Development Build
Clone this repo and change into this project directory.

Execute the following commands in Terminal:

```
npm install
npm install -g polymer-cli@1.9.7
npm run build
```

**Note**: If EPERM errors occur then install polymer-cli using the `--unsafe-perm` flag ( `npm install -g polymer-cli --unsafe-perm` ) and/or using sudo.

### Testing
You can run the suite of tests either by command terminal or interactive via Chrome browser.

#### Command Terminal
Execute the following command in Terminal to run tests:

```
npm run test
```

In case `polymer-cli` was installed globally, the `wct-istanbul` package will also need to be installed globally:

```
npm install -g wct-istanbul
```

#### Local Server
Run the following command in Terminal: `polymer serve`.

Now in your browser, navigate to:

```
http://127.0.0.1:8081/components/rise-playlist/demo/src/rise-playlist-dev.html
```

#### Demo project

A demo project showing how to use `rise-playlist`, `rise-playlist-item` and `rise-embedded-template` can be found in the `demo` folder.

Another option is using `example-playlist-component` as the scaffolding for a new template. This project can be found in https://github.com/Rise-Vision/html-template-library

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues, please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas, please post your thoughts to our [community](https://help.risevision.com/hc/en-us/community/topics), otherwise submit a pull request and we will do our best to incorporate it. Please be sure to submit corresponding E2E and unit tests where appropriate.

### Languages
If you would like to translate the user interface for this product to another language, please refer to the [common-i18n](https://github.com/Rise-Vision/common-i18n) repository.

## Resources
If you have any questions or problems, please don't hesitate to join our lively and responsive community at https://help.risevision.com/hc/en-us/community/topics.

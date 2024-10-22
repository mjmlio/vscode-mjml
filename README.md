# MJML

This is a fork of original @attilabuti VSC extension : (https://github.com/attilabuti/vscode-mjml)[https://github.com/attilabuti/vscode-mjml]

MJML preview, lint, compile for Visual Studio Code.

## Features

* Live preview for MJML files. Preview updates as you type. Preview based on [html-preview-vscode](https://github.com/tht13/html-preview-vscode).
* Inline errors (squiggle underlines). Linter based on [atom-linter-mjml](https://github.com/mjmlio/atom-linter-mjml).
* Export HTML file from MJML.
* Copy the result HTML to clipboard.
* Take a screenshot of the rendered MJML document.
* Send email with Nodemailer or Mailjet.
* Code snippets for MJML. Based on [mjml-syntax](https://github.com/mjmlio/mjml-syntax).
* Fetch official templates. Based on [mjml-app](https://github.com/mjmlio/mjml-app).
* Beautify MJML code.
* Migrate a template from MJML 3 to MJML 4.
* MJML syntax highlight. Based on [mjml-syntax](https://github.com/mjmlio/mjml-syntax).
* Built-in MJML documentation with `Try it live` support.

## It looks like this

![MJML Preview](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-preview.gif)

![MJML Lint](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-lint.gif)

## Installation

Press `F1`, type `ext install vscode-mjml`.

## Usage

Start command palette (with `Ctrl+Shift+P` or `F1`) and start typing `MJML`.

## Available commands

The following command is available:
* **MJML: Beautify** or **Format Document** Beautify MJML code.
* **MJML: Copy HTML** Copy the result HTML to clipboard.
* **MJML: Export HTML** Export HTML file from MJML.
* **MJML: Migrate** Migrate a template from MJML 3 to MJML 4.
* **MJML: Multiple Screenshots** Take multiple screenshots of the rendered MJML document.
* **MJML: Open Preview to the Side** Opens a preview in a column alongside the current document.
* **MJML: Screenshot** Take a screenshot of the rendered MJML document, and save it as a file.
* **MJML: Send Email** Send email with Nodemailer or Mailjet.
* **MJML: Template** Fetch official templates.
* **MJML: Documentation** open the MJML documentation.
* **MJML: Search in MJML documentation** search for the selected mj-element in the MJML documentation.
* **MJML: Version** Shows the version of MJML.

## Settings

| Name | Default | Description |
| --- | --- | --- |
| `mjml.autoPreview` | `false` | Automatically update preview when switching between MJML documents. |
| `mjml.beautifyHtmlOutput` | `false` | Beautify HTML output. (Works when `mjml.minifyHtmlOutput` aren't enabled.) |
| `mjml.beautify` | ` ` | Beautify options ([available options](https://github.com/beautify-web/js-beautify#options)). |
| `mjml.exportType` | `.html` | Specifies the file type of the output file. |
| `mjml.lintEnable` | `true` | Enable/disable MJML linter (requires restart). |
| `mjml.lintWhenTyping` | `true` | Whether the linter is run on type or on save. |
| `mjml.mailFromName` | ` ` | Sender name. |
| `mjml.mailRecipients` | ` ` | Comma separated list of recipients email addresses. |
| `mjml.mailSender` | ` ` | Sender email address. (Mailjet: must be a verified sender.) |
| `mjml.mailSubject` | ` ` | Email subject. |
| `mjml.mailer` | `mailjet` | Send email with Nodemailer or Mailjet. Possible values are 'nodemailer' and 'mailjet'. |
| `mjml.mailjetAPIKey` | ` ` | Mailjet API Key. |
| `mjml.mailjetAPISecret` | ` ` | Mailjet API Secret. |
| `mjml.minifyHtmlOutput` | `true` | Minify HTML output. |
| `mjml.nodemailer` | `{}` | Nodemailer configuration. Please see the [Nodemailer](https://nodemailer.com) documentation for more information. |
| `mjml.preserveFocus` | `true` | Preserve focus of Text Editor after preview open. |
| `mjml.screenshotQuality` | `75` | Screenshot quality. |
| `mjml.screenshotType` | `jpg` | Screenshot type. Possible values are 'png', 'jpg', and 'jpeg'. |
| `mjml.screenshotWidth` | `650` | Screenshot width. |
| `mjml.screenshotWidths` | `640,750` | Screenshot widths. |
| `mjml.updateWhenTyping` | `true` | Update preview when typing. |
| `mjml.previewBackgroundColor` | `#FFFFFF` | Preview background color. |
| `mjml.autoClosePreview` | `true` | Automatically close preview when all open MJML documents have been closed. |
| `mjml.showSaveDialog` | `false` | Show the save as dialog instead of input box. |
| `mjml.templateGallery` | `false` | Show the template gallery instead of quick pick. |
| `mjml.templateGalleryAutoClose` | `true` | Automatically close template gallery when selecting a template. |
| `mjml.switchOnSeparateFileChange` | `true` | Automatically switch previews when editing a different file. |
| `mjml.mjmlConfigPath` | ` ` | The path or directory of the .mjmlconfig (or .mjmlconfig.js) file (for custom components use) |


## Snippets

| Trigger | URL | Content |
| --- | --- | --- |
| `mjall` | [mj-all](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-attributes/README.md) | `<mj-all />` |
| `mjattributes` | [mj-attributes](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-attributes/README.md) | `<mj-attributes></mj-attributes>` |
| `mjbody` | [mj-body](https://github.com/mjmlio/mjml/blob/master/packages/mjml-body/README.md) | `<mj-body></mj-body>` |
| `mjbreakpoint` | [mj-breakpoint](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-breakpoint/README.md) | `<mj-breakpoint width="" />` |
| `mjbutton` | [mj-button](https://github.com/mjmlio/mjml/blob/master/packages/mjml-button/README.md) | `<mj-button></mj-button>` |
| `mjcarousel` | [mj-carousel](https://github.com/mjmlio/mjml/blob/master/packages/mjml-carousel/README.md) | `<mj-carousel></mj-carousel>` |
| `mjcarousel-image` | [mj-carousel-image](https://github.com/mjmlio/mjml/blob/master/packages/mjml-carousel/README.md#mjml-carousel-image) | `<mj-carousel-image src="" />` |
| `mjclass` | [mj-class](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-attributes/README.md) | `<mj-class name="" />` |
| `mjcolumn` | [mj-column](https://github.com/mjmlio/mjml/blob/master/packages/mjml-column/README.md) | `<mj-column width=""></mj-column>` |
| `mjdivider` | [mj-divider](https://github.com/mjmlio/mjml/blob/master/packages/mjml-divider/README.md) | `<mj-divider />` |
| `mjfont` | [mj-font](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-font/README.md) | `<mj-font name="" href="" />` |
| `mjgroup` | [mj-group](https://github.com/mjmlio/mjml/blob/master/packages/mjml-group/README.md) | `<mj-group></mj-group>` |
| `mjhead` | [mj-head](https://github.com/mjmlio/mjml/blob/master/doc/guide.md#mj-head) | `<mj-head></mj-head>` |
| `mjhero` | [mj-hero](https://github.com/mjmlio/mjml/blob/master/packages/mjml-hero/README.md) | `<mj-hero></mj-hero>` |
| `mjimage` | [mj-image](https://github.com/mjmlio/mjml/blob/master/packages/mjml-image/README.md) | `<mj-image src="" alt="" />` |
| `mjinclude` | [mj-include](https://github.com/mjmlio/mjml/blob/master/doc/guide.md#mj-include) | `<mj-include path="" />` |
| `mjraw` | [mj-raw](https://github.com/mjmlio/mjml/blob/master/packages/mjml-raw/README.md) | `<mj-raw></mj-raw>` |
| `mjsection` | [mj-section](https://github.com/mjmlio/mjml/blob/master/packages/mjml-section/README.md) | `<mj-section></mj-section>` |
| `mjsocial` | [mj-social](https://github.com/mjmlio/mjml/blob/master/packages/mjml-social/README.md) | `<mj-social></mj-social>` |
| `mjsocialelement` | [mj-social-element](https://github.com/mjmlio/mjml/blob/master/packages/mjml-social/README.md#mj-social-element) | `<mj-social-element></mj-social-element>` |
| `mjstyle` | [mj-style](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-style/README.md) | `<mj-style></mj-style>` |
| `mjtable` | [mj-table](https://github.com/mjmlio/mjml/blob/master/packages/mjml-table/README.md) | `<mj-table></mj-table>` |
| `mjtext` | [mj-text](https://github.com/mjmlio/mjml/blob/master/packages/mjml-text/README.md) | `<mj-text></mj-text>` |
| `mjtitle` | [mj-title](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-title/README.md) | `<mj-title></mj-title>` |
| `mjml` | [mjml](https://github.com/mjmlio/mjml/blob/master/doc/guide.md#mjml) | `<mjml></mjml>` |
| `mjpreview` | [mj-preview](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-preview/README.md) | `<mj-preview></mj-preview>` |
| `mjspacer` | [mj-spacer](https://github.com/mjmlio/mjml/blob/master/packages/mjml-spacer/README.md) | `<mj-spacer height="" />` |
| `mjwrapper` | [mj-wrapper](https://github.com/mjmlio/mjml/blob/master/packages/mjml-wrapper/README.md) | `<mj-wrapper></mj-wrapper>` |
| `mjaccordion` | [mj-accordion](https://github.com/mjmlio/mjml/blob/master/packages/mjml-accordion/README.md) | `<mj-accordion></mj-accordion>` |
| `mjaccordion-element` | [mj-accordion-element](https://github.com/mjmlio/mjml/blob/master/packages/mjml-accordion/README.md#mjml-accordion-element) | `<mj-accordion-element>...</mj-accordion-element>` |
| `mjnavbar` | [mj-navbar](https://github.com/mjmlio/mjml/blob/master/packages/mjml-navbar/README.md) | `<mj-navbar></mj-navbar>` |
| `mjnavbarlink` | [mj-navbar-link](https://github.com/mjmlio/mjml/blob/master/packages/mjml-navbar/README.md#mjml-navbar-link) | `<mj-navbar-link></mj-navbar-link>` |
| `mjlink` | [mj-link](https://mjml.io/documentation/#mjml-navbar) | `<mj-link href=""></mj-link>` |
| `mjml-` | | Basic MJML Template |

## Nodemailer configuration

Please see the [Nodemailer](https://nodemailer.com) documentation for more information.

### [Gmail](https://gmail.com)
```json
"mjml.nodemailer": {
    "service": "Gmail",
    "auth": {
        "user": "youremail@gmail.com",
        "pass": "password"
    }
}
```

### [Mailtrap](https://mailtrap.io)
```json
"mjml.nodemailer": {
    "host": "smtp.mailtrap.io",
    "port": 2525,
    "auth": {
        "user": "username",
        "pass": "password"
    }
}
```

### [Ethereal](https://ethereal.email)
```json
"mjml.nodemailer": {
    "host": "smtp.ethereal.email",
    "port": 587,
    "auth": {
        "user": "youremail@ethereal.email",
        "pass": "password"
    }
}
```

## Change Log

### [1.0.0] (2019-11-20)
* This is the initial release of this extension.
* Update MJML to 4.5.1

## Issues

Submit the [issues](https://github.com/mjml/vscode-mjml/issues) if you find any bug or have any suggestion.

## Contribution

Fork the [repo](https://github.com/mjml/vscode-mjml) and submit pull requests.

## Contributors

Main Author: Attila Buti ([@attilabuti](https://github.com/attilabuti))

A big thanks to the people that have contributed to this project:

- Christian Brevik ([@cbrevik](https://github.com/cbrevik)) - [contributions](https://github.com/attilabuti/vscode-mjml/commits?author=cbrevik))
- Kevin Oliveira ([@kvnol](https://github.com/kvnol)) - [contributions](https://github.com/attilabuti/vscode-mjml/commits?author=kvnol))
- Joshua Skrzypek ([@jskrzypek](https://github.com/jskrzypek)) - [contributions](https://github.com/attilabuti/vscode-mjml/commits?author=jskrzypek))

## License

This extension is licensed under the [MIT License][license-url].

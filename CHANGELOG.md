# Change Log

All notable changes to the "mjml" extension will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/).

### [2.2.0] (2025-12-03)

- [update] MJML to v4.17.1
- [new] `MJML: Preview:` now loads automatically when opening example files from documentation
- [fix] `MJML: Beautify` is working again
- [fix] `MJML: Documentation`: is working again and uses the latest documentation
- [fix] `MJML: Search in MJML documentation`: is working again
- [fix] `MJML: Template`: templates updated

### [2.1.0] (2025-02-20)

- [update] MJML to MJML5 experimental branch
- [fix] Beautify formatter is now based on prettier

### [1.6.0] (2018-10-28)

- [new] Configuration property `mjml.templateGallery`: Show the template gallery instead of quick pick.
- [new] Configuration property `mjml.templateGalleryAutoClose`: Automatically close template gallery when selecting a template.
- [#42](https://github.com/attilabuti/vscode-mjml/issues/42) [#43](https://github.com/attilabuti/vscode-mjml/issues/43): fixed beautify issues.
- [new] [#47](https://github.com/attilabuti/vscode-mjml/issues/47) `MJML: Version`: Shows the version of MJML.
- .mjmlconfig is working again.
- MJML 4.2.0
- Other improvements and bugfixes.

### [1.5.1] (2018-10-03)

- [#41](https://github.com/attilabuti/vscode-mjml/issues/41): fixed preview issue.
- [#40](https://github.com/attilabuti/vscode-mjml/issues/40): fixed comment issue.

### [1.5.0] (2018-09-28)

- [new] Configuration property `mjml.previewBackgroundColor`: preview background color ([#39](https://github.com/attilabuti/vscode-mjml/issues/39)).
- [new] Configuration property `mjml.showSaveDialog`: show the save as dialog instead of input box.
- [new] Configuration property `mjml.autoClosePreview`: automatically close preview when all open MJML documents have been closed.
- [new] `MJML: Documentation`: open the MJML documentation.
- [new] `MJML: Search in MJML documentation`: search for the selected mj-element in the MJML documentation.
- [#38](https://github.com/attilabuti/vscode-mjml/issues/38): added support for beautify mj-style.
- [#35](https://github.com/attilabuti/vscode-mjml/issues/35): show more useful information on error in sending the email.
- [#29](https://github.com/attilabuti/vscode-mjml/pull/29): merged pull request.
- MJML syntax highlight with CSS support.
- The `PreviewManager` has been completely rewritten.
- Built-in MJML documentation with `Try it live` support.
- `Search in MJML documentation` from context menu.
- MJML 4.1.2
- Some other improvements.

### [1.4.0] (2018-07-14)

- [#30](https://github.com/attilabuti/vscode-mjml/issues/30): fixed PhantomJS rebuild issue.
- [#27](https://github.com/attilabuti/vscode-mjml/issues/27) [#31](https://github.com/attilabuti/vscode-mjml/issues/31): fixed rendering issue.
- MJML 4.1.0
- Some other improvements.

### [1.3.0] (2018-05-15)

- [new] Configuration property `mjml.autoPreview`: Automatically update preview when switching between MJML documents.
- MJML 4.0.5
- Various fixes and other improvements.

### [1.2.1] (2018-04-15)

- [#24](https://github.com/attilabuti/vscode-mjml/issues/24): fixed.
- Dependency updates.

### [1.2.0] (2018-03-26)

- [new] Configuration property `mjml.mailer`: send email with Nodemailer or Mailjet. Possible values are 'nodemailer' and 'mailjet'.
- [new] Configuration property `mjml.nodemailer`: Nodemailer configuration. Please see the [Nodemailer](https://nodemailer.com) documentation for more information.
- Send email with Nodemailer.
- Added support for inline images (automatically generated from local images).
- New preview icon.
- Some other improvements.
- MJML 4.0.3

### [1.1.0] (2018-03-18)

- [new] Configuration property `mjml.exportType`: Specifies the file type of the output file.
- `MJML: Export HTML`: allows to specify the exported file type (e.g. example.html or .pug).
- MJML 4.0.2

### [1.0.0] (2018-03-07)

- [new] `MJML: Migrate`: Migrate a template from MJML 3 to MJML 4.
- Change to [Semantic Versioning](https://semver.org/).
- Some fixes.
- MJML 4.0.0

### [0.1.0] (2017-12-14)

- [new] `MJML: Beautify`: [#8](https://github.com/attilabuti/vscode-mjml/issues/8) Beautify MJML code.
- [#15](https://github.com/attilabuti/vscode-mjml/pull/15): fixed preview cache issue.
- Some other improvements.

### [0.0.9] (2017-10-06)

- [new] Configuration property `mjml.screenshotWidths`: Screenshot widths.
- [new] `MJML: Multiple Screenshots`: [#13](https://github.com/attilabuti/vscode-mjml/issues/13) Take multiple screenshots of the rendered MJML document.
- [new] `MJML: Template`: Fetch official templates from source. Based on [mjml-app](https://github.com/mjmlio/mjml-app).
- Some other small improvements.
- MJML 3.3.5

### [0.0.8] (2017-09-04)

- [#10](https://github.com/attilabuti/vscode-mjml/issues/10): added MJML snippets. Based on [mjml-syntax](https://github.com/mjmlio/mjml-syntax).

### [0.0.7] (2017-07-21)

- [#5](https://github.com/attilabuti/vscode-mjml/issues/5): .mjmlconfig is now supported.
- [new] Configuration property `mjml.mailjetAPIKey`: Mailjet API Key.
- [new] Configuration property `mjml.mailjetAPISecret`: Mailjet API Secret.
- [new] Configuration property `mjml.mailSender`: Sender email address. (Mailjet: must be a verified sender.)
- [new] Configuration property `mjml.mailFromName`: Sender name.
- [new] Configuration property `mjml.mailSubject`: Email subject.
- [new] Configuration property `mjml.mailRecipients`: Comma separated list of recipients email addresses.
- [new] `MJML: Copy HTML`: Copy the result HTML to clipboard.
- [new] `MJML: Send Email`: Send email with Mailjet.
- Some other small improvements.

### [0.0.6] (2017-06-28)

- Added PhantomJS-rebuild functionallity in order to build PhantomJS for the propper OS. Based on [MarkdownConverter](https://github.com/manuth/MarkdownConverter).

### [0.0.5] (2017-06-28)

- [#3](https://github.com/attilabuti/vscode-mjml/issues/3): fixed preview issue.
- [new] Configuration property `mjml.lintWhenTyping`: whether the linter is run on type or on save.
- [new] Configuration property `mjml.minifyHtmlOutput`: minify HTML output.
- [new] Configuration property `mjml.beautifyHtmlOutput`: beautify HTML output. (Works when `mjml.minifyHtmlOutput` aren't enabled.)
- [new] Configuration property `mjml.screenshotWidth`: screenshot width.
- [new] Configuration property `mjml.screenshotType`: screenshot type. Possible values are 'png', 'jpg', and 'jpeg'.
- [new] Configuration property `mjml.screenshotQuality`: screenshot quality.
- [new] `MJML: Screenshot`: Take a screenshot of the rendered MJML document, and save it as a file.
- Fixed background-url path issue.
- Lint when a MJML file is opened.
- Some other small improvements.

### [0.0.4] (2017-06-21)

- [#1](https://github.com/attilabuti/vscode-mjml/pull/1): fixed image path issue.
- [#2](https://github.com/attilabuti/vscode-mjml/issues/2): fixed mj-include issue.
- [new] Configuration property `mjml.preserveFocus`: preserve focus of Text Editor after preview open.
- [new] Configuration property `mjml.updateWhenTyping`: update preview when typing.
- `MJML: Open Preview` was renamed to `MJML: Open Preview to the Side`
- `MJML: Generate HTML` was renamed to `MJML: Export HTML`
- MJML 3.3.3

### [0.0.2] (2017-05-08)

- Some fixes.

### [0.0.1] (2017-05-07)

- This is the initial release of this extension.

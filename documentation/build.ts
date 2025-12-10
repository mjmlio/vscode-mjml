'use strict'

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import fetch from 'node-fetch'

import * as hljs from 'highlight.js'

const md = require('markdown-it')({
  html: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.default.getLanguage(lang)) {
      try {
        return `<div>${hljs.default.highlight(str, { language: lang }).value}</div>`
      } catch (err) {}
    }
    return ''
  },
}).use(require('markdown-it-anchor'))

let githubAccessToken: string = process.env.GITHUB_ACCESS_TOKEN || ''

let exampleFolder: string = './documentation/examples'
let imagesFolder: string = './documentation/images'
let documentationHTML: string = './documentation/documentation.html'

async function run(): Promise<void> {
  clean()

  let documentation: string = `<!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
        <style>${await getStyle()}</style>
        <script>
            const vscode = acquireVsCodeApi();

            function openExample(data) {
                vscode.postMessage({
                    command: "openExample",
                    data: data
                });
            }

            window.addEventListener("message", event => {
                let message = event.data;

                if (message.command == "scrollTo") {
                    location.hash = message.anchor;
                }
            });
        </script>
    </head>
    <body>
        ${md.render(await getContent()).replace(/(<br\s*\/?>[\n\t\s]*){2,}/gi, '<br />')}
    </body>
    </html>`

  if (documentation) {
    fs.writeFile(documentationHTML, documentation, (err) => {
      if (err) {
        return console.log(err)
      }

      console.log('The file was saved!')
    })
  }
}

function clean(): void {
  let deleteFolderRecursive = (path: string) => {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file: string) => {
        let currentPath: string = `${path}/${file}`

        if (fs.lstatSync(currentPath).isDirectory()) {
          deleteFolderRecursive(currentPath)
        } else {
          fs.unlinkSync(currentPath)
        }
      })

      fs.rmdirSync(path)
    }
  }

  if (fs.existsSync(exampleFolder) && fs.statSync(exampleFolder).isDirectory()) {
    deleteFolderRecursive(exampleFolder)
  }

  if (fs.existsSync(imagesFolder) && fs.statSync(imagesFolder).isDirectory()) {
    deleteFolderRecursive(imagesFolder)
  }

  if (fs.existsSync(documentationHTML) && fs.statSync(documentationHTML).isFile()) {
    fs.unlinkSync(documentationHTML)
  }

  fs.mkdirSync(exampleFolder)
  fs.mkdirSync(imagesFolder)
}

async function getContent(): Promise<string> {
  let docs: string[] = [
    'https://api.github.com/repos/mjmlio/mjml/contents/doc/guide.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/doc/getting_started.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/doc/basic.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/doc/components.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/doc/head_components.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-head-attributes/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-head-breakpoint/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-head-font/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-head-preview/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-head-style/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-head-title/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/doc/body_components.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-accordion/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-body/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-button/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-carousel/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-column/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-divider/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-group/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-hero/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-image/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-navbar/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-raw/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-section/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-social/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-spacer/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-table/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-text/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/packages/mjml-wrapper/README.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/doc/community-components.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/doc/mjml-chart.md',
    'https://api.github.com/repos/mjmlio/mjml/contents/doc/create.md',
  ]

  let content: string = ''

  for (let i in docs) {
    if (docs[i].indexOf('api.github.com') !== -1) {
      content += await fetchFromGithub(docs[i])
    } else {
      let mdFile: string = path.join('../', 'node_modules', docs[i])

      if (mdFile && fs.existsSync(mdFile) && fs.statSync(mdFile).isFile()) {
        content += fs.readFileSync(mdFile, 'utf8')
      }
    }

    content += '\n\n'
  }

  console.log('Final documentation content:', content.slice(0, 500)) // Log first 500 chars

  return await tryItLive(
    await getImages(content.replace(/---[\s\S]*?---/, '').replace(/^\s+|\s+$/g, '')),
  )
}

async function getImages(content: string): Promise<string> {
  let imagePath: string[] = []
  let pattern: RegExp = /<img\s+[^>]*?src=("|')([^"']+)\1/g

  let match: RegExpMatchArray
  while ((match = pattern.exec(content))) {
    if (imagePath.indexOf(match[2]) == -1) {
      imagePath.push(match[2])

      let res = await fetch(match[2])

      await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(`${imagesFolder}/${path.basename(match[2])}`)
        res.body.pipe(fileStream)
        res.body.on('error', reject)
        fileStream.on('finish', () => resolve(void 0))
      })
    }
  }

  return content.replace(/src=['"]((?:[^"'\/]*\/)*([^'"]+))['"]/gi, 'src="{{root}}/images/$2"')
}

async function getStyle(): Promise<string> {
  let css: string = ''
  let previewStyles: string[] = [
    'https://api.github.com/repos/Microsoft/vscode/contents/extensions/markdown-language-features/media/markdown.css',
    'https://api.github.com/repos/Microsoft/vscode/contents/extensions/markdown-language-features/media/highlight.css',
  ]

  for (let i in previewStyles) {
    css += await fetchFromGithub(previewStyles[i])
  }

  return css
    .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '')
    .replace(/ {2,}/g, ' ')
    .replace(/ ([{:}]) /g, '$1')
    .replace(/([;,]) /g, '$1')
    .replace(/ !/g, '!')
}

async function fetchFromGithub(url: string): Promise<string> {
  let response = await fetch(url, {
    headers: {
      Authorization: `token ${githubAccessToken}`,
    },
  })
  let json = await response.json()

  if (json.content && json.encoding == 'base64') {
    const content = Buffer.from(json.content, 'base64').toString()
    console.log(`Fetched from ${url}:`, content.slice(0, 100))
    return content
  }

  console.log(`No content fetched from ${url}`)
  return ''
}

async function tryItLive(html: string): Promise<string> {
  let tryItLive: string[] = []

  html = html.replace(/href=\"\/try-it-live\//gi, 'href="https://mjml.io/try-it-live/')

  let match
  while (
    (match =
      /<a[^>]*?href\s*=\s*['"](https?:\/\/mjml\.io\/try-it-live\/([^"']*?))['"][^>]*?>/gi.exec(
        html,
      ))
  ) {
    let fileName: string = match[2].replace(/\//g, '-')

    if (tryItLive.indexOf(match[2]) == -1) {
      let response = await fetch(match[1])

      let mjmlMatch: RegExpExecArray = /"value":*?["']([\s\S]*?)["']*?"}/gi.exec(
        await response.text(),
      )

      mjmlMatch[1]
        .replace(/\\"/g, '"')
        .replace(/src="\/(assets\/img)\/(.*?)"/gi, 'src="https://mjml.io/assets/img/$2"')
        .split('\\n')
        .forEach((line) => {
          fs.appendFileSync(
            `${exampleFolder}/${fileName}.mjml`,
            line.replace(/\\/g, '').toString() + '\n',
          )
        })

      tryItLive.push(match[2])
    }

    html = html.replace(
      `href="${match[1]}"`,
      `href="javascript:void(0)" onclick="openExample('${fileName}')" title="${fileName.replace(/components-/gi, '')}"`,
    )
  }

  return html
}

run()

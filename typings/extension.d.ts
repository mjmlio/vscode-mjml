declare module 'mjml'
declare module 'node-mailjet'
declare module 'phantom'
declare module 'phantomjs-prebuilt'

declare interface WebviewMessage {
  command: string
  data: string
}

declare interface Templates {
  mjml: string
  name: string
  thumbnail: string
}

declare interface Attachments {
  ContentType?: string
  'Content-type'?: string | null
  cid?: string
  content?: any
  filename?: string
  Filename?: string
  originalPath: string
}

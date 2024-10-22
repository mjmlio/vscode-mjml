import { createReadStream, existsSync, readFileSync, statSync } from 'fs'
import { basename, dirname, join as joinPath } from 'path'
import { commands, Disposable, ProgressLocation, window, workspace } from 'vscode'

import mime from 'mime'
import { connect as mailjetConnect } from 'node-mailjet'
import { createTransport, getTestMessageUrl } from 'nodemailer'

import { getPath, renderMJML } from './helper'

export default class Email {
  constructor(subscriptions: Disposable[]) {
    subscriptions.push(
      commands.registerCommand('mjml.sendEmail', () => {
        renderMJML((content: string) => {
          this.sendEmail(content, getPath())
        })
      }),
    )
  }

  private sendEmail(content: string, mjmlPath: string): void {
    const mailer: string = workspace.getConfiguration('mjml').mailer.toLowerCase()
    const defaultRecipients: string = workspace.getConfiguration('mjml').mailRecipients

    window
      .showInputBox({
        placeHolder: 'Type a subject for the email.',
        prompt: 'Subject',
        value: workspace.getConfiguration('mjml').mailSubject,
      })
      .then((subject: string | undefined) => {
        if (!subject) {
          return
        }

        window
          .showInputBox({
            placeHolder: 'Comma-separated list of recipients.',
            prompt: 'Recipients',
            value: defaultRecipients,
          })
          .then(async (recipients: string | undefined) => {
            if (!recipients) {
              return
            }

            await window.withProgress(
              {
                cancellable: false,
                location: ProgressLocation.Notification,
                title: `Sending email...`,
              },
              async () => {
                recipients = (recipients ? recipients : defaultRecipients).replace(/\s/g, '')

                const attachments: Attachments[] = this.createAttachments(content, mjmlPath, mailer)
                content = this.replaceImages(content, attachments, mailer)

                if (mailer === 'nodemailer') {
                  await this.nodemailer(subject, recipients, content, attachments)
                } else {
                  await this.mailjet(subject, recipients, content, attachments)
                }
              },
            )
          })
      })
  }

  private async nodemailer(
    subject: string,
    recipients: string,
    html: string,
    attachments: Attachments[],
  ): Promise<void> {
    const transportOptions: any = workspace.getConfiguration('mjml').nodemailer

    await createTransport(transportOptions)
      .sendMail({
        attachments,
        from: {
          address: workspace.getConfiguration('mjml').mailSender,
          name: workspace.getConfiguration('mjml').mailFromName,
        },
        html,
        subject,
        to: recipients,
      })
      .then((info: any) => {
        window.showInformationMessage('Mail has been sent successfully.')

        if (transportOptions.host && transportOptions.host === 'smtp.ethereal.email') {
          const url: string | boolean = getTestMessageUrl(info)

          if (url) {
            window.showInformationMessage(`Preview URL: ${url}`)
          }
        }
      })
      .catch((error: Error | null) => {
        if (error) {
          window.showErrorMessage(error.message)

          return
        }
      })
  }

  private async mailjet(
    subject: string,
    recipients: string,
    html: string,
    attachments: Attachments[],
  ): Promise<void> {
    const recipientList: Array<{ Email: string }> = recipients
      .split(',')
      .map((emailAddress: string) => {
        return { Email: emailAddress }
      })

    await mailjetConnect(
      workspace.getConfiguration('mjml').mailjetAPIKey,
      workspace.getConfiguration('mjml').mailjetAPISecret,
    )
      .post('send')
      .request({
        FromEmail: workspace.getConfiguration('mjml').mailSender,
        FromName: workspace.getConfiguration('mjml').mailFromName,
        'Html-part': html,
        Inline_attachments: attachments,
        Recipients: recipientList,
        Subject: subject,
      })
      .then(() => {
        window.showInformationMessage('Mail has been sent successfully.')
      })
      .catch((error: any) => {
        window.showErrorMessage(error.message)
      })
  }

  private createAttachments(content: string, mjmlPath: string, mailer?: string): Attachments[] {
    const imgPaths: string[] = []

    let match: RegExpExecArray | null
    const pattern: RegExp = /<img\s+[^>]*?src=("|')([^"']+)\1/g
    while ((match = pattern.exec(content))) {
      imgPaths.push(match[2])
    }

    const attachments: Attachments[] = []
    if (!imgPaths) {
      return attachments
    }

    for (let i = 0; i < imgPaths.length; i++) {
      if (imgPaths[i] && !isURL(imgPaths[i])) {
        const filePath: string = joinPath(dirname(mjmlPath), imgPaths[i])

        if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
          if (mailer === 'nodemailer') {
            attachments.push({
              cid: Math.random().toString(36).substring(2) + i,
              content: createReadStream(filePath),
              filename: basename(filePath),
              originalPath: imgPaths[i],
            })
          } else {
            attachments.push({
              'Content-type': mime.getType(filePath),
              Filename: i + '_' + basename(filePath),
              content: readFileSync(filePath).toString('base64'),
              originalPath: imgPaths[i],
            })
          }
        }
      }
    }

    return attachments
  }

  private replaceImages(content: string, attachments: Attachments[], mailer?: string): string {
    if (attachments) {
      for (const attachment of attachments) {
        content = content.replace(
          `src="${attachment.originalPath}"`,
          `src="cid:${mailer === 'nodemailer' ? attachment.cid : attachment.Filename}"`,
        )
      }
    }

    return content
  }
}

/**
 * Regular Expression for URL validation
 * Author: Diego Perini
 * License: MIT
 * https://gist.github.com/dperini/729294
 */
function isURL(url: string): boolean {
  return new RegExp(
    '^' +
      '(?:(?:(?:https?|ftp):)?\\/\\/)' +
      '(?:\\S+(?::\\S*)?@)?' +
      '(?:' +
      '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
      '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
      '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
      '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
      '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
      '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
      '|' +
      '(?:' +
      '(?:' +
      '[a-z0-9\\u00a1-\\uffff]' +
      '[a-z0-9\\u00a1-\\uffff_-]{0,62}' +
      ')?' +
      '[a-z0-9\\u00a1-\\uffff]\\.' +
      ')+' +
      '(?:[a-z\\u00a1-\\uffff]{2,}\\.?)' +
      ')' +
      '(?::\\d{2,5})?' +
      '(?:[/?#]\\S*)?' +
      '$',
    'i',
  ).test(url)
}

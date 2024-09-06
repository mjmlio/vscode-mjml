import { basename, join as joinPath, resolve as resolvePath } from 'path'
import { commands, Disposable, ProgressLocation, Uri, window, workspace } from 'vscode'

import { commands as npmCommands, load } from 'npm'
import * as phantom from 'phantom'
import { platform as phantomJs } from 'phantomjs-prebuilt'

import { getPath, renderMJML } from './helper'

export default class Screenshot {
    // Gets a value indicating whether PhantomJS could be built
    private phantomJSBuilt: any = undefined
    private phantomJsPlatform: string = ''
    private processPlatform: string = ''

    constructor(subscriptions: Disposable[]) {
        // Rebuilding PhantomJS if required
        if (phantomJs !== process.platform) {
            this.rebuild()
        } else {
            this.phantomJsPlatform = phantomJs
            this.processPlatform = process.platform

            subscriptions.push(
                commands.registerCommand('mjml.screenshot', () => {
                    this.renderMJML(false)
                }),

                commands.registerCommand('mjml.multipleScreenshots', () => {
                    this.renderMJML(true)
                }),
            )
        }
    }

    private async rebuild(): Promise<void> {
        await window.withProgress(
            {
                cancellable: false,
                location: ProgressLocation.Notification,
                title: `MJML needs to be rebuilt for your current platform. Please wait for the installation to finish...`,
            },
            async () => {
                return new Promise<void>((resolve, reject) => {
                    process.chdir(joinPath(__dirname, '..'))

                    load(
                        // {
                        //     loglevel: 'silent',
                        // },
                        () => {
                            npmCommands.rebuild(['phantomjs-prebuilt'], (error: any) => {
                                if (error) {
                                    reject(error)
                                } else {
                                    resolve()
                                }
                            })
                        },
                    )
                })
                    .then(() => {
                        this.phantomJSBuilt = true
                        window.showInformationMessage(
                            "MJML's been updated. Please restart VSCode in order to continue using MJML.",
                        )
                    })
                    .catch(() => {
                        this.phantomJSBuilt = false
                        window.showErrorMessage(
                            "MJML couldn't build the proper version of PhantomJS. Restart VSCode in order to try it again.",
                        )
                    })
            },
        )
    }

    private renderMJML(multiple: boolean): void {
        if (this.phantomJsPlatform !== this.processPlatform || this.phantomJSBuilt !== undefined) {
            if (this.phantomJSBuilt) {
                window.showInformationMessage(
                    "MJML's been updated. Please restart VSCode in order to continue using MJML.",
                )
            } else {
                window.showWarningMessage(
                    "MJML couldn't build the proper version of PhantomJS. Restart VSCode in order to try it again.",
                )
            }
        } else {
            renderMJML((content: string) => {
                let defaultWidth: string = workspace
                    .getConfiguration('mjml')
                    .screenshotWidth.toString()

                let placeHolder: string = `Enter image width (${defaultWidth}).`
                if (multiple) {
                    defaultWidth = workspace.getConfiguration('mjml').screenshotWidths.join(', ')
                    placeHolder = `Comma-separated list of image widths (${defaultWidth}).`
                }

                window
                    .showInputBox({
                        placeHolder,
                        prompt: 'Width',
                        value: defaultWidth,
                    })
                    .then((width: string | undefined) => {
                        if (!width) {
                            return
                        }

                        const imgWidth: Array<number | undefined> = width
                            .split(',')
                            .map((tmpWidth: string) => {
                                return tmpWidth ? parseInt(tmpWidth, 10) : undefined
                            })
                            .filter((tmpWidth: number | undefined) => {
                                return tmpWidth ? tmpWidth : undefined
                            })

                        if (imgWidth.length > 0) {
                            this.showSaveDialog(multiple, content, imgWidth)
                        }
                    })
            }, true)
        }
    }

    private showSaveDialog(
        multiple: boolean,
        content: string,
        width: Array<number | undefined>,
    ): void {
        const defaultFileName: string = basename(getPath()).replace(/\.[^\.]+$/, '')

        let screenshotType: string = 'png'
        if (['png', 'jpg', 'jpeg'].indexOf(workspace.getConfiguration('mjml').screenshotType)) {
            screenshotType = workspace.getConfiguration('mjml').screenshotType
        }

        if (workspace.getConfiguration('mjml').showSaveDialog) {
            window
                .showSaveDialog({
                    defaultUri: Uri.file(
                        resolvePath(getPath(), `../${defaultFileName}.${screenshotType}`),
                    ),
                    filters: {
                        Images: ['png', 'jpg', 'jpeg'],
                    },
                })
                .then((fileUri: Uri | undefined) => {
                    if (fileUri) {
                        this.screenshot(multiple, fileUri.fsPath, content, width, screenshotType)
                    }
                })
        } else {
            window
                .showInputBox({
                    placeHolder: 'Enter a filename.',
                    prompt: 'Filename',
                    value: `${defaultFileName}.${screenshotType}`,
                })
                .then((fileName: string | undefined) => {
                    if (!fileName) {
                        return
                    }

                    fileName = fileName ? fileName.replace(/\.[^\.]+$/, '') : defaultFileName
                    const file: string = resolvePath(getPath(), `../${fileName}.${screenshotType}`)

                    this.screenshot(multiple, file, content, width, screenshotType)
                })
        }
    }

    private async screenshot(
        multiple: boolean,
        file: string,
        html: string,
        width: Array<number | undefined>,
        type: string,
    ): Promise<void> {
        await window.withProgress(
            {
                cancellable: false,
                location: ProgressLocation.Notification,
                title: `Taking ${multiple ? 'screenshots' : 'screenshot'}...`,
            },
            async () => {
                try {
                    const instance = await phantom.create()
                    const page = await instance.createPage()

                    await page.setContent(html, '')
                    await page.reload()

                    for (const imgWidth of width) {
                        if (imgWidth && Number.isInteger(imgWidth)) {
                            let filePath: string
                            let imageName: string

                            if (multiple) {
                                const fileName: string =
                                    basename(file).split('.').slice(0, -1).join('.') +
                                    '_' +
                                    imgWidth.toString()
                                filePath = resolvePath(getPath(), `../${fileName}.${type}`)
                                imageName = `${fileName}.${type}`
                            } else {
                                filePath = imageName = file
                            }

                            await page.property('viewportSize', {
                                height: 480,
                                width: imgWidth,
                            })

                            await page.render(filePath, {
                                quality: workspace.getConfiguration('mjml').screenshotQuality,
                            })

                            window.showInformationMessage(
                                `Successfully saved screenshot ${imageName}`,
                            )

                            if (!multiple) {
                                break
                            }
                        }
                    }

                    await instance.exit()
                } catch (error) {
                    if (error instanceof Error) {
                        window.showErrorMessage(error.message)
                    } else {
                        window.showErrorMessage(
                            'An unknown error occurred while taking the screenshot: ' + error,
                        )
                    }
                }
            },
        )
    }
}

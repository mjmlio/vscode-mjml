import { existsSync, readFileSync, statSync } from 'fs'
import { basename, dirname, join as joinPath, parse as parsePath } from 'path'
import { TextDocument, TextEditor, window, workspace } from 'vscode'

import { html as jsBeautify } from 'js-beautify'
import { getExtension, getType as getMimeType } from 'mime'
import * as mjml2html from 'mjml'

export function renderMJML(
    cb: (content: string) => any,
    fixImg?: boolean,
    minify?: boolean,
    beautify?: boolean,
): void {
    const activeTextEditor: TextEditor | undefined = window.activeTextEditor
    if (!activeTextEditor) {
        return
    }

    if (!isMJMLFile(activeTextEditor.document)) {
        window.showWarningMessage('This is not a MJML document!')

        return
    }

    let content: string = mjmlToHtml(
        activeTextEditor.document.getText(),
        minify !== undefined ? minify : workspace.getConfiguration('mjml').minifyHtmlOutput,
        beautify !== undefined ? beautify : workspace.getConfiguration('mjml').beautifyHtmlOutput,
        workspace.getConfiguration('mjml').mjmlConfigPathOutput,
    ).html

    if (content) {
        if (fixImg !== undefined && fixImg) {
            content = fixImages(content, getPath())
        }

        return cb(content)
    } else {
        window.showErrorMessage(`MJMLError: Failed to parse file ${basename(getPath())}`)
    }
}

export function isMJMLFile(document: TextDocument): boolean {
    return (
        document.languageId === 'mjml' &&
        (document.uri.scheme === 'file' || document.uri.scheme === 'untitled')
    )
}

export function mjmlToHtml(
    mjml: string,
    minify: boolean,
    beautify: boolean,
    path?: string,
    validation: 'strict' | 'soft' | 'skip' = 'skip',
): { html: string; errors: any[] } {
    try {
        if (!path) {
            path = getPath()
        }

        return mjml2html(mjml, {
            beautify,
            filePath: path,
            minify,
            mjmlConfigPath: getCWD(path),
            validationLevel: validation,
        })
    } catch (error) {
        return { html: '', errors: [error] }
    }
}

export function fixImages(text: string, mjmlPath: string): string {
    return text.replace(
        new RegExp(/((?:src|url)(?:=|\()(?:[\'\"]|))((?!http|\\|"|#).+?)([\'\"]|\))/, 'gmi'),
        (_1: string, start: string, src: string, end: string): string => {
            return start + encodeImage(joinPath(dirname(mjmlPath), src), src) + end
        },
    )
}

export function beautifyHTML(mjml: string): string | undefined {
    try {
        const replaced: string = mjml.replace(
            new RegExp(/<.*mj-style[^>]*>(?:[^<>]+)<.*\/.*mj-style>/, 'gmi'),
            (style: string): string => {
                return style.replace(/mj-style/gi, 'style')
            },
        )

        const beautified: string = jsBeautify(replaced, workspace.getConfiguration('mjml').beautify)

        if (replaced !== mjml) {
            return beautified.replace(
                new RegExp(/<.*style[^>]*>(?:[^<>]+)<.*\/.*style>/, 'gmi'),
                (styleBlock: string): string => {
                    return styleBlock.replace(
                        new RegExp(/<.*style.*>/, 'gi'),
                        (style: string): string => {
                            return style.replace('style', 'mj-style')
                        },
                    )
                },
            )
        }

        return beautified
    } catch (error) {
        window.showErrorMessage(error)

        return
    }
}

export function getPath(): string {
    if (window.activeTextEditor && window.activeTextEditor.document) {
        return window.activeTextEditor.document.uri.fsPath
    }

    return ''
}

function getCWD(mjmlPath?: string): string {
    if (workspace.rootPath) {
        return workspace.rootPath
    }

    return mjmlPath ? parsePath(mjmlPath).dir : ''
}

function encodeImage(filePath: string, original: string): string {
    const mimeType: string | null = getMimeType(filePath)
    if (!mimeType) {
        return original
    }

    const extension: string | null = getExtension(mimeType)
    if (!extension || ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg'].indexOf(extension) === -1) {
        return original
    }

    if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
        const data: Buffer = readFileSync(filePath)
        if (data) {
            return `data:${mimeType};base64,${data.toString('base64')}`
        }
    }

    return original
}

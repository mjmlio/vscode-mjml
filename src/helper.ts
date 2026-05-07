import { existsSync, readFileSync, statSync } from 'fs'
import { basename, dirname, join as joinPath, parse as parsePath, isAbsolute, relative } from 'path'
import { TextDocument, TextEditor, Uri, window, workspace } from 'vscode'

import mime from 'mime'

import mjml2html from 'mjml'

export function isMJMLFile(document: TextDocument): boolean {
  return (
    document.languageId === 'mjml' &&
    (document.uri.scheme === 'file' || document.uri.scheme === 'untitled')
  )
}

export async function mjmlToHtml(
  mjmlContent: string,
  minify: boolean,
  beautify: boolean,
  path?: string,
  validation: 'strict' | 'soft' | 'skip' = 'skip',
  mjmlConfigPath?: string,
): Promise<{ html: string; errors: any[] }> {
  try {
    if (!path) {
      path = getPath()
    }

    const keepComments = workspace.getConfiguration('mjml').get<boolean>('keepComments', true)
    const allowIncludes = workspace.getConfiguration('mjml').get<boolean>('allowIncludes', false)
    const includePath = getIncludePath(path)

    return await mjml2html(mjmlContent, {
      beautify,
      filePath: path,
      includePath: allowIncludes ? includePath : undefined,
      ignoreIncludes: !allowIncludes,
      keepComments,
      minify,
      mjmlConfigPath: mjmlConfigPath
        ? isAbsolute(mjmlConfigPath)
          ? mjmlConfigPath
          : joinPath(getCWD(path), mjmlConfigPath)
        : getCWD(path),
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

export function getPath(): string {
  if (window.activeTextEditor && window.activeTextEditor.document) {
    return window.activeTextEditor.document.uri.fsPath
  }

  return ''
}

function getCWD(mjmlPath?: string): string {
  if (mjmlPath) {
    const workspaceFolder = workspace.getWorkspaceFolder(Uri.file(mjmlPath))
    if (workspaceFolder) {
      return workspaceFolder.uri.fsPath
    }
  }

  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    return workspace.workspaceFolders[0].uri.fsPath
  }

  return mjmlPath ? parsePath(mjmlPath).dir : ''
}

function getIncludePath(mjmlPath?: string): string[] | undefined {
  const config = workspace.getConfiguration('mjml').get<string | string[]>('includePath', [])
  const includePath = normalizeIncludePathConfig(config)
  const basePath = getCWD(mjmlPath)

  const normalized = includePath
    .map((value: string) => value.trim())
    .filter((value: string) => value.length > 0)
    .map((value: string) => (isAbsolute(value) ? value : joinPath(basePath, value)))

  return normalized.length > 0 ? normalized : undefined
}

function normalizeIncludePathConfig(config: string | string[]): string[] {
  const rawValues = Array.isArray(config) ? config : [config]
  const expanded = rawValues.flatMap((value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      return []
    }

    if (trimmed.startsWith('[') || trimmed.startsWith('{') || trimmed.startsWith('"')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((entry: any) => String(entry))
        }

        if (typeof parsed === 'string') {
          return [parsed]
        }
      } catch {
        // Keep raw value if it's not valid JSON.
      }
    }

    return [trimmed]
  })

  return expanded
}

function encodeImage(filePath: string, original: string): string {
  const mimeType: string | null = mime.getType(filePath)
  if (!mimeType) {
    return original
  }

  const extension: string | null = mime.getExtension(mimeType)
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

export function warnAboutIncludes(mjmlContent: string, mjmlPath?: string): void {
  const allowIncludes = workspace.getConfiguration('mjml').get<boolean>('allowIncludes', false)

  if (!allowIncludes) {
    const includeTagCount = (mjmlContent.match(/<mj-include\b/gi) ?? []).length
    if (includeTagCount === 0) {
      return
    }

    window.showWarningMessage(
      `This file contains ${includeTagCount} mj-include tag(s) but include processing is disabled. ` +
        `Enable 'mjml.allowIncludes' in settings to process them.`,
    )
    return
  }

  if (!mjmlPath) {
    return
  }

  const includeRegex = /<mj-include\s+[^>]*path=["']([^"']+)["']/g
  const includes: string[] = []
  let match: RegExpExecArray | null

  while ((match = includeRegex.exec(mjmlContent)) !== null) {
    includes.push(match[1])
  }

  if (includes.length === 0) {
    return
  }

  const coveredPaths = getIncludePath(mjmlPath) ?? []
  const fileDir = dirname(mjmlPath)
  const uncovered: string[] = []

  for (const inc of includes) {
    const resolvedPath = isAbsolute(inc) ? inc : joinPath(fileDir, inc)
    const resolvedDir = dirname(resolvedPath)

    // Covered if resolvedDir is the same as or inside the file's own directory
    const relToFileDir = relative(fileDir, resolvedDir)
    if (!relToFileDir.startsWith('..') && !isAbsolute(relToFileDir)) {
      continue
    }

    // Covered if resolvedDir is under any allowlisted includePath entry
    const covered = coveredPaths.some((ip) => {
      const rel = relative(ip, resolvedDir)
      return !rel.startsWith('..') && !isAbsolute(rel)
    })

    if (!covered) {
      uncovered.push(inc)
    }
  }

  if (uncovered.length > 0) {
    window.showInformationMessage(
      `${uncovered.length} mj-include path(s) may be outside the allowed directories. ` +
        `Add their parent folders to 'mjml.includePath': ${uncovered.join(', ')}`,
    )
  }
}

export async function renderMJML(
  cb: (content: string) => any,
  fixImg?: boolean,
  minify?: boolean,
  beautify?: boolean,
): Promise<void> {
  const activeTextEditor: TextEditor | undefined = window.activeTextEditor
  if (!activeTextEditor) {
    return
  }

  if (!isMJMLFile(activeTextEditor.document)) {
    window.showWarningMessage('This is not a MJML document!')
    return
  }

  warnAboutIncludes(activeTextEditor.document.getText(), activeTextEditor.document.uri.fsPath)

  const result = await mjmlToHtml(
    activeTextEditor.document.getText(),
    minify !== undefined ? minify : workspace.getConfiguration('mjml').minifyHtmlOutput,
    beautify !== undefined ? beautify : workspace.getConfiguration('mjml').beautifyHtmlOutput,
    undefined,
    'skip',
    workspace.getConfiguration('mjml').mjmlConfigPath,
  )

  let content = result.html

  if (content) {
    if (fixImg !== undefined && fixImg) {
      content = fixImages(content, getPath())
    }

    return cb(content)
  } else {
    window.showErrorMessage(`MJMLError: Failed to parse file ${basename(getPath())}`)
  }
}

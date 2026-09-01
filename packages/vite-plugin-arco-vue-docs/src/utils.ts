import { Token, Tokens } from 'marked';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { FileImportToken, I18nDescriptionToken } from './interface.js';
export function isParagraph(token: Token): token is Tokens.Paragraph {
  return (token as Tokens.Paragraph).type === 'paragraph';
}

export function isCode(token: Token): token is Tokens.Code {
  return (token as Tokens.Code).type === 'code';
}

export function isHeading(token: Token): token is Tokens.Heading {
  return (token as Tokens.Heading).type === 'heading';
}

export const isFileImport = (token: any): token is FileImportToken => {
  return token.type === 'fileImport';
};

export const isI18nDescription = (
  token: any
): token is I18nDescriptionToken => {
  return token.type === 'i18nDescription';
};

export function isSpace(token: Token): token is Tokens.Space {
  return (token as Tokens.Space).type === 'space';
}

export const toKebabCase = (string: string): string => {
  string = string.trim();
  if (/\s\w/.test(string)) {
    string = string.replace('s(w)', (match, word) => {
      return word.toUpperCase();
    });
  }

  return string.replace(/[A-Z]/g, (match, offset) => {
    return `${offset > 0 ? '-' : ''}${match.toLowerCase()}`;
  });
};

export const toPascalCase = (string: string): string => {
  string = string.trim();

  return string
    .replace(/^[a-z]/, (match: string) => match.toLocaleUpperCase())
    .replace(/-(\w)/g, (match: string, p1: string) => {
      return p1.toLocaleUpperCase();
    });
};

/**
 * 将字符串转换为模板中的字符串格式
 */
export const getTemplateString = (string: string): string => {
  return `'${string.replace(/'/g, `\\'`)}'`;
};

export const normalizeModuleId = (id: string): string => {
  let clean = id.split('?')[0].replace(/\\/g, '/');
  if (clean.startsWith('file:')) {
    try {
      clean = fileURLToPath(clean).replace(/\\/g, '/');
    } catch {
      // keep the original id when it is not a valid file URL
    }
  }
  if (/^\/[A-Za-z]:\//.test(clean)) {
    clean = clean.slice(1);
  }
  return clean;
};

export const toVirtualId = (id: string): string => {
  return `${normalizeModuleId(id)}.virtual.vue`;
};

export const isVirtualModule = (id: string) => {
  if (id.includes('?')) {
    return false;
  }
  return normalizeModuleId(id).endsWith('.virtual.vue');
};

export const isDemoMarkdown = (id: string) => {
  return /\/__demo__\//.test(normalizeModuleId(id));
};

export const getFrontMatter = (tokens: any[]) => {
  for (const token of tokens) {
    if (token.type === 'frontMatter') {
      return token.attributes;
    }
  }
  return undefined;
};

export const getVueId = (id: string) => {
  const normalized = normalizeModuleId(id);
  if (isVirtualModule(normalized)) {
    return normalized;
  }
  return normalized.replace(/\.md$/, '.vue');
};

export const getValidFilename = (filename: string) => {
  return path.extname(filename) ? filename : `${filename}.md`;
};

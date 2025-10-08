export function fakeTranslator(key: string, options?: Record<string, string | number>) {
    return `${key} : ${JSON.stringify(options)}`;
}
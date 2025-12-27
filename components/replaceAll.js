export const replace = (temp) => {
    return temp
        .replaceAll('"', '&quot;')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll("'", '&#39;')
        .replaceAll('`', '&#96;')
        .replaceAll('/', '&#47;');
};
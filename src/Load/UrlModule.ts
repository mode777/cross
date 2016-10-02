export function getFilename(url: string):string {
    let frags = url.split("/");
    return frags[frags.length - 1];
}

export function getName(url: string): string {
    let frags = getFilename(url).split(".");
    return frags[0];
}

export function getExtension(url: string): string {
    let frags = getFilename(url).split(".");
    return frags[frags.length - 1];
}

export function getPath(url: string): string {
    let frags = url.split("/");
    frags.splice(frags.length - 1, 1);
    return frags.join("/") + "/";
}


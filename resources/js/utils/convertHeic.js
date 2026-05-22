// utils/convertHeic.js

const HEIC_MIMES = [
    "image/heic", "image/heif",
    "image/heic-sequence", "image/heif-sequence",
];

export const isHeic = (file) => {
    if (!file) return false;
    if (HEIC_MIMES.includes(file.type)) return true;
    return /\.(heic|heif)$/i.test(file.name || "");
};

export async function isHeicByBytes(file) {
    if (!file) return false;
    const buf = await file.slice(0, 32).arrayBuffer();
    const bytes = new Uint8Array(buf);
    if (bytes.length < 12) return false;
    const ftyp = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
    if (ftyp !== "ftyp") return false;
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    return ["heic","heix","hevc","heim","heis","mif1","msf1","heif"].includes(brand);
}

// Попытка №1: heic-to (свежий libheif WASM)
async function tryHeicTo(file, quality) {
    const { heicTo } = await import("heic-to");
    const blob = await heicTo({
        blob: file,
        type: "image/jpeg",
        quality,
    });
    return blob;
}

// Попытка №2: heic2any (старая, но иногда работает где первая нет)
async function tryHeic2any(file, quality) {
    const mod = await import("heic2any");
    const heic2any = mod.default || mod;
    let result;
    try {
        result = await heic2any({ blob: file, toType: "image/jpeg", quality });
    } catch {
        result = await heic2any({ blob: file, toType: "image/jpeg", quality, multiple: true });
        if (Array.isArray(result)) result = result[0];
    }
    return Array.isArray(result) ? result[0] : result;
}

/**
 * Результат:
 *  - { file, converted: true }  — успешно сконвертировали в JPEG
 *  - { file, converted: false } — это не HEIC, отдаём как есть
 *  - { file, converted: false, unsupported: true } — HEIC, но клиент не смог; шлём оригинал
 */
export async function normalizeImage(file, { quality = 0.9 } = {}) {
    if (!file) return { file, converted: false };

    const heicByName = isHeic(file);
    const heicByBytes = await isHeicByBytes(file);
    const isReallyHeic = heicByName || heicByBytes;

    if (!isReallyHeic) return { file, converted: false };
    if (file.size === 0) throw new Error("Файл пустой");

    const attempts = [
        { name: "heic-to", fn: tryHeicTo },
        { name: "heic2any", fn: tryHeic2any },
    ];

    let lastError;
    for (const { name, fn } of attempts) {
        try {
            const blob = await fn(file, quality);
            if (!(blob instanceof Blob)) throw new Error(`${name}: вернул не Blob`);

            const newName = (file.name || "image").replace(/\.(heic|heif)$/i, "") + ".jpg";
            const converted = new File([blob], newName, {
                type: "image/jpeg",
                lastModified: Date.now(),
            });
            console.log(`[normalizeImage] ok via ${name}`, { size: converted.size });
            return { file: converted, converted: true };
        } catch (err) {
            console.warn(`[normalizeImage] ${name} failed`, err?.message || err);
            lastError = err;
        }
    }

    // обе либы провалились — отдаём оригинал, сервер дообработает
    console.error("[normalizeImage] all client converters failed, falling back to server", lastError);
    return { file, converted: false, unsupported: true };
}

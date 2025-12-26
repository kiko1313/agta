import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';
import { isAuthenticated } from '@/lib/auth';

const utapi = new UTApi();

function getFileExtension(filename: string): string {
    const parts = filename.split('.');
    if (parts.length < 2) return '';
    return parts[parts.length - 1]!.toLowerCase();
}

function validateUpload(file: File) {
    const ext = getFileExtension(file.name);
    const mime = (file.type || '').toLowerCase();

    const isVideo = mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'm4v'].includes(ext);
    const isImage = mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
    const isPdf = mime === 'application/pdf' || ext === 'pdf';
    const isZip = mime === 'application/zip' || mime === 'application/x-zip-compressed' || ext === 'zip';

    const maxBytes = isVideo
        ? 512 * 1024 * 1024
        : isImage
            ? 4 * 1024 * 1024
            : (isPdf ? 32 * 1024 * 1024 : (isZip ? 128 * 1024 * 1024 : 0));

    if (!isVideo && !isImage && !isPdf && !isZip) {
        return {
            ok: false as const,
            error: 'Unsupported file type. Please upload an image (jpg/png/webp/gif), a video (mp4/webm/mov), or a program file (pdf/zip).',
        };
    }

    if (maxBytes > 0 && file.size > maxBytes) {
        const mb = Math.round(maxBytes / (1024 * 1024));
        return {
            ok: false as const,
            error: `File is too large. Max allowed is ${mb}MB for this file type.`,
        };
    }

    if (isVideo && !(mime === 'video/mp4' || mime === 'video/webm' || mime === 'video/quicktime' || ['mp4', 'webm', 'mov', 'm4v'].includes(ext))) {
        return {
            ok: false as const,
            error: 'Unsupported video format. Please upload mp4 (preferred), webm, or mov.',
        };
    }

    return { ok: true as const };
}

export async function POST(request: NextRequest) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const validation = validateUpload(file);
        if (!validation.ok) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Upload to UploadThing
        const response = await utapi.uploadFiles(file);

        if (response.data) {
            return NextResponse.json({
                success: true,
                url: response.data.url,
                key: response.data.key,
            });
        }

        if ((response as any).error) {
            const message = typeof (response as any).error === 'string'
                ? (response as any).error
                : ((response as any).error?.message || 'Upload failed');
            return NextResponse.json({ error: 'Upload failed', details: message }, { status: 502 });
        }

        throw new Error('Upload failed');
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

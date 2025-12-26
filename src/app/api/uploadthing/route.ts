import { createRouteHandler } from "uploadthing/next";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
// Note: Auth is handled by Next.js middleware - only admin users can access /admin/upload
export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        .middleware(async () => {
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for file:", file.url);
            return { url: file.url };
        }),

    videoUploader: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
        .middleware(async () => {
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for video:", file.url);
            return { url: file.url };
        }),

    pdfUploader: f({ pdf: { maxFileSize: "32MB", maxFileCount: 1 } })
        .middleware(async () => {
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for PDF:", file.url);
            return { url: file.url };
        }),

    fileUploader: f({ "blob": { maxFileSize: "512MB", maxFileCount: 1 } })
        .middleware(async () => {
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for file:", file.url);
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});

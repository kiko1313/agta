import { createRouteHandler } from "uploadthing/next";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { isAuthenticated } from "@/lib/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        .middleware(async () => {
            if (!await isAuthenticated()) {
                throw new Error('Unauthorized');
            }
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for file:", file.url);
            return { url: file.url };
        }),

    videoUploader: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
        .middleware(async () => {
            if (!await isAuthenticated()) {
                throw new Error('Unauthorized');
            }
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for video:", file.url);
            return { url: file.url };
        }),

    pdfUploader: f({ pdf: { maxFileSize: "32MB", maxFileCount: 1 } })
        .middleware(async () => {
            if (!await isAuthenticated()) {
                throw new Error('Unauthorized');
            }
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for PDF:", file.url);
            return { url: file.url };
        }),

    fileUploader: f({ "blob": { maxFileSize: "512MB", maxFileCount: 1 } })
        .middleware(async () => {
            if (!await isAuthenticated()) {
                throw new Error('Unauthorized');
            }
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

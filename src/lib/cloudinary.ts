import { v2 as cloudinaryV2 } from 'cloudinary';

cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = (file: File | File[], folder: string) => {
    return new Promise(async (resolve, reject) => {
        if (file) {
            const opts = {
                folder,
                resource_type: 'auto',
                overwrite: true
            };

            if (Array.isArray(file)) {
                const req = file.map((img: any) => {
                    return cloudinaryV2.uploader.upload(img.path, opts);
                });

                try {
                    const result = await Promise.all(req);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            } else {
                try {
                    const result = await cloudinaryV2.uploader.upload((file as any).path, opts);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        } else {
            Array.isArray(file) ? resolve([]) : resolve({});
        }
    });
}

export const deleteImage = (publicID: string | string[]) => {
    if (publicID) {
        return new Promise(async (resolve, reject) => {
            if (Array.isArray(publicID)) {
                try {
                    await cloudinaryV2.api.delete_resources(publicID);
                    resolve({ state: true });
                } catch (err) {
                    reject(err);
                }
            } else {
                try {
                    await cloudinaryV2.uploader.destroy(publicID, { invalidate: true });
                    resolve({ state: true });
                } catch (err) {
                    reject(err);
                }
            }
        });
    }
}
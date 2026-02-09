
/**
 * Uploads an image to Cloudinary using the unsigned preset.
 * @param file - The file object to upload.
 * @param folder - (Optional) Folder name in Cloudinary.
 * @returns Promise resolving to the secure URL of the uploaded image.
 */
export const uploadToCloudinary = async (file: File, folder: string = "tailor_uploads"): Promise<string> => {
    const cloudName = "dvffwnuni";
    const uploadPreset = "ml_default"; // Fallback to default if not provided, usually 'ml_default' for unsigned

    // Note: Ideally the preset should be provided by the user if they created a custom one.
    // We will try standard 'ml_default' or user's custom one if they update this file.

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

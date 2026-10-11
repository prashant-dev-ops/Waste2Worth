import * as FileSystem from 'expo-file-system';

/**
 * Convert image URI to base64 string
 */
export async function imageToBase64(uri: string): Promise<string> {
    try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
        });
        return base64;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw new Error('Failed to process image');
    }
}

/**
 * Get MIME type from image URI
 */
export function getMimeType(uri: string): string {
    const extension = uri.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'webp':
            return 'image/webp';
        default:
            return 'image/jpeg'; // Default fallback
    }
}

// src/lib/api/upload.ts

import { API_BASE_URL, ApiResponse } from './config';

/**
 * Upload an image file
 */
export async function uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'שגיאה בהעלאה',
      };
    }

    return { success: true, data: { url: data.url } };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'שגיאה בהעלאה',
    };
  }
}

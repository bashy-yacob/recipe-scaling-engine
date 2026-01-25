// app/api/upload/route.ts

import { put, del } from '@vercel/blob';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'לא נבחר קובץ' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return Response.json(
        { error: 'סוג קובץ לא נתמך. השתמש ב-JPG, PNG, WebP או GIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return Response.json(
        { error: 'הקובץ גדול מדי. גודל מקסימלי: 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const userId = session.user.id.slice(-8);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `recipes/${userId}/${timestamp}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return Response.json({
      success: true,
      url: blob.url,
      filename: blob.pathname,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return Response.json({ error: 'שגיאה בהעלאת הקובץ' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: 'חסר URL' }, { status: 400 });
    }

    await del(url);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return Response.json({ error: 'שגיאה במחיקת הקובץ' }, { status: 500 });
  }
}

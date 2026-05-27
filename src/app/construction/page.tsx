import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';

export default async function Page() {
  // 1. Detect if mobile from user-agent header
  const reqHeaders = await headers();
  const userAgent = reqHeaders.get('user-agent') || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // 2. Read the appropriate file from the public folder
  const filename = isMobile ? 'mobile.html' : 'desktop.html';
  const filePath = path.join(process.cwd(), 'public', 'construction', filename);
  
  let html = '';
  try {
    html = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    // Fallback to index.html if desktop/mobile aren't available
    const fallbackPath = path.join(process.cwd(), 'public', 'construction', 'index.html');
    html = fs.readFileSync(fallbackPath, 'utf8');
  }

  // 3. Render raw HTML cleanly
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}

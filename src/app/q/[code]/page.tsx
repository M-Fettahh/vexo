'use client';

import { use } from 'react';
import App from '../../../App';

export default function QRPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  return <App initialCode={code} />;
}

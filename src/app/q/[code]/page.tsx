'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import App from '../../../App';

export default function QRRoutePage() {
  const params = useParams();
  const code = typeof params?.code === 'string' ? params.code : Array.isArray(params?.code) ? params.code[0] : '';

  return <App initialCode={code} />;
}

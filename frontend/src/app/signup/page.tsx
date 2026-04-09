'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Signup route now redirects to the combined auth page at /login?tab=signup.
 * All signup logic lives in the unified Login page component.
 */
export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?tab=signup');
  }, [router]);

  return null;
}

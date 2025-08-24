import { SignUp } from '@clerk/nextjs';
import { Icons } from '@/components';

export default function SignUpPage() {
  return (
    <div className="min-w-screen min-h-screen flex flex-col items-center justify-center py-4 md:py-16 space-y-3">
      <Icons.Logo className="h-10 w-10 md:h-14 md:w-14 mb-2" />
      <SignUp />
    </div>
  );
}

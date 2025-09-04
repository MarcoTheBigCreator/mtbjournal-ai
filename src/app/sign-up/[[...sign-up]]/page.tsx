import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      <SignUp />
    </div>
  );
}

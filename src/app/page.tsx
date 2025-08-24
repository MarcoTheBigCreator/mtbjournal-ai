import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { buttonVariants, Vortex } from '@/components';
import { titleFont } from '@/config';
import { cn } from '@/lib';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { userId } = auth();

  const href = userId ? '/journal' : '/new-user';

  if (userId) {
    return redirect('/journal');
  }

  return (
    <div className="w-screen mx-auto h-screen overflow-hidden">
      <Vortex
        rangeY={200}
        particleCount={600}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h1
          className={`${titleFont.className} text-white text-2xl md:text-6xl font-bold text-center`}
        >
          Meet The Best Journal App Enhanced with AI
        </h1>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          A journal app that helps you understand your emotions and thoughts,
          keeping a track of your mental health.
        </p>
        <div className="flex flex-col sm:flex-row items-center mt-6">
          <Link
            href={href}
            className={cn(
              buttonVariants({ variant: 'primary' }),
              'group relative'
            )}
          >
            <span>Get Started</span>
            <div className="w-0 translate-x-[100%] opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100 group-hover:ml-1">
              <ArrowRight width={24} height={24} />
            </div>
          </Link>
        </div>
      </Vortex>
    </div>
  );
}

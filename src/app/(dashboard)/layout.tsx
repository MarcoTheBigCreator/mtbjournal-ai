import { SideMenu } from '@/components';
import { cn } from '@/lib';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row w-full flex-1 border-neutral-700 overflow-hidden',
        'min-h-screen'
      )}
    >
      <SideMenu />
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-900 flex flex-col gap-2 flex-1 w-full min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}

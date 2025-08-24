'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { generatePaginationNumbers } from '@/utils';
import { cn } from '@/lib';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageString = searchParams.get('page') ?? 1;
  const currentPage = isNaN(+pageString) ? 1 : +pageString;
  const allPages = generatePaginationNumbers(currentPage, totalPages);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);

    if (pageNumber === '...') {
      return `${pathname}?${params.toString()}`;
    }

    if (+pageNumber <= 0) {
      return `${pathname}`;
    }

    if (+pageNumber > totalPages) {
      return `${pathname}?${params.toString()}`;
    }

    params.set('page', String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  return (
    totalPages >= 2 && (
      <div className="flex justify-center mb-8">
        <nav
          aria-label="Pagination"
          className="inline-flex items-center bg-neutral-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-2"
        >
          <ul className="flex items-center space-x-1">
            <li>
              <Link
                className="relative flex items-center justify-center w-10 h-10 rounded-full text-violet-300 hover:bg-violet-700 hover:bg-opacity-20 transition-all duration-300"
                href={createPageUrl(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={24} />
              </Link>
            </li>

            {allPages.map((page, index) => (
              <li key={page + '-' + index}>
                <Link
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-full text-violet-100 hover:bg-violet-700 hover:bg-opacity-20 transition-all duration-300',
                    {
                      'bg-violet-700 bg-opacity-50 text-white shadow-lg':
                        page === currentPage,
                    }
                  )}
                  href={createPageUrl(page)}
                >
                  {page}
                </Link>
              </li>
            ))}

            <li>
              <Link
                className="relative flex items-center justify-center w-10 h-10 rounded-full text-violet-300 hover:bg-violet-700 hover:bg-opacity-20 transition-all duration-300"
                href={createPageUrl(currentPage + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={24} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    )
  );
};

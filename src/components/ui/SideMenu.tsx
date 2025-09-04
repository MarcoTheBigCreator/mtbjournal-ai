'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Sidebar, SidebarBody, SidebarLink } from './Sidebar';
import { BrainCircuit, ChartSpline, NotebookText } from 'lucide-react';
import { LogoWithText, LogoIcon } from '../logos/Logo';

export const SideMenu = () => {
  const links = [
    {
      label: 'Journal Dashboard',
      href: '/journal',
      icon: (
        <NotebookText className="text-neutral-700 dark:text-neutral-200 h-[1.35rem] w-[1.35rem] flex-shrink-0" />
      ),
    },
    {
      label: 'AI Entry Search',
      href: '/ai-search',
      icon: (
        <BrainCircuit className="text-neutral-700 dark:text-neutral-200 h-[1.35rem] w-[1.35rem] flex-shrink-0" />
      ),
    },
    {
      label: 'AI Mood Chart',
      href: '/mood-chart',
      icon: (
        <ChartSpline className="text-neutral-700 dark:text-neutral-200 h-[1.35rem] w-[1.35rem] flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <LogoWithText /> : <LogoIcon />}
            <div className="mt-10 flex flex-col gap-2 space-y-4">
              {open ? (
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: {
                        flexDirection: 'row-reverse',
                        marginBottom: '0.5rem',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      },
                      userButtonOuterIdentifier: {
                        fontSize: '0.875rem',
                        lineHeight: '1.25rem',
                        margin: '0',
                        paddingLeft: '0.2rem',
                        fontWeight: '400',
                      },
                    },
                  }}
                  showName
                />
              ) : (
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: {
                        marginBottom: '0.5rem',
                      },
                    },
                  }}
                />
              )}
              {links.map((link, idx) => (
                <div key={idx} onClick={() => setOpen(false)}>
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </>
  );
};

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils/class';

const NavLink = ({
  path,
  currentPath,
  href,
  label,
}: {
  path: string;
  currentPath: string;
  href: string;
  label: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'text-white text-base hover:text-gray-300 px-2 rounded-md py-1 hover:bg-gray-900',
        currentPath === path &&
          'bg-white text-black hover:text-gray-900 hover:bg-gray-200',
      )}
    >
      {label}
    </Link>
  );
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="">
      <div className="bg-black font-sans">
        <div className="container mx-auto p-4 font-sans max-w-4xl flex justify-between items-center">
          <Link href="/">
            <Image
              src="/Logo_barlow_b.png"
              alt="Oxyera Logo"
              height={36}
              width={113}
            />
          </Link>
          <div className="flex gap-5 border border-gray-700 rounded-lg py-1.5 px-2">
            <NavLink
              path="/"
              currentPath={pathname}
              href="/patient"
              label="Patients"
            />
            <NavLink
              path="/medication"
              currentPath={pathname}
              href="/medication"
              label="Medications"
            />
            <NavLink
              path="/assignment"
              currentPath={pathname}
              href="/assignment"
              label="Assignments"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 font-sans max-w-4xl">
        {children}
      </div>
    </div>
  );
}

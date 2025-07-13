'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/class';

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
            <Link
              href="/patient"
              className={cn(
                'text-white text-base hover:text-gray-300 px-2 rounded-md py-1 hover:bg-gray-900',
                pathname === '/patient' &&
                  'bg-white text-black hover:text-gray-900 hover:bg-gray-200',
              )}
            >
              Patients
            </Link>
            <Link
              href="/medication"
              className={cn(
                'text-white text-base hover:text-gray-300 px-2 rounded-md py-1 hover:bg-gray-900',
                pathname === '/medication' &&
                  'bg-white text-black hover:text-gray-900 hover:bg-gray-200',
              )}
            >
              Medications
            </Link>
            <Link
              href="/assignment"
              className={cn(
                'text-white text-base hover:text-gray-300 px-2 rounded-md py-1 hover:bg-gray-900',
                pathname === '/assignment' &&
                  'bg-white text-black hover:text-gray-900 hover:bg-gray-200',
              )}
            >
              Assignments
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 font-sans max-w-4xl">
        {children}
      </div>
    </div>
  );
}

import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const setVh = useCallback(() => {
    const height = window.innerHeight;
    document.documentElement.style.setProperty('--vh', height / 100 + 'px');
  }, []);

  useEffect(() => {
    window.addEventListener('load', setVh);
    window.addEventListener('resize', setVh);
  }, [setVh]);

  return (
    <>
      {false && (
        <nav className="flex gap-2 bg-slate-500 p-4 text-white">
          <Link href="/stations">
            <a className="text-sm">Stations</a>
          </Link>
          <Link href="/timetable/stations/Frankfurt Hbf">
            <a className="text-sm">Timetable</a>
          </Link>
        </nav>
      )}
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;

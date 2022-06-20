import type { AppProps } from 'next/app';
import Link from 'next/link';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <nav className="flex gap-2 bg-slate-500 p-4 text-white">
        <Link href="/stations">
          <a className="text-sm">Stations</a>
        </Link>
        <Link href="/timetable/stations/Frankfurt Hbf">
          <a className="text-sm">Timetable</a>
        </Link>
      </nav>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;

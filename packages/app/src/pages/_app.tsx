import type { AppProps } from 'next/app';
import Link from 'next/link';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {false && (
        <nav className="flex gap-2 bg-slate-500 p-4 text-white">
          <Link className="text-sm" href="/stations">
            Stations
          </Link>
          <Link className="text-sm" href="/timetable/stations/Frankfurt Hbf">
            Timetable
          </Link>
        </nav>
      )}
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;

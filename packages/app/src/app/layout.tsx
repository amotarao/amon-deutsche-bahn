import Link from "next/link";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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
        {children}
      </body>
    </html>
  );
}

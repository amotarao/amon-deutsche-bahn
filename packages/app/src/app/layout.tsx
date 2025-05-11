import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark:bg-slate-900 dark:text-gray-100">
      <body className="pb-40">{children}</body>
    </html>
  );
}

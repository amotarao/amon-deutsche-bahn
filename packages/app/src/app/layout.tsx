import "../styles/globals.css";

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="pb-40">{children}</body>
    </html>
  );
}

import "./style.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className="dark:bg-slate-900 dark:text-gray-100">
      <body className="pb-40">{children}</body>
    </html>
  );
}

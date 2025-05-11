import "./style.css";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="de" className="dark:bg-slate-900 dark:text-gray-100">
      <body className="pb-40">{children}</body>
    </html>
  );
}

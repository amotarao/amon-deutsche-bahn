export default function Page() {
  return (
    <div>
      <h1>NEXT_PUBLIC_VERCEL_URL</h1>
      <p>{process.env.NEXT_PUBLIC_VERCEL_URL}</p>
    </div>
  );
}

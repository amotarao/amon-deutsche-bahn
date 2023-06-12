export default function Page() {
  return (
    <div>
      <h2>NEXT_PUBLIC_VERCEL_URL</h2>
      <p>{process.env.NEXT_PUBLIC_VERCEL_URL}</p>
      <h2>NEXT_PUBLIC_VERCEL_BRANCH_URL</h2>
      <p>{process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}</p>
    </div>
  );
}

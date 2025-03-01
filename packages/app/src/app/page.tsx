import Link from "next/link";

export default function Page() {
  return (
    <div>
      <ul className="list-disc pl-4">
        <li>
          <Link className="underline" href="/db/station">
            DB Station
          </Link>
        </li>
      </ul>
    </div>
  );
}

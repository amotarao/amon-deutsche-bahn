import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export type StationIdListProps = {
  ids: string[];
};

export const StationIdList: React.FC<StationIdListProps> = ({ ids }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!ids.length) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-1">
      {ids.map((id) => (
        <li key={id}>
          <Link
            className="px-4 py-2 text-xs underline"
            href={{
              pathname,
              query: {
                ...Object.fromEntries(searchParams?.entries() ?? []),
                id,
              },
            }}
            replace
          >
            {id}
          </Link>
        </li>
      ))}
    </ul>
  );
};

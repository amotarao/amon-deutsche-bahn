import { formatUrl } from 'next/dist/shared/lib/router/utils/format-url';
import Link from 'next/link';
import { useRouter } from 'next/router';

export type StationIdListProps = {
  ids: string[];
};

export const StationIdList: React.FC<StationIdListProps> = ({ ids }) => {
  const router = useRouter();

  if (!ids.length) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-1">
      {ids.map((id) => (
        <li key={id}>
          <Link
            className="px-4 py-2 text-xs underline"
            href={formatUrl({
              pathname: router.asPath.split('?').slice(0, 1).join(''),
              query: {
                ...router.query,
                id,
              },
            })}
            replace
          >
            {id}
          </Link>
        </li>
      ))}
    </ul>
  );
};

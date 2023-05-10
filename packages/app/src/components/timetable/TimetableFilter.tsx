'use client';

import debounce from 'lodash.debounce';
import type { Route } from 'next';
import { formatUrl } from 'next/dist/shared/lib/router/utils/format-url';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { TimetableRequestQuery, getGermanyDate, getGermanyTime } from '../../modules/fetch-api/timetable';

export type TimetableFilterProps = {
  className?: string;
  name: string;
};

export const TimetableFilter: React.FC<TimetableFilterProps> = ({ className, name }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const id = searchParams?.has('id') ? searchParams.get('id') || undefined : undefined;
  const date = searchParams?.has('date') ? searchParams.get('date') || undefined : undefined;
  const time = searchParams?.has('time') ? searchParams.get('time') || undefined : undefined;
  const filter = searchParams?.has('filter') ? searchParams.getAll('filter') || undefined : undefined;
  const type = searchParams?.has('type') ? searchParams.get('type') || undefined : undefined;
  const ignoreNullablePlatform = searchParams?.has('ignoreNullablePlatform')
    ? searchParams.get('ignoreNullablePlatform') || undefined
    : undefined;

  const replace = debounce(({ name = '', ...query }: Partial<TimetableRequestQuery>) => {
    const newQuery = Object.fromEntries(
      Object.entries({
        id,
        date,
        time,
        filter,
        type,
        ignoreNullablePlatform,
        ...query,
      }).filter(([, value]) => value !== undefined)
    );

    router.replace(
      formatUrl({
        pathname: name ? `/timetable/stations/${name}` : pathname,
        query: newQuery,
      }) as Route
    );
  }, 1000);

  return (
    <div className={`flex flex-col border-b border-gray-300 bg-white text-sm ${className}`}>
      <div className="border-b border-dashed border-gray-300">
        <input
          className="w-full px-4 py-2"
          type="text"
          name="name"
          defaultValue={decodeURIComponent(name)}
          onChange={(e) => {
            replace({ name: e.target.value, id: '' });
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') {
              return;
            }
            replace({ id: '' });
          }}
          onBlur={(e) => {
            replace({ name: e.target.value, id: '' });
          }}
        />
      </div>
      <div className="flex border-b border-dashed border-gray-300">
        <input
          className="w-1/2 px-4 py-2"
          type="date"
          name="date"
          defaultValue={date || getGermanyDate()}
          onChange={(e) => {
            replace({ date: e.target.value });
          }}
        />
        <input
          className="w-1/2 px-4 py-2"
          type="time"
          name="time"
          defaultValue={time || getGermanyTime()}
          onChange={(e) => {
            replace({ time: e.target.value });
          }}
        />
      </div>
      <div className="flex border-b border-dashed border-gray-300">
        {[
          { id: 'express', name: 'Express' },
          { id: 'train', name: 'Train' },
          { id: 's-bahn', name: 'S-Bahn' },
        ].map((currentFilter) => (
          <label className="flex grow items-center py-2 pl-4 pr-2" key={currentFilter.id}>
            <input
              className="mr-2"
              type="checkbox"
              name="filter"
              value={currentFilter.id}
              defaultChecked={filter && filter.length > 0 ? filter.includes(currentFilter.id) : true}
              onChange={(e) => {
                const value = e.target.value;
                const newFilter = ['express', 'train', 's-bahn'].filter((item) =>
                  item === value ? e.target.checked : true
                );
                replace({ filter: newFilter });
              }}
            />
            {currentFilter.name}
          </label>
        ))}
      </div>
      <div className="flex">
        {[
          { id: 'both', name: 'Both' },
          { id: 'dep', name: 'Dep' },
          { id: 'arr', name: 'Arr' },
        ].map((currentType) => (
          <label className="flex grow items-center py-2 pl-4 pr-2" key={currentType.id}>
            <input
              className="mr-2"
              type="radio"
              name="type"
              value={currentType.id}
              defaultChecked={type ? type === currentType.id : 'both' === currentType.id}
              onChange={(e) => {
                replace({ type: e.target.value });
              }}
            />
            {currentType.name}
          </label>
        ))}
        <label className="flex grow items-center py-2 pl-4 pr-2">
          <input
            className="mr-2"
            type="checkbox"
            name="ignoreNullablePlatform"
            defaultChecked={ignoreNullablePlatform === 'true' ? true : false}
            onChange={(e) => {
              replace({ ignoreNullablePlatform: e.target.checked ? 'true' : 'false' });
            }}
          />
          has Plf
        </label>
      </div>
    </div>
  );
};

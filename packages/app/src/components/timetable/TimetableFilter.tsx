'use client';

import debounce from 'lodash.debounce';
import type { Route } from 'next';
import { formatUrl } from 'next/dist/shared/lib/router/utils/format-url';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { TimetableRequestQuery } from '../../modules/fetch-api/timetable';

export type TimetableFilterProps = {
  className?: string;
  name: string;
};

export const TimetableFilter: React.FC<TimetableFilterProps> = ({ className, name }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const id = searchParams?.get('id') ?? '';
  const date = searchParams?.get('date') ?? new Date().toISOString().slice(0, 10);
  const time = searchParams?.get('time') ?? new Date().toISOString().slice(11, 16);
  const filter = useMemo(() => searchParams?.getAll('filter') ?? ['express', 'train', 's-bahn'], [searchParams]);
  const type = searchParams?.get('type') ?? 'both';
  const ignoreNullablePlatform = (searchParams?.get('ignoreNullablePlatform') ?? 'false') === 'true' ? 'true' : 'false';

  const replace = debounce(({ name = '', ...query }: Partial<TimetableRequestQuery>) => {
    router.replace(
      formatUrl({
        pathname: name ? `/timetable/stations/${name}` : pathname,
        query: {
          id,
          date,
          time,
          filter,
          type,
          ignoreNullablePlatform,
          ...query,
        },
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
          defaultValue={name}
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
          defaultValue={date}
          onChange={(e) => {
            replace({ date: e.target.value });
          }}
        />
        <input
          className="w-1/2 px-4 py-2"
          type="time"
          name="time"
          defaultValue={time}
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
              defaultChecked={filter.length === 0 ? true : filter.includes(currentFilter.id)}
              onChange={(e) => {
                const value = e.target.value;
                const newFilter = ['express', 'train', 's-bahn'].filter((item) =>
                  item === value ? e.target.checked : true
                );
                replace({ filter: newFilter.length <= 1 ? newFilter[0] || '' : newFilter });
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
              defaultChecked={type === currentType.id}
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
            defaultChecked={ignoreNullablePlatform === 'true'}
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

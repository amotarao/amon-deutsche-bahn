import { ChangeEventHandler, useMemo } from 'react';
import { TimetableRequestQuery } from '../../pages/timetable/stations/[name]';

export type TimetableFilterProps = {
  className?: string;
  name: string;
  date: string;
  time: string;
  filter: string | string[];
  type: string;
  ignoreNullablePlatform: 'true' | 'false';
  onChange: (obj: Partial<TimetableRequestQuery>) => void;
};

export const TimetableFilter: React.FC<TimetableFilterProps> = ({
  className,
  name,
  date,
  time,
  filter,
  type,
  ignoreNullablePlatform,
  onChange,
}) => {
  const filterArray = useMemo(() => {
    return Array.isArray(filter) ? filter : [filter];
  }, [filter]);

  const onChangeFilter: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const newFilter = [...filterArray, value].filter((item) => (item === value ? e.target.checked : true));
    onChange({ filter: newFilter.length <= 1 ? newFilter[0] || '' : newFilter });
  };

  return (
    <div className={`flex flex-col border-b border-gray-300 bg-white text-sm ${className}`}>
      <div className="border-b border-dashed border-gray-300">
        <input
          className="w-full px-4 py-2"
          type="text"
          name="name"
          value={name}
          onChange={(e) => {
            onChange({ name: e.target.value, id: '' });
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') {
              return;
            }
            onChange({ id: '' });
          }}
          onBlur={(e) => {
            onChange({ name: e.target.value, id: '' });
          }}
        />
      </div>
      <div className="flex border-b border-dashed border-gray-300">
        <input
          className="w-1/2 px-4 py-2"
          type="date"
          name="date"
          value={date}
          onChange={(e) => {
            onChange({ date: e.target.value });
          }}
        />
        <input
          className="w-1/2 px-4 py-2"
          type="time"
          name="time"
          value={time}
          onChange={(e) => {
            onChange({ time: e.target.value });
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
              checked={filter.includes(currentFilter.id)}
              onChange={onChangeFilter}
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
              checked={type === currentType.id}
              onChange={(e) => {
                onChange({ type: e.target.value });
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
            checked={ignoreNullablePlatform === 'true'}
            onChange={(e) => {
              onChange({ ignoreNullablePlatform: e.target.checked ? 'true' : 'false' });
            }}
          />
          has Plf
        </label>
      </div>
    </div>
  );
};

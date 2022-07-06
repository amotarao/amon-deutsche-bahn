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
        <label className="flex grow items-center py-2 pl-4 pr-2">
          <input
            className="mr-2"
            type="checkbox"
            name="filter"
            value="express"
            checked={filter.includes('express')}
            onChange={onChangeFilter}
          />
          Express
        </label>
        <label className="flex grow items-center py-2 pl-4 pr-2">
          <input
            className="mr-2"
            type="checkbox"
            name="filter"
            value="train"
            checked={filter.includes('train')}
            onChange={onChangeFilter}
          />
          Train
        </label>
        <label className="flex grow items-center py-2 pl-4 pr-2">
          <input
            className="mr-2"
            type="checkbox"
            name="filter"
            value="s-bahn"
            checked={filter.includes('s-bahn')}
            onChange={onChangeFilter}
          />
          S-Bahn
        </label>
      </div>
      <div className="flex">
        <label className="flex grow items-center py-2 pl-4 pr-2">
          <input
            className="mr-2"
            type="radio"
            name="type"
            value="both"
            checked={type === 'both'}
            onChange={(e) => {
              onChange({ type: e.target.value });
            }}
          />
          Both
        </label>
        <label className="flex grow items-center py-2 pl-4 pr-2">
          <input
            className="mr-2"
            type="radio"
            name="type"
            value="dep"
            checked={type === 'dep'}
            onChange={(e) => {
              onChange({ type: e.target.value });
            }}
          />
          Departure
        </label>
        <label className="flex grow items-center py-2 pl-4 pr-2">
          <input
            className="mr-2"
            type="radio"
            name="type"
            value="arr"
            checked={type === 'arr'}
            onChange={(e) => {
              onChange({ type: e.target.value });
            }}
          />
          Arrival
        </label>
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

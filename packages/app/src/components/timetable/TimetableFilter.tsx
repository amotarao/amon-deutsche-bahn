import { TimetableRequestQuery } from '../../pages/timetable/stations/[name]';

export type TimetableFilterProps = {
  className?: string;
  name: string;
  date: string;
  time: string;
  filter: string;
  type: string;
  onChange: (obj: Partial<TimetableRequestQuery>) => void;
};

export const TimetableFilter: React.FC<TimetableFilterProps> = ({
  className,
  name,
  date,
  time,
  filter,
  type,
  onChange,
}) => {
  return (
    <div className={`flex flex-col border-b border-gray-300 bg-white text-sm ${className}`}>
      <div className="border-b border-dashed border-gray-300">
        <input
          className="w-full p-2"
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
          className="w-1/2 p-2"
          type="date"
          name="date"
          value={date}
          onChange={(e) => {
            onChange({ date: e.target.value });
          }}
        />
        <input
          className="w-1/2 p-2"
          type="time"
          name="time"
          value={time}
          onChange={(e) => {
            onChange({ time: e.target.value });
          }}
        />
      </div>
      <div className="flex border-b border-dashed border-gray-300">
        <label className="flex w-1/4 items-center p-2">
          <input
            className="mr-2"
            type="radio"
            name="filter"
            value="all"
            checked={filter === 'all'}
            onChange={(e) => {
              onChange({ filter: e.target.value });
            }}
          />
          All
        </label>
        <label className="flex w-1/4 items-center p-2">
          <input
            className="mr-2"
            type="radio"
            name="filter"
            value="express"
            checked={filter === 'express'}
            onChange={(e) => {
              onChange({ filter: e.target.value });
            }}
          />
          Express
        </label>
        <label className="flex w-1/4 items-center p-2">
          <input
            className="mr-2"
            type="radio"
            name="filter"
            value="train"
            checked={filter === 'train'}
            onChange={(e) => {
              onChange({ filter: e.target.value });
            }}
          />
          Train
        </label>
        <label className="flex w-1/4 items-center p-2">
          <input
            className="mr-2"
            type="radio"
            name="filter"
            value="s"
            checked={filter === 's'}
            onChange={(e) => {
              onChange({ filter: e.target.value });
            }}
          />
          S-Bahn
        </label>
      </div>
      <div className="flex">
        <label className="flex w-1/3 items-center p-2">
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
        <label className="flex w-1/3 items-center p-2">
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
        <label className="flex w-1/3 items-center p-2">
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
          Both (Beta)
        </label>
      </div>
    </div>
  );
};

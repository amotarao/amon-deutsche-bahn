export type StationIdListProps = {
  ids: string[];
  onClick?: (id: string) => void;
};

export const StationIdList: React.FC<StationIdListProps> = ({ ids, onClick }) => {
  if (!ids.length) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-1">
      {ids.map((id) => (
        <li key={id}>
          <button
            className="p-2 text-xs underline"
            onClick={() => {
              onClick && onClick(id);
            }}
          >
            {id}
          </button>
        </li>
      ))}
    </ul>
  );
};

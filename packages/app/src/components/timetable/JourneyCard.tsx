import Link from 'next/link';
import { Journey } from '../../utils/api/timetable/types';

export type JourneyCardProps = {
  className?: string;
  journey: Journey;
};

export const JourneyCard: React.FC<JourneyCardProps> = ({ className, journey }) => {
  const information = [
    journey.information.replaced ? `Replaced: ${journey.information.replacedTo}` : '',
    journey.information.changedRoute ? 'Changed Route' : '',
    journey.information.changedOrigin ? `Changed Origin: ${journey.information.changedOriginTo}` : '',
    journey.information.changedDestination ? `Changed Destination: ${journey.information.changedDestinationTo}` : '',
    journey.information.specialTrain ? 'Special Train' : '',
    journey.information.replacementTrain ? `Replacement Train: ${journey.information.replacementTrainFrom}` : '',
    ...journey.information.others,
  ]
    .filter((info) => info)
    .join(', ');

  return (
    <div className={`flex flex-wrap gap-2 border-b border-dashed border-gray-300 p-2 text-xs ${className}`}>
      <p className="w-16">
        <span className={journey.information.canceled ? 'font-bold text-red-500 line-through' : ''}>
          {journey.departureTime || journey.arrivalTime}
        </span>
        <br />
        {journey.departureActualTime && journey.departureTime !== journey.departureActualTime ? (
          <span className={journey.delayed ? 'text-red-500' : ''}>&gt;{journey.departureActualTime}</span>
        ) : journey.arrivalActualTime && journey.arrivalTime !== journey.arrivalActualTime ? (
          <span className={journey.delayed ? 'text-red-500' : ''}>&gt;{journey.arrivalActualTime}</span>
        ) : null}
      </p>
      <p className="flex-grow">
        <Link href={journey.detailHref}>
          <a className="underline">{journey.train}</a>
        </Link>
        <br />
        {journey.origin && <span>{journey.origin}</span>}
        {journey.destination && <span>{journey.destination}</span>}
      </p>
      <p
        className={[
          'w-12',
          journey.information.changedPlatform ? 'text-right font-bold text-red-500' : ' text-right',
        ].join(' ')}
      >
        {journey.platform}
      </p>
      {information && (
        <div className="w-full text-red-500">
          <p>* {information}</p>
        </div>
      )}
      {journey.message && (
        <div className="w-full">
          <p lang="de-DE">{journey.message.title}</p>
          <p lang="de-DE">{journey.message.text}</p>
        </div>
      )}
    </div>
  );
};

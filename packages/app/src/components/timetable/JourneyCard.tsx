import Link from 'next/link';
import { Journey, JourneyInformation, JourneyWithArrivalDepartureInformation } from '../../utils/api/timetable/types';

export type JourneyCardProps = {
  className?: string;
  journey: Journey | JourneyWithArrivalDepartureInformation;
};

export const JourneyCard: React.FC<JourneyCardProps> = ({ className, journey }) => {
  const information =
    'information' in journey ? journey.information : journey.departureInformation || journey.arrivalInformation;

  return (
    <div className={`flex flex-wrap gap-2 px-4 py-2 text-xs ${className}`}>
      <div className="flex w-full gap-2">
        {(('information' in journey && journey.arrivalTime) || !('information' in journey)) && (
          <TimeField
            information={information}
            time={journey.arrivalTime}
            actualTime={journey.arrivalActualTime}
            delayed={journey.delayed}
          />
        )}
        {(('information' in journey && journey.departureTime) || !('information' in journey)) && (
          <TimeField
            information={information}
            time={journey.departureTime}
            actualTime={journey.departureActualTime}
            delayed={journey.delayed}
          />
        )}
        <p className="shrink grow">
          <Link href={journey.detailHref}>
            <a className="underline">{journey.train}</a>
          </Link>
          <br />
          {journey.origin && <span>{journey.origin}</span>}
          {journey.origin && journey.destination && <span> -&gt; </span>}
          {journey.destination && <span>{journey.destination}</span>}
        </p>
        <p
          className={[
            'w-10 shrink-0',
            information?.changedPlatform ? 'text-right font-bold text-red-500' : 'text-right',
          ].join(' ')}
        >
          {journey.platform}
        </p>
      </div>
      {'information' in journey && <InformationField information={journey.information} />}
      {'arrivalInformation' in journey && <InformationField information={journey.arrivalInformation} />}
      {'departureInformation' in journey && <InformationField information={journey.departureInformation} />}
      {journey.message && (
        <div className="w-full">
          <p lang="de-DE">{journey.message.title}</p>
          <p lang="de-DE">{journey.message.text}</p>
        </div>
      )}
    </div>
  );
};

type TimeFieldProps = {
  information: JourneyInformation | null;
  time: string | null;
  actualTime: string | null;
  delayed: boolean;
};

const TimeField: React.FC<TimeFieldProps> = ({ information, time, actualTime, delayed }) => {
  return (
    <div className="w-10 flex-shrink-0 text-right">
      <p>
        <span className={information?.canceled ? 'font-bold text-red-500 line-through' : ''}>{time}</span>
        <br />
        {actualTime && time !== actualTime && <span className={delayed ? 'text-red-500' : ''}>&gt;{actualTime}</span>}
      </p>
    </div>
  );
};

type InformationFieldProps = {
  information: JourneyInformation | null;
};

const InformationField: React.FC<InformationFieldProps> = ({ information }) => {
  if (!information) {
    return null;
  }

  const informationText = [
    information.replaced ? `Replaced: ${information.replacedTo}` : '',
    information.changedRoute ? 'Changed Route' : '',
    information.changedOrigin ? `Changed Origin: ${information.changedOriginTo}` : '',
    information.changedDestination ? `Changed Destination: ${information.changedDestinationTo}` : '',
    information.specialTrain ? 'Special Train' : '',
    information.replacementTrain ? `Replacement Train: ${information.replacementTrainFrom}` : '',
    ...information.others,
  ]
    .filter((info) => info)
    .join(', ');

  if (!informationText) {
    return null;
  }

  return (
    <div className="w-full">
      <p className="text-red-500">* {informationText}</p>
    </div>
  );
};

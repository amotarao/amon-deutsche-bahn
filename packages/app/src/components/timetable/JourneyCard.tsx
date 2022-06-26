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
      {
        <InformationField
          informations={[
            'information' in journey ? journey.information : null,
            'arrivalInformation' in journey ? journey.arrivalInformation : null,
            'departureInformation' in journey ? journey.departureInformation : null,
          ]}
        />
      }
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
  informations: (JourneyInformation | null)[];
};

const InformationField: React.FC<InformationFieldProps> = ({ informations }) => {
  const informationSet = new Set();

  informations.forEach((information) => {
    if (information === null) {
      return;
    }
    information.replaced && informationSet.add(`Replaced: ${information.replacedTo}`);
    information.changedRoute && informationSet.add('Changed Route');
    information.changedOrigin && informationSet.add(`Changed Origin: ${information.changedOriginTo}`);
    information.changedDestination && informationSet.add(`Changed Destination: ${information.changedDestinationTo}`);
    information.specialTrain && informationSet.add('Special Train');
    information.replacementTrain && informationSet.add(`Replacement Train: ${information.replacementTrainFrom}`);
    information.others.forEach((other) => informationSet.add(other));
  });

  const informationText = Array.from(informationSet).join(', ');

  if (!informationText) {
    return null;
  }

  return (
    <div className="w-full">
      <p className="text-red-500">* {informationText}</p>
    </div>
  );
};

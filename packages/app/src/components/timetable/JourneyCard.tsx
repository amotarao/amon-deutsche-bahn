import classNames from 'classnames';
import type { Route } from 'next';
import Link from 'next/link';
import { JourneyInformation, JourneyWithArrivalDepartureInformation } from '../../utils/api/timetable/types';

export type JourneyCardProps = {
  className?: string;
  type: 'arr' | 'dep' | 'both';
  journey: JourneyWithArrivalDepartureInformation;
};

export const JourneyCard: React.FC<JourneyCardProps> = ({ className, type = 'both', journey }) => {
  const information =
    type === 'both'
      ? journey.departureInformation || journey.arrivalInformation
      : type === 'arr'
        ? journey.arrivalInformation
        : journey.departureInformation;

  return (
    <div className={classNames('flex flex-wrap gap-2 px-4 py-2 text-xs', className)}>
      <div className="flex w-full gap-2">
        {(type === 'both' || type === 'arr') && (
          <TimeField
            information={journey.arrivalInformation}
            time={journey.arrivalTime}
            actualTime={journey.arrivalActualTime}
            delayed={journey.delayed}
          />
        )}
        {(type === 'both' || type === 'dep') && (
          <TimeField
            information={journey.departureInformation}
            time={journey.departureTime}
            actualTime={journey.departureActualTime}
            delayed={journey.delayed}
          />
        )}
        <p className="shrink grow">
          <Link className="underline" href={journey.detailHref as Route} prefetch={false}>
            {journey.train}
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
      <InformationField
        informations={[
          'arrivalInformation' in journey ? journey.arrivalInformation : null,
          'departureInformation' in journey ? journey.departureInformation : null,
        ]}
      />
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
    <div className="w-10 shrink-0 text-right">
      <p>
        <span className={information?.canceled ? 'font-bold text-red-500 line-through' : ''}>{time}</span>
        <br />
        {actualTime && (
          <span className={delayed ? 'text-red-500' : ''}>{time !== actualTime ? <>&gt;{actualTime}</> : <>+0</>}</span>
        )}
      </p>
    </div>
  );
};

type InformationFieldProps = {
  informations: (JourneyInformation | null)[];
};

const InformationField: React.FC<InformationFieldProps> = ({ informations }) => {
  const informationSet = new Set();
  const informationOthersSet = new Set();

  informations.forEach((information) => {
    if (information === null) {
      return;
    }
    information.replaced && informationSet.add(`Replaced: ${information.replacedTo}`);
    information.changedRoute && informationSet.add('Changed Route');
    information.changedOrigin && informationSet.add(`Changed Origin`);
    information.changedDestination && informationSet.add(`Changed Destination: ${information.changedDestinationTo}`);
    information.specialTrain && informationSet.add('Special Train');
    information.replacementTrain && informationSet.add(`Replacement Train: ${information.replacementTrainFrom}`);
    information.others.forEach((other) => informationOthersSet.add(other));
  });

  const informationText = Array.from(informationSet).join(', ');
  const informationOthersText = Array.from(informationOthersSet).join(', ');

  if (!informationText) {
    return null;
  }

  return (
    <div className="w-full">
      {informationText && <p className="font-bold text-red-500">* {informationText}</p>}
      {informationOthersText && <p className="text-red-500">* {informationOthersText}</p>}
    </div>
  );
};

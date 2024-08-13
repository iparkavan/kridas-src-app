import { VariantProps, cva } from 'class-variance-authority';
// import PersonIcon from '../../../assets/icons/person-icon.svg?react';
import CheckIcon from '../../../assets/icons/check-icon.svg?react';
import DashTomatoIcon from '../../../assets/icons/dash-tomato-icons.svg?react';
import DashGrayIcon from '../../../assets/icons/dash-gray-icon.svg?react';
import { RequestStatus } from '../types/request-status-types';
import { requestStatusLabels, userStatusLabels } from '../constants';
import { UserStatus } from '../types/user-types';

type StatusChipProps =
  | {
      type: 'user';
      userStatus: UserStatus;
    }
  | {
      type: 'request';
      requestStatus: RequestStatus;
    };

const chipVariants = cva(
  'flex w-fit items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-sm',
  {
    variants: {
      variant: {
        teal: 'bg-tealLight',
        gray: 'bg-grayGreen70',
        pink: 'bg-pink',
      },
    },
  }
);

type ChipVariant = VariantProps<typeof chipVariants>['variant'];

const StatusChip = (props: StatusChipProps) => {
  const { type } = props;
  let variant: ChipVariant,
    Icon:
      | (React.FunctionComponent<React.SVGProps<SVGSVGElement>> & {
          title?: string | undefined;
        })
      | undefined,
    text = '';

  if (type === 'request') {
    text = requestStatusLabels[props.requestStatus];
    if (props.requestStatus === 'APRD') variant = 'teal';
    else if (props.requestStatus === 'PEND') variant = 'gray';
    else if (props.requestStatus === 'DENY') variant = 'pink';
  } else {
    text = userStatusLabels[props.userStatus];
    // Need to handle for "You" in teams
    if (props.userStatus === 'CONFD') variant = 'teal';
  }

  if (variant === 'teal') {
    Icon = CheckIcon;
  } else if (variant === 'gray') {
    Icon = DashGrayIcon;
  } else if (variant === 'pink') {
    Icon = DashTomatoIcon;
  }

  return (
    <div className={chipVariants({ variant })}>
      {Icon && <Icon />}
      {text}
    </div>
  );

  // <span className="translate-y-[1px] text-sm text-white">{type}</span>
};

export default StatusChip;

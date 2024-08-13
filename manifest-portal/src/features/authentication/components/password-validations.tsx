import { FieldError } from 'react-hook-form';
import { cn } from '../../../lib/cn';
import { passwordValidations } from '../constants';
import TickIcon from '../../../assets/icons/tick-icon.svg?react';
import CrossIcon from '../../../assets/icons/cross-icon.svg?react';

type PasswordValidationsProps = {
  currentError: FieldError | undefined;
};

const PasswordValidations = ({ currentError }: PasswordValidationsProps) => {
  return passwordValidations.map((validation) => {
    const isInvalid =
      currentError &&
      Object.prototype.hasOwnProperty.call(currentError, validation.path);

    return (
      <div
        key={validation.path}
        className={cn(
          'mt-1 flex items-baseline gap-1.5',
          isInvalid ? 'text-tomato' : 'text-teal'
        )}
      >
        {isInvalid ? <CrossIcon /> : <TickIcon />}
        <p className="text-sm">{validation.message}</p>
      </div>
    );
  });
};

export { PasswordValidations };

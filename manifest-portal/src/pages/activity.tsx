import { Input } from '../components/ui/input';
import SearchIcon from '../assets/icons/search-icon.svg?react';
import CalendarIcon from '../assets/icons/calendar-icon.svg?react';
import DropDownIcon from '../assets/icons/dropdown-icon.svg?react';
import { Button } from '../components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';

type ActivityField = {
  clientId: string;
  words: string;
  startDate: string;
  endDate: string;
  httpStatusCode: string;
};

const Activity = () => {
  const { register, handleSubmit } = useForm<ActivityField>();

  const onActivitySubmit: SubmitHandler<ActivityField> = (value) => {
    console.log(value);
  };

  return (
    <div className="">
      <p className="pl-[10px] pt-[23px] text-2xl font-medium text-gray">
        Activity
      </p>
      <form id="activity-form" onSubmit={handleSubmit(onActivitySubmit)}>
        <div className="flex items-center gap-[30px] pt-[23px]">
          <Input
            id="clientId"
            {...register('clientId')}
            wrapperClassName="flex-1"
            leftIcon={<SearchIcon />}
            placeholder="Search for client id"
          />
          <Input
            id="words"
            {...register('words')}
            wrapperClassName="flex-1"
            placeholder="Search for words"
            leftIcon={<SearchIcon />}
          />
        </div>
        <div className="flex items-center gap-[30px] pt-[24px]">
          <Input
            id="startDate"
            {...register('startDate')}
            wrapperClassName="w-full"
            leftIcon={<CalendarIcon />}
            placeholder="Start date"
          />
          <Input
            id="endDate"
            {...register('endDate')}
            wrapperClassName="w-full"
            leftIcon={<CalendarIcon />}
            placeholder="End date"
          />
          <Input
            id="httpStatusCode"
            {...register('httpStatusCode')}
            wrapperClassName="w-full"
            rightIcon={<DropDownIcon />}
            placeholder="HTTP status code"
          />
        </div>
        <div className="mt-6 space-x-6 text-right">
          <Button className="border border-grayGreen100 px-8 py-3.5 ring-grayGreen100">
            Reset
          </Button>
          <Button
            className="border bg-deepForest px-8 py-3.5 text-white ring-deepForest"
            type="submit"
          >
            Search
          </Button>
        </div>
      </form>

      <div className="mt-[70px] flex h-[250px] items-center justify-center rounded-md border border-grayGreen100 bg-white">
        <p className="">No results found</p>
      </div>
    </div>
  );
};

export { Activity };

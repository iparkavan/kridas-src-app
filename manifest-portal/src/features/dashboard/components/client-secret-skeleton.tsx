import { Skeleton } from '../../../components/ui/skeleton';

const ClientSecretSkeleton = () => {
  return (
    <div className="mt-7 max-w-[850px] rounded-md border border-grayGreen100 bg-white">
      <div className="p-6 pr-10">
        <Skeleton className="h-5 w-24" />
        <div className="mt-4">
          <Skeleton className="h-5 w-[70%]" />
        </div>
      </div>
      <hr className="text-grayGreen100" />
      <div className="p-6 pr-10">
        <Skeleton className="h-5 w-24" />
        <div className="mt-4">
          <Skeleton className="h-5 w-[70%]" />
        </div>
      </div>
    </div>
  );
};

export { ClientSecretSkeleton };

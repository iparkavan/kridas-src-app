import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';

const Security = () => {
  return (
    <div>
      <h2 className="text-xl font-medium">Multi-Factor Authentication</h2>
      <div className="mt-7 max-w-[800px] rounded-md border border-grayGreen100 bg-white">
        <div className="border-b border-grayGreen100 p-7">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">
              Enforce Multi-Factor Authentication For All Organization Members
            </p>
            <div className="flex items-end justify-center gap-2.5">
              <label htmlFor="mfaSwitch" className="text-sm">
                Off
              </label>
              <Switch id="mfaSwitch" />
            </div>
          </div>
          <p className="mt-4">
            When turned on, all members on your team will be required <br /> to
            set up Multi-Factor Authentication for their account.
          </p>
        </div>
        <div className="flex items-start justify-between p-7">
          <div>
            <p className="text-lg font-medium">
              Account Multi-Factor Authentication
            </p>
            <p className="mt-4">
              Protect your Manifest account with an extra security step.
            </p>
          </div>
          <Button variant="secondary">Set up MFA</Button>
        </div>
      </div>
    </div>
  );
};

export { Security };

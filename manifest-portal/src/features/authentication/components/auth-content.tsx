import { ManifestLogo } from '../../../assets/manifest-logo';
import { ManifestLogoSmall } from '../../../assets/manifest-logo-small';
import TimeIcon from '../../../assets/images/icon_time.png';
import DocumentIcon from '../../../assets/images/icon_document.png';
import PersonIcon from '../../../assets/images/icon_person.png';
import DataIcon from '../../../assets/images/icon_data.png';
import NetworkLogo from '../../../assets/images/logo_Network.png';
import FortuneLogo from '../../../assets/images/logo_Fortune.png';
import ForbesLogo from '../../../assets/images/logo_Forbes.png';
import PBSLogo from '../../../assets/images/logo_PBS.png';
import ChicagoLogo from '../../../assets/images/logo_builtin_chicago.png';

const AuthContent = () => {
  return (
    <section className="flex-1 p-6 sm:p-10 md:px-12 md:py-8 lg:px-20">
      <div className="md:hidden">
        <ManifestLogoSmall />
      </div>
      <div className="hidden md:block">
        <ManifestLogo />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-deepForest md:mt-14 md:text-4xl md:text-coco">
        Join Manifest Today!
      </h2>
      <p className="mt-3 text-sm md:mt-4 md:text-lg md:text-cocoGray">
        Access our powerful API for simplified retirement account transfers and
        enhance your applications today!
      </p>
      <div className="mt-10 grid grid-cols-2 gap-6 md:mt-12">
        <div>
          <img src={TimeIcon} alt="Time Icon" className="ml-[-6px] w-8" />
          <p className="mt-1 text-sm font-medium text-coco sm:max-w-[80%] md:mt-2 md:text-base">
            Quick start with our self-serve platform
          </p>
        </div>

        <div>
          <img
            src={DocumentIcon}
            alt="Document Icon"
            className="ml-[-6px] w-8"
          />
          <p className="mt-1 text-sm font-medium text-coco sm:max-w-[80%] md:mt-2 md:text-base">
            Developer-Friendly Documentation & Sandbox Environment
          </p>
        </div>

        <div>
          <img src={PersonIcon} alt="Person Icon" className="ml-[-6px] w-8" />
          <p className="mt-1 text-sm font-medium text-coco sm:max-w-[80%] md:mt-2 md:text-base">
            Seamless transfer experience for your users
          </p>
        </div>

        <div>
          <img src={DataIcon} alt="Data Icon" className="ml-[-6px] w-8" />
          <p className="mt-1 text-sm font-medium text-coco sm:max-w-[80%] md:mt-2 md:text-base">
            Advanced security measures to protect data
          </p>
        </div>
      </div>

      <p className="mt-10 text-sm text-cocoGray md:text-base lg:mt-12">
        Featured in
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-5">
        <img src={NetworkLogo} alt="Network Logo" className="h-8" />
        <img src={FortuneLogo} alt="Fortune Logo" className="h-5" />
        <img src={ForbesLogo} alt="Forbes Logo" className="h-5" />
        <img src={PBSLogo} alt="PBS Logo" className="h-6" />
        <img src={ChicagoLogo} alt="Chicago Logo" className="h-8" />
      </div>
    </section>
  );
};

export { AuthContent };

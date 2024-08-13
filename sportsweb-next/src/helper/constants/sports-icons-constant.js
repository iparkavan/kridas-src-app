import { BiBasketball, BiCycling, BiFootball } from "react-icons/bi";
import { FcSportsMode } from "react-icons/fc";
import {
  GiArcheryTarget,
  GiBlackBelt,
  GiBowlingStrike,
  GiBoxingGlove,
  GiBoxingGloveSurprise,
  GiBoxingRing,
  GiChopsticks,
  GiFrisbee,
  GiGamepad,
  GiHockey,
  GiHorseHead,
  GiKatana,
  GiPistolGun,
  GiRun,
  GiTennisRacket,
  GiThrowingBall,
  GiWeightLiftingUp,
} from "react-icons/gi";
import {
  MdGolfCourse,
  MdKitesurfing,
  MdOutlineSports,
  MdOutlineSportsCricket,
  MdOutlineSportsHandball,
  MdOutlineSportsTennis,
  MdRowing,
  MdSailing,
  MdSportsKabaddi,
} from "react-icons/md";
import {
  RiBoxingFill,
  RiCoinLine,
  RiFootballLine,
  RiMotorbikeFill,
} from "react-icons/ri";
import { BsBicycle } from "react-icons/bs";
import {
  FaChess,
  FaHorse,
  FaHorseHead,
  FaSkating,
  FaSkiing,
  FaSwimmer,
  FaTableTennis,
  FaVolleyballBall,
} from "react-icons/fa";
// import { TbSwimming, TbKarate, TbBallFootball } from "react-icons/tb";

export const SportIcons = (sportType) => {
  switch (sportType) {
    case "SPOR25":
      return RiFootballLine;
    case "SPOR28":
      return GiArcheryTarget;
    case "SPOR29":
      return FcSportsMode;
    case "SPOR02":
      return MdOutlineSportsTennis;
    case "SPOR13":
      return BiBasketball;
    case "SPOR04":
      return GiBoxingGlove;
    case "SPOR30":
      return BsBicycle;
    case "SPOR31":
      return GiBowlingStrike;
    case "SPOR18":
      return GiBoxingGloveSurprise;
    case "SPOR11":
      return RiCoinLine;
    case "SPOR15":
      return FaChess;
    case "SPOR05":
      return MdOutlineSportsCricket;
    case "SPOR23":
      return BiCycling;
    case "SPOR32":
      return GiHorseHead;
    case "SPOR33":
      return GiGamepad;
    case "SPOR34":
      return GiKatana;
    case "SPOR07":
      return BiFootball;
    case "SPOR35":
      return BiFootball;
    case "SPOR26":
      return MdSportsKabaddi;
    case "SPOR14":
      return MdGolfCourse;
    case "SPOR36":
      return MdOutlineSportsHandball;
    case "SPOR03":
      return MdOutlineSportsHandball;
    case "SPOR10":
      return GiHockey;
    case "SPOR37":
      return FaHorse;
    case "SPOR38":
      return GiBoxingRing;
    case "SPOR19":
      return MdSportsKabaddi;
    case "SPOR39":
      return RiBoxingFill;
    case "SPOR17":
      return RiMotorbikeFill;
    case "SPOR40":
      return FaHorseHead;
    case "SPOR27":
      return GiWeightLiftingUp;
    case "SPOR16":
      return MdRowing;
    case "SPOR42":
      return MdSailing;
    case "SPOR43":
      return GiPistolGun;
    case "SPOR44":
      return FaSkating;
    case "SPOR45":
      return FaSkiing;
    case "SPOR21":
      return GiChopsticks;
    case "SPOR12":
      return GiThrowingBall;
    case "SPOR01":
      return MdOutlineSportsTennis;
    case "SPOR46":
      return MdKitesurfing;
    case "SPOR22":
      return FaSwimmer;
    case "SPOR06":
      return FaTableTennis;
    case "SPOR47":
      return GiBlackBelt;
    case "SPOR08":
      return GiTennisRacket;
    case "SPOR48":
      return GiRun;
    case "SPOR50":
      return GiFrisbee;
    case "SPOR09":
      return FaVolleyballBall;
    case "SPOR49":
      return BiFootball;
    case "SPOR24":
      return GiWeightLiftingUp;
    case "SPOR20":
      return GiBlackBelt;
    default:
      return MdOutlineSports;
  }
};

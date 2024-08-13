import {
  MdOutlineMail,
  MdLockOutline,
  MdOutlineSmartphone,
  MdOutlineSubject,
  MdOutlinePhotoSizeSelectActual,
  MdOutlineSmartDisplay,
  MdOutlinePoll,
  MdOutlineCategory,
  MdCalendarToday,
  MdErrorOutline,
  MdDateRange,
  MdOutlineArticle,
  MdOutlineKeyboardBackspace,
  MdOutlineSportsScore,
  MdOutlineSportsCricket,
  MdOutlineLocationOn,
  MdEmojiEvents,
  MdSearch,
  MdClose,
  MdOutlineSportsHandball,
  MdOutlinePalette,
  MdOutlineShoppingCart,
  MdOutlineCardGiftcard,
  MdPersonRemove,
} from "react-icons/md";
import { IoArrowBack, IoKeyOutline, IoTrophyOutline } from "react-icons/io5";
import {
  FaPeopleArrows,
  FaRegHeart,
  FaFacebookSquare,
  FaHandshake,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaRegIdCard,
  FaCoins,
  FaCopy,
  FaRegStar,
} from "react-icons/fa";
import {
  BsArrowBarLeft,
  BsArrowBarRight,
  BsDiamondFill,
  BsTrash,
  BsTwitter,
  BsInstagram,
  BsLinkedin,
  BsPersonCircle,
  BsArrowRightShort,
  BsThreeDots,
  BsCartCheck,
} from "react-icons/bs";
import {
  AiOutlineFileJpg,
  AiOutlineFilePdf,
  AiOutlineLike,
  AiOutlineVideoCameraAdd,
  AiOutlineHome,
  AiOutlineInteraction,
  AiOutlineShareAlt,
  AiOutlineTag,
  AiOutlineDollar,
  AiFillShop,
  AiFillSetting,
} from "react-icons/ai";
import {
  RiAttachment2,
  RiImageAddLine,
  RiShareForwardLine,
  RiShareForwardFill,
  RiInstagramFill,
  RiTrophyFill,
  RiHandCoinLine,
} from "react-icons/ri";
import {
  BiComment,
  BiDetail,
  BiChevronRight,
  BiChevronDown,
  BiUserCircle,
  BiEdit,
  BiTransferAlt,
} from "react-icons/bi";
import { IoMdThumbsUp, IoMdHeart } from "react-icons/io";
import {
  GrCircleInformation,
  GrConnect,
  GrContactInfo,
  GrStreetView,
  GrWorkshop,
} from "react-icons/gr";
import {
  HiOutlineViewGridAdd,
  HiMenuAlt1,
  HiBadgeCheck,
  HiMinusCircle,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import { FaPhotoVideo } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import { BsUpload, BsArrowDownShort } from "react-icons/bs";
import { VscReferences, VscMilestone } from "react-icons/vsc";
import {
  FiUser,
  FiSettings,
  FiPower,
  FiEdit,
  FiBriefcase,
  FiPlus,
  FiCheck,
  FiBell,
  FiMoreVertical,
  FiSearch,
  FiLock,
  FiArrowUp,
  FiShare2,
  FiCheckCircle,
  FiActivity,
  FiFilter,
  FiMinus,
  FiRepeat,
} from "react-icons/fi";
import { GiMoneyStack } from "react-icons/gi";
import { CgOptions } from "react-icons/cg";

/***********************************************/
export const AboutDetail = (props) => <GrCircleInformation {...props} />;
export const AddIcon = (props) => <FiPlus {...props} />;
export const AddImageIcon = (props) => <RiImageAddLine {...props} />;
export const AddVideoIcon = (props) => <AiOutlineVideoCameraAdd {...props} />;
export const ArrowBarLeftIcon = (props) => <BsArrowBarLeft {...props} />;
export const ArrowBarRightIcon = (props) => <BsArrowBarRight {...props} />;
export const ArrowLeftIcon = (props) => (
  <MdOutlineKeyboardBackspace {...props} />
);
export const ArrowUpIcon = (props) => <FiArrowUp {...props} />;
export const ArticleIcon = (props) => <MdOutlineArticle {...props} />;
export const AttachmentIcon = (props) => <RiAttachment2 {...props} />;
export const AmountIcon = (props) => <GiMoneyStack {...props} />;

/***********************************************/

/***********************************************/
export const BioIcon = (props) => <BiDetail {...props} />;
export const BellIcon = (props) => <FiBell {...props} />;
export const BackButton = (props) => <IoArrowBack {...props} />;

/***********************************************/

/***********************************************/
export const CalendarIcon = (props) => <MdCalendarToday {...props} />;
export const CareerIcon = (props) => <MdOutlineSportsScore {...props} />;
export const CategoryIcon = (props) => <MdOutlineCategory {...props} />;
export const CheckCircleIcon = (props) => <FiCheckCircle {...props} />;
export const CommentIcon = (props) => <BiComment {...props} color="#2F80ED" />;
export const ContactInfo = (props) => <GrContactInfo {...props} />;
export const ChevronRight = (props) => <BiChevronRight {...props} />;
export const ChevronDown = (props) => <BiChevronDown {...props} />;
export const PictureEditIcon = (props) => <BiEdit {...props} />;
export const CricketIcon = (props) => <MdOutlineSportsCricket {...props} />;
export const CoinIcon = (props) => <FaCoins {...props} />;
export const CopyIcon = (props) => <FaCopy {...props} />;

/***********************************************/

/***********************************************/
export const DeleteIcon = (props) => <BsTrash {...props} />;
export const DollarIcon = (props) => <AiOutlineDollar {...props} />;
/***********************************************/

/***********************************************/
export const EditIcon = (props) => <FiEdit {...props} />;
export const ErrorIcon = (props) => <MdErrorOutline {...props} />;
/***********************************************/

/***********************************************/
export const FacebookIcon = (props) => <FaFacebookSquare {...props} />;
export const FillLikeIcon = (props) => <IoMdThumbsUp {...props} />;
export const FillHeartIcon = (props) => <IoMdHeart {...props} />;
export const FollowIcon = (props) => <FaPeopleArrows {...props} />;
export const FilterIcon = (props) => <FiFilter {...props} />;
/***********************************************/

/***********************************************/
export const HandShakeIcon = (props) => <FaHandshake {...props} />;
export const HeartIcon = (props) => <FaRegHeart {...props} />;
export const HomeIcon = (props) => <AiOutlineHome {...props} />;
export const HandCoinIcon = (props) => <RiHandCoinLine {...props} />;
/***********************************************/

/***********************************************/
// export const InstagramIcon = (props) => <BsInstagram {...props} />;
export const InstagramIcon = (props) => <RiInstagramFill {...props} />;
/***********************************************/

/***********************************************/
export const JpgIcon = (props) => <AiOutlineFileJpg {...props} />;
/***********************************************/

/***********************************************/
export const KeyIcon = (props) => <IoKeyOutline {...props} />;
/***********************************************/

/***********************************************/
export const LinkedinIcon = (props) => <BsLinkedin {...props} />;
export const LogoutIcon = (props) => <FiPower {...props} />;
export const LocationIcon = (props) => <MdOutlineLocationOn {...props} />;
export const LockIcon = (props) => <FiLock {...props} />;
/***********************************************/

/***********************************************/
export const MailIcon = (props) => <MdOutlineMail {...props} />;
export const MandatoryIcon = (props) => <BsDiamondFill {...props} />;
export const MenuDots = (props) => <BsThreeDots {...props} />;
export const MenuVerticalIcon = (props) => <FiMoreVertical {...props} />;
export const MenuAltIcon = (props) => <HiMenuAlt1 {...props} />;
export const MinusIcon = (props) => <FiMinus {...props} />;
export const MilestoneIcon = (props) => <VscMilestone {...props} />;
/***********************************************/

/***********************************************/
export const NavSearchIcon = (props) => <FiSearch {...props} />;
/***********************************************/

/***********************************************/
export const OutlineLikeIcon = (props) => (
  <AiOutlineLike {...props} color="#2F80ED" />
);
export const OrderIcon = (props) => <BsCartCheck {...props} />;
export const OptionsIcon = (props) => <CgOptions {...props} />;

/***********************************************/

/***********************************************/
export const PdfIcon = (props) => <AiOutlineFilePdf {...props} />;
export const PasswordIcon = (props) => <MdLockOutline {...props} />;
export const PersonIcon = (props) => <FiUser {...props} />;
export const PersonCircleIcon = (props) => <BsPersonCircle {...props} />;
export const PhoneIcon = (props) => <MdOutlineSmartphone {...props} />;
export const PollIcon = (props) => <MdOutlinePoll {...props} />;
export const PostIcon = (props) => <MdOutlineSubject {...props} />;
export const PageIcon = (props) => <MdOutlinePalette {...props} />;
export const PhotoIcon = (props) => (
  <MdOutlinePhotoSizeSelectActual {...props} />
);
export const PersonRemoveIcon = (props) => <MdPersonRemove {...props} />;
/***********************************************/

/***********************************************/
export const ReferenceIcon = (props) => <VscReferences {...props} />;
export const RemoveIcon = (props) => <HiMinusCircle {...props} />;
export const RepeatIcon = (props) => <FiRepeat {...props} />;
/***********************************************/

/***********************************************/
export const ShopIcon = (props) => <MdOutlineShoppingCart {...props} />;
export const VoucherIcon = (props) => <MdOutlineCardGiftcard {...props} />;
/***********************************************/

/***********************************************/
export const ThumpsUpIcon = (props) => <FaRegThumbsUp {...props} />;
export const ThumpsDownIcon = (props) => <FaRegThumbsDown {...props} />;
export const TickIcon = (props) => <FiCheck {...props} />;
export const TrophyIcon = (props) => <IoTrophyOutline {...props} />;
export const TwitterIcon = (props) => <BsTwitter {...props} />;
export const TransactionIcon = (props) => <BiTransferAlt {...props} />;

/***********************************************/

/***********************************************/
export const SettingsIcon = (props) => <FiSettings {...props} />;
export const ShareIcon = (props) => (
  <RiShareForwardLine {...props} color="#2F80ED" />
);
export const ShareFillIcon = (props) => <RiShareForwardFill {...props} />;
export const Share2Icon = (props) => <FiShare2 {...props} />;
export const SocialMedia = (props) => <GrStreetView {...props} />;
export const SportsProfile = (props) => <GrWorkshop {...props} />;
export const SubmitIcon = (props) => <BsArrowRightShort {...props} />;
export const ShoppingBagIcon = (props) => <HiOutlineShoppingBag {...props} />;
export const StarIcon = (props) => <FaRegStar {...props} />;
/***********************************************/

/***********************************************/
export const VideoIcon = (props) => <MdOutlineSmartDisplay {...props} />;
export const VerifyIcon = (props) => <HiBadgeCheck {...props} />;
/***********************************************/

/***********************************************/
export const WorkIcon = (props) => <FiBriefcase {...props} />;
/***********************************************/

export const AlbumIcon = (props) => <FaPhotoVideo {...props} />;
export const UploadIcon = (props) => <BsUpload {...props} />;
/***********************************************/
export const EventsIcon = (props) => <MdEmojiEvents {...props} />;
export const SearchIcon = (props) => <MdSearch {...props} />;
export const CloseIcon = (props) => <MdClose {...props} />;
export const DateIcon = (props) => <MdDateRange {...props} />;
export const UserIcon = (props) => <BiUserCircle {...props} />;
export const SportsIcon = (props) => <MdOutlineSportsHandball {...props} />;
export const ViewMoreIcon = (props) => <HiOutlineViewGridAdd {...props} />;
export const SearchBlueIcon = (props) => <FcSearch {...props} />;
export const DownArrowIcon = (props) => <BsArrowDownShort {...props} />;
export const RegisterEvent = (props) => <FaRegIdCard {...props} />;
export const Prize = (props) => <RiTrophyFill {...props} />;
export const Activity = (props) => <FiActivity {...props} />;
export const Interaction = (props) => <AiOutlineInteraction {...props} />;
export const Connection = (props) => <GrConnect {...props} />;
export const Share = (props) => <AiOutlineShareAlt {...props} />;
export const Tag = (props) => <AiOutlineTag {...props} />;
export const Product = (props) => <AiFillShop {...props} />;
export const Service = (props) => <AiFillSetting {...props} />;

/***********************************************/

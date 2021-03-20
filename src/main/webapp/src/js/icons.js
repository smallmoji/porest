import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import GifOutlinedIcon from '@material-ui/icons/GifOutlined';
import PollOutlinedIcon from '@material-ui/icons/PollOutlined';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import ScheduleOutlinedIcon from '@material-ui/icons/ScheduleOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';

export function muiIcon(iconName){
  switch (iconName) {
    case 'homeIcon':
      return <HomeOutlinedIcon />;
    case 'personIcon':
      return <PermIdentityOutlinedIcon />;
    case 'moreHorizontal':
      return <MoreHorizOutlinedIcon/>;
    case 'moreVertical':
      return <MoreVertOutlinedIcon/>;
    case 'mailIcon':
      return <EmailOutlinedIcon/>;
    case 'friendsIcon':
      return <SupervisorAccountOutlinedIcon/>;
    case 'notifIcon':
      return <NotificationsNoneOutlinedIcon/>;
    case 'searchIcon':
      return <SearchOutlinedIcon/>;
    case 'imageIcon':
      return <ImageOutlinedIcon/>;
    case 'gifIcon':
      return <GifOutlinedIcon/>;
    case 'pollIcon':
      return <PollOutlinedIcon/>;
    case 'emojiIcon':
      return <SentimentSatisfiedOutlinedIcon/>;
    case 'scheduleIcon':
      return <ScheduleOutlinedIcon/>;
    case 'arrowBackIcon':
      return <ArrowBackIcon/>;
    case 'commentIcon':
      return <SmsOutlinedIcon/>;
    case 'shareIcon':
      return <ShareOutlinedIcon/>;
    case 'heartIcon':
      return <FavoriteBorderOutlinedIcon/>;
    case 'filledHeartIcon':
      return <FavoriteIcon/>;
    default:
      break;
  }
}
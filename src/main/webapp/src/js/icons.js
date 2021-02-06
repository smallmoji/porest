import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
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

export function muiIcon(iconName){
  switch (iconName) {
    case 'homeIcon':
      return <HomeOutlinedIcon />;
      break;
    case 'personIcon':
      return <PermIdentityOutlinedIcon />;
      break;
    case 'moreHorizontal':
      return <MoreHorizOutlinedIcon/>;
      break;
    case 'moreVertical':
      return <MoreVertOutlinedIcon/>;
      break;
    case 'mailIcon':
      return <EmailOutlinedIcon/>;
      break;
    case 'friendsIcon':
      return <SupervisorAccountOutlinedIcon/>;
      break;
    case 'notifIcon':
      return <NotificationsNoneOutlinedIcon/>;
      break;
    case 'searchIcon':
      return <SearchOutlinedIcon/>;
      break;
    case 'imageIcon':
      return <ImageOutlinedIcon/>;
      break;
    case 'gifIcon':
      return <GifOutlinedIcon/>;
      break;
    case 'pollIcon':
      return <PollOutlinedIcon/>;
      break;
    case 'emojiIcon':
      return <SentimentSatisfiedOutlinedIcon/>;
      break;
    case 'scheduleIcon':
      return <ScheduleOutlinedIcon/>;
      break;
    case 'arrowBackIcon':
      return <ArrowBackIcon/>;
      break;
    case 'commentIcon':
      return <SmsOutlinedIcon/>;
      break;
    case 'shareIcon':
      return <ShareOutlinedIcon/>;
      break;
    case 'heartIcon':
      return <FavoriteBorderOutlinedIcon/>;
      break;
    default:
      break;
  }
}
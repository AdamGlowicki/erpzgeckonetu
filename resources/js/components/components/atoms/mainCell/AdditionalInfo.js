import React from 'react';
import styled from 'styled-components';
import InfoItem from "../infoItem/InfoItem";
import HomeIcon from '@material-ui/icons/Home';
import PublicIcon from '@material-ui/icons/Public';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import TodayIcon from '@material-ui/icons/Today';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import {useSelector} from "react-redux";
import {limitString} from "../../../common/globalMethods";

const StyledWrapper = styled.section`
  display: ${props => props.focus ? 'flex' : 'none'};
  flex-direction: column;
  align-items: flex-start;
  font-size: 10px;
`

const AdditionalInfo = ({stage: {address, country, arrangements, condition, condition_term, add_date, drawer_id, tech}, focus}) => {

    const drawer = useSelector(state => state.investments.drawers && state.investments.drawers.filter(item => item.id === drawer_id)[0])

    const drawerName = drawer ? drawer.name : ''

    return (
        <StyledWrapper focus={focus}>
            <InfoItem icon={<HomeIcon style={{fontSize: '12px'}}/>} title='Adres:' value={address}/>
            <InfoItem icon={<PublicIcon style={{fontSize: '12px'}}/>} title='Powiat:' value={country}/>
            <InfoItem icon={<EmojiTransportationIcon style={{fontSize: '12px'}}/>} title='War. tech.:' value={condition}/>
            <InfoItem icon={<EventBusyIcon style={{fontSize: '12px'}}/>} title='Wygaś. tech.:' value={condition_term}/>
            <InfoItem icon={<TodayIcon style={{fontSize: '12px'}}/>} title='Dodano::' value={add_date}/>
            <InfoItem icon={<ArtTrackIcon style={{fontSize: '12px'}}/>} title='Uzgodnienia:'
                      value={limitString(arrangements, 20)}/>
            <InfoItem icon={<BlurOnIcon style={{fontSize: '12px'}}/>} title='Technologia:' value={tech}/>
            <InfoItem icon={<MeetingRoomIcon style={{fontSize: '12px'}}/>} title='Szuflada:' value={drawerName}/>
        </StyledWrapper>
    );
};

export default AdditionalInfo;

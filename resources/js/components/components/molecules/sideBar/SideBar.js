import React from 'react';
import styled from 'styled-components';
import { NavLink} from 'react-router-dom'
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import StoreMallDirectoryOutlinedIcon from '@material-ui/icons/StoreMallDirectoryOutlined';
import GroupWorkOutlinedIcon from '@material-ui/icons/GroupWorkOutlined';
import ContactMailOutlinedIcon from '@material-ui/icons/ContactMailOutlined';
import PermScanWifiOutlinedIcon from '@material-ui/icons/PermScanWifiOutlined';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import DonutLargeOutlinedIcon from '@material-ui/icons/DonutLargeOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import EuroOutlinedIcon from '@material-ui/icons/EuroOutlined';
import SpeakerNotesOutlinedIcon from '@material-ui/icons/SpeakerNotesOutlined';
import WifiOutlinedIcon from '@material-ui/icons/WifiOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import MapIcon from '@material-ui/icons/Map';

const StyledNav = styled.nav`
  width: 220px;
  background-color: yellowgreen;
  border-radius: 8px;
  max-height: 90vh;
  overflow-y: scroll;
  margin-left: 16px;
  box-shadow: 7px 6px 16px -5px rgba(0,0,0,0.58);
  &::-webkit-scrollbar{
  width: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
  background: #ac0;
  }
`

const StyledUl = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin-left: 20px;
`

const StyledLi =  styled.li`
  display: block;
  margin: 0;
`

const StyledA = styled.a`
  text-transform: none;
  text-decoration: none;
   &:focus, &:hover, &:visited, &:link, &:active {
     text-decoration: none;
   }
  margin-top: 10px;
  padding: 10px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const StyledLink = styled(NavLink)`
  text-transform: none;
  text-decoration: none;
   &:focus, &:hover, &:visited, &:link, &:active {
     text-decoration: none;
   }
  margin-top: 10px;
  padding: 10px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const StyledP = styled.p.attrs({
    className: 'ml-3'
})`
  font: 10px Poppins, sans-serif;
  color: rgba(255,255,255,0.8);
  text-transform: uppercase;
  margin: 0;
  font-weight: 700;
  transition: 300ms;
  &:hover {
    font-size: 12px;
    color: #9A9A9A;
  }
`

const SideBar = () => {
    return (
        <StyledNav>
            <StyledUl>
                <StyledLi>
                    <StyledA href="/dashboard">
                        <BarChartOutlinedIcon style={{color: 'white', opacity: 0.8}}/>
                        <StyledP>dashboard</StyledP>
                    </StyledA>

                    <StyledA href="/warehouse">
                        <StoreMallDirectoryOutlinedIcon style={{color: 'white', opacity: 0.8}}/>
                        <StyledP>magazyn</StyledP>
                    </StyledA>

                    <StyledA href="/cars">
                        <GroupWorkOutlinedIcon style={{color: 'white', opacity: 0.8}}/>
                        <StyledP>grupy</StyledP>
                    </StyledA>

                    <StyledA href="/contractors">
                        <ContactMailOutlinedIcon style={{color: 'white', opacity: 0.8}}/>
                        <StyledP>kontrahenci</StyledP>
                    </StyledA>

                    <StyledA href="/availability">
                        <PermScanWifiOutlinedIcon style={{color: 'white', opacity: 0.8}}/>
                        <StyledP>dostępność usług</StyledP>
                    </StyledA>

                    <StyledA href="/rma">
                        <BuildOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>rma</StyledP>
                    </StyledA>

                    <StyledA href="/bhp">
                        <DonutLargeOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>materiały bhp</StyledP>
                    </StyledA>

                    <StyledA href="/calendar">
                        <CalendarTodayOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>Kalendarz</StyledP>
                    </StyledA>

                    <StyledA href="/map">
                        <ExploreOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>mapa</StyledP>
                    </StyledA>

                    <StyledA href="/bok">
                        <PersonOutlineOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>bok / ph</StyledP>
                    </StyledA>

                    <StyledA href="/reports">
                        <DescriptionOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>raporty</StyledP>
                    </StyledA>

                    <StyledLink to="/react/invest">
                        <EuroOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>inwestycje</StyledP>
                    </StyledLink>

                    <StyledA href="/wiki">
                        <SpeakerNotesOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>wiki</StyledP>
                    </StyledA>

                    <StyledA href="/doc">
                        <AssignmentOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>dokumenty</StyledP>
                    </StyledA>

                    <StyledA href="/nodes">
                        <WifiOutlinedIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>węzły radiowe</StyledP>
                    </StyledA>

                    <StyledLink to="/react/graph">
                        <MapIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>mapa procesu</StyledP>
                    </StyledLink>

                    <StyledLink to="/react/carService">
                        <LocalShippingIcon style={{color: 'white', opacity: 0.8}} />
                        <StyledP>serwis samochodów</StyledP>
                    </StyledLink>

                </StyledLi>
            </StyledUl>
        </StyledNav>
    );
};

export default SideBar;

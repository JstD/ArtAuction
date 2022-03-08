import React, {  useState } from 'react';
// import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import { useSelector } from 'react-redux';
// import { useHistory } from 'react-router';
import Login from './Login';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    
} from 'reactstrap';

const TopNav = () => {
    // const history = useHistory()
    // const user = useSelector(state => state.currentUser)
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return (
        <div>
        <Navbar color="light" light expand="md" >
            <NavbarBrand href="/">
                <Logo> Teqie </Logo>
                
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
                <NavItem style={{marginLeft: 2 + 'em'}}>
                <NavLink href="/myart">My Art</NavLink>
                </NavItem>
                <NavItem style={{marginLeft: 2 + 'em'}}>
                <NavLink href="/myauction">My Auction</NavLink>
                </NavItem>
                
                
            </Nav>
            <Mobile>
            {
                <Login/>                    
            }
            </Mobile>
            </Collapse>
            <Wide>
            {
                <Login/>
            
            }
            </Wide>
        </Navbar>
        </div>
    );
}
const Logo =styled.div`
    padding-left:20px;
`;

const Mobile = styled.div`
    @media (min-width: 768px) {
        display:none;
    }
`;
const Wide = styled.div`
    display: inline-block;
    margin-right:10px;
    @media (max-width: 768px) {
        display:none;
    }
`
export default TopNav;

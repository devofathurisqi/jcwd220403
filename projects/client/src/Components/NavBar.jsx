import React from 'react';
import {
  Container,
  Box,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Menu,
  MenuButton,
  Tag,
  Avatar,
  MenuList,
  MenuItem,
  Icon,
  MenuDivider,
  useBreakpointValue,
  useMediaQuery,
  IconButton,
  Center,
} from '@chakra-ui/react';
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons';
import Logo from '../Assets/Logo.png';
import LogoOnly from '../Assets/Logo_only.png';
//import component
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Category from './Category';
// import { useSelector } from "react-redux"
import useLogout from '../hooks/useLogout';

const NavBar = () => {
  const location = useLocation();
  const OnlyHome = location.pathname === '/';
  // const isDoneCreateData = useSelector((state) => state.DoneCreatePropertiesSlice.isDone)
  const { auth } = useAuth();
  console.log(auth)
  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate('/');
  };
  const [isMobile] = useMediaQuery('(max-width: 481px)');
  // const display = useBreakpointValue({
  //   base: 'none',
  //   md: 'none',
  //   lg: 'black',
  // });
  const displayTablet = useBreakpointValue({
    base: 'none',
    md: 'block',
    lg: 'block',
  });
  const widht = useBreakpointValue({
    base: '100%',
    md: '400px',
  });
  const displayLogoOnly = useBreakpointValue({
    base: 'block',
    md: 'none',
  });
  const logoTabletAndDesktop = useBreakpointValue({
    md: '45%',
    lg: '25%',
  });

  return (
    <Box bg='#ffffff' color='white' p={4} position='sticky' top={0} zIndex={1}>
      <Center>
        <Container
          maxW={isMobile ? '100%' : '6xl'}
          mx='auto'
          px={4}
          py={2}
          style={{
            ...(isMobile
              ? { borderBottom: 'none' }
              : { borderBottom: '1px solid #181D31' }),
          }}
        >
          <Box display='flex' alignItems='center'>
            <Link to={'/'}>
              <Box>
                <Image
                  src={Logo}
                  width={logoTabletAndDesktop}
                  display={displayTablet}
                />
              </Box>
              <Image
                src={LogoOnly}
                width='30px'
                display={displayLogoOnly}
                marginRight='5px'
              />
            </Link>
            <Box width='auto'>
              <InputGroup>
                <InputLeftElement children={<SearchIcon color='#fea012' />} />
                <Input
                  width={widht}
                  borderRadius='full'
                  borderColor='#e2e2e2'
                  type='tel'
                  placeholder={
                    isMobile ? 'Search .....' : 'Search Destination?'
                  }
                  _placeholder={{ opacity: 1, fontFamily: 'Poppins' }}
                  boxShadow='md'
                  color='black'
                  marginRight={12}
                />
              </InputGroup>
            </Box>
            <Box>
              <Text
                fontSize='14px'
                fontFamily='Poppins'
                cursor='pointer'
                _hover={{ fontWeight: 'bold' }}
                color='black'
              >
                {auth?.isTenant === true ? (
                  <Link to={'/tenant'}>Switch to hosting</Link>
                ) : (
                  <Link to={'/register-tenant'}>List your property</Link>
                )}
              </Text>
            </Box>
            <Box marginLeft='auto' display={displayTablet}>
              <Menu>
                <MenuButton w='70px'>
                  <Tag
                    bgColor='white'
                    w='40'
                    h='10'
                    borderRadius='full'
                    border='1px'
                    borderColor='gray.300'
                    _hover={{ cursor: 'pointer' }}
                  >
                    <Icon as={HamburgerIcon} mr='2' ml='1' />
                    <Avatar size='sm' name={auth.name} bgColor='#FE9900' src='' />
                  </Tag>
                </MenuButton>
                {auth?.accessToken ? (
                  <MenuList zIndex='3' fontFamily='poppins' color='black'>
                    <MenuItem>
                      <Link to={'/user'}>Profile</Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/users'}>Profiles</Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/trip'}>Trips</Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/review'}>Reviews</Link>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem>List Your Property</MenuItem>
                    <MenuDivider />
                    <MenuItem>Help</MenuItem>
                    <MenuItem onClick={signOut}>Logout</MenuItem>
                  </MenuList>
                ) : (
                  <MenuList zIndex='3' fontFamily='poppins' color='black'>
                    <MenuItem>
                      <Link to={'/register'}>Register</Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/login'}>Login</Link>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem>List Your Property</MenuItem>
                    <MenuDivider />
                    <MenuItem>Help</MenuItem>
                  </MenuList>
                )}
              </Menu>
            </Box>
            <Box marginLeft='auto' display={displayLogoOnly}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label='Options'
                  icon={<HamburgerIcon />}
                  variant='outline'
                  borderRadius='full'
                  boxShadow='md'
                  color='black'
                />
                <MenuList color='black' zIndex='3' fontFamily='poppins'>
                  <MenuItem>Register</MenuItem>
                  <MenuItem>Login</MenuItem>
                  <MenuDivider />
                  <MenuItem>List Your Property</MenuItem>
                  <MenuDivider />
                  <MenuItem>Help</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>
        </Container>
      </Center>
      {OnlyHome ? <Category /> : null}
    </Box>
  );
};

export default NavBar;

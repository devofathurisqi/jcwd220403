import { IoHomeOutline, IoPersonOutline, IoSearchOutline, IoAddOutline, IoHeartOutline, IoHome, IoSearch, IoAdd, IoHeart, IoPerson } from "react-icons/io5";
import { Center, Flex, Icon, Text, VStack, useMediaQuery, Box } from "@chakra-ui/react";
import { useState } from "react";
import "../Style/NavBot.css";

function NavBot() {
    const [selected, setSelected] = useState(0);
    const [isMobile] = useMediaQuery("(max-width: 481px)")

    const menus = [
        {
            icon: IoHomeOutline,
            icon2: IoHome,
            name: "Home"
        },
        {
            icon: IoSearchOutline,
            icon2: IoSearch,
            name: "Search"
        },
        {
            icon: IoAddOutline,
            icon2: IoAdd,
            name: "Add"
        },
        {
            icon: IoHeartOutline,
            icon2: IoHeart,
            name: "Like"
        },
        {
            icon: IoPersonOutline,
            icon2: IoPerson,
            name: "Profile"
        },
    ];
    if (isMobile) {
        return (
            <Box position="fixed" zIndex={1} style={{minWidth:"100%"}} p={0} bottom={0}>
                <Center>
                    <Flex w={[400, 450, 500]} h="7vh" bgColor="white" justifyContent="center" color="black" dropShadow="2xl" >
                        <Flex justifyContent="space-evenly" align="center" w={[400, 450, 500]} >
                            {menus.map((item, index) => {
                                return (
                                    <VStack w="50px" pt="2" h="7vh" justifyContent="center" _hover={{ cursor: "pointer" }} borderTop={index === selected ? "2px" : ""}
                                        onClick={() => setSelected(index)} key={index} className={index === selected ? "active" : ""}
                                    >
                                        <Icon className="icon" w={6} h={6} as={index === selected ? item.icon2 : item.icon} />
                                        {index === selected ? <Text justifyItems="center" className="name" fontSize="small" fontWeight="bold" >{item.name}</Text> : null}
                                    </VStack>
                                )
                            })}
                        </Flex>
                    </Flex>
                </Center>
            </Box>

        );
    }
};

export default NavBot
import {
    Box,
    Text,
    Image,
    Flex,
    Center,
} from "@chakra-ui/react";
import { useState} from "react";
import Axios from "axios";
import { useEffect } from "react";
import { getPreciseDistance } from 'geolib';
import {PulseLoader} from "react-spinners";
import {motion} from "framer-motion"


function HomeCard() {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)

    //data ini masih di tembak, berikut adalah lat dan lng indonesia
    const cord = {
        lat : -6.200000,
        lng: 106.816666
    }
    
    const url = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=airbnb-listings&q=indonesia&rows=100&start=1&sort&facet=host_response_time&facet=host_response_rate&facet=host_verifications&facet=city&facet=country&facet=property_type&facet=room_type&facet=bed_type&facet=amenities&facet=availability_365&facet=cancellation_policy&refine.features=Require+Guest+Phone+Verification"

    const getdata = async () => {
        try {
            setLoading(true)
            const res = await Axios.get(url);
            setData(res.data)
            setLoading(false)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getdata()
    }, [])


    const Loadingg = () => {
        return (
            <Center>
                <PulseLoader
                color="#19b4b5"
                size={30}
                margin="50px 0px"
                 />
            </Center>
        )
    }

    return (
        <>
            {loading ? <Loadingg /> :
                <Center>
                    <motion.div
                    className="card"
                    initial={{x:"-100%"}}
                    animate={{x:0}}
                    transition={{duration:0.5}}>    
                    <Flex flexWrap={"wrap"} justifyContent="center" position="relative" bgColor="white" mt="3" >
                        {data?.records.map((item) => {
                            return (
                                <Box _hover={{ cursor: "pointer" }} w="270px" h="260px" m="10px" boxSize="auto" >
                                    <Box borderRadius="13px" borderTopRadius="13px" overflow="hidden">
                                        <Image objectFit="cover" src={item.fields.xl_picture_url} width="270px" height="190px" />
                                    </Box>

                                    <Box px="10px" h="90px">
                                        <Text mt="2" fontWeight="bold" fontSize="sm" >
                                            {item.fields.city}, {item.fields.country}
                                        </Text>
                                        <Text mr="5px" fontSize="sm">
                                            Berjarak {Math.ceil(getPreciseDistance({ latitude: cord.lat, longitude: cord.lng }, { latitude: item.fields.geolocation[0], longitude: item.fields.geolocation[1] }) / 1000) + " km"}
                                        </Text>
                                        <Text mr="5px" fontSize="sm" >
                                            <Text fontWeight="bold" display="inline" >${item.fields.price}</Text> / night
                                        </Text>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Flex>
                    </motion.div>
                </Center>
            }
        </>
    );
}
export default HomeCard
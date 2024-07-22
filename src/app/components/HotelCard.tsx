// HotelCard.js
import React from "react";
import { Box, Center, Image, Flex, Badge, Text } from "@chakra-ui/react";
import { MdStar } from "react-icons/md";

const HotelCard = ({ hotel }) => {
  return (
    <Center>
      <Box p="5" maxW="320px" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Image borderRadius="md" src={hotel.imageUrl} alt={hotel.name} />
        <Flex align="baseline" mt={2}>
          <Badge colorScheme="pink">Plus</Badge>
          <Text
            ml={2}
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="bold"
            color="pink.800"
          >
            Verified &bull; {hotel.location}
          </Text>
        </Flex>
        <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
          {hotel.name}
        </Text>
        <Text mt={2}>{hotel.price}/night</Text>
        <Flex mt={2} align="center">
          <Box as={MdStar} color="orange.400" />
          <Text ml={1} fontSize="sm">
            <b>{hotel.rating}</b> ({hotel.reviews})
          </Text>
        </Flex>
      </Box>
    </Center>
  );
};

export default HotelCard;

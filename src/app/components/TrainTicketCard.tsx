import React from "react";
import { Box, VStack, HStack, Text, Divider, Badge } from "@chakra-ui/react";

const TrainTicketCard = ({ ticket }) => (
  <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="6" bg="gray.800" boxShadow="lg">
    <VStack align="start" spacing="4">
      <HStack justifyContent="space-between" w="100%">
        <Text fontWeight="bold" fontSize="xl" color="black">{ticket.from} - {ticket.to}</Text>
        <Text color="gray.400" fontSize="md">{ticket.depTime} - {ticket.arrTime}</Text>
      </HStack>
      <Divider borderColor="gray.600" />
      <HStack justifyContent="space-between" w="100%">
        <Text color="gray.400" fontSize="md">票价:</Text>
        <Text fontWeight="bold" fontSize="lg" color="teal.300">¥{ticket.bestPrice}</Text>
      </HStack>
      {ticket.isRecommended && (
        <Badge colorScheme="green" variant="solid">最佳推荐</Badge>
      )}
      {ticket.description && (
        <Text color="gray.400" fontSize="sm">{ticket.description}</Text>
      )}
    </VStack>
  </Box>
);

export default TrainTicketCard;

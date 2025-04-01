import { Box, Text, VStack, Avatar, Card, CardBody, CardHeader, Heading, Divider, useColorModeValue } from "@chakra-ui/react";
import { useAuth } from "../admin/useAuth.jsx";

const Profile = () => {
  const { user } = useAuth(); // Access user data

  // Dynamic colors based on the theme (light/dark mode)
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Box p={4} maxW="600px" mx="auto">
      <Card bg={cardBg} boxShadow="lg" borderRadius="lg">
        <CardHeader>
          <VStack spacing={4} align="center">
            <Avatar size="xl" name={user?.name} src={user?.avatar} bg="teal.500" color="white" />
            <Heading as="h1" size="xl" color={textColor}>
              {user?.name}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {user?.role}
            </Text>
          </VStack>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack spacing={4} align="start">
            <ProfileDetail label="Email" value={user?.email} />
            <ProfileDetail label="Address" value={user?.address} />
            <ProfileDetail label="Phone" value={user?.phone} />
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

// Reusable component for profile details
const ProfileDetail = ({ label, value }) => {
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Box>
      <Text fontSize="sm" color="gray.500" fontWeight="bold">
        {label}
      </Text>
      <Text fontSize="md" color={textColor}>
        {value || "N/A"}
      </Text>
    </Box>
  );
};

export default Profile;
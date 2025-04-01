import { Box, Container, VStack, Text, SimpleGrid, Link, HStack, keyframes, Icon } from "@chakra-ui/react";
import { FaTruck, FaShieldAlt, FaHeadset, FaHandHoldingMedical, FaHospitalUser, FaPrescriptionBottleAlt } from "react-icons/fa";
import { useEffect } from "react";
import { useProductStore } from "../store/product";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();

  useEffect(() => {
    try {
      fetchProducts();
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [fetchProducts]);

  return (
    <Container maxW="container.xl" p={0}>
        {/* Hero Section */}
        <Box
        position="relative"
        height="80vh"
        bgImage={`url("../e_pharamacy.png")`} // Ensure this path is correct
        bgSize="cover"
        bgPosition="center"
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <VStack spacing={4} px={6} zIndex={1} animation={`${fadeIn} 1s ease-out`}>
          <Text
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            color="white"
            textShadow="2px 2px 12px rgba(0, 0, 0, 0.9)" // Stronger text shadow
            bgGradient="linear(to-r, red.600, red.600)"
            bgClip="text"
          >
            Your Health, Our Priority
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            maxW="lg"
            color="gray.100"
            textShadow="1px 1px 4px rgba(0, 0, 0, 0.7)"
            fontWeight="medium"
          >
            Experience seamless healthcare with fast, reliable, and secure services.
          </Text>
        </VStack>
      </Box>

      {/* Features Section */}
      <Box py={12} bg="gray.50" textAlign="center">
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mb={6}>
          Why Choose Us?
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8} px={{ base: 4, md: 8 }}>
          <FeatureCard icon={FaPrescriptionBottleAlt} title="Convenience" description="Order medicines anytime, anywhere. Stay hassle-free." />
          <FeatureCard icon={FaTruck} title="Fast Delivery" description="Get your medications quickly and reliably, straight to your doorstep." />
          <FeatureCard icon={FaShieldAlt} title="Privacy" description="Your information is secure and treated with utmost confidentiality." />
          <FeatureCard icon={FaHandHoldingMedical} title="Quality Care" description="We ensure that you get the best quality medicines every time." />
          <FeatureCard icon={FaHeadset} title="Customer Support" description="Our support team is here to help you 24/7 with any questions." />
          <FeatureCard icon={FaHospitalUser} title="Trusted Partners" description="Collaborating with certified pharmacies for safe medication." />
        </SimpleGrid>
      </Box>

      {/* Footer Section */}
      <Box bg="blue.900" py={8} textAlign="center" color="white">
        <VStack spacing={4}>
          <Text fontSize="lg" fontWeight="bold">
            Ready to get started? {" "}
            <Link to="/login" color="yellow.300" _hover={{ textDecoration: "underline" }}>
              Login Here
            </Link>
          </Text>
          <HStack spacing={6} justify="center" flexWrap="wrap">
            <Box>
              <Text fontSize="sm" fontWeight="bold">Contact Us:</Text>
              <Text fontSize="sm">+123-456-7890</Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold">Email:</Text>
              <Text fontSize="sm">
                <Link href="mailto:support@epharmacy.com" color="yellow.300">
                  support@epharmacy.com
                </Link>
              </Text>
            </Box>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};

// FeatureCard Component
const FeatureCard = ({ icon, title, description }) => (
  <VStack
    p={6}
    borderRadius="lg"
    bg="white"
    shadow="md"
    textAlign="center"
    spacing={4}
    _hover={{ shadow: "lg", transform: "scale(1.05)" }}
    transition="0.3s"
  >
    <Icon as={icon} boxSize={12} color="blue.500" />
    <Text fontSize="lg" fontWeight="bold">{title}</Text>
    <Text fontSize="sm" color="gray.600">{description}</Text>
  </VStack>
);

export default HomePage;

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    useToast,
    SimpleGrid,
    Select,
    Flex,
    Badge,
    Icon
  } from "@chakra-ui/react";
  import { FaCreditCard, FaMapMarkerAlt, FaLock } from "react-icons/fa";
  import { useLocation, useNavigate } from "react-router-dom";
  import { useState, useEffect } from "react";
  import { useAuth } from "../admin/useAuth.jsx";
  
  const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();
    const { cart, pharmacy } = location.state || {};
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
      street: "",
      city: "",
      state: "",
      postalCode: "",
    });
    const [cardDetails, setCardDetails] = useState({
      number: "",
      name: "",
      expiry: "",
      cvv: ""
    });
  
    const totalSum = cart?.reduce((sum, product) => sum + (product.price * product.quantity), 0) || 0;
  
    useEffect(() => {
      if (!cart || cart.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Your cart is empty, please add items first",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        navigate("/products");
      }
    }, [cart, navigate, toast]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsProcessing(true);
  
      try {
        const purchaseData = {
          customerEmail: user?.email || "guest@example.com",
          customerName: user?.name || "Guest User",
          pharmacy: pharmacy || "Unknown Pharmacy",
          products: cart.map(item => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: totalSum,
          shippingAddress,
          status: "pending"
        };
  
        const response = await fetch("http://localhost:5000/api/purchases", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(purchaseData),
        });
  
        const data = await response.json();
  
        if (data.success) {
          toast({
            title: "Order Placed",
            description: `Your order #${data.purchase._id} has been received`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate("/", { state: { orderId: data.purchase._id } });
        } else {
          throw new Error(data.message || "Payment failed");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsProcessing(false);
      }
    };
  
    return (
      <Box maxW="container.lg" mx="auto" py={8} px={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>Payment Details</Text>
  
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
              <Flex align="center" mb={4}>
                <Icon as={FaMapMarkerAlt} mr={2} />
                <Text fontSize="lg" fontWeight="bold">Shipping Address</Text>
              </Flex>
              
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Street Address</FormLabel>
                  <Input
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                  />
                </FormControl>
  
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>City</FormLabel>
                    <Input
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    />
                  </FormControl>
  
                  <FormControl isRequired>
                    <FormLabel>State</FormLabel>
                    <Input
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    />
                  </FormControl>
                </SimpleGrid>
  
                <FormControl isRequired>
                  <FormLabel>Postal Code</FormLabel>
                  <Input
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  />
                </FormControl>
              </VStack>
            </Box>
  
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
              <Flex align="center" mb={4}>
                <Icon as={FaCreditCard} mr={2} />
                <Text fontSize="lg" fontWeight="bold">Payment Method</Text>
              </Flex>
  
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Card Number</FormLabel>
                  <Input
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  />
                </FormControl>
  
                <FormControl isRequired>
                  <FormLabel>Name on Card</FormLabel>
                  <Input
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  />
                </FormControl>
  
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Expiry Date</FormLabel>
                    <Input
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                  </FormControl>
  
                  <FormControl isRequired>
                    <FormLabel>CVV</FormLabel>
                    <Input
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>
  
              <Flex align="center" mt={6} color="gray.500">
                <Icon as={FaLock} mr={2} />
                <Text fontSize="sm">Secure payment</Text>
              </Flex>
            </Box>
          </Box>
  
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="lg" fontWeight="bold" mb={4}>Order Summary</Text>
            
            <VStack spacing={4} align="stretch" mb={6}>
              {cart?.map((item) => (
                <Flex key={item._id} justify="space-between">
                  <Text>{item.name} × {item.quantity}</Text>
                  <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                </Flex>
              ))}
  
              <Box borderTopWidth="1px" pt={4}>
                <Flex justify="space-between" fontWeight="bold">
                  <Text>Total</Text>
                  <Text>${totalSum.toFixed(2)}</Text>
                </Flex>
              </Box>
            </VStack>
  
            <Button
              colorScheme="teal"
              size="lg"
              width="full"
              onClick={handleSubmit}
              isLoading={isProcessing}
            >
              Pay ${totalSum.toFixed(2)}
            </Button>
  
            {pharmacy && (
              <Text mt={4} textAlign="center" fontSize="sm">
                Fulfilled by: <Badge colorScheme="purple">{pharmacy}</Badge>
              </Text>
            )}
          </Box>
        </SimpleGrid>
      </Box>
    );
  };
  
  export default PaymentPage;
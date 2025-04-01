import {
  Container,
  SimpleGrid,
  Text,
  VStack,
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Image,
  Flex,
  Icon
} from "@chakra-ui/react";
import { FaShoppingCart, FaFileUpload } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/product";
import { useNavigate } from "react-router-dom";

const UserProductCard = ({ product, addToCart }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="white" boxShadow="md">
      {product.image && (
        <Image
          src={product.image}
          alt={product.name}
          borderRadius="lg"
          objectFit="cover"
          height="200px"
          width="100%"
        />
      )}
      <Text fontSize="xl" fontWeight="bold" mt={2} color="gray.700">
        {product.name}
      </Text>
      <Text color="gray.500">Price: ${product.price}</Text>
      <Text color="gray.500">Stock: {product.stock}</Text>
      <Button 
        mt={2} 
        colorScheme="teal" 
        onClick={() => addToCart(product)}
        isDisabled={product.stock <= 0}
        leftIcon={<FaShoppingCart />}
      >
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </Button>
    </Box>
  );
};

const Cart = ({ cart, onPayNow, onRemoveItem }) => {
  const totalSum = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  return (
    <Box
      mt={8}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      boxShadow="lg"
      width="100%"
      maxW="600px"
      mx="auto"
    >
      <Flex align="center" mb={6}>
        <Icon as={FaShoppingCart} boxSize={6} mr={2} color="teal.500" />
        <Text fontSize="2xl" fontWeight="bold" color="teal.500">
          Your Cart
        </Text>
      </Flex>

      <VStack spacing={4} mb={6}>
        {cart.map((product, index) => (
          <Box
            key={`${product._id}-${index}`}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            width="100%"
            bg="gray.50"
            _hover={{ bg: "gray.100" }}
          >
            <Flex align="center" justify="space-between">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  borderRadius="lg"
                  boxSize="80px"
                  objectFit="cover"
                  mr={4}
                />
              )}
              <Box flex="1">
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  {product.name}
                </Text>
                <Text color="gray.500">Price: ${product.price}</Text>
                <Text color="gray.500">Quantity: {product.quantity}</Text>
                <Text color="gray.500">Subtotal: ${(product.price * product.quantity).toFixed(2)}</Text>
              </Box>
              <Button 
                colorScheme="red" 
                size="sm"
                onClick={() => onRemoveItem(index)}
                data-testid={`remove-${product._id}`}
              >
                Remove
              </Button>
            </Flex>
          </Box>
        ))}
      </VStack>

      <Box mt={6} pt={4} borderTopWidth="1px" borderColor="gray.200" textAlign="right">
        <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={4}>
          Total: ${totalSum.toFixed(2)}
        </Text>
        <Button
          colorScheme="teal"
          size="lg"
          width="100%"
          onClick={onPayNow}
          isDisabled={cart.length === 0}
          _hover={{ transform: "scale(1.02)" }}
          _active={{ transform: "scale(0.98)" }}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );
};

const UploadPrescription = () => {
  const toast = useToast();
  const { fetchProducts, products } = useProductStore();
  const [prescription, setPrescription] = useState(null);
  const [pharmacy, setPharmacy] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pharmacies, setPharmacies] = useState([]);
  const [cart, setCart] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Error",
          description: `Cannot add more than available stock (${product.stock})`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setCart(cart.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const removeFromCart = (indexToRemove) => {
    if (indexToRemove < 0 || indexToRemove >= cart.length) {
      console.error("Invalid index for removal:", indexToRemove);
      return;
    }

    const removedItem = cart[indexToRemove];
    setCart(prevCart => prevCart.filter((_, index) => index !== indexToRemove));
    
    toast({
      title: "Item removed",
      description: `${removedItem.name} has been removed from your cart.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePayNow = () => {
    if (!pharmacy) {
      toast({
        title: "Error",
        description: "Please select a pharmacy first",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    navigate("/payment", { 
      state: { 
        cart,
        pharmacy,
        customerInfo: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone
        }
      } 
    });
  };

  const handleSubmit = async () => {
    if (!prescription || !pharmacy || !customerEmail || !customerName) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("prescription", prescription);
    formData.append("pharmacy", pharmacy);
    formData.append("customerEmail", customerEmail);
    formData.append("customerName", customerName);
    if (customerPhone) formData.append("customerPhone", customerPhone);

    try {
      const response = await fetch("http://localhost:5000/api/prescriptions", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Prescription uploaded successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setPrescription(null);
        setImagePreview(null);
        setPharmacy("");
        setCustomerEmail("");
        setCustomerName("");
        setCustomerPhone("");
      } else {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error uploading prescription:", error);
      toast({
        title: "Error",
        description: "An error occurred while uploading the prescription.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    
    const fetchPharmacies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/pharmacy");
        const data = await response.json();
        if (data.success) {
          setPharmacies(data.pharmacies);
          if (data.pharmacies.length > 0) {
            setPharmacy(data.pharmacies[0].name);
          }
        }
      } catch (error) {
        console.error("Error fetching pharmacies:", error);
      }
    };

    fetchPharmacies();
  }, [fetchProducts]);

  const handlePrescriptionUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescription(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  return (
    <Container maxW="container.xl" py={12} minHeight="100vh">
      <VStack spacing={12} align="stretch">
        {/* Prescription Upload Section */}
        <Box
          p={8}
          borderRadius="lg"
          bg="white"
          boxShadow="md"
        >
          <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center" color="teal.600">
            Upload Your Prescription
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
              <FormControl id="customerName" isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                />
              </FormControl>

              <FormControl id="customerEmail" isRequired mt={4}>
                <FormLabel>Email Address</FormLabel>
                <Input 
                  type="email" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </FormControl>

              <FormControl id="customerPhone" mt={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input 
                  type="tel" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                />
              </FormControl>

              <FormControl id="pharmacy" isRequired mt={4}>
                <FormLabel>Select Pharmacy</FormLabel>
                <Select
                  value={pharmacy}
                  onChange={(e) => setPharmacy(e.target.value)}
                >
                  {pharmacies.map((pharm) => (
                    <option key={pharm._id} value={pharm.name}>
                      {pharm.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <FormControl id="prescription" isRequired>
                <FormLabel>Prescription File</FormLabel>
                <Box
                  borderWidth="2px"
                  borderStyle="dashed"
                  borderColor="gray.300"
                  borderRadius="lg"
                  p={6}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ borderColor: "teal.500" }}
                >
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handlePrescriptionUpload}
                    display="none"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Flex direction="column" align="center">
                      <Icon as={FaFileUpload} boxSize={8} color="teal.500" mb={2} />
                      <Text>Click to upload prescription</Text>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        (JPG, PNG, or PDF)
                      </Text>
                    </Flex>
                  </label>
                </Box>
                {imagePreview && (
                  <Box mt={4}>
                    <Image 
                      src={imagePreview} 
                      alt="Prescription Preview" 
                      maxH="200px" 
                      borderRadius="lg" 
                      mx="auto"
                    />
                  </Box>
                )}
              </FormControl>

              <Button
                mt={6}
                colorScheme="teal"
                size="lg"
                width="full"
                onClick={handleSubmit}
                isDisabled={!prescription || !pharmacy || !customerEmail || !customerName}
              >
                Upload Prescription
              </Button>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Products Section */}
        <Box>
          <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center" color="blue.600">
            Available Products
          </Text>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {products && products.length > 0 ? (
              products.map((product) => (
                <UserProductCard 
                  key={product._id} 
                  product={product} 
                  addToCart={addToCart} 
                />
              ))
            ) : (
              <Box gridColumn="1 / -1" textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.500">
                  No products available at the moment
                </Text>
              </Box>
            )}
          </SimpleGrid>
        </Box>

        {/* Shopping Cart Section */}
        {cart.length > 0 && (
          <Box mt={8}>
            <Cart 
              cart={cart} 
              onPayNow={handlePayNow} 
              onRemoveItem={removeFromCart} 
            />
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default UploadPrescription;
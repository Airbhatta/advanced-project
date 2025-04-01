import {
    Box,
    Button,
    Heading,
    HStack,
    Image,
    Text,
    useColorModeValue,
    useToast,
  } from "@chakra-ui/react";
  import { useProductStore } from "../store/product";
  
  const UserProductCard = ({ product, addToCart }) => {
    const { buyProduct } = useProductStore();
    const toast = useToast();
  
    const textColor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.800");
  
    const handleBuyNow = async (pid) => {
      if (product.stock <= 0) {
        toast({
          title: "Out of Stock",
          description: "This product is currently out of stock.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const { success, message } = await buyProduct(pid);
      toast({
        title: success ? "Success" : "Error",
        description: message,
        status: success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    };
  
    const handleAddToCart = (pid) => {
      addToCart(pid); // Add product to cart
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    };
  
    return (
      <Box
        shadow="lg"
        rounded="lg"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
        bg={bg}
      >
        <Image src={product.image} alt={product.name} h={48} w="full" objectFit="cover" />
  
        <Box p={4}>
          <Heading as="h3" size="md" mb={2}>
            {product.name}
          </Heading>
  
          <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
            ${product.price}
          </Text>
  
          <Text color={textColor} mb={2}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Text>
  
          <HStack spacing={2}>
            <Button
              colorScheme="teal"
              onClick={() => handleAddToCart(product._id)}
              isDisabled={product.stock <= 0}
            >
              Add to Cart
            </Button>
            <Button
              colorScheme="green"
              onClick={() => handleBuyNow(product._id)}
              isDisabled={product.stock <= 0}
            >
              {product.stock <= 0 ? "Out of Stock" : "Buy Now"}
            </Button>
          </HStack>
        </Box>
      </Box>
    );
  };
  
  export default UserProductCard;
  
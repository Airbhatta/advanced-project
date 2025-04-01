import { Box, Button, Container, FormControl, FormLabel, Heading, Input, NumberInput, NumberInputField, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useProductStore } from "../store/product";
import { useAuth } from "../admin/useAuth.jsx";

const CreatePage = () => {
  const { user } = useAuth();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    stock: 10,
    pharmacy: user?.email || "" // Auto-set from logged in user
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { createProduct } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 10
      };

      const { success, message } = await createProduct(productData);

      toast({
        title: success ? "Success" : "Error",
        description: message,
        status: success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });

      if (success) {
        setNewProduct({ 
          name: "", 
          price: "", 
          image: "", 
          stock: 10,
          pharmacy: user?.email || ""
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <VStack as="form" onSubmit={handleSubmit} spacing={8}>
        <Heading as="h1" size="xl" textAlign="center">
          Create New Product
        </Heading>

        <Box w="full" p={6} rounded="lg" shadow="md" bg="white">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="e.g. Paracetamol 500mg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price ($)</FormLabel>
              <NumberInput min={0} precision={2}>
                <NumberInputField
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="e.g. 5.99"
                />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                placeholder="https://example.com/product.jpg"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Initial Stock</FormLabel>
              <NumberInput 
                min={0} 
                value={newProduct.stock}
                onChange={(value) => setNewProduct({...newProduct, stock: value})}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Pharmacy</FormLabel>
              <Input
                value={newProduct.pharmacy}
                isReadOnly
                variant="filled"
              />
            </FormControl>

            <Button 
              type="submit"
              colorScheme="blue" 
              w="full"
              isLoading={isLoading}
              loadingText="Creating..."
              mt={4}
            >
              Create Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
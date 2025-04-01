import {
  Container,
  SimpleGrid,
  Text,
  VStack,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Badge,
  Tooltip
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../admin/useAuth.jsx";

const Adminproduct = () => {
  const { user } = useAuth();
  const { products, fetchProducts, deleteProduct } = useProductStore();
  const [prescriptions, setPrescriptions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState({
    products: true,
    prescriptions: true,
    purchases: true
  });
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.email) await fetchProducts(user.email);
        if (user?.name) {
          const [presResponse, purchasesResponse] = await Promise.all([
            fetch(`http://localhost:5000/api/prescriptions/pharmacy/${user.name}`),
            fetch(`http://localhost:5000/api/purchases/pharmacy/${user.name}`)
          ]);
          
          const [presData, purchasesData] = await Promise.all([
            presResponse.json(),
            purchasesResponse.json()
          ]);
          
          if (presData.success) setPrescriptions(presData.prescriptions || []);
          if (purchasesData.success) setPurchases(purchasesData.purchases || []);
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
        setLoading({ products: false, prescriptions: false, purchases: false });
      }
    };

    loadData();
  }, [user, fetchProducts, toast]);

  const handleDelete = async (productId) => {
    try {
      const { success, message } = await deleteProduct(productId);
      toast({
        title: success ? "Success" : "Error",
        description: message,
        status: success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updatePurchaseStatus = async (purchaseId, newStatus) => {
    setUpdatingStatus(purchaseId);
    try {
      const response = await fetch(`http://localhost:5000/api/purchases/${purchaseId}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPurchases(prevPurchases => 
          prevPurchases.map(purchase => 
            purchase._id === purchaseId 
              ? { ...purchase, status: newStatus } 
              : purchase
          )
        );
        
        toast({
          title: "Success",
          description: `Status updated to ${newStatus}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const confirmStatusUpdate = (purchaseId, newStatus) => {
    if (window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      updatePurchaseStatus(purchaseId, newStatus);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={12} align="stretch">
        {/* Products Section */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={6}>My Products</Text>
          {loading.products ? (
            <Spinner size="xl" />
          ) : products?.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onDelete={handleDelete}
                  showActions={true}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Alert status="info">
              <AlertIcon />No products found
            </Alert>
          )}
        </Box>

        {/* Prescriptions Section */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={6}>Prescription Orders</Text>
          {loading.prescriptions ? (
            <Spinner size="xl" />
          ) : prescriptions.length > 0 ? (
            <Box overflowX="auto">
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Customer</Th>
                    <Th>Email</Th>
                    <Th>Prescription</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {prescriptions.map((prescription) => (
                    <Tr key={prescription._id}>
                      <Td>{prescription.customerName || "N/A"}</Td>
                      <Td>{prescription.customerEmail || "N/A"}</Td>
                      <Td>
                        <Button
                          as="a"
                          href={`http://localhost:5000${prescription.fileUrl}`}
                          target="_blank"
                          size="sm"
                          variant="link"
                          colorScheme="blue"
                        >
                          View
                        </Button>
                      </Td>
                      <Td>{new Date(prescription.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        <Badge colorScheme={
                          prescription.status === "pending" ? "yellow" : 
                          prescription.status === "approved" ? "green" : "red"
                        }>
                          {prescription.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Alert status="info">
              <AlertIcon />No prescriptions found
            </Alert>
          )}
        </Box>

        {/* Purchases Section */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={6}>Product Purchases</Text>
          {loading.purchases ? (
            <Spinner size="xl" />
          ) : purchases.length > 0 ? (
            <Box overflowX="auto">
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Customer</Th>
                    <Th>Email</Th>
                    <Th>Address</Th>
                    <Th>Products</Th>
                    <Th>Total</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th minW="150px">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {purchases.map((purchase) => (
                    <Tr key={purchase._id}>
                      <Td fontWeight="medium">{purchase.customerName}</Td>
                      <Td>{purchase.customerEmail}</Td>
                      <Td>
                        {purchase.shippingAddress && (
                          <>
                            <Text fontSize="sm">{purchase.shippingAddress.street}</Text>
                            <Text fontSize="sm">{purchase.shippingAddress.city}, {purchase.shippingAddress.state}</Text>
                            <Text fontSize="sm">{purchase.shippingAddress.postalCode}</Text>
                          </>
                        )}
                      </Td>
                      <Td>
                        {purchase.products.map((product, i) => (
                          <Text key={i} fontSize="sm">
                            {product.name} (${product.price} × {product.quantity})
                          </Text>
                        ))}
                      </Td>
                      <Td>${purchase.totalAmount.toFixed(2)}</Td>
                      <Td>{new Date(purchase.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        <Badge colorScheme={
                          purchase.status === 'pending' ? 'yellow' :
                          purchase.status === 'completed' ? 'blue' :
                          purchase.status === 'shipped' ? 'orange' :
                          purchase.status === 'delivered' ? 'green' : 'red'
                        }>
                          {purchase.status}
                        </Badge>
                      </Td>
                      <Td>
                        {/* Pending: Approve only */}
                        {purchase.status === 'pending' && (
                          <Tooltip label="Approve this order to proceed to shipping">
                            <Button
                              size="sm"
                              colorScheme="green"
                              onClick={() => confirmStatusUpdate(purchase._id, 'completed')}
                              isLoading={updatingStatus === purchase._id}
                            >
                              Approve
                            </Button>
                          </Tooltip>
                        )}

                        {/* Completed: Ship only */}
                        {purchase.status === 'completed' && (
                          <Tooltip label="Mark as shipped">
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => confirmStatusUpdate(purchase._id, 'shipped')}
                              isLoading={updatingStatus === purchase._id}
                            >
                              Ship
                            </Button>
                          </Tooltip>
                        )}

                        {/* Shipped: Deliver only */}
                        {purchase.status === 'shipped' && (
                          <Tooltip label="Mark as delivered">
                            <Button
                              size="sm"
                              colorScheme="purple"
                              onClick={() => confirmStatusUpdate(purchase._id, 'delivered')}
                              isLoading={updatingStatus === purchase._id}
                            >
                              Deliver
                            </Button>
                          </Tooltip>
                        )}

                        {/* Delivered/Cancelled: No actions */}
                        {['delivered', 'cancelled'].includes(purchase.status) && (
                          <Text fontSize="sm" color="gray.500">
                            No actions available
                          </Text>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Alert status="info">
              <AlertIcon />No purchases found
            </Alert>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default Adminproduct;
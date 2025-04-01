import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  useColorModeValue,
  useToast,
  VStack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../admin/useAuth.jsx";

const AuthPage = () => {
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    address: "",
    phone: "",
  });
  const [pinInput, setPinInput] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [tempUser, setTempUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuth = async () => {
    const endpoint = isLogin ? "auth/login" : "auth/register";

    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.success) {
        // For pharmacy users during login, require PIN verification
        if (data.user.role === "pharmacy") {
          setTempUser(data.user);
          onOpen();
          return;
        }

        // For non-pharmacy users, proceed normally
        handleSuccessfulAuth(data);
      } else {
        toast({
          title: "Error",
          description: data.message || "Authentication failed, please try again.",
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handlePinVerification = () => {
    // Hardcoded PIN verification (9846)
    if (pinInput === "9846") {
      onClose();
      handleSuccessfulAuth({ success: true, user: tempUser });
      setPinInput("");
    } else {
      toast({
        title: "Error",
        description: "Invalid PIN. Please try again.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleSuccessfulAuth = (data) => {
    toast({
      title: isLogin ? "Login Successful" : "Sign Up Successful",
      description: isLogin ? "Welcome back!" : "Account created successfully!",
      status: "success",
      isClosable: true,
    });

    setAuthData({
      name: "",
      email: "",
      password: "",
      role: "customer",
      address: "",
      phone: "",
    });

    if (data.user) {
      login(data.user);
    } else {
      console.error("User data is missing in the backend response");
      toast({
        title: "Error",
        description: "User data is missing in the backend response.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    // Redirect based on user role
    if (data.user.role === "admin") {
      navigate("/Product");
    } else if (data.user.role === "pharmacy") {
      navigate("/Product");
    } else if (data.user.role === "customer") {
      navigate("/UploadPrescription");
    } else {
      console.error("Invalid user role:", data.user.role);
      toast({
        title: "Error",
        description: "Invalid user role.",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm">
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          {isLogin ? "Login" : "Sign Up"}
        </Heading>

        <Box
          w="full"
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <VStack spacing={4}>
            {!isLogin && (
              <>
                <Input
                  placeholder="Name"
                  name="name"
                  value={authData.name}
                  onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                />
                <Input
                  placeholder="Address"
                  name="address"
                  value={authData.address}
                  onChange={(e) => setAuthData({ ...authData, address: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  name="phone"
                  value={authData.phone}
                  onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
                />
                <Select
                  placeholder="Select role"
                  value={authData.role}
                  onChange={(e) => setAuthData({ ...authData, role: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="pharmacy">Pharmacy</option>
                </Select>
              </>
            )}
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            />
            <Button colorScheme="blue" onClick={handleAuth} w="full">
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              colorScheme="blue"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </Button>
          </VStack>
        </Box>
      </VStack>

      {/* PIN Verification Modal for Pharmacy */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pharmacy Verification</ModalHeader>
          <ModalBody>
            <Text mb={4}>Please enter your pharmacy PIN to continue:</Text>
            <Input
              placeholder="Enter pharmacy PIN"
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePinVerification}>
              Verify
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AuthPage;
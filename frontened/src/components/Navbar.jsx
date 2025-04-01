import { Button, Container, Flex, HStack, Text, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { useAuth } from "../admin/useAuth.jsx"; // Import the useAuth hook

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isLoggedIn, user, logout } = useAuth(); // Access user data

  return (
    <Container maxW={"1140px"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
        >
          <Link to={"/"}>E-med Store 🛒</Link>
        </Text>

        <HStack spacing={2} alignItems={"center"}>
          <Link to={"/"}>
            <Button>Home</Button>
          </Link>

          {/* Conditionally render Login or Logout/Profile buttons */}
          {isLoggedIn ? (
            <>
              <Link to={"/profile"}>
                <Button>User Profile</Button>
              </Link>

              {/* Show "User Prescription" button only for customers */}
              {user?.role === "customer" && (
                <Link to={"/UploadPrescription"}>
                  <Button>User Prescription</Button>
                </Link>
              )}

              {/* Show "Products" button for pharmacy and admin */}
              {(user?.role === "pharmacy" || user?.role === "admin") && (
                <Link to={"/Product"}>
                  <Button>Products</Button>
                </Link>
              )}

              <Link to={"/"}>
                <Button onClick={logout}>Logout</Button>
              </Link>
            </>
          ) : (
            <Link to={"/login"}>
              <Button>Login</Button>
            </Link>
          )}

          {/* Show "Create" button only for pharmacy and admin */}
          {(user?.role === "pharmacy" || user?.role === "admin") && (
            <Link to={"/create"}>
              <Button>
                <PlusSquareIcon fontSize={20} />
              </Button>
            </Link>
          )}

          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun size='20' />}
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
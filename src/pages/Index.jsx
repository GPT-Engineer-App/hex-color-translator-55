import React, { useState } from "react";
import { Box, Button, Center, Container, Input, Text, VStack, useToast } from "@chakra-ui/react";

const Index = () => {
  const [color, setColor] = useState("");
  const [colorName, setColorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const fetchColorName = async () => {
    if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
      toast({
        title: "Invalid color code.",
        description: "Please enter a valid hex color code (6 characters).",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setColorName("");

    try {
      const response = await fetch(`https://api.color.pizza/v1/${color}`);
      const data = await response.json();

      if (data.colors && data.colors.length > 0) {
        setColorName(data.colors[0].name);
      } else {
        toast({
          title: "Color not found.",
          description: "The color name could not be retrieved.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error.",
        description: "There was an error fetching the color name.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Center py={10}>
        <VStack spacing={4}>
          <Input placeholder="Enter hex color code (e.g., 1a1c2c)" value={color} onChange={handleColorChange} maxLength={6} isRequired isInvalid={!/^[0-9A-Fa-f]{6}$/.test(color) && color.length === 6} />
          <Button onClick={fetchColorName} isLoading={isLoading} loadingText="Translating" colorScheme="blue">
            Translate Hex
          </Button>
          {colorName && (
            <Box p={3} bg={`#${color}`} borderRadius="md">
              <Text fontSize="xl" color="white">
                {colorName}
              </Text>
            </Box>
          )}
        </VStack>
      </Center>
    </Container>
  );
};

export default Index;

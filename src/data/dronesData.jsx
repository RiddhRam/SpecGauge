export const dronesData = () => {
  // This determines how many steps the user has to go through when adding a product
  const droneProcess = ["a brand", "a drone"];
  const droneQueryProcess = ["Brand", "Name"];
  const compressedDroneBrands =
    "eJxtUl1vmzAU/SsWz9VkQ4Cob7SkDdsyoRh10qo+uImrWQObGROtm/bf5y8CTvZ07zm+99wvP/+J7iThx+g2KkZF2+gm2tOfIx0UVrSPbp+jzUmAqtK8cXbkF1g1HnwhXIC6HQePPzNFL7F3qwqUI2lnVEsxgw1XVPaSDXShHGaCbAWbmdo3nwCmktEhevl7M89QfqyuJ9iREzuAgkkQ68f6O+FKdGDle9gxzmZgQ+MAJeCecbp4/CZENyUmPtSq43OQhkGp4ngi/ECP5wCXFfQCnuIPcFm1JcPADssUvV2iGB+7M2maWAglAG9miWbqMg7o2TNkcSKKgIf6KdC0q8I9kT8mDa0QrHor2neAlbCrudj4FucxNOJbjCC0NoeeyD2BYlg6J0+dTSYCwscp1DFazdo493blNTKXmqQGP6A1+jpJusQU+UDkJVGGrM3S84MvmnnpxPc7ZfpSsW4hmL8mUgp1PXvByRvTH8Cs1rja3tFX0duN7kj3KuyyQy2hKHe3vlQzV7XHM5425dr008Rm8AatDWM7LyUlHZX+Y5V2vCZJwzr799//uVZD21aEgZiTXhHGr4NxndoD4tqtENfuoDi91xIv/wAjsjX8";
  const compressedDroneDefaultArray =
    "eJzFmUFT8zYQhv+KJieYIYd+0xM3CKUw00CKKTl0elDkja2pJXkkmZB2+t+7tmXHMYlNnCjcwJZePSu/Xu06f/47eqNJBqPr0U0YEmpJAtRY8oNwC8IQq8g7hxWxMZBUKzO6Gt1xkyZ0Pbq2OoOr0YRaiJTG/0ezcsCUWhZzGTWvyJDaYtCSJgZnva7TfM0Ab840LEGDZFDffRSp0pZKW1954FEM+ikTC9Du4n9XG/bxuBPsViPANtnm0mnR8rUPIHuiArbB6ivfyjUHnG23yVabazVbObFC+6OXrRzf8zSnXHKRCaJS0NTi4gS9WPydabgmPejP9azXzaztSBK1AjR5qixIy2mye6WOSJ9OFCj98Buo6Frg5PEd6LGA/9PCfVdJ1na/j33vAXvYYf64z/znQZvz0MbbZDbm7G8Jxnw73G8gozbdqgb+TrL7JH965JULIBc/kQW1FvT6cvfLsiwHW+7Bige+IlWCcPw4EKXZnpfccYfNQd/I/qpSEqQAYSetqUf4RL3LjMXyRS0JLkPmCKnHL2CKnbLNKJx8M0uhFsN0iafEPRR5s1XjcEPCLflVIa8b8vuCuz2N+efIhffHAdCk2Mwjw1k5PVPokYtczMRFgJddpcmJwplCRFP+AYnpPQInWCxp2jJYPZ1cCMolYcWgS+8mq17Wx+B5GLibz43yzvrGQ1DkllssBforjZ20ChsDsigVzsT7e0YTbteDeN8LBQ1M6TAvhL7qjf56+yv89xySkGCCeMNuahD/slLI+zHvvAFIozTJS7RBtKacb6oSz+vezt5IzdCR+nbuavruPOA/TU+mzwEpN/Zw0JgaQgkTyhBTSXjmvc00NklBrCwRKvyqD/YcK0xhpyUzlSF/rFTRi1BLYkTAl9Jg4W+5kt7zyMPdSxHMVx7AnkjKJ7HIeGLHmEHiUFeKnp/HjEqlqeDs2AgYxcSn8RaQtNTEkLgcn+tFCEDnTXftrKMfhikFTUPQcwgvN3Myw+W2v4gdCF+8CIZo2pXPTwT84+eUTLgEQU+z5bke29LznY3Kng0zfUoZFgHNPq43NbnJ24G42SRVK+hKp6fJPJOY6gg+taDD0Fkp5qVF/ex1wFqPLpIe0+wELc2iK4UqbP92eZS4jsyzDK5Bo/7Ta4qMaIa8gXNTWn1RJWgadwd/oz2kn4APt7IoEI+OpOozqFCZtHlJ2VqBmCzNSduNuY8gf6mWdtRBonoa8r7wCsvJzzGVwmewXZLwCHBj3UebKabHvlMCiyOtknYn3tByX0uE0/Icxa+zYAhwvvNRega+PCNh8RIIqm0aKwnEAQ2hdmav8hTqmlrXfyg3jEECWgmw0NcW7N10tDtt6XjvDVz5W/EOJc8/VzoB76bBYkaOrRo/KNFXAO0E1oVC/ptorPJTXNu468vBqdpGJVJqBmUQ1zTWAp5JnxfGUoan/B2akLl+7mBoVamEDZXzJJQjssim0EEdVuv4TtRrrQxT6SA7l8hRQ8IH7V//A6VlDV4=";
  const droneCategories = [
    { Category: "N", Values: [] },
    { Category: "R", Values: [] },
    { Category: "Pros", Values: [] },
    { Category: "Brand", Values: [] },
    { Category: "Name", Values: [] },
    { Category: "Weight", Values: [] },
    { Category: "Operating Temperature", Values: [] },
    { Category: "Size", Values: [] },
    { Category: "Height", Values: [] },
    { Category: "Width", Values: [] },
    { Category: "Length", Values: [] },
    { Category: "Flight Time (1 battery)", Values: [] },
    { Category: "Maximum Flight Distance", Values: [] },
    { Category: "Top Speed", Values: [] },
    { Category: "Structural Features", Values: [] },
    { Category: "Camera", Values: [] },
    { Category: "Camera Features", Values: [] },
    { Category: "Battery", Values: [] },
    { Category: "Memory and Storage", Values: [] },
    { Category: "Controls", Values: [] },
  ];

  return [
    droneProcess,
    droneQueryProcess,
    compressedDroneBrands,
    compressedDroneDefaultArray,
    droneCategories,
  ];
};

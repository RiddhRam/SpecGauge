export const dronesData = () => {
  // This determines how many steps the user has to go through when adding a product
  const droneProcess = ["a brand", "a drone"];
  const droneQueryProcess = ["Brand", "Name"];
  const compressedDroneBrands =
    "eJxtUl1vmzAU/SsWz9VkQ4Cob7SkDdsyoRh10qo+uImrWQObGROtm/bf5y8CTvZ07zm+99wvP/+J7iThx+g2KkZF2+gm2tOfIx0UVrSPbp+jzUmAqtK8cXbkF1g1HnwhXIC6HQePPzNFL7F3qwqUI2lnVEsxgw1XVPaSDXShHGaCbAWbmdo3nwCmktEhevl7M89QfqyuJ9iREzuAgkkQ68f6O+FKdGDle9gxzmZgQ+MAJeCecbp4/CZENyUmPtSq43OQhkGp4ngi/ECP5wCXFfQCnuIPcFm1JcPADssUvV2iGB+7M2maWAglAG9miWbqMg7o2TNkcSKKgIf6KdC0q8I9kT8mDa0QrHor2neAlbCrudj4FucxNOJbjCC0NoeeyD2BYlg6J0+dTSYCwscp1DFazdo493blNTKXmqQGP6A1+jpJusQU+UDkJVGGrM3S84MvmnnpxPc7ZfpSsW4hmL8mUgp1PXvByRvTH8Cs1rja3tFX0duN7kj3KuyyQy2hKHe3vlQzV7XHM5425dr008Rm8AatDWM7LyUlHZX+Y5V2vCZJwzr799//uVZD21aEgZiTXhHGr4NxndoD4tqtENfuoDi91xIv/wAjsjX8";
  const compressedDroneDefaultArray =
    "eJzFmc9T6zYQx/+VnZxghhz6piduJJQHMw2kmMLhTQ+KvIk1lSWNJBPSTv/3rn/i5IU4OFG4gSx99Vlpd6VVfvw7eGYyw8HlYDgcXAyuhTOSrQaX3mZ4MRgzjwtt6f/ByDIVU48J8zwRarHWpGLmi25zJh2Ne1qZXDKij1OLc7SoODZf71KjrWfKNy23YpGgvc/SGdpy7v8u9ia7ZymugzUtYbmu4hiYB4nMefgGwmPqwGt4FbgEnyAYq91O9GnZoYXetBwXvWhss78gI0I7jJBJjNuQ1fgWZUTc3GeWSbihYZnFDWjhYFnpuUIPznIxl9AC6Pn5LntGnfaUi9ZhznXmfDEZ0ETwQux2+IhOuELjYOviNfllIW9b8i3zStzjWtcRAJH4ZyMAXrXMNkNgDez+JGAvSMP9OtryvW07WvTncdgmQok0S0EbtMzT5EDxWfxNW3wJHegPzain91Hrlki9RAp8oz0qL8h9ts4UfhMm7C2soemuCY5u3yez/+0WH0u6fOxE7i9in6yT+UTwvxU69+Vwv6NabNItG+CvJLuR+e7Bk0gRzn6BGfOUblfn231yXnb2IkC6+6Qn1nFY8V8XpwP/IJYq7rjd6QvZn7SByCDGO2ld0yMk6sOM1oRLhGv0yL3QavcBPtbKWy03Tm1dq8QtlcDn9J3yKGmp6DyovWCiY3R9+EVLq1r+tNIKbMUjUl5XQ6+Ht7qIqk+z20IhvwonOg9i65Pz8NwTXDAj3lC6zkNvTAWCZRu+3gyHs5QJBbzotAv8OP5e54276KEfeDVeOB2c9fHqBaaJ9rrLpwvODy7ULtHaO7BsGd4pnkWMGkbC022l+zK0dXk11XMwKxWCL3DJ+0fGpPCrXryvhYJFrm2c39X2debuynIf/huBMgYqlJ6pCO7FP68V8jI6OO/t9WORVw9w54Q5YDDLhPRDWukktrViYN+O0OZlR0TxeBwbXCnoWoKBTRhPHiKIUDlt96HfBs1T7Yi8kgjMO2VKW5YKfuiCc0YxaekTgik1yRihhvzdzqCGfPvVwFgoTNlxXCfX42t6gQ0YZZaK78b390w1H+0GXWOEynTmoDic8rzJPCSEQJnUaZl1XCCPk/xvps/QOPong2FuXuFUzlMGLOTvTr1SfBmt4Op3q5AJflSWj7SuhnE6U9slZSd8NXidvhoNRi9xV8o5jk+ME2YX+FM13A+dl2JBquUtdQRdndhMdiSXraBlUrG1Qm12eNf+7Y3mUXQITmhu2uRI6o7346pj/jAcERdb4BZTFGAtnJb9XSkc2Jzv06hPAZczL8wJas3vK6sd16ZXmVk6yaIlcYL6vtjDaqM7g7DLN0Qt6Fpfe//ys1cBR0R054hSZr1JtEKo1rbPBrjM5JPXoUq6rtE9wd1Rp4a5Xo8r1c2xEQhMesU5SrQ6RY9d99yPeRWwDZ3QDyrVw8JG6jrY6+sHC5bqTPm81PspOZaOtfnYGDAgDoiC97OKdHijE/z+W9WbNW9v8rgRCIH81//pBQ1e";
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

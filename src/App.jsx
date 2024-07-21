import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import useWindowDimensions from "./useWindowDimensions";
import WebHome from "./pages/WebHome";
const WebLogIn = lazy(() => import("./pages/WebLogIn"));
const WebUserAccount = lazy(() => import("./pages/WebUserAccount"));
const Compare = lazy(() => import("./pages/Compare"));
const Prediction = lazy(() => import("./pages/Prediction"));
const Information = lazy(() => import("./pages/Information"));
const NoPage = lazy(() => import("./pages/NoPage"));

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { query, where, collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

import PakoInflate from "./functions/PakoInflate";

// This determines how many steps the user has to go through when adding a product
const consoleProcess = ["a brand", "a console"];

// This is used when filtering out items in the selection modal whenever user clicks something
const consoleQueryProcess = ["Brand", "Name"];

// Compressed String Values
const compressedConsoleBrands =
  "eJyVV1tz2jgU/isanpJpOyvLmNC+QUzcTjDxYkKYdvqg2FqiibGzxk6gnf3veyRfZYs0eQH56Ds36dz04/dgmtI4HHwZuDxIk33yTzb4OFiyf3O2z/yMPQ2+/Bhs7pMD8lnK2R5tYLv97VffNzFrNsVHe6damiOMfDR0pm2Cl7Idz3eIYJV+maQK4yQNaKhQZhHPGDJajIOf/31sfFrwOGNxmPRd8l94FjwAvVigs5v5zEZuErLoHKh3nKNbNJZiTdtHmzk6I9gYnpff9UfJPgc7amjBD7+k+gQ6/No+L0W7POYFodgHXCmBlEj4ceiOoWlyRJPwmcYBK0lBfi+W/mLWBsFyMRqK35mPLiO63/MAzUKe8SQu0TVZalfOyU/iY/+MvIge/YwKEchCfsR3gOkT0ZnNtzyjUaXvvAvrsXUYOvtDiIikS+thbqOM7yhcvyCzFBmr6Ul5GttN5OdPwCY9IFYRQSpgqCNKfBVx6paG6CUp+AnENfiLSLmovk2nAxcAz/eQI933kUSt1iXVxBiXS6NZkmY5q8gtkeWlq1T19tc0emaaFMkY3SGbBY9KdoBuUiRwC2AZpEVyafDAIekVLZP7wzHKM42ikRCnYiPO4heaasCT6OmBojNunndYYhol21zD4SXBIxNVzc7FsbpsS5G/FcbKAFhkXUH3LI3liXUELR3TMuEawFX0ARkj+TcqzmLpWBaRH72tOx6PMFQv10aT7CGCO/E5HHgK92lhhv4q4MuJK5YQxL5vv85FgGvcsBCxLpiEhZsNZES+r20h49LAIbbWJfoDRPyoJAuf/MrkhmxhSw9edw6g2QQFrp7H1ck3e0copGtMkT713DEt7FVYk1REjDcascZaQ8R9bstwvR4SLWicKIoNr9klY+xqBGmIgNSZYbhIkwDJ469EF/2GqI0yKpbHXyxGF+hiPMS3EAfygIqQIHUUAb6NHY2xxMobVLGq+n2+18T/jYMmUXTsYDOa8j54fSna0/wYd1ry5EjRgmk68lXEnxA0wjf7pmMYv8Zwncd/kj5UpV9P32lOh+FVc8gffW2smfC0yOo33mbBYeg1tPCNhqJKIsHmspDTFXuENr1j8Z5nR9HwsKw1Naes+G3rICytMbFuVR/fZ7AUYo0kqCmFBBOjHAkEqOo1DgMT3yW+mrFAnpiU2CErxYplN0zjfojOk0eY3ehBBLZYVpbchDyu65X8KDUVDDBuSc++wTAa9ajggULro1qI7wzsVQx1PLtvKDQPmHrefDYbrwguCL5mV7jT9CIYb6RhcihH/OKTYXy2nItT3WtjFxKbWJZlULH8elV35o751yu0NNAd/3TFoVZesijKI5q2el5x1oq0OYuTZ01ZmbOtGIOcomh+N9DskMF742Tf7eEVXHMqqvIE5lkm3xMd9Q4MYEkeqnDX/9ZHwqD2gibQDVrnDDNuSuH2DMv6esrg03zQwM0uX5O26kPpmUPOa2bAB86ijvXwnDs8yZm7j39HvrcToOR4G74Th2QEc4B6SSpPgfdYnIlHppNEIRqL6eYt5+IlL488DDWPow0Zizi3rKqlNwPC1MQ94jUUHbMM6T6DgUVZgRwT/ulZO9SNMfZb2VXPE6UoUgP//oyr3XWzBCDB/mlLKopLtzw4oM0t0KsCNyG4klDilCNbsixNeHhqDkeiTzb9xqwqT+NLpbtGQECoZaTeI5K785aF+b6v3E7hYRLQfVa9AOyUP7OivopXl3xHO4ym/X2FoupasRRWe3SVpIFmWvsKqIhBHraTQlyxphMb9Rz2838hhdU7";
const compressedConsoleDefaultArray =
  "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";

// Decompressed (inflated) String Values into JSON values
// Brands and second steps are preloaded
const consoleBrands = JSON.parse(PakoInflate(compressedConsoleBrands));

// Default values and other data for each spec
const consoleDefaultArray = JSON.parse(
  PakoInflate(compressedConsoleDefaultArray)
);

// This determines how many rows to show in the table, each item is 1 column, each item within the item is a row.
// To add a product, the specs are added to the '-Specs' array in the corresponding category. '-Specs' array is below
const consoleCategories = [
  { Category: "N", Values: [] },
  { Category: "R", Values: [] },
  { Category: "Pros", Values: [] },
  { Category: "Brand", Values: [] },
  { Category: "Name", Values: [] },
  { Category: "CPU", Values: [] },
  { Category: "GPU", Values: [] },
  { Category: "RAM", Values: [] },
  { Category: "Storage", Values: [] },
  { Category: "Display", Values: [] },
  { Category: "Controllers", Values: [] },
  { Category: "Height", Values: [] },
  { Category: "Width", Values: [] },
  { Category: "Length", Values: [] },
  { Category: "Size", Values: [] },
  { Category: "Weight", Values: [] },
  { Category: "Operating Temperature", Values: [] },
  { Category: "Ports", Values: [] },
  { Category: "Games", Values: [] },
  { Category: "Connectivity", Values: [] },
  { Category: "Audio", Values: [] },
  { Category: "Power", Values: [] },
  { Category: "Portability", Values: [] },
];

const droneProcess = ["a brand", "a drone"];
const droneQueryProcess = ["Brand", "Name"];

const compressedDroneBrands =
  "eJxtUl1vmzAU/SsWz9VkQ4Cob7SkDdsyoRh10qo+uImrWQObGROtm/bf5y8CTvZ07zm+99wvP/+J7iThx+g2KkZF2+gm2tOfIx0UVrSPbp+jzUmAqtK8cXbkF1g1HnwhXIC6HQePPzNFL7F3qwqUI2lnVEsxgw1XVPaSDXShHGaCbAWbmdo3nwCmktEhevl7M89QfqyuJ9iREzuAgkkQ68f6O+FKdGDle9gxzmZgQ+MAJeCecbp4/CZENyUmPtSq43OQhkGp4ngi/ECP5wCXFfQCnuIPcFm1JcPADssUvV2iGB+7M2maWAglAG9miWbqMg7o2TNkcSKKgIf6KdC0q8I9kT8mDa0QrHor2neAlbCrudj4FucxNOJbjCC0NoeeyD2BYlg6J0+dTSYCwscp1DFazdo493blNTKXmqQGP6A1+jpJusQU+UDkJVGGrM3S84MvmnnpxPc7ZfpSsW4hmL8mUgp1PXvByRvTH8Cs1rja3tFX0duN7kj3KuyyQy2hKHe3vlQzV7XHM5425dr008Rm8AatDWM7LyUlHZX+Y5V2vCZJwzr799//uVZD21aEgZiTXhHGr4NxndoD4tqtENfuoDi91xIv/wAjsjX8";
const compressedDroneDefaultArray =
  "eJzFmc9T6zYQx/+VnZxghhz6piduJJQHMw2kmMLhTQ+KvIk1lSWNJBPSTv/3rn/i5IU4OFG4gSx99Vlpd6VVfvw7eGYyw8HlYDgcXAyuhTOSrQaX3mZ4MRgzjwtt6f/ByDIVU48J8zwRarHWpGLmi25zJh2Ne1qZXDKij1OLc7SoODZf71KjrWfKNy23YpGgvc/SGdpy7v8u9ia7ZymugzUtYbmu4hiYB4nMefgGwmPqwGt4FbgEnyAYq91O9GnZoYXetBwXvWhss78gI0I7jJBJjNuQ1fgWZUTc3GeWSbihYZnFDWjhYFnpuUIPznIxl9AC6Pn5LntGnfaUi9ZhznXmfDEZ0ETwQux2+IhOuELjYOviNfllIW9b8i3zStzjWtcRAJH4ZyMAXrXMNkNgDez+JGAvSMP9OtryvW07WvTncdgmQok0S0EbtMzT5EDxWfxNW3wJHegPzain91Hrlki9RAp8oz0qL8h9ts4UfhMm7C2soemuCY5u3yez/+0WH0u6fOxE7i9in6yT+UTwvxU69+Vwv6NabNItG+CvJLuR+e7Bk0gRzn6BGfOUblfn231yXnb2IkC6+6Qn1nFY8V8XpwP/IJYq7rjd6QvZn7SByCDGO2ld0yMk6sOM1oRLhGv0yL3QavcBPtbKWy03Tm1dq8QtlcDn9J3yKGmp6DyovWCiY3R9+EVLq1r+tNIKbMUjUl5XQ6+Ht7qIqk+z20IhvwonOg9i65Pz8NwTXDAj3lC6zkNvTAWCZRu+3gyHs5QJBbzotAv8OP5e54276KEfeDVeOB2c9fHqBaaJ9rrLpwvODy7ULtHaO7BsGd4pnkWMGkbC022l+zK0dXk11XMwKxWCL3DJ+0fGpPCrXryvhYJFrm2c39X2debuynIf/huBMgYqlJ6pCO7FP68V8jI6OO/t9WORVw9w54Q5YDDLhPRDWukktrViYN+O0OZlR0TxeBwbXCnoWoKBTRhPHiKIUDlt96HfBs1T7Yi8kgjMO2VKW5YKfuiCc0YxaekTgik1yRihhvzdzqCGfPvVwFgoTNlxXCfX42t6gQ0YZZaK78b390w1H+0GXWOEynTmoDic8rzJPCSEQJnUaZl1XCCPk/xvps/QOPong2FuXuFUzlMGLOTvTr1SfBmt4Op3q5AJflSWj7SuhnE6U9slZSd8NXidvhoNRi9xV8o5jk+ME2YX+FM13A+dl2JBquUtdQRdndhMdiSXraBlUrG1Qm12eNf+7Y3mUXQITmhu2uRI6o7346pj/jAcERdb4BZTFGAtnJb9XSkc2Jzv06hPAZczL8wJas3vK6sd16ZXmVk6yaIlcYL6vtjDaqM7g7DLN0Qt6Fpfe//ys1cBR0R054hSZr1JtEKo1rbPBrjM5JPXoUq6rtE9wd1Rp4a5Xo8r1c2xEQhMesU5SrQ6RY9d99yPeRWwDZ3QDyrVw8JG6jrY6+sHC5bqTPm81PspOZaOtfnYGDAgDoiC97OKdHijE/z+W9WbNW9v8rgRCIH81//pBQ1e";

const droneBrands = JSON.parse(PakoInflate(compressedDroneBrands));
const droneDefaultArray = JSON.parse(PakoInflate(compressedDroneDefaultArray));
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

const graphicsCardsProcess = ["a brand", "a generation", "a graphics card"];
const graphicsCardsQueryProcess = ["Brand", "Generation", "Card"];

const compressedGraphicsCardsBrands =
  "eJxtkk1PwzAMhv9K1POQyroP2K2sUHLYVGAbSNMOprW2Slkz0o4L4r+Tru0Sp5yax6/9xna6/fEeFBSZN/PCReQNvFf8OmNZvVV48mZbb4N7YDxOagUylAVLlGR1lEYW8jMX6MQg1YHGgbcmS/jO24+puRDn3Bzb7LksSimQxclaUyIFqLw0nibfMul3S+uMUdfA7ndgtsCLCkV/DxFUwOaoRdV28xyxWMHpkKflzfvCCaxqDubXgMYPtIlUU3ZU1/pRcyjSAx7zsqrPKrWTyTDLDY942J8mxiepUmQj36/tO7z1NaywFMASKFMQtjYx79WkhBlcz6uzyou9xpczZPUPIkUFVvXQt2DkkzttmhIa+ubO1jg8nlChlXPvU2tTYWXQIfspI2IS/JMxbUzayd0mxo3a9nhdRiffuR0QnDjqxDj1XiEgjY4v1G3Geg53/QEdz72erJyIGvUftfsDmxI9dA==";
const compressedGraphicsCardsDefaultArray =
  "eJzFl0Fv2jAUx7+KldMmUWmFG7cS1BaptBaB9TDt4CYPYi2xI8dpy6Z999mEIAwUpwnObvDi/9+/vBc/2z/+eN9JUoA39K6uvJ43pnmWkLU3lKKAnucTCSsu1H9vJAiL1IgpkWFM2coIsYjIzbAlSXKlm68zbRmoh1jAEgSwEHZPJ2nGhSRM7iL3dBWDeCzSFxDb4N9ebbQ7YCCIpJyZfAfx/wvpE3GQvl3EMdhNFCEiUQIkl6iPqIQ0R5KjVwpvSMaAMsHzs+y4HLDHvos4Zr/DiyGylR8vDuq+DThmm6vPP6e5mgLl9Dd8nvPAwGQu5VvkRytyObw2cd6GNr84qY59kNoxqF9y3Sq7Ww/n2GMKKGj0KVRK54gz0H0A0FjBWDGrwRO25Cbvvg36cvNKaEJeaKKS/LWLpTcNZnjT00jBwrjFe5hG7lcg9icoSLi0Io/40X5Rac9Q2vNbizKISaTmRAWj0t4pZsAiEJrRwDVM3HeM6aIxqda6X3hPuDGg1joH9HmaFWo1L2oV/aiDGXL35VYdXTV2nwtoXvY9D/fln7eDrfTOQR++IZ+EsX1z2IwyISute8jrFpDXXUH2W0D2rZDB4jKUgxaUg1OU5pZ/mVyO9PbtJzz89fnOtNGGWuu85CPO1R2rKedG3A3oFFJlXZO0HHxwcNoz6IpWH5CRmghp8zbUhlFX9KPC3vzPMCt5Z6RqkjcaSfvB+hxvZeK+hT0VUh097Nk9cabeSts1sHp3lgdgqxopPQFZKi/fZI8Qn2sV/QTh83GhnQDeg3re6PJUKjtAnI9xEz4l6wAO03dI0KzO3R+DWHKREj2deQ3deXRwyn+XhYCWwPsuzpFv8aCP5iDIbcIze0v6ENr0cYP98x9MgAM3";

const graphicsCardsBrands = JSON.parse(
  PakoInflate(compressedGraphicsCardsBrands)
);
const graphicsCardsDefaultArray = JSON.parse(
  PakoInflate(compressedGraphicsCardsDefaultArray)
);
const graphicsCardsCategories = [
  { Category: "N", Values: [] },
  { Category: "R", Values: [] },
  { Category: "Pros", Values: [] },
  { Category: "Brand", Values: [] },
  { Category: "Generation", Values: [] },
  { Category: "Card", Values: [] },
  { Category: "GPU", Values: [] },
  { Category: "Memory", Values: [] },
  { Category: "Cache", Values: [] },
  { Category: "Release Info", Values: [] },
  { Category: "Board", Values: [] },
  { Category: "Rendering", Values: [] },
  { Category: "Performance", Values: [] },
];

const CPUsProcess = ["a brand", "a generation", "a processor"];
const CPUsQueryProcess = ["Brand", "Generation", "CPU"];

const compressedCPUsBrands =
  "eJxlUsFOwzAM/ZUo5x1WulG229ZViMOkagMBm3Yo1FIjpUlJUzSG+HfilDiTuFjP79Xv2VGP33xtKlXzJV9tN3zCd/AxQG/3Fjq+PPLd1wUUS51wQNF3mUOrZIrVNlIrB4oEu4UXbrAvX3NWtG9Q11Aje4dlRhaPjYGqNqLrwBDpx29dyYnKh97qltorx5E4JATnGBuy+elnEi97UBbk/9teQCtWysoKNWCG74uMEF7tR1lp9Dv0vTZBKxvhYAnKiqFl91riSrk2wETGZlPbULuIiBVna6CFwODGT9Kayl/ufZ+ja6A2AeyF/ATaoAjgL3w0yoJ3GuS10epCkXTctjrT0Pxq97jimBK1NH5FyKsgwfifACfcw59+AW43r6A=";
const compressedCPUsDefaultArray =
  "eJy9mV1v2jAUhv+KRW/LpkJ707sS+kEFNCJ0qjTtwiSHYi3EmeO0sGn/fQ6BkAQWhxj7ksTv60cnx/bx4fuf1jfsx9C6bbXbrctWn0Shj9etW85iuGxZmMM7ZeJ3q8dw4IkRI8zdBQneC48CD/PNsDn2I6GbrsPE0hEvbQZzYBC4kL0dLEPKOA549uSJvC+AjePlDFg699/L2mSPEADDnNCgiFd6rpfRsl9vkQRUjCkS7h7oRbvzPIQ58gFHHHUQ4bCMEKfog8An4gtAIaNRJbidDsiRZ0/Oi755mGd3qPsTuDSyto/5nLJlETIVG4iwiIYLUYQc8hukrHdM8HFweczgIKiZTZE6NdlCj6XQ6XBJaKdi9UYkEhNECsw5l7Mjl8PcJ6Aa4p2FdtbB1xd0prQoW+lPjWTG86RHyclI2M+QJnkb7czcwhGM8ErKOxUmS+wXUXfqCkz5LlcL87k547MJwBFmzc+KVHzKWZEan7q0JpCcw4D6Aqghat7CxBl8gegcWZSBfCM4qHD2Wu3LaDPVdMEAe01Bt2rtqE/rGSPe8ZhuHatY83ITCTC00X27KexerD2szshGF0gQNPj+e63+MyoQGOJiAh56ZDhcEFfO68Sz9rYG2B2j+8Pq0M9EVjww+BULi7U82L4oxIvMmbjqVHg9S7inMZtRtGFoQpqTaz/Besm23ph0r9aewumKRv9NgRr7QtlCO3O2EaEepdFBnXDKVpY6aCcexT4noU+ANUmHvVp73r58AHMTAjzzQRLUKlD0GiSvwasg7p2FeFyjXVO1594N0hxA43ILR0MeTPt2s7pbCPVfFkVpT5bxEtn0s0aibkaVS++cgQFeWApv5MRhopMCp8NLxAWLsy+vw0vD5nB3QgBPvm0dA84ZVJUG8gjXKw36/cmVCu5er0Zbq6nUn3QUWTsGWbuKrF2DrNeKrNcGWW8UWW9MsQ5t1dWVdzDEq7TC8g6GeJVWWd7BEK/SSss7mOJ9Uwd+M0qstD/kHUzxqkf4ZmWKWFSAKMVoVo7h1ReUe6H1TpaWfr1Y3rOpqByFXH/VeG9Z+6icmAAFrWZO2xq071chE/cs+fXBGhRBc2L9pA64VEwgPqCYtkb7vgxb1OvnnQLjpDluQa7/YmZhdwFoeCVvdiQDi6g7rfb1v52oowDZ0d/z3M7UVaDs6t/2t820Zl88E5tqdjb75plY/8nkTORtouP/KA5xHLgLZDPiGtiVRpSL1zOKWY0/6o4DWwsSRsAr/+do2Mwoh9WukZ5Hmlq2gcS0a6TkUTT9yfhgd2uwAUs+LQ7c0qJJ1NoRe3Hg+ZD8jUr9Go3Low3WooempfPjH5KQ1Js=";

const CPUsBrands = JSON.parse(PakoInflate(compressedCPUsBrands));
const CPUsDefaultArray = JSON.parse(PakoInflate(compressedCPUsDefaultArray));
const CPUsCategories = [
  { Category: "N", Values: [] },
  { Category: "R", Values: [] },
  { Category: "Pros", Values: [] },
  { Category: "Brand", Values: [] },
  { Category: "Generation", Values: [] },
  { Category: "CPU", Values: [] },
  { Category: "Clock", Values: [] },
  { Category: "Architecture", Values: [] },
  { Category: "Thermal", Values: [] },
  { Category: "Platform", Values: [] },
  { Category: "Sub-Processors", Values: [] },
  { Category: "Power", Values: [] },
  { Category: "Memory", Values: [] },
  { Category: "PCI", Values: [] },
  { Category: "Cache", Values: [] },
  { Category: "Performance", Values: [] },
];

const carsProcess = ["a brand", "a model", "a year", "a trim"];
const carsQueryProcess = ["Brand", "Model", "Year", "Trim"];

const compressedCarsBrands =
  "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";
const compressedCarsDefaultArray =
  "eJzFl02P2jAQhv+KlVNXYlWpR24lbJdKZYUW2lVV9TAks8FSYqdjZxGt+t+bDzbkqyQYzJ4Q43knj8eZ8eTHH+cbhAk6Y+f21hk5U67iEHbOWFOCI8cFjYGk9L8zIRB+6jEH7W24CGom4YPO3Z4hVKlutYuzkMt0cUH4jITCw3L1cxRL0iB0aZnxYIP0kERrpOLZf0eDyebSx7BOdjC9Kdl3BKqDlZY35VoRj+pcpcUu10ffZ6BZiKA0+8C4xkgxLdkLxy3TG2QxSXUUfVE4VNBLy2XRc2OVfSL9HctijllfqaSejUp51Z4CWsStcBaGHsyF3CJpAi56OecyxWgks1TbJ50Sf0Fj0oPaPukSQateyCkqHog6Za6sAxa6Pd+DCV+zqqZSkhlerrSN53K9Y58SDNlX1Sqe/XFVODPP9xPQGqlRRXkMVwqVRLHmUrB3WeibE/jbtT/o/LPlLdjaxD76FfbhymjNBfq2TmMf/uZYRV5oK/nTB3Xjnh1csSsbN+SLvxnNEl1J+pX0p7KDr1BaB0x//3NXtF/ZDsqD/OJH3Una6sbDKU9px2a5dHchFz62r4xBkKX6CGf/yDWE804EaTdhoGJOkHUYI95WFPvF7ia0Zk+YOmmDWbGitn8jfEER6I0BZSE8pdGb5fKJ+0Z8uc4+3sz0lGcdB2wlfxvEcA3tq35IDl+19jFXnJAt+e9+zK4xtlSfN3gM+oR95JE5aCZW1+G8RxjwUdDRMHOh/YmDQKiIK9XR1wfNHRW9/Y6+Hx+ZCzF46TfHOXNzM5b1VN+F6GniHnsEEZw18tcj2RkAfv4DQlzqCA==";

const carsBrands = JSON.parse(PakoInflate(compressedCarsBrands));
const carsDefaultArray = JSON.parse(PakoInflate(compressedCarsDefaultArray));
const carsCategories = [
  { Category: "N", Values: [] },
  { Category: "R", Values: [] },
  { Category: "Pros", Values: [] },
  { Category: "Brand", Values: [] },
  { Category: "Model", Values: [] },
  { Category: "Year", Values: [] },
  { Category: "Trim", Values: [] },
  { Category: "Body", Values: [] },
  { Category: "Motor", Values: [] },
  { Category: "Design", Values: [] },
  { Category: "Fuel/Battery", Values: [] },
];

const fast = -0.12;
const normal = -0.09;
const reputable = -0.07;
const reliable = -0.06;
const reliableMotorCycle = -0.07;
const reputableMotorCycle = -0.055;
const expensiveSportMotorCycle = -0.045;
const inBetweenCars = -0.045;
const superReliable = -0.035;
const expensiveSport = -0.03;
const superMotorCycle = -0.025;
const superCar = -0.02;

const gpuFast = -0.16;
const gpuNormal = -0.12;

const cpuNormal = -0.12;

const carsAveragePrices = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  24596.49306,
  24568.04833,
  24499.73456,
  23629.92042,
  26551.32829,
  35249.10294,
  34998.1869,
  31601.678,
  29804.43696,
  28069.02268,
  26335.33643,
  26434.31044,
  26533.18701,
  26631.96533,
  26730.64605,
  26829.22803,
  26927.71208,
  27026.09842,
  27124.38395,
  27222.57373,
  27320.66564,
  27706.09402,
  28091.13666,
  28475.79633,
  28860.07368,
  29243.96935,
  29627.4796,
  30010.60948,
  30393.35726,
  30775.72255,
  31157.70719,
  31539.31261,
  31920.53863,
  32301.38433,
  32681.85482,
  33061.94786,
  32613.79568,
  32166.10259,
  31718.85731,
];

const carsBrandValues = [
  { label: "Acura", value: reliable },
  { label: "Alfa Romeo", value: reputable },
  { label: "Alpine", value: inBetweenCars },
  { label: "Aston Martin", value: expensiveSport },
  { label: "Audi", value: reputable },
  { label: "Bentley", value: expensiveSport },
  { label: "BMW", value: reputable },
  { label: "BMW M-Series", value: reputable },
  { label: "BMW Motorcycle", value: expensiveSportMotorCycle },
  { label: "Bugatti", value: superCar },
  { label: "Buick", value: normal },
  { label: "BYD", value: normal },
  { label: "Cadillac", value: normal },
  { label: "Chevrolet", value: normal },
  { label: "Chevrolet Corvette", value: reputable },
  { label: "Chrysler", value: normal },
  { label: "Citroen", value: fast },
  { label: "Daewoo", value: normal },
  { label: "Dodge", value: reputable },
  { label: "Ducati", value: reliableMotorCycle },
  { label: "Ferrari", value: superCar },
  { label: "Fiat", value: fast },
  { label: "Fisker", value: fast },
  { label: "Ford", value: reputable },
  { label: "Genesis", value: normal },
  { label: "GMC", value: normal },
  { label: "Harley-Davidson", value: expensiveSportMotorCycle },
  { label: "Hennessey", value: superCar },
  { label: "Honda", value: reliable },
  { label: "Honda Motorcycle", value: superMotorCycle },
  { label: "Hummer", value: fast },
  { label: "Hyundai", value: normal },
  { label: "INEOS", value: fast },
  { label: "Infiniti", value: normal },
  { label: "Isuzu", value: normal },
  { label: "Jaguar", value: expensiveSport },
  { label: "Jeep", value: normal },
  { label: "Karma", value: normal },
  { label: "Kawasaki", value: expensiveSportMotorCycle },
  { label: "Kia", value: normal },
  { label: "Koenigsegg", value: superCar },
  { label: "KTM", value: expensiveSport },
  { label: "Lamborghini", value: superCar },
  { label: "Land Rover", value: normal },
  { label: "Lexus", value: reliable },
  { label: "Lincoln", value: normal },
  { label: "Lotus", value: normal },
  { label: "Lucid", value: normal },
  { label: "Maserati", value: expensiveSport },
  { label: "Maybach", value: superCar },
  { label: "Mazda", value: reliable },
  { label: "McLaren", value: expensiveSport },
  { label: "Mercedes-AMG", value: reputable },
  { label: "Mercedes-Benz", value: reputable },
  { label: "Mercury", value: normal },
  { label: "Mini", value: fast },
  { label: "Mitsubishi", value: superReliable },
  { label: "Nissan", value: reliable },
  { label: "Oldsmobile", value: normal },
  { label: "Opel", value: normal },
  { label: "Pagani", value: superCar },
  { label: "Panoz", value: normal },
  { label: "Peugeot", value: normal },
  { label: "Plymouth", value: normal },
  { label: "Polestar", value: normal },
  { label: "Pontiac", value: normal },
  { label: "Porsche", value: expensiveSport },
  { label: "RAM", value: normal },
  { label: "Renault", value: normal },
  { label: "Rimac", value: superCar },
  { label: "Rivian", value: normal },
  { label: "Rolls-Royce", value: expensiveSport },
  { label: "Saab", value: normal },
  { label: "Saturn", value: normal },
  { label: "Scion", value: normal },
  { label: "Smart", value: fast },
  { label: "Spyker", value: normal },
  { label: "Subaru", value: reliable },
  { label: "Suzuki", value: normal },
  { label: "Suzuki Motorcycle", value: reputableMotorCycle },
  { label: "Tata", value: normal },
  { label: "Tesla", value: reputable },
  { label: "Toyota", value: superReliable },
  { label: "Triumph", value: expensiveSportMotorCycle },
  { label: "VinFast", value: fast },
  { label: "Volkswagen", value: normal },
  { label: "Volvo", value: reliable },
  { label: "Xiaomi", value: fast },
  { label: "Yamaha", value: expensiveSportMotorCycle },
];

const graphicsCardsBrandValues = [
  { label: "AMD", value: gpuFast },
  { label: "Intel", value: gpuFast },
  { label: "NVIDIA", value: gpuNormal },
];

const processorsBrandValues = [
  { label: "AMD", value: cpuNormal },
  { label: "Intel", value: cpuNormal },
];

export default function App() {
  const [userVal, setUserVal] = useState(false);
  const isMobile = useWindowDimensions();

  const queryDronesFunction = async (brand, name) => {
    const colRef = collection(db, "Drones");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Name", "==", name)
    );

    const snapshot = await getDocs(q);

    const dronesArray = [];
    snapshot.forEach((doc) => {
      dronesArray.push(doc.data());
    });

    return dronesArray;
  };

  const directQueryDronesFunction = async (product) => {
    const colRef = collection(db, "Drones");
    const q = query(
      colRef,
      where("Brand", "==", product[0]),
      where("Name", "==", product[1])
    );

    const snapshot = await getDocs(q);
    const dronesArray = [];
    snapshot.forEach((doc) => {
      dronesArray.push(doc.data());
    });

    // Should only be 1 item so return the first
    return dronesArray[0];
  };

  const queryConsolesFunction = async (brand, name) => {
    const colRef = collection(db, "Consoles");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Name", "==", name)
    );

    const snapshot = await getDocs(q);

    const ConsolesArray = [];
    snapshot.forEach((doc) => {
      ConsolesArray.push(doc.data());
    });

    return ConsolesArray;
  };

  const directQueryConsolesFunction = async (product) => {
    const colRef = collection(db, "Consoles");
    const q = query(
      colRef,
      where("Brand", "==", product[0]),
      where("Name", "==", product[1])
    );

    const snapshot = await getDocs(q);
    const consolesArray = [];
    snapshot.forEach((doc) => {
      consolesArray.push(doc.data());
    });

    // Should only be 1 item so return the first
    return consolesArray[0];
  };

  const queryGraphicsCardsFunction = async (brand, generation) => {
    const colRef = collection(db, "Graphics Cards");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Generation", "==", generation)
    );

    const snapshot = await getDocs(q);

    const GraphicsCardsArray = [];
    snapshot.forEach((doc) => {
      GraphicsCardsArray.push(doc.data());
    });

    return GraphicsCardsArray;
  };

  const directQueryGraphicsCardsFunction = async (product) => {
    const colRef = collection(db, "Graphics Cards");
    const q = query(
      colRef,
      where("Brand", "==", product[0]),
      where("Generation", "==", product[1]),
      where("Card", "==", product[2])
    );

    const snapshot = await getDocs(q);
    const graphicsCardsArray = [];
    snapshot.forEach((doc) => {
      graphicsCardsArray.push(doc.data());
    });
    // Should only be 1 item so return the first
    return graphicsCardsArray[0];
  };

  const queryCPUsFunction = async (brand, generation) => {
    const colRef = collection(db, "CPUs");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Generation", "==", generation)
    );

    const snapshot = await getDocs(q);

    const CPUsArray = [];
    snapshot.forEach((doc) => {
      CPUsArray.push(doc.data());
    });

    return CPUsArray;
  };

  const directQueryCPUsFunction = async (product) => {
    const colRef = collection(db, "CPUs");
    const q = query(
      colRef,
      where("Brand", "==", product[0]),
      where("Generation", "==", product[1]),
      where("CPU", "==", product[2])
    );

    const snapshot = await getDocs(q);
    const cpusArray = [];
    snapshot.forEach((doc) => {
      cpusArray.push(doc.data());
    });

    // Should only be 1 item so return the first
    return cpusArray[0];
  };

  const queryAutomobilesFunction = async (brand, model) => {
    const colRef = collection(db, "Automobiles");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Model", "==", model)
    );

    const snapshot = await getDocs(q);

    const automobilesArray = [];
    snapshot.forEach((doc) => {
      automobilesArray.push(doc.data());
    });

    return automobilesArray;
  };

  const directQueryAutomobilesFunction = async (product) => {
    const colRef = collection(db, "Automobiles");
    const q = query(
      colRef,
      where("Brand", "==", product[0]),
      where("Model", "==", product[1]),
      where("Year", "==", product[2]),
      where("Trim", "==", product[3])
    );

    const snapshot = await getDocs(q);
    const automobilesArray = [];
    snapshot.forEach((doc) => {
      automobilesArray.push(doc.data());
    });

    // Should only be 1 item so return the first
    return automobilesArray[0];
  };

  useEffect(() => {
    // listen for changes (sign in, sign out)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // update userVal upon any change
      setUserVal(user);
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* in case user goes to specgauge.com, instead of specgauge.com/home */}
        <Route
          path="/"
          element={<WebHome isMobile={isMobile}></WebHome>}
        ></Route>
        {/* the home page */}
        <Route
          index
          path="/home/"
          element={<WebHome isMobile={isMobile}></WebHome>}
        ></Route>
        {/* the login page */}
        <Route
          index
          path="/login/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <WebLogIn isMobile={isMobile}></WebLogIn>
            </Suspense>
          }
        ></Route>
        {/* the user account page */}
        <Route
          index
          path="/account/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <WebUserAccount
                isMobile={isMobile}
                brands={[
                  carsBrands,
                  consoleBrands,
                  CPUsBrands,
                  graphicsCardsBrands,
                  droneBrands,
                ]}
              ></WebUserAccount>
            </Suspense>
          }
        ></Route>
        {/* the cars comparison page */}
        <Route
          path="/comparison/automobiles/*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Compare
                type={"Vehicles"}
                Brands={carsBrands}
                Process={carsProcess}
                QueryProcess={carsQueryProcess}
                QueryFunction={queryAutomobilesFunction}
                DirectQueryFunction={directQueryAutomobilesFunction}
                DefaultArray={carsDefaultArray}
                Categories={carsCategories}
                isMobile={isMobile}
                comparisonLink={
                  window.location.origin + "/comparison/automobiles/"
                }
                description={`Compare multiple new and used Cars, SUVs, Trucks and Electric Vehicle (EVs) and more side-by-side. The ultimate automobile comparison tool.`}
                defaultTitle={`Compare Multiple Vehicles Side-by-Side - Car Comparison Tool`}
              ></Compare>
            </Suspense>
          }
        ></Route>
        {/* the consoles comparison page */}
        <Route
          path="/comparison/consoles/*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Compare
                type={"Consoles"}
                Brands={consoleBrands}
                Process={consoleProcess}
                QueryProcess={consoleQueryProcess}
                QueryFunction={queryConsolesFunction}
                DirectQueryFunction={directQueryConsolesFunction}
                DefaultArray={consoleDefaultArray}
                Categories={consoleCategories}
                isMobile={isMobile}
                comparisonLink={
                  window.location.origin + "/comparison/consoles/"
                }
                description={`Compare Xbox vs Nintendo vs PlayStation vs Steam Deck and more consoles side-by-side. The ultimate gaming console comparison tool`}
                defaultTitle={`Compare Multiple Consoles Side-by-Side - Console Comparison Tool`}
              ></Compare>
            </Suspense>
          }
        ></Route>
        {/* the cpus comparison page */}
        <Route
          path="/comparison/cpus/*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Compare
                type={"CPUs"}
                Brands={CPUsBrands}
                Process={CPUsProcess}
                QueryProcess={CPUsQueryProcess}
                QueryFunction={queryCPUsFunction}
                DirectQueryFunction={directQueryCPUsFunction}
                DefaultArray={CPUsDefaultArray}
                Categories={CPUsCategories}
                isMobile={isMobile}
                comparisonLink={window.location.origin + "/comparison/cpus/"}
                description={`Compare AMD Ryzen vs Intel Core processors side-by-side. View real-world benchmark performance in the ultimate CPU comparison tool.`}
                defaultTitle={`Compare Multiple Processors Side-by-Side - CPUs Comparison Tool`}
              ></Compare>
            </Suspense>
          }
        ></Route>
        {/* the graphics cards comparison page */}
        <Route
          path="/comparison/graphicsCards/*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Compare
                type={"Graphics Cards"}
                Brands={graphicsCardsBrands}
                Process={graphicsCardsProcess}
                QueryProcess={graphicsCardsQueryProcess}
                QueryFunction={queryGraphicsCardsFunction}
                DirectQueryFunction={directQueryGraphicsCardsFunction}
                DefaultArray={graphicsCardsDefaultArray}
                Categories={graphicsCardsCategories}
                isMobile={isMobile}
                comparisonLink={
                  window.location.origin + "/comparison/graphicsCards/"
                }
                description={`Compare NVIDIA GeForce vs AMD Radeon vs Intel Alchemist GPUs side-by-side. Including GTX 10, RTX 20, RTX 30, RTX 40 series and RX 5000 - RX 7000 GPUs.`}
                defaultTitle={`Compare Multiple GPUs Side-by-Side - Graphics Cards Comparison Tool`}
              ></Compare>
            </Suspense>
          }
        ></Route>
        {/* the drones comparison page */}
        <Route
          path="/comparison/drones/*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Compare
                type={"Drones"}
                Brands={droneBrands}
                Process={droneProcess}
                QueryProcess={droneQueryProcess}
                QueryFunction={queryDronesFunction}
                DirectQueryFunction={directQueryDronesFunction}
                DefaultArray={droneDefaultArray}
                Categories={droneCategories}
                isMobile={isMobile}
                comparisonLink={window.location.origin + "/comparison/drones/"}
                description={`Compare DJI, Autel, Parrot, Holy Stone and more drones side-by-side. View the DJI Mini, Autel Evo, Parrot Anafi in the ultimate drone comparison tool.`}
                defaultTitle={`Compare Multiple Drones Side-by-Side - Drone Comparison Tool`}
              ></Compare>
            </Suspense>
          }
        ></Route>
        {/* the automobiles prediction page */}
        <Route
          path="/prediction/automobiles/*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Prediction
                type={"Vehicles"}
                isMobile={isMobile}
                averagePrices={carsAveragePrices}
                brandValues={carsBrandValues}
                minimumPrice={7500}
                description={`View future prices of Cars, SUVs, Trucks, Electric (EVs) and more over time and into the future. View new and used vehicle depreciation and value.`}
                predictionLink={
                  window.location.origin + "/prediction/automobiles/"
                }
              ></Prediction>
            </Suspense>
          }
        ></Route>
        {/* the cpus prediction page */}
        <Route
          path="/prediction/cpus/*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Prediction
                type={"CPUs"}
                isMobile={isMobile}
                averagePrices={null}
                brandValues={processorsBrandValues}
                minimumPrice={150}
                description={`View future prices of processors over time and into the future. Predict future costs and view past prices.`}
                predictionLink={window.location.origin + "/prediction/cpus/"}
              ></Prediction>
            </Suspense>
          }
        ></Route>
        {/* the graphics cards prediction page */}
        <Route
          path="/prediction/graphicsCards/*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Prediction
                type={"Graphics Cards"}
                isMobile={isMobile}
                averagePrices={null}
                brandValues={graphicsCardsBrandValues}
                minimumPrice={200}
                description={`View future prices of GPUs over time and into the future. Predict future costs and view past prices.`}
                predictionLink={
                  window.location.origin + "/prediction/graphicsCards/"
                }
              ></Prediction>
            </Suspense>
          }
        ></Route>
        {/* the about us page */}
        <Route
          path="/aboutus/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Information
                isMobile={isMobile}
                title={"About Us"}
                text={
                  /* prettier-ignore */
                  <div>

<p className="InfoText">Welcome to SpecGauge – your ultimate sidekick for tech and car comparisons!</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText">We get it. Making the right choice in a world full of options can be overwhelming. Whether you’re picking out your next car, drone, gaming console, GPU, or CPU, we've got your back. Our mission? To help you make informed decisions with ease and confidence. </p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">What We Do:</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>• Compare Products Side by Side: </p><p className="InfoText">Check out detailed comparisons of the latest and greatest cars, drones, consoles, GPUs, and CPUs. No more guessing games – see how your top picks stack up against each other in real-time.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText" style={{fontWeight: 'bold'}}>• Predict Future Prices: </p><p className="InfoText">Wondering how much that new tech or car will cost down the road? Our unique prediction feature lets you forecast prices all the way to 2055. Yep, you read that right. Get ahead of the game and plan your purchases like a pro.</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">Why SpecGauge?</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText">We blend cutting-edge data analysis with a user-friendly interface to bring you accurate, reliable, and easy-to-understand insights. Our team is passionate about technology and cars, and we’re here to share that passion with you.</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">Whether you're a tech geek, a car enthusiast, or just someone looking to get the best bang for your buck, SpecGauge is designed with you in mind. We're all about making complex information simple and accessible.</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">So, dive in, explore, and let us help you find the perfect match for your needs. With SpecGauge, you're not just making a choice; you're making the right choice.</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">Thanks for stopping by. Let's navigate the future together!</p>
                </div>
                }
                description={
                  "Welcome to SpecGauge – your ultimate sidekick for tech and car comparisons. We get it. Making the right choice in a world full of options can be overwhelming. Whether you’re picking out your next car, drone, gaming console, GPU, or CPU, we've got your back. Our mission? To help you make informed decisions with ease and confidence."
                }
              ></Information>
            </Suspense>
          }
        ></Route>
        {/* the terms of service page */}
        <Route
          path="/termsofservice/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Information
                isMobile={isMobile}
                title={"Terms of Service"}
                text={
                  /* prettier-ignore */
                  <div>
<p className="InfoText">Welcome to SpecGauge! These Terms of Service ("Terms") outline the rules and regulations for using our website.</p>

<p className="InfoText">By accessing this website, we assume you accept these Terms in full. Do not continue to use SpecGauge if you do not agree to all of the Terms stated on this page.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">1. Use of the Website</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText" style={{fontWeight: 'bold'}}>1.1. </p><p className="InfoText">You agree to use SpecGauge only for lawful purposes and in a way that does not infringe on the rights of others or restrict or inhibit anyone else’s use and enjoyment of the website.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText" style={{fontWeight: 'bold'}}>1.2. </p><p className="InfoText">We reserve the right to modify or discontinue, temporarily or permanently, the website (or any part of it) with or without notice.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">2. Predictions and Accuracy</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText" style={{fontWeight: 'bold'}}>2.1. </p><p className="InfoText">SpecGauge provides future price predictions for products. These predictions are based on historical data and trends and are intended for informational purposes only. We do not guarantee the accuracy or reliability of these predictions.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">3. Intellectual Property</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>


<p className="InfoText" style={{fontWeight: 'bold'}}>3.1. </p><p className="InfoText">The content on SpecGauge, including text, graphics, logos, images, and software, is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, display, perform, or otherwise use any part of SpecGauge without our prior written consent.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">4. Privacy</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>4.1. </p><p className="InfoText">Your privacy is important to us. Please refer to our Privacy Policy to understand how we collect, use, and disclose information about you.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">5. Limitation of Liability</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>5.1. </p><p className="InfoText">To the extent permitted by law, SpecGauge and its affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with your use of this website.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">6. Governing Law</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>6.1. </p><p className="InfoText">These Terms shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">7. Changes to the Terms</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>7.1. </p><p className="InfoText">We reserve the right to revise these Terms at any time without prior notice. By using SpecGauge after any such changes, you agree to be bound by the revised Terms.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">If you have any questions or concerns about these Terms of Service, please contact us at specgauge@gmail.com.</p>
              </div>
                }
                description={
                  "Read the Terms of Service for SpecGauge. Understand the rules, guidelines, and policies that govern your use of our services and website. Stay informed about your rights and responsibilities as a user."
                }
              ></Information>
            </Suspense>
          }
        ></Route>
        {/* the privacy policy page */}
        <Route
          path="/privacypolicy/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Information
                isMobile={isMobile}
                title={"Privacy Policy"}
                text={
                  /* prettier-ignore */
                  <div>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">We collect user activity data through Google Analytics to understand how our app is used and improve it for you. This data helps us tweak features and make your experience better. The data is not linked to you or your email. We do not store any of your usage data on our servers. We don't sell this info to third parties — your privacy is our priority.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">When users visit our website, we utilize Google Ads to promote our services. Google Ads may place cookies on users' browsers and collect certain anonymous information for advertising purposes. This data helps us reach our audience effectively.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">Additionally, this website displays advertisements using Google AdSense. Google uses advertising cookies which enables it and its partners to serve ads to users based on their visit to this sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting myadcenter.google.com Further information and options about opting out the advertising cookies can be found at www.AboutAds.info.</p>

<p className="InfoText">When users create accounts using their email and password, we collect and store this information securely. It's used solely for account management purposes, like resetting passwords or sending important updates related to their account.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText">If you have any questions or concerns about our Privacy Policy, please contact us at specgauge@gmail.com.</p>

                </div>
                }
                description={
                  "Review the Privacy Policy of SpecGauge. Learn how we collect, use, and protect your personal information. Understand your privacy rights and our commitment to safeguarding your data."
                }
              ></Information>
            </Suspense>
          }
        ></Route>
        {/* any other page, error 404 */}
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <NoPage isMobile={isMobile}></NoPage>
            </Suspense>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

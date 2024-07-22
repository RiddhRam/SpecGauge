import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

import { Navbar } from "../components/Navbar";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
import GetProsAndSpecs from "../functions/GetProsAndSpecs";
import BuildTitle from "../functions/BuildTitle";
import PakoInflate from "../functions/PakoInflate";

const SelectionModal = lazy(() => import("../components/SelectionModal"));
const WebAccountHandler = lazy(() => import("../components/WebAccountHandler"));

import { logEvent } from "firebase/analytics";
import { httpsCallable } from "firebase/functions";
import { auth, analytics, functions } from "../firebaseConfig";
import SetCanonical from "../functions/SetCanonical";

// This determines how many steps the user has to go through when adding a product
const consoleProcess = ["a brand", "a console"];

// This is used when filtering out items in the selection modal whenever user clicks something
const consoleQueryProcess = ["Brand", "Name"];

// Compressed String Values
// Brands and second steps are preloaded
const compressedConsoleBrands =
  "eJyVV1tz2jgU/isanpJpOyvLmNC+QUzcTjDxYkKYdvqg2FqiibGzxk6gnf3veyRfZYs0eQH56Ds36dz04/dgmtI4HHwZuDxIk33yTzb4OFiyf3O2z/yMPQ2+/Bhs7pMD8lnK2R5tYLv97VffNzFrNsVHe6damiOMfDR0pm2Cl7Idz3eIYJV+maQK4yQNaKhQZhHPGDJajIOf/31sfFrwOGNxmPRd8l94FjwAvVigs5v5zEZuErLoHKh3nKNbNJZiTdtHmzk6I9gYnpff9UfJPgc7amjBD7+k+gQ6/No+L0W7POYFodgHXCmBlEj4ceiOoWlyRJPwmcYBK0lBfi+W/mLWBsFyMRqK35mPLiO63/MAzUKe8SQu0TVZalfOyU/iY/+MvIge/YwKEchCfsR3gOkT0ZnNtzyjUaXvvAvrsXUYOvtDiIikS+thbqOM7yhcvyCzFBmr6Ul5GttN5OdPwCY9IFYRQSpgqCNKfBVx6paG6CUp+AnENfiLSLmovk2nAxcAz/eQI933kUSt1iXVxBiXS6NZkmY5q8gtkeWlq1T19tc0emaaFMkY3SGbBY9KdoBuUiRwC2AZpEVyafDAIekVLZP7wzHKM42ikRCnYiPO4heaasCT6OmBojNunndYYhol21zD4SXBIxNVzc7FsbpsS5G/FcbKAFhkXUH3LI3liXUELR3TMuEawFX0ARkj+TcqzmLpWBaRH72tOx6PMFQv10aT7CGCO/E5HHgK92lhhv4q4MuJK5YQxL5vv85FgGvcsBCxLpiEhZsNZES+r20h49LAIbbWJfoDRPyoJAuf/MrkhmxhSw9edw6g2QQFrp7H1ck3e0copGtMkT713DEt7FVYk1REjDcascZaQ8R9bstwvR4SLWicKIoNr9klY+xqBGmIgNSZYbhIkwDJ469EF/2GqI0yKpbHXyxGF+hiPMS3EAfygIqQIHUUAb6NHY2xxMobVLGq+n2+18T/jYMmUXTsYDOa8j54fSna0/wYd1ry5EjRgmk68lXEnxA0wjf7pmMYv8Zwncd/kj5UpV9P32lOh+FVc8gffW2smfC0yOo33mbBYeg1tPCNhqJKIsHmspDTFXuENr1j8Z5nR9HwsKw1Naes+G3rICytMbFuVR/fZ7AUYo0kqCmFBBOjHAkEqOo1DgMT3yW+mrFAnpiU2CErxYplN0zjfojOk0eY3ehBBLZYVpbchDyu65X8KDUVDDBuSc++wTAa9ajggULro1qI7wzsVQx1PLtvKDQPmHrefDYbrwguCL5mV7jT9CIYb6RhcihH/OKTYXy2nItT3WtjFxKbWJZlULH8elV35o751yu0NNAd/3TFoVZesijKI5q2el5x1oq0OYuTZ01ZmbOtGIOcomh+N9DskMF742Tf7eEVXHMqqvIE5lkm3xMd9Q4MYEkeqnDX/9ZHwqD2gibQDVrnDDNuSuH2DMv6esrg03zQwM0uX5O26kPpmUPOa2bAB86ijvXwnDs8yZm7j39HvrcToOR4G74Th2QEc4B6SSpPgfdYnIlHppNEIRqL6eYt5+IlL488DDWPow0Zizi3rKqlNwPC1MQ94jUUHbMM6T6DgUVZgRwT/ulZO9SNMfZb2VXPE6UoUgP//oyr3XWzBCDB/mlLKopLtzw4oM0t0KsCNyG4klDilCNbsixNeHhqDkeiTzb9xqwqT+NLpbtGQECoZaTeI5K785aF+b6v3E7hYRLQfVa9AOyUP7OivopXl3xHO4ym/X2FoupasRRWe3SVpIFmWvsKqIhBHraTQlyxphMb9Rz2838hhdU7";
// Default values and other data for each spec
const compressedConsoleDefaultArray =
  "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";

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

const carsProcess = ["a brand", "a model", "a year", "a trim"];
const carsQueryProcess = ["Brand", "Model", "Year", "Trim"];
const compressedCarsBrands =
  "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";
const compressedCarsDefaultArray =
  "eJzFl02P2jAQhv+KlVNXYlWpR24lbJdKZYUW2lVV9TAks8FSYqdjZxGt+t+bDzbkqyQYzJ4Q43knj8eZ8eTHH+cbhAk6Y+f21hk5U67iEHbOWFOCI8cFjYGk9L8zIRB+6jEH7W24CGom4YPO3Z4hVKlutYuzkMt0cUH4jITCw3L1cxRL0iB0aZnxYIP0kERrpOLZf0eDyebSx7BOdjC9Kdl3BKqDlZY35VoRj+pcpcUu10ffZ6BZiKA0+8C4xkgxLdkLxy3TG2QxSXUUfVE4VNBLy2XRc2OVfSL9HctijllfqaSejUp51Z4CWsStcBaGHsyF3CJpAi56OecyxWgks1TbJ50Sf0Fj0oPaPukSQateyCkqHog6Za6sAxa6Pd+DCV+zqqZSkhlerrSN53K9Y58SDNlX1Sqe/XFVODPP9xPQGqlRRXkMVwqVRLHmUrB3WeibE/jbtT/o/LPlLdjaxD76FfbhymjNBfq2TmMf/uZYRV5oK/nTB3Xjnh1csSsbN+SLvxnNEl1J+pX0p7KDr1BaB0x//3NXtF/ZDsqD/OJH3Una6sbDKU9px2a5dHchFz62r4xBkKX6CGf/yDWE804EaTdhoGJOkHUYI95WFPvF7ia0Zk+YOmmDWbGitn8jfEER6I0BZSE8pdGb5fKJ+0Z8uc4+3sz0lGcdB2wlfxvEcA3tq35IDl+19jFXnJAt+e9+zK4xtlSfN3gM+oR95JE5aCZW1+G8RxjwUdDRMHOh/YmDQKiIK9XR1wfNHRW9/Y6+Hx+ZCzF46TfHOXNzM5b1VN+F6GniHnsEEZw18tcj2RkAfv4DQlzqCA==";
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

const CPUsProcess = ["a brand", "a generation", "a processor"];
const CPUsQueryProcess = ["Brand", "Generation", "CPU"];
const compressedCPUsBrands =
  "eJxlUsFOwzAM/ZUo5x1WulG229ZViMOkagMBm3Yo1FIjpUlJUzSG+HfilDiTuFjP79Xv2VGP33xtKlXzJV9tN3zCd/AxQG/3Fjq+PPLd1wUUS51wQNF3mUOrZIrVNlIrB4oEu4UXbrAvX3NWtG9Q11Aje4dlRhaPjYGqNqLrwBDpx29dyYnKh97qltorx5E4JATnGBuy+elnEi97UBbk/9teQCtWysoKNWCG74uMEF7tR1lp9Dv0vTZBKxvhYAnKiqFl91riSrk2wETGZlPbULuIiBVna6CFwODGT9Kayl/ufZ+ja6A2AeyF/ATaoAjgL3w0yoJ3GuS10epCkXTctjrT0Pxq97jimBK1NH5FyKsgwfifACfcw59+AW43r6A=";
const compressedCPUsDefaultArray =
  "eJy9mV1v2jAUhv+KRW/LpkJ707sS+kEFNCJ0qjTtwiSHYi3EmeO0sGn/fQ6BkAQWhxj7ksTv60cnx/bx4fuf1jfsx9C6bbXbrctWn0Shj9etW85iuGxZmMM7ZeJ3q8dw4IkRI8zdBQneC48CD/PNsDn2I6GbrsPE0hEvbQZzYBC4kL0dLEPKOA549uSJvC+AjePlDFg699/L2mSPEADDnNCgiFd6rpfRsl9vkQRUjCkS7h7oRbvzPIQ58gFHHHUQ4bCMEKfog8An4gtAIaNRJbidDsiRZ0/Oi755mGd3qPsTuDSyto/5nLJlETIVG4iwiIYLUYQc8hukrHdM8HFweczgIKiZTZE6NdlCj6XQ6XBJaKdi9UYkEhNECsw5l7Mjl8PcJ6Aa4p2FdtbB1xd0prQoW+lPjWTG86RHyclI2M+QJnkb7czcwhGM8ErKOxUmS+wXUXfqCkz5LlcL87k547MJwBFmzc+KVHzKWZEan7q0JpCcw4D6Aqghat7CxBl8gegcWZSBfCM4qHD2Wu3LaDPVdMEAe01Bt2rtqE/rGSPe8ZhuHatY83ITCTC00X27KexerD2szshGF0gQNPj+e63+MyoQGOJiAh56ZDhcEFfO68Sz9rYG2B2j+8Pq0M9EVjww+BULi7U82L4oxIvMmbjqVHg9S7inMZtRtGFoQpqTaz/Besm23ph0r9aewumKRv9NgRr7QtlCO3O2EaEepdFBnXDKVpY6aCcexT4noU+ANUmHvVp73r58AHMTAjzzQRLUKlD0GiSvwasg7p2FeFyjXVO1594N0hxA43ILR0MeTPt2s7pbCPVfFkVpT5bxEtn0s0aibkaVS++cgQFeWApv5MRhopMCp8NLxAWLsy+vw0vD5nB3QgBPvm0dA84ZVJUG8gjXKw36/cmVCu5er0Zbq6nUn3QUWTsGWbuKrF2DrNeKrNcGWW8UWW9MsQ5t1dWVdzDEq7TC8g6GeJVWWd7BEK/SSss7mOJ9Uwd+M0qstD/kHUzxqkf4ZmWKWFSAKMVoVo7h1ReUe6H1TpaWfr1Y3rOpqByFXH/VeG9Z+6icmAAFrWZO2xq071chE/cs+fXBGhRBc2L9pA64VEwgPqCYtkb7vgxb1OvnnQLjpDluQa7/YmZhdwFoeCVvdiQDi6g7rfb1v52oowDZ0d/z3M7UVaDs6t/2t820Zl88E5tqdjb75plY/8nkTORtouP/KA5xHLgLZDPiGtiVRpSL1zOKWY0/6o4DWwsSRsAr/+do2Mwoh9WukZ5Hmlq2gcS0a6TkUTT9yfhgd2uwAUs+LQ7c0qJJ1NoRe3Hg+ZD8jUr9Go3Low3WooempfPjH5KQ1Js=";
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

const graphicsCardsProcess = ["a brand", "a generation", "a graphics card"];
const graphicsCardsQueryProcess = ["Brand", "Generation", "Card"];
const compressedGraphicsCardsBrands =
  "eJxtkk1PwzAMhv9K1POQyroP2K2sUHLYVGAbSNMOprW2Slkz0o4L4r+Tru0Sp5yax6/9xna6/fEeFBSZN/PCReQNvFf8OmNZvVV48mZbb4N7YDxOagUylAVLlGR1lEYW8jMX6MQg1YHGgbcmS/jO24+puRDn3Bzb7LksSimQxclaUyIFqLw0nibfMul3S+uMUdfA7ndgtsCLCkV/DxFUwOaoRdV28xyxWMHpkKflzfvCCaxqDubXgMYPtIlUU3ZU1/pRcyjSAx7zsqrPKrWTyTDLDY942J8mxiepUmQj36/tO7z1NaywFMASKFMQtjYx79WkhBlcz6uzyou9xpczZPUPIkUFVvXQt2DkkzttmhIa+ubO1jg8nlChlXPvU2tTYWXQIfspI2IS/JMxbUzayd0mxo3a9nhdRiffuR0QnDjqxDj1XiEgjY4v1G3Geg53/QEdz72erJyIGvUftfsDmxI9dA==";
const compressedGraphicsCardsDefaultArray =
  "eJzFl0Fv2jAUx7+KldMmUWmFG7cS1BaptBaB9TDt4CYPYi2xI8dpy6Z999mEIAwUpwnObvDi/9+/vBc/2z/+eN9JUoA39K6uvJ43pnmWkLU3lKKAnucTCSsu1H9vJAiL1IgpkWFM2coIsYjIzbAlSXKlm68zbRmoh1jAEgSwEHZPJ2nGhSRM7iL3dBWDeCzSFxDb4N9ebbQ7YCCIpJyZfAfx/wvpE3GQvl3EMdhNFCEiUQIkl6iPqIQ0R5KjVwpvSMaAMsHzs+y4HLDHvos4Zr/DiyGylR8vDuq+DThmm6vPP6e5mgLl9Dd8nvPAwGQu5VvkRytyObw2cd6GNr84qY59kNoxqF9y3Sq7Ww/n2GMKKGj0KVRK54gz0H0A0FjBWDGrwRO25Cbvvg36cvNKaEJeaKKS/LWLpTcNZnjT00jBwrjFe5hG7lcg9icoSLi0Io/40X5Rac9Q2vNbizKISaTmRAWj0t4pZsAiEJrRwDVM3HeM6aIxqda6X3hPuDGg1joH9HmaFWo1L2oV/aiDGXL35VYdXTV2nwtoXvY9D/fln7eDrfTOQR++IZ+EsX1z2IwyISute8jrFpDXXUH2W0D2rZDB4jKUgxaUg1OU5pZ/mVyO9PbtJzz89fnOtNGGWuu85CPO1R2rKedG3A3oFFJlXZO0HHxwcNoz6IpWH5CRmghp8zbUhlFX9KPC3vzPMCt5Z6RqkjcaSfvB+hxvZeK+hT0VUh097Nk9cabeSts1sHp3lgdgqxopPQFZKi/fZI8Qn2sV/QTh83GhnQDeg3re6PJUKjtAnI9xEz4l6wAO03dI0KzO3R+DWHKREj2deQ3deXRwyn+XhYCWwPsuzpFv8aCP5iDIbcIze0v6ENr0cYP98x9MgAM3";
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

Modal.setAppElement("#SpecGauge");

export default function Compare({
  type,
  QueryFunction,
  DirectQueryFunction,
  isMobile,
  comparisonLink,
  description,
  defaultTitle,
}) {
  let Process = carsProcess;
  let QueryProcess = carsQueryProcess;
  let compressedBrands = compressedCarsBrands;
  let compressedDefaultArray = compressedCarsDefaultArray;
  let Categories = carsCategories;

  if (type != "Vehicles") {
    if (type == "Consoles") {
      Process = consoleProcess;
      QueryProcess = consoleQueryProcess;
      compressedBrands = compressedConsoleBrands;
      compressedDefaultArray = compressedConsoleDefaultArray;
      Categories = consoleCategories;
    } else if (type == "CPUs") {
      Process = CPUsProcess;
      QueryProcess = CPUsQueryProcess;
      compressedBrands = compressedCPUsBrands;
      compressedDefaultArray = compressedCPUsDefaultArray;
      Categories = CPUsCategories;
    } else if (type == "Graphics Cards") {
      Process = graphicsCardsProcess;
      QueryProcess = graphicsCardsQueryProcess;
      compressedBrands = compressedGraphicsCardsBrands;
      compressedDefaultArray = compressedGraphicsCardsDefaultArray;
      Categories = graphicsCardsCategories;
    } else {
      Process = droneProcess;
      QueryProcess = droneQueryProcess;
      compressedBrands = compressedDroneBrands;
      compressedDefaultArray = compressedDroneDefaultArray;
      Categories = droneCategories;
    }
  }

  // Decompressed (inflated) String Values into JSON values
  const Brands = JSON.parse(PakoInflate(compressedBrands));
  const DefaultArray = JSON.parse(PakoInflate(compressedDefaultArray));

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [savingComparison, setSavingComparison] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [awaitingSavingComparison, setAwaitingSavingComparison] =
    useState(false);
  const [successfullySavedComparison, setSuccessfullySavedComparison] =
    useState(false);
  const [saveComparisonProcesses, setSaveComparisonProcesses] = useState([]);

  const [products, setProducts] = useState([]);
  const [pros, setPros] = useState([]);
  const [displayPros, setDisplayPros] = useState([]);

  const navigate = useNavigate();

  // This returns an array that is just the base of the pros string array, It's just empty categories with \n
  const defaultProCategories = () => {
    const prosCategoriesTemp = [];

    // The pros will be organized to their respective categories
    for (let i = 0; i < Categories.length; i++) {
      prosCategoriesTemp.push(`${Categories[i]["Category"].toUpperCase()} \n`);
    }

    return prosCategoriesTemp;
  };

  useEffect(() => {
    // If at least 2 products
    if (pros.length >= 2) {
      // This array keeps track of the pros for each product
      const productPros = [];
      for (let item in pros) {
        productPros.push(defaultProCategories().slice());
      }

      // This is used to set the values of the pros. It's the base unedited version of each spec
      const referencePros = [];
      for (let item in DefaultArray) {
        if (DefaultArray[item].Important) {
          referencePros.push(DefaultArray[item].Value);
        }
      }

      // Iterate through each Important spec
      for (let item in pros[0]) {
        // If spec is a boolean type
        if (pros[0][item].Type == "B") {
          // Keeps track of first occurence of true value, and counts occurences
          // It's not actually the firstIndex if count is greater than 1
          let tracker = { firstIndex: null, count: 0 };
          // Iterate through all products and check this spec to find all true values
          for (let item1 in pros) {
            if (
              pros[item1][item].Value == "True" ||
              pros[item1][item].Value == "Yes"
            ) {
              // It's not actually the firstIndex if count is greater than 1
              tracker.firstIndex = item1;

              tracker.count++;
            }
          }
          // If only 1 occurence
          if (tracker.count == 1) {
            // Iterate through DefaultArray to find the Value, since for some reason, Value got changed to "True" and "False" in the pros array
            for (let matchingItem in DefaultArray) {
              // If the spec matches
              if (
                pros[0][item].Matching == DefaultArray[matchingItem].Matching
              ) {
                // Find the category index
                for (let categoryItem in Categories) {
                  if (
                    pros[0][item].Category == Categories[categoryItem].Category
                  ) {
                    // Add value to that products pros at this particular category
                    productPros[tracker.firstIndex][categoryItem] +=
                      DefaultArray[matchingItem].Value + "\n";
                    break;
                  }
                }

                break;
              }
            }
          }
        }
        // If spec is a number type
        else if (pros[0][item].Type == "N") {
          // Keeps track of each number for this spec
          let tracker = {
            HigherNumber: pros[0][item].HigherNumber,
            values: [],
          };
          // Iterate through all products and check this spec to find values
          for (let item1 in pros) {
            // The value
            let newNumber = pros[item1][item].Value;
            // If a string with units after a space, split and get first item
            try {
              newNumber = newNumber.split(" ")[0];
              // Remove commas and spaces
              newNumber = newNumber.replace(",", "");
              newNumber = newNumber.replace(" ", "");
            } catch {}
            // Convert strings to numbers
            try {
              newNumber = Number(newNumber);
            } catch {}

            tracker.values.push(newNumber);
          }

          // The value to save
          let totalBestValue = NaN;
          // Track the latest value that caused a change, if NaN, then 2 duplicates were found
          let lastBestValue = NaN;
          // The index of the product
          let bestIndex = NaN;
          // Iterate through all values that were saved for this spec

          for (let trackerItem in tracker.values) {
            // Save for readability
            const itemValue = tracker.values[trackerItem];
            if (!isNaN(itemValue)) {
              // Higher number is better
              if (tracker.HigherNumber == true) {
                if (isNaN(totalBestValue)) {
                  // Initialize the first value
                  totalBestValue = itemValue;
                  lastBestValue = totalBestValue;
                  bestIndex = 0;
                } else if (totalBestValue < itemValue) {
                  // If new value is better, make a new array and set them to totalBestValue, lastBestValue and bestIndex
                  totalBestValue = itemValue;
                  lastBestValue = itemValue;
                  bestIndex = trackerItem;
                } else if (totalBestValue == itemValue) {
                  // If duplicate, then record that to lastBestValue but don't change totalBestValue so we know what the highest value was
                  lastBestValue = NaN;
                  bestIndex = NaN;
                }
              }
              // Lower number is better
              else if (tracker.HigherNumber == false) {
                if (isNaN(totalBestValue)) {
                  // Initialize the first value
                  totalBestValue = itemValue;
                  lastBestValue = totalBestValue;
                  bestIndex = 0;
                } else if (totalBestValue > itemValue) {
                  // If new value is better, make a new array and set them to totalBestValue, lastBestValue and bestIndex
                  totalBestValue = itemValue;
                  lastBestValue = itemValue;
                  bestIndex = trackerItem;
                } else if (totalBestValue == itemValue) {
                  // If duplicate, then record that to lastBestValue but don't change totalBestValue so we know what the highest value was
                  lastBestValue = NaN;
                  bestIndex = NaN;
                }
              }
            }
          }

          if (!isNaN(lastBestValue) && !isNaN(totalBestValue)) {
            const pro = pros[bestIndex][item];

            for (let categoryItem in Categories) {
              if (
                pro.Category == Categories[categoryItem].Category &&
                pro.Value != "--"
              ) {
                productPros[bestIndex][categoryItem] += `${referencePros[
                  item
                ].replace("--", pro.Value)} \n`;
                break;
              }
            }
          }
        }
      }

      const tempOriginalDefaultPros = defaultProCategories();
      const newDisplayPros = [];
      for (let productIndex in productPros) {
        let tempProductPros = "";

        for (let categoryIndex in tempOriginalDefaultPros) {
          if (
            productPros[productIndex][categoryIndex] !=
            tempOriginalDefaultPros[categoryIndex]
          ) {
            tempProductPros += productPros[productIndex][categoryIndex];
            tempProductPros += "\n";
          }
        }
        newDisplayPros.push(tempProductPros);
      }
      setDisplayPros(newDisplayPros);
    } else {
      setDisplayPros(["Add at least 2 items to view the pros"]);
    }

    if (pros.length == 0) {
      SetTitleAndDescription(defaultTitle, description, window.location.href);
    } else {
      // Update the title
      const newTitle = BuildTitle(saveComparisonProcesses, "Compare:");
      SetTitleAndDescription(newTitle, description, window.location.href);
    }
  }, [pros]);

  // Load presets from the link
  const loadPresets = async (presetURL) => {
    let processes = [];
    // Lazy import this, becaues it includes pako
    await import("../functions/DeconstructURLFriendlyCompare").then(
      (module) => {
        // Deconstruct the string into a process array
        processes = module.default(presetURL, Brands);
      }
    );

    if (processes[0].length == QueryProcess.length) {
      setSaveComparisonProcesses(processes);

      for (let processItem in processes) {
        // Directly get the product
        const result = await DirectQueryFunction(processes[processItem]);

        let parameterArray = [];

        // Deep Copy DefaultArray into parameterArray then we will use parameterArray from here on
        for (let i = 0; i < DefaultArray.length; i++) {
          const defaultArrayItem = DefaultArray[i];

          let newJSON = {};
          newJSON["Value"] = defaultArrayItem.Value;
          newJSON["Display"] = defaultArrayItem.Display;
          newJSON["Category"] = defaultArrayItem.Category;
          newJSON["Matching"] = defaultArrayItem.Matching;
          newJSON["Mandatory"] = defaultArrayItem.Mandatory;
          newJSON["Type"] = defaultArrayItem.Type;
          newJSON["Preference"] = defaultArrayItem.Preference;
          newJSON["Important"] = defaultArrayItem.Important;
          newJSON["HigherNumber"] = defaultArrayItem.HigherNumber;
          parameterArray.push(newJSON);
        }

        // returns [tempProsArray, tempNewProduct]
        // prettier-ignore
        const prosAndSpecs = GetProsAndSpecs(parameterArray, result, Categories);

        // prettier-ignore
        setPros((prevPros) => [...prevPros, prosAndSpecs[0]]);
        setProducts((prevProducts) => [...prevProducts, prosAndSpecs[1]]);
      }

      if (analytics != null) {
        logEvent(analytics, "Load Comparison Presets", {
          Processes: processes,
        });
      }
    }
  };

  useEffect(() => {
    if (analytics != null) {
      logEvent(analytics, "Screen", {
        Screen: type,
        Platform: isMobile ? "Mobile" : "Computer",
        Tool: "Comparison",
      });
    }
  }, []);

  useEffect(() => {
    // URL of the page
    const fullURL = window.location.href;

    // Index of the prefix (/comparison/type/)
    const startIndex = fullURL.indexOf(comparisonLink);
    // The presets
    const presetsURL = fullURL.substring(startIndex + comparisonLink.length);

    // Have to manually reset, in case user uses navigation buttons to switch to another compare page
    setProducts([]);
    setSaveComparisonProcesses([]);
    setPros([]);
    setDisplayPros([]);

    SetCanonical(comparisonLink);

    // If greater than one, then there are presets
    if (presetsURL.length > 1) {
      loadPresets(presetsURL);
    } else {
      SetTitleAndDescription(defaultTitle, description, window.location.href);
    }
  }, [type]);

  const CallSaveComparisonCloudFunction = async () => {
    // The processes that get saved
    const arrayToSave = [];
    for (let item in saveComparisonProcesses) {
      arrayToSave.push(saveComparisonProcesses[item]);
    }

    // The names of the products which will be in alphabetical order so user can't save multiple of the same comparison
    let names = [];

    for (let item1 in arrayToSave) {
      let name = "";

      for (let item2 in arrayToSave[item1]) {
        name += arrayToSave[item1][item2];
      }
      names.push(name);
    }
    names.sort();

    // The sum of all names in alphabetical order
    let comparisonName = "";
    for (let item in names) {
      comparisonName += names[item];
    }

    // Pass this JSON to the cloud
    const comparison = {
      email: auth.currentUser.email,
      type: type,
      name: comparisonName,
      processes: arrayToSave,
    };

    try {
      const WriteSavedComparisons = httpsCallable(
        functions,
        "WriteSavedComparisons"
      );
      const result = await WriteSavedComparisons(comparison);
      return result.data;
    } catch (error) {
      return error;
    }
  };

  const copyURLToClipboard = async (shareURL) => {
    // Create a temporary textarea element
    const textarea = document.createElement("textarea");
    textarea.value = shareURL;
    textarea.setAttribute("readonly", ""); // Prevent mobile devices from popping up the keyboard
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px"; // Move the textarea off-screen
    document.body.appendChild(textarea);

    // Select and copy the URL from the textarea
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length); // For mobile devices
    document.execCommand("copy");

    // Clean up: remove the textarea from the DOM
    document.body.removeChild(textarea);
  };

  return (
    <>
      <Navbar isMobile={isMobile}></Navbar>
      {/* Main Body */}
      <div className="LargeContainer">
        <p style={{ fontSize: 20 }} className="HeaderText">
          {type} Comparison
        </p>

        {/* Top buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(5, 1fr)`,
            gridTemplateRows: `65px`,
            borderBottom: "1px solid darkGrey",
            paddingBottom: "10px",
          }}
        >
          {/* Back to home */}
          <button
            onClick={() => {
              {
                /* Set page to home */
              }
              navigate("/home");

              setProducts([]);
              setSaveComparisonProcesses([]);
              setPros([]);
              setDisplayPros([]);
            }}
            className="CompareTopButton"
            style={
              isMobile
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>{"< Back"}</p>
          </button>

          {/* Add a new product */}
          <button
            onClick={async () => {
              if (analytics != null) {
                logEvent(analytics, "Add Comparison Item", { Category: type });
              }
              {
                /* Show product selection modal */
              }
              setProductModalVisible(true);
            }}
            className="CompareTopButton"
            style={
              isMobile
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>Add</p>
          </button>

          {/* Save comparison */}
          <button
            onClick={async () => {
              if (analytics != null) {
                logEvent(analytics, "Save Comparison", {
                  Category: type,
                });
              }

              if (auth.currentUser != null) {
                setAwaitingSavingComparison(true);
                setSavingComparison(true);
                const result = await CallSaveComparisonCloudFunction();
                if (result == 200) {
                  setSuccessfullySavedComparison(true);
                }
                setAwaitingSavingComparison(false);
              } else {
                setAccountModalVisible(true);
              }
            }}
            className="CompareTopButton"
            style={
              isMobile
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>Save</p>
          </button>

          {/* Share comparison */}
          <button
            onClick={async () => {
              let presetsURL = "";

              // Lazy import this, becaues it includes pako
              await import("../functions/BuildURLFriendlyCompare").then(
                (module) => {
                  // Construct the process array into a string
                  presetsURL = module.default(saveComparisonProcesses, Brands);
                }
              );

              // The full URL
              const shareURL = comparisonLink + presetsURL;

              // Copy to user's clipboard
              copyURLToClipboard(shareURL);
              // Tell user copying to clipboard was successful
              setCopiedLink(true);
              if (analytics != null) {
                logEvent(analytics, "Share Comparison", { Type: type });
              }
            }}
            className="ShareTopButton"
            style={
              isMobile
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>Share</p>
          </button>

          {/* Reset specs to just the categories and processes to empty array */}
          <button
            onClick={async () => {
              if (analytics != null) {
                logEvent(analytics, "Reset Comparison", {
                  Category: type,
                });
              }

              setProducts([]);
              setSaveComparisonProcesses([]);
              setPros([]);
              setDisplayPros([]);
            }}
            className="ResetTopButton"
            style={
              isMobile
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>Reset</p>
          </button>
        </div>

        {/* For each product, show a column */}
        {/* For each category, show a row */}
        {products.length == 0 ? (
          <div style={{ height: "400px" }}>
            <h2 className="SimpleText">Click "Add" to get started</h2>
          </div>
        ) : (
          <div
            className="ComparisonTable"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${products.length}, ${
                isMobile ? "150px" : "250px"
              })`,
              gridTemplateRows: `repeat(${Categories.length}, auto)`,
              gridAutoFlow: "column",
            }}
          >
            {/* Create a div for each category in each product, but don't create a div for each product */}
            {/* This way, it won't put everything on the first row */}
            {products.flatMap((product, productIndex) =>
              product.map((category, categoryIndex) =>
                categoryIndex != 2 ? (
                  // If not the pros index
                  categoryIndex != 0 ? (
                    // If not the second row
                    categoryIndex != 1 ? (
                      // If not the first row
                      <div
                        key={`${productIndex}-${categoryIndex}`}
                        className="ComparisonCell"
                      >
                        <p
                          className="ComparisonRowName"
                          style={{ fontSize: isMobile ? "13px" : "15px" }}
                        >
                          {category.Category}
                        </p>

                        <div
                          className="ComparisonRowValue"
                          style={{ fontSize: isMobile ? "13px" : "15px" }}
                        >
                          {[]
                            .concat(category.Values)
                            .map((rowValue, rowIndex) => (
                              <p key={rowIndex}>{rowValue}</p>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <p
                        className="SimpleText"
                        key={`${productIndex}-${categoryIndex}`}
                      >
                        {saveComparisonProcesses[productIndex][0] +
                          " " +
                          saveComparisonProcesses[productIndex][
                            saveComparisonProcesses[productIndex].length - 1
                          ]}
                      </p>
                    )
                  ) : (
                    // If it is the second row
                    <div key={`${productIndex}-${categoryIndex}`}>
                      <button
                        className="DangerButton"
                        style={{ width: "100%" }}
                        onClick={() => {
                          // Remove from the products array
                          const newSpecsArray = products.filter(
                            (subArray) => products[productIndex] !== subArray
                          );
                          setProducts(newSpecsArray);

                          const newComparisonProcessArray =
                            saveComparisonProcesses.filter(
                              (subArray) =>
                                saveComparisonProcesses[productIndex] !==
                                subArray
                            );
                          setSaveComparisonProcesses(newComparisonProcessArray);

                          // Remove from the pros array
                          const newPros = pros.filter(
                            (subArray) => pros[productIndex] !== subArray
                          );
                          setPros(newPros);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )
                ) : (
                  // If it is the pro index
                  <div
                    key={`${productIndex}-${categoryIndex}`}
                    className="ProCell"
                  >
                    <p
                      className="ComparisonRowName"
                      style={{ fontSize: isMobile ? "13px" : "15px" }}
                    >
                      Pros
                    </p>

                    <div
                      className="ComparisonRowValue"
                      style={{ fontSize: isMobile ? "13px" : "15px" }}
                    >
                      {[].concat(category.Values).map((rowValue, rowIndex) => (
                        <p key={rowIndex}>{displayPros[productIndex]}</p>
                      ))}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>

      {/* Shows up if user needs to be logged in to complete action */}
      <Modal
        isOpen={accountModalVisible}
        contentLabel="Account Sign Up or Log In"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <WebAccountHandler
            screenType={"modal"}
            setModaldiv={setAccountModalVisible}
          ></WebAccountHandler>
        </Suspense>

        <button
          className="NormalButtonNoBackground"
          onClick={() => {
            setAccountModalVisible(false);
          }}
        >
          <p>Cancel</p>
        </button>
      </Modal>

      {/* Display status of saving comparison */}
      <Modal
        isOpen={savingComparison}
        contentLabel="Saving comparison"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <p className="HeaderText">Save Comparison</p>
        {awaitingSavingComparison ? (
          <div
            className="ActivityIndicator"
            style={{ marginTop: 30, marginBottom: 30 }}
          ></div>
        ) : (
          <div
            className="ModalButtonSection"
            style={{ marginBottom: 30, display: "flex", alignItems: "center" }}
          >
            {successfullySavedComparison ? (
              <p className="SuccessText">Succesfully saved this comparison.</p>
            ) : (
              <p className="ErrorText">
                Saving this comparison was unsuccessful, try again later.
              </p>
            )}
            {/* Okay Button */}
            <button
              className="NormalButton"
              onClick={() => {
                setSavingComparison(false);
              }}
              style={{ width: "50%" }}
            >
              Okay
            </button>
          </div>
        )}
      </Modal>

      {/* Shows up when user is selecting a new product */}
      <Modal
        isOpen={productModalVisible}
        contentLabel="Select a product to compare"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <SelectionModal
            type={type}
            setProductModalVisible={setProductModalVisible}
            brands={Brands}
            queryFunction={QueryFunction}
            queryProcess={QueryProcess}
            process={Process}
            defaultArray={DefaultArray}
            categories={Categories}
            setPros={setPros}
            setProducts={setProducts}
            setSaveComparisonProcesses={setSaveComparisonProcesses}
          ></SelectionModal>
        </Suspense>
      </Modal>

      {/* Shows up when user clicks the share button */}
      <Modal
        isOpen={copiedLink}
        contentLabel="Copied link to clipboard"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <p className="HeaderText">Share Comparison</p>
        <div
          className="ModalButtonSection"
          style={{ marginBottom: 30, display: "flex", alignItems: "center" }}
        >
          <p className="SuccessText">
            Successfully copied link to your clipboard
          </p>
        </div>

        <button
          className="NormalButtonNoBackground"
          onClick={() => {
            setCopiedLink(false);
          }}
        >
          <p>Ok</p>
        </button>
      </Modal>
    </>
  );
}

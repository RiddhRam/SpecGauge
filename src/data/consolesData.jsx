export const consolesData = () => {
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

  return [
    consoleProcess,
    consoleQueryProcess,
    compressedConsoleBrands,
    compressedConsoleDefaultArray,
    consoleCategories,
  ];
};

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

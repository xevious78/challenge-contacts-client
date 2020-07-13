import bem from "easy-bem";

const ClassName = (styles, ...args) => {
  const cn = bem(...args);
  return (...props) =>
    cn(...props)
      .split(" ")
      .map((c) => styles[c])
      .join(" ");
};

export default ClassName;

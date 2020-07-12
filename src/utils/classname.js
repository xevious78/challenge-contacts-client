import bem from "easy-bem";

const ClassName = (styles, ...args) => {
  const cn = bem(...args);
  return (...props) => styles[cn(...props)];
};

export default ClassName;

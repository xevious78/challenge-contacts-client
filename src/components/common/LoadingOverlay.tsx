import React from "react";
import ClassName from "../../utils/classname";
import styles from "./LoadingOverlay.module.scss";
import { LoadingOutlined } from "@ant-design/icons";

type Props = {
  isLoading?: boolean;
};

const LoadingOverlay = React.memo<Props>(({ isLoading }) => {
  const cn = ClassName(styles, "loading-overlay");
  return (
    <div className={cn({ active: isLoading })}>
      <LoadingOutlined spin />
    </div>
  );
});

export default LoadingOverlay;

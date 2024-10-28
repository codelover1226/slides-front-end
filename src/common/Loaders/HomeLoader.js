import useWindowSize from "hooks/useWindowSize";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const HomeLoader = ({ size }) => {
  const innerWidth = useWindowSize();
  const InlineWrapperWithMargin = ({ children }) => {
    return (
      <span
        style={{ paddingRight: "0.3rem", borderRadius: "10px", width: "33%" }}
      >
        {children}
      </span>
    );
  };
  return [...Array(size).keys()].map(i => (
    <Skeleton
      count={3}
      wrapper={InlineWrapperWithMargin}
      inline
      width={innerWidth?.width < 576 ? "100%" : "32.56%"}
      height={250}
      key={i}
    />
  ));
};

export const HomeListLoader = ({ size, loading }) => {
  const ListItem = ({ loading, children }) => {
    return <div className="list-item">{loading ? <Skeleton /> : children}</div>;
  };

  return [...Array(size).keys()].map(i => (
    <ListItem loading={loading}>List Item 1</ListItem>
  ));
};

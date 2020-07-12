import React, { useEffect } from "react";
import { observer, useObserver } from "mobx-react";
import { useStores } from "../stores";

const Home = observer(() => {
  const { ContactStore } = useStores();

  useEffect(() => {
    ContactStore.fetch();
  }, [ContactStore]);

  return (
    <div data-testid="home-page">
      test {ContactStore.isFetching ? "fetching" : "not"}
    </div>
  );
});

export default Home;

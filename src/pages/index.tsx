import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const Home: NextPage = () => {
  const [items, setItems] = useState(Array.from({ length: 20 }));
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    console.log("FETCHING MORE DATA")
    if (items.length >= 100) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 20 })));
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-4">
        <h1 className="text-2xl font-bold">Example infinite Scroll</h1>
        <div id="scroll" className="h-96 overflow-y-auto bg-red-300 p-4">
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scroll"
            scrollThreshold={0.5} //hacer fetch cuando el scroll vaya en 50%
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {items.map((_, index) => (
              <div key={index} className="my-2 bg-gray-200 p-2">
                <p className="text-lg font-bold">Item {index}</p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam quod, voluptatum, quia, voluptas quas voluptates
                  quibusdam consequuntur quae voluptate quos quidem. Quisquam,
                  quae. Quisquam quod, voluptatum, quia, voluptas quas
                  voluptates quibusdam consequuntur quae voluptate quos quidem.
                  Quisquam, quae. Quisquam quod, voluptatum, quia, voluptas quas
                  voluptates quibusdam consequuntur quae voluptate quos quidem.
                  Quisquam, quae. Quisquam quod, voluptatum, quia, voluptas quas
                  voluptates quibusdam consequuntur quae voluptate quos quidem.
                  Quisquam, quae. Quisquam quod, voluptatum, quia, voluptas quas
                  voluptates quibusdam consequuntur quae voluptate quos quidem.
                  Quisquam, quae. Quisquam
                </p>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </main>
    </>
  );
};

export default Home;

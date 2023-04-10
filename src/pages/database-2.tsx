/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { api } from "y/utils/api";
import { type ChangeEvent, useState, type FormEvent, useRef } from "react";
import { faker } from "@faker-js/faker";
import { motion, AnimatePresence } from "framer-motion";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "y/server/api/root";

const Database2: NextPage = () => {
  const utils = api.useContext();
  const [author, setAuthor] = useState("Nicolás Chaima");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const refScroll = useRef<HTMLDivElement>(null);

  // isFetching,
  // isFetchingNextPage,
  const { data, isLoading, fetchNextPage, hasNextPage } =
    api.posts.getAll.useInfiniteQuery(
      { limit: 20 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const { mutate: addPost, isLoading: isAddPostLoading } =
    api.posts.add.useMutation({
      onMutate: async (newPost) => {
        await utils.posts.getAll.cancel();

        utils.posts.getAll.setInfiniteData({ limit: 20 }, (data) => {
          if (!data)
            return {
              pages: [],
              pageParams: [],
            };

          return {
            ...data,
            pages: data.pages.map((page, index) => ({
              ...page,
              posts: index === 0 ? [newPost, ...page.posts] : [...page.posts],
            })),
          };
        });

        // if (refScroll.current) {
        //   refScroll.current.scrollTo({
        //     top: 0,
        //     behavior: "smooth",
        //   });
        // }
      },
      onSuccess: async () => {
        await utils.posts.getAll.invalidate();
      },
    });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "author":
        setAuthor(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "content":
        setContent(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPost({
      author,
      title,
      content,
      authorImage: faker.image.avatar(),
      id: "-1",
      createdAt: new Date(),
    });
    setAuthor("Nicolás Chaima");
    setContent("");
    setTitle("");
    return true;
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-7">
        <div className="grid grid-cols-12 gap-x-2">
          <div className="col-span-12 md:col-span-3">
            <h1 className="text-2xl font-bold">Database 2</h1>
            <form
              onSubmit={handleSubmit}
              className="mt-4 rounded-lg border px-3 py-3"
            >
              <div className="mb-3">
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700"
                >
                  Autor
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="author"
                    className="block w-full rounded-md border px-2 py-1 focus:border-gray-400 focus:outline-0"
                    required
                    value={author}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Titulo
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    className="block w-full rounded-md border px-2 py-1 focus:border-gray-400 focus:outline-0"
                    value={title}
                    required
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contenido
                </label>
                <div className="mt-1">
                  <textarea
                    name="content"
                    className="block w-full rounded-md border px-2 py-1 focus:border-gray-400 focus:outline-0"
                    required
                    value={content}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid">
                <button
                  type="submit"
                  className="mt-2 rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1.5 font-semibold text-white transition-all duration-150 ease-out hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 hover:ease-in"
                >
                  Agregar post
                </button>
              </div>
            </form>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="text-2xl font-bold">Last posts</h1>

            <div
              ref={refScroll}
              id="scroll"
              className="mt-4 h-[80vh] overflow-y-auto pr-2"
            >
              {isLoading || !data ? (
                <p>Loading...</p>
              ) : (
                <div className="border-x border-gray-200">
                  <InfiniteScroll
                    dataLength={data.pages.reduce((acc, page) => {
                      return acc + page.posts.length;
                    }, 0)}
                    next={fetchNextPage}
                    hasMore={hasNextPage as boolean}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scroll"
                    scrollThreshold={0.9} //hacer fetch cuando el scroll vaya en 50%
                    endMessage={
                      <p style={{ textAlign: "center" }}>
                        <b>Yay! You have seen it all</b>
                      </p>
                    }
                  >
                    {data.pages.map((page) =>
                      page.posts.map((post) =>
                        post.id === "-1" ? (
                          <AnimatePresence key={post.id} initial={true}>
                            <motion.div
                              initial={{ y: -100 }}
                              animate={{ y: 0 }}
                              transition={{ duration: ".5", ease: "linear" }}
                            >
                              <PostCard post={post}></PostCard>
                            </motion.div>
                          </AnimatePresence>
                        ) : (
                          <PostCard key={post.id} post={post}></PostCard>
                        )
                      )
                    )}
                  </InfiniteScroll>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Database2;

type RouterOutput = inferRouterOutputs<AppRouter>;
type PostCreateOutput = RouterOutput["posts"]["getAll"];
type Post = PostCreateOutput["posts"][number];

type PostCardProps = {
  post: Post;
};
function PostCard({ post }: PostCardProps) {
  return (
    <div className="my-2 border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.authorImage}
            alt=""
            className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
          />
          <p className="text-xl">{post.author}</p>
        </div>
        <p className="text-sm text-gray-500">
          {moment(post.createdAt).format("DD-MM-YYYY hh:mm")}
        </p>
      </div>
      <p className="mt-3 text-lg font-medium">{post.title}</p>
      <p>{post.content}</p>
    </div>
  );
}
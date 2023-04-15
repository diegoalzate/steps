import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Steps</title>
        <meta name="description" content="One step at a time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center gap-4">
        <div>nav bar</div>
        <div>we make habits fun</div>
        <div>make it attractive</div>
      </main>
    </>
  );
};

export default Home;

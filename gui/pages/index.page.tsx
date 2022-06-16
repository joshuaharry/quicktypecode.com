import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="w-full flex flex-col items-center p-8">
      <h1 className="text-3xl font-extrabold mb-8">Quick, Type Code!</h1>
      <div>
        <pre>
          <code>Code goes here...</code>
        </pre>
      </div>
    </div>
  );
};

export default Home;

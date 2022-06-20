import React from "react";

const TitleBar: React.FC = () => {
  return (
    <div className="flex items-center justify-around py-2 px-2 w-full bg-slate-300 mb-8">
      <div className="flex">
        <div className="w-3" />
        <h1 className="font-extrabold text-2xl">Quick, Type Code!</h1>
      </div>
      <button className="btn btn-blue">Sign In</button>
    </div>
  );
};

export default TitleBar;

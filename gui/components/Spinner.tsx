import React from "react";

interface SpinnerProps {
  size?: string;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size } = props;
  return (
    <>
      <span className="loader" />
      <style jsx>{`
        .loader,
        .loader:after {
          border-radius: 50%;
          width: 10em;
          height: 10em;
        }
        .loader {
          font-size: ${size || "3px"};
          position: relative;
          text-indent: -9999em;
          border-top: 1.1em solid rgba(0, 46, 122, 0.2);
          border-right: 1.1em solid rgba(0, 46, 122, 0.2);
          border-bottom: 1.1em solid rgba(0, 46, 122, 0.2);
          border-left: 1.1em solid #002e7a;
          -webkit-transform: translateZ(0);
          -ms-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-animation: load8 1.1s infinite linear;
          animation: load8 1.1s infinite linear;
        }
        @-webkit-keyframes load8 {
          0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        @keyframes load8 {
          0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
	`}</style>
    </>
  );
};

export default Spinner;

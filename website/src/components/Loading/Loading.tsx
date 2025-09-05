import { ImSpinner2 } from "react-icons/im";

const Loading = () => {
  return (
    <div className="container-min-height w-full grid justify-center items-center">
      <ImSpinner2 className="size-20 animate-spin text-primary" />
    </div>
  );
};

export default Loading;

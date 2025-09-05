import Image from "next/image";
import React from "react";

const NotFound = () => {
  return (
    <div className="grid justify-center container-min-height items-center">
      <div className="text-center space-x-3">
        <Image
          src="/img/not-round.png"
          height={400}
          width={400}
          alt="ek-fashion"
        />
        <p className="text-2xl font-semibold text-gray-500">
          Sorry Not Item Found
        </p>
      </div>
    </div>
  );
};

export default NotFound;

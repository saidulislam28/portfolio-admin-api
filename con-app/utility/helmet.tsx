import React from "react";
import { Helmet } from "react-helmet";

export const getHeader = (title: string) => {
  return (
      <Helmet>
          <title>{title}</title> {/*TODO postfix app name*/}
      </Helmet>
  )
}

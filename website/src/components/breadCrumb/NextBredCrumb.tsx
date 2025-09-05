"use client";

import { convertSlugToNam } from "@/utils/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";

type TBreadCrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  capitalizeLinks?: boolean;
};

const NextBreadcrumb = ({
  homeElement,
  separator,
  containerClasses,
  capitalizeLinks,
}: TBreadCrumbProps) => {
  const paths = usePathname();
  const searchParams = useSearchParams();
  const pathNames = paths.split("/").filter((path) => path);
  const category = searchParams.get("category");

  return (
    <>
      {pathNames?.length ? (
        <div className="bg-[#f1f1f1]">
          <ul className={containerClasses}>
            <li
              className={`text-primary font-semibold hover:text-[#3aadb9] mx-2`}
            >
              <Link href={"/"}>{homeElement}</Link>
            </li>
            {pathNames.length > 0 && separator}

            {pathNames.map((link, index) => {
              let href = `/${pathNames.slice(0, index + 1).join("/")}`;
              let itemClasses =
                paths === href
                  ? `text-black-text font-semibold mx-2`
                  : "text-primary font-semibold hover:text-[#3aadb9] mx-2";
              let itemLink = capitalizeLinks
                ? link[0].toUpperCase() + link.slice(1)
                : link;

              return (
                <React.Fragment key={index}>
                  <li
                    className={
                      category
                        ? "text-primary font-semibold hover:text-[#3aadb9] mx-2"
                        : itemClasses
                    }
                  >
                    <Link href={href}>{convertSlugToNam(itemLink)}</Link>
                  </li>
                  {pathNames.length !== index + 1 && separator}
                </React.Fragment>
              );
            })}

            {category && (
              <>
                {separator}
                <li className="text-black-text font-semibold px-2">
                  {capitalizeLinks
                    ? convertSlugToNam(category)
                    : convertSlugToNam(category)}
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default NextBreadcrumb;

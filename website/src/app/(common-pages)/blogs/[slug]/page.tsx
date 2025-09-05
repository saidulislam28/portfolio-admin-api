import { getBlogDetailsBySlug } from "@/src/services/api/fetchRequests";
import { Metadata, ResolvingMetadata } from "next";
import BlogDetails from "./BlogDetails";

const page = async ({ params }: any) => {
  const { slug } = params;
  const data = await getBlogDetailsBySlug(slug);

  return (
    <div className="bg-body-background border-t border-border-light">
      <div className="main-container ">
        <BlogDetails singleBlog={data?.blog} latestBlogs={data?.latest} />
      </div>
    </div>
  );
};

export async function generateMetadata(
  { params, searchParams },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;

  const data = await getBlogDetailsBySlug(slug);

  return {
    title: data?.blog?.meta_title ?? "EK FASHION",
    description: data?.blog?.meta_description,
    openGraph: {
      title: data?.data?.meta_title ?? "EK FASHION",
      description: data?.data?.meta_description,
      url: process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${data?.data?.slug}`
        : `https://ekfashion.com.au/products/${data?.data?.slug}`,
      siteName: `${process.env.NEXT_PUBLIC_WEBSITE_NAME ?? "EK FASHION"}`,
      images: [
        {
          url: data?.data?.image ?? "/img/logo.jpg",
          width: 800,
          height: 600,
          alt: "EK Fashion blog",
        },
      ],
      locale: "ku_KU",
      type: "article",
    },
    other: [{ name: "keywords", metaKeywords: data?.data?.keywords }],
  };
}

export default page;

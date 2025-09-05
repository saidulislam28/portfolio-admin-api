import {
  API_GET_ALL_CATEGORIES,
  API_GET_ALL_CUSTOM_COLLECTION_PRODUCTS,
  API_GET_ALL_PRODUCT_CATEGORY,
  API_GET_ALL_PRODUCT_COLLECTIONS,
  API_GET_HOME_DATA,
  API_GET_HOME_SETTINGS,
  API_GET_SINGLE_BLOG,
} from "@/src/services/api/endpoints";
import { fetchTags } from "@/src/services/fetchTags";

export const getAllSettings = async () => {
  let settings = {};
  try {
    const resp = await fetch(API_GET_HOME_SETTINGS, {
      next: {
        // revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
        revalidate: 0,
        tags: [fetchTags.settings],
      },
    }).then((res) => res.json());

    if (resp?.data) {
      //make a settings object from array
      resp?.data?.map((item) => {
        let val = item?.value;
        if (val === "null") {
          val = null; //convert string 'null' to actual null
        }
        settings[item?.key] = val;
      });
      return settings;
    }
  } catch (e) {
    console.log("failed to get settings");
    return {};
  }
};

export const getBlogDetailsBySlug = async (slug: string) => {
  try {
    const resp = await fetch(`${API_GET_SINGLE_BLOG}/${slug}`, {
      next: {
        // revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
        revalidate: 0,
        tags: [fetchTags.single_blog],
      },
    }).then((res) => res.json());

    if (resp?.data) {
      return resp?.data;
    }
  } catch (e) {
    return {
      blog: {},
      latest: [],
    };
  }
};

export const getHomePageLayout = async () => {
  try {
    const resp = await fetch(API_GET_HOME_DATA, {
      next: {
        // revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
        revalidate: 0,
        tags: [fetchTags.home_data],
      },
    }).then((res) => res.json());

    if (resp?.data) {
      return resp?.data;
    }
    return null;
  } catch (e) {
    console.log("failed to fetch homepage layout data");
    return null;
  }
};

export const getAllCategories = async () => {
  try {
    const resp = await fetch(API_GET_ALL_CATEGORIES, {
      next: {
        // revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
        revalidate: 0,
        tags: [fetchTags.all_categories],
      },
    }).then((res) => res.json());

    if (resp?.data) {
      return resp?.data;
    }
  } catch (e) {
    console.log("failed to fetch homepage layout data", e);
    return [];
  }
};

export const getCustomCollectionProducts = async (ids: string) => {
  try {
    const resp = await fetch(
      `${API_GET_ALL_CUSTOM_COLLECTION_PRODUCTS}?productsIds=${ids}`,
      {
        next: {
          // revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
          revalidate: 0,
          tags: [fetchTags.home_data],
        },
      }
    ).then((res) => res.json());

    if (resp?.data) {
      return resp?.data;
    }
  } catch (e) {
    console.log("failed to fetch homepage layout data", e);
    return [];
  }
};

export const getProductForCollectionPage = async (queries: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${API_GET_ALL_PRODUCT_COLLECTIONS}/${queries}`,
      {
        next: { tags: ["all-product-collections"] },
        cache: "no-cache",
      }
    ).then((res) => res.json());

    if (res?.data) {
      return res?.data;
    }
  } catch (e) {
    console.log("failed to fetch homepage layout data", e);
    return [];
  }
};

export const getProductForCategory = async (endpoint: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${API_GET_ALL_PRODUCT_CATEGORY}/${endpoint}`,
      {
        next: { tags: ["all-product-for-category"] },
        cache: "no-cache",
      }
    ).then((res) => res.json());

    if (res?.data) {
      return res?.data;
    }
  } catch (e) {
    console.log("failed to fetch homepage layout data", e);
    return [];
  }
};

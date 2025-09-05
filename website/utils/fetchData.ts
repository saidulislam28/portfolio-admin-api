import { GET_CATEGORY, GET_PACKAGES, GET_SINGLE_PACKAGE, WEBSITE_BLOG_CONTENT, WEBSITE_HOME_CONTENT } from "@/config/constantsApi";

export const fetchBlogs = async () => {
  try {
    const res = await fetch(WEBSITE_BLOG_CONTENT, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    const data = await res.json();

    return data?.data ?? [];
  } catch (error) {
    console.error('fetch blog error ===>', error);
    return [];
  }
};

export const fetchHomeContent = async () => {
  try {
    const res = await fetch(WEBSITE_HOME_CONTENT, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`failed to fetch: ${res.statusText}`)
    };

    const data = await res.json();
    return data ?? {};

  } catch (error) {
    console.error('fetch home error ===>', error);
    return [];
  }
}


export const fetchPackages = async () => {
  try {
    const res = await fetch(GET_PACKAGES, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`failed to fetch: ${res.statusText}`)

    };

    const data = await res.json();
    return data?.data ?? [];

  } catch (error) {
    console.error('fetch blog error ===>', error);
    return [];
  }
}

export const fetchPackageById = async (id: any) => {
  try {
    const res = await fetch(`${GET_SINGLE_PACKAGE}/${id}`, {
      method: 'GET',
      cache: 'no-store'
    })

    if (!res.ok) {
      throw new Error(`failed to fetch package by ID: ${res.statusText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('fetch package by ID error ===>', error);
    return {};
  }
};

export const fetchAllCategory = async () => {
  try {
    const res = await fetch(GET_CATEGORY, {
      method: 'GET',
      cache: 'no-store'
    })

    if (!res.ok) {
      throw new Error(`failed to fetch package by ID: ${res.statusText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('fetch package by ID error ===>', error);
    return null;
  }
}
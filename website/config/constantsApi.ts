


const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;


export const WEBSITE_HOME_CONTENT =`${API_URL}/website/home-data`
export const WEBSITE_BLOG_CONTENT =`${API_URL}/blogs/list`
export const WEBSITE_CORPORATE_CONTENT =`${process.env.NEXT_PUBLIC_CONTENT_URL}/corporate-page`
export const GET_PACKAGES = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/packages/list`
export const GET_SINGLE_PACKAGE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/packages/single`
export const GET_CATEGORY = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/packages/category`


export const HOME_SECTION_TYPES = {
    HERO: "HERO",
    FEATURES: "FEATURES",
    CERTIFICATION: "CERTIFICATION",
    BANNER_TWO_COLUMN: "BANNER_TWO_COLUMN",
    AFFILIATIONS: "AFFILIATIONS",
    PRODUCTS: "PRODUCTS",
    REVIEW: "REVIEW",
    BLOGS: "BLOGS",
    FAQ: "FAQ",
  }
  
  export const CORPORATE_PAGE_TYPE = {
  HERO: "HERO",
  CLIENTS: "CLIENTS",
  ADVANTAGES: "ADVANTAGES",
  INDUSTRIES: "INDUSTRIES",
  SERVICE_MANAGER: "SERVICE_MANAGER",
  CORPORATE_REVIEW: "CORPORATE_REVIEW",
  SCHEDULE: "SCHEDULE"
  }
  
  export const BLOG_SECTION_TYPE = {
    BLOG: 'BLOG'
  }
  
  export const CONTACT_SECTION_TYPE ={
    CONTACT:'CONTACT'
  }
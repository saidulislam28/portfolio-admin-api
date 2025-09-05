export default interface User {
  userInfo:{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    accountType: string;
    city: string;
    state: string;
    country: string;
  };
  token:string;
  auth_flag:string
}

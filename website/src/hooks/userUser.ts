import User from "@/types/user";
import { retrieveUser } from "@/utils/retrieveUser";
import { useState, useEffect } from "react";

export default function useUser() {
  const [accessUser, setAccessUser] = useState<any>();

  useEffect(() => {
    const user: User | null = retrieveUser();
    setAccessUser(user);
  }, []);

  return {
    user: accessUser,
  };
}

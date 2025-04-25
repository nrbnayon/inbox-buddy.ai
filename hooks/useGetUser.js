import { getUserProfile } from "@/lib/api/user";
import { useEffect, useState } from "react";

export default function useGetUser(token) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await getUserProfile(token);
        if (mounted) {
          setUser(res?.data || null); // Fallback to null if res.data is undefined
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to fetch user profile");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (token) {
      fetchUser();
    } else {
      setError("Token is required");
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [token]); // Depend on token to refetch when it changes

  return { user, setUser, isLoading, error }; // Do not expose setUser
}

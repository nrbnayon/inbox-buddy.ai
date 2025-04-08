import { getUserProfile } from "@/lib/api/user";
import { useEffect, useState } from "react";

export default function useGetUser(token) {
  const [user, setUser] = useState(null); // Initialize as null to distinguish from undefined
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    let mounted = true; // Flag to prevent state updates on unmounted components

    const fetchUser = async () => {
      setIsLoading(true); // Set loading to true before fetching
      setError(null); // Reset any previous errors

      try {
        const res = await getUserProfile(token);
        if (mounted) {
          setUser(res?.data); // Update user only if component is still mounted
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to fetch user profile"); // Set error if something goes wrong
        }
      } finally {
        if (mounted) {
          setIsLoading(false); // Set loading to false whether success or failure
        }
      }
    };

    fetchUser();

    // Cleanup function to avoid memory leaks
    return () => {
      mounted = false; // Mark as unmounted
    };
  }, []); // Empty dependency array means this runs only once on mount

  // Return user data, loading state, and error
  return { user, setUser, isLoading, error };
}

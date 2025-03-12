import { QueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [url, params] = queryKey as [string, Record<string, any>?];
        return apiRequest(url, params);
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

/**
 * A helper function to make API requests to the server.
 * This function handles the common logic for all API requests,
 * including error handling and response parsing.
 */
export async function apiRequest(url: string, data?: Record<string, any>) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method: data ? "POST" : "GET",
      headers,
      credentials: "include",
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Request failed with status ${response.status}`
      );
    }

    // For 204 No Content, return null
    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}
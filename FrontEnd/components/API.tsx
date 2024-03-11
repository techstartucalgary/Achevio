import axios, { AxiosRequestConfig, Method } from 'axios';
import { useSelector } from 'react-redux';


/**
 * A utility function for making API requests.
 *
 * @param url The URL of the API endpoint.
 * @param method The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param data Optional data to be sent with the request (for POST/PUT requests).
 * @param headers Optional HTTP headers to be sent with the request.
 * @returns A promise that resolves with the response data.
 */
export async function fetchAPI<T>(
  url: string,
  method: Method = 'GET',
  data?: object,
  headers?: object,
): Promise<T> {
  const config: AxiosRequestConfig = {
    url,
    method,
    data,
    headers,
  };

  try {
    const response = await axios(config);
    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'An unknown error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export const getAllUsersFromCommunity = async (communityId) => {
const { url } = useSelector((state: any) => state.user);

  try {
    const response = await axios.get(`${url}/community/${communityId}/getAllUsers`);
    return response.data; // Assuming the response has the data directly
  } catch (error) {
    console.error("Failed to fetch users from community:", error);
    return null;
  }
};

export const getMyCommunities = async () => {
  const { url } = useSelector((state: any) => state.user);

  try {
    const response = await axios.get(`${url}/user/myCommunities`);
    return response.data; // Assuming the response has the data directly
  } catch (error) {
    console.error("Failed to fetch my communities:", error);
    return null;
  }
};
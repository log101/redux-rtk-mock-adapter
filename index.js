import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Function to create a mock adapter
const createMockAdapter = (api) => {
  let handlers = {};

  // Function to add a handler for a specific endpoint and arguments
  const onEndpoint = (endpoint, args, response) => {
    const queryKey = api.util.serializeQueryArgs({
      endpoint,
      args,
      baseQueryArgs: {},
    });

    handlers[queryKey] = response;
  };

  // Function to apply the mock adapter to the API
  const apply = () => {
    const baseQuery = async (args, api, extraOptions) => {
      const queryKey = api.util.serializeQueryArgs(args);

      if (handlers[queryKey]) {
        return { data: handlers[queryKey] };
      }

      console.warn(`No handler found for ${args.endpoint}. Falling back to actual API call.`);
      return fetchBaseQuery(args, api, extraOptions);
    };

    return createApi({
      ...api,
      baseQuery,
    });
  };

  return { onEndpoint, apply };
};

export default createMockAdapter;

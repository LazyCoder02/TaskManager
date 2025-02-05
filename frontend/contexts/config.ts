// This is a config file that loads in the config file
const config = {
  hostUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    // Add this for debugging
    getApiUrl: () => {
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    }
  };

export default config
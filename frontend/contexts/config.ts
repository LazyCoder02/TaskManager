// This is a config file that loads in the config file
const config = {
  // get url from env
  hostUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
}

export default config
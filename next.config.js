/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig


/* 7/11/22 i added code below because .env.development variables were not working
 specifically const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;
 but then it started working and so i set all back per course 
module.exports = {nextConfig,
        env: {
        NEXT_PUBLIC_NETWORK_ID : 5777
	  },
}
*/
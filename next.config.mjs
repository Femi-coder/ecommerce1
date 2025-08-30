/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "assets.thenorthface.eu" },
      { protocol: "https", hostname: "img01.ztat.net" },
      { protocol: "https", hostname: "hatstore.imgix.net" },
      { protocol: "https", hostname: "i1.t4s.cz" },
      { protocol: "https", hostname: "encrypted-tbn2.gstatic.com" },
      { protocol: "https", hostname: "cdn.media.amplience.net" },
      { protocol: "https", hostname: "www.staycoldapparel.com" },
      { protocol: "https", hostname: "www.jiomart.com" },
      { protocol: "https", hostname: "hatroom.eu" },
    ],
  },
};

export default nextConfig;

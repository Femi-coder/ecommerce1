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
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "i8.amplience.net" },
      { protocol: "https", hostname: "www.rebelsport.com.au" },
      { protocol: "https", hostname: "lsco.scene7.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "www.closurelondon.com" },
      { protocol: "https", hostname: "store.acmilan.com" },
      { protocol: "https", hostname: "static.nike.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "assets.adidas.com" },
      { protocol: "https", hostname: "resources.mandmdirect.com" },
      { protocol: "https", hostname: "images.prodirectsport.com" },
    ],
  },
};

export default nextConfig;

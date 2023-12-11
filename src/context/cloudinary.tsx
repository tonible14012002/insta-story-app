import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { Cloudinary } from "@cloudinary/url-gen";

const CloudinaryContext = createContext<{
  cloudinary?: Cloudinary;
}>({});

export const useCloudinary = () => useContext(CloudinaryContext);

export const CloudinaryProvider = ({ children }: PropsWithChildren) => {
  const cloudinary = useMemo(() => {
    return new Cloudinary({ cloud: { cloudName: "dqw1ilzbd" } });
  }, []);

  return (
    <CloudinaryContext.Provider value={{ cloudinary }}>
      {children}
    </CloudinaryContext.Provider>
  );
};

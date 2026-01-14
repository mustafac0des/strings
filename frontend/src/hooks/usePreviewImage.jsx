import { useState } from "react";
import useCustomToast from "./useCustomToast";

const usePreviewImage = () => {
  const showToast = useCustomToast();
  const [imgUrl, setImgUrl] = useState(null);

  const handleImgChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Invalid file type!", "error");
      setImgUrl(null);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result;
    };

    img.onload = () => {
      const maxWidth = 1024;
      const quality = 0.6;

      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      setImgUrl(compressedDataUrl);
    };

    reader.readAsDataURL(file);
  };

  return { imgUrl, setImgUrl, handleImgChange };
};

export default usePreviewImage;

export default async function uploadImg(file, preset) {
  let fileData = new FormData();
  fileData.append("invalidate ", true);
  fileData.append("file", file);
  fileData.append("upload_preset", preset);
  console.log(fileData, file);

  let imgUrl;
  const requestOptions = {
    method: "POST",
    body: fileData,
    redirect: "follow",
  };
  return fetch(
    "https://api.cloudinary.com/v1_1/dpiyqfdpk/image/upload",
    requestOptions
  )
    .then((res) => res.json())
    .then((response) => {
      imgUrl = response.secure_url;
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
}

// "https://api.cloudinary.com/v1_1/fintechngr/image/upload";

// cloudinary://118759682255234:pruQ7s4FhCooA8E_iCrQ1z9c5_c@dpiyqfdpk

import { useState } from "react"

const App = () => {
  const [image, setImage] = useState(null)

  const uploadImage = async (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setImage(e.target.files[0])
  
    try{
      const options = {
        method: "POST",
        body: formData
      }

      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json()
      console.log(data)
    } catch(err){
      console.log(err)
    }
  }

  console.log(image)

  return (
    <div className="app">
      { image && <img src={URL.createObjectURL(image)} alt='meh'/> }
      <label htmlFor="files">Upload An Image </label>
      <input onChange={uploadImage} id = "files" type="file" accept="image/*" hidden/>
    </div>
  );
}

export default App;

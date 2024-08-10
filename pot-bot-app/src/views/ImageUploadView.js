import React, {useRef} from "react";


export default function ImageUploadView({loading, plantName, uploader, setSelectedImage}) {
  const inputRef = useRef(null)


  return (
    <div className="connect module" style={{textAlign: "center"}}>
      {loading ? <div style={{fontSize: '1.2rem'}}>Hang tight your picture is being uploaded</div> :
        <div className="upload" style={{textAlign: "center", alignItems: 'center'}}><p
          style={{fontSize: '1.2rem'}}>Chose your own picture to
          replace {plantName} picture<br/></p>
          <p>
            <input className='-upload' ref={inputRef} type="file" accept="image/*" id="select-image"
                   style={{display: "none"}} title="Upload picture" onChange={uploader}/>
            <button type="submit" onClick={(event => {
              inputRef.current.click()
            })}>Upload photo
            </button>

          </p>
        </div>}
    </div>
  )
}

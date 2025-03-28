import React, { useState } from "react"

export const ProfilePhotoSelector = ({image, setImage}) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if(file) {
            // update the image state
            setImage(file);

            // generate preview url from the file
        }
    }
    return (
        <div>
            Profile photo selector
        </div>
    )
}
import { Alert, Button, TextInput } from "flowbite-react";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootStateProps } from "../types/userTypes";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashProfile = () => {
    const { currentUser } = useAppSelector((state : RootStateProps) => state.user);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
    const [imageFileUploadProgress, setimageFileUploadProgress] = useState<null | number>(null);
    const [imageFileUploadError, setimageFileUploadError] = useState<string | null>(null);
    const filePickerRef = useRef<HTMLInputElement>(null);

    const handleImageChange =(e : ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files
        if(files && files.length >0){
            const file : File = files[0]
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file))
        }
    };

    useEffect(() => {
        if(imageFile){
            uploadImage();
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageFile]);

    const uploadImage : () => void = async () =>{
        // service firebase.storage {
        // match /b/{bucket}/o {
        //     match /{allPaths=**} {
        //     allow read;
        //     allow write: if
        //     request.resource.size < 2 * 1024 * 1024 &&
        //     request.resource.contentType.matches('image/.*')
        //     }
        // }
        // }
        if(imageFile != null) {
            setimageFileUploadError(null);
            const storage = getStorage(app);
            const fileName = new  Date().getTime() + imageFile.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setimageFileUploadProgress(Number(progress.toFixed(0)));
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                () => {
                    setimageFileUploadError('Could not upload image (File must to be less than 2MB');
                    setimageFileUploadProgress(null);
                    setImageFile(null);
                    setImageFileUrl(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL : string) => {
                        setImageFileUrl(downloadURL)
                    })
                }
            )
        }
    };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4">
            <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                onClick={() => filePickerRef.current?.click()}
            >
                {imageFileUploadProgress && (
                    <CircularProgressbar
                        value={imageFileUploadProgress || 0}
                        text={`${imageFileUploadProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            },
                            path: {
                                stroke: `rgba(62, 152, 199), ${imageFileUploadProgress / 100}`
                            }
                        }}
                    />
                )}
                <img src={imageFileUrl || currentUser?.profilePicture} alt="user"
                className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
                ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}/>
            </div>
            {imageFileUploadError && (
                <Alert color='failure'>
                    {imageFileUploadError}
                </Alert>
            )}
            <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser?.username}/>
            <TextInput type="text" id="email" placeholder="email" defaultValue={currentUser?.email}/>
            <TextInput type="password" id="password" placeholder="password"/>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                Update
            </Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span className="cursor-pointer">Delete Account</span>
            <span className="cursor-pointer">Sign Out</span>
        </div>
    </div>
  )
}

export default DashProfile
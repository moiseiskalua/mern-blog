import { Alert, Button, TextInput } from "flowbite-react";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootStateProps, UserProps } from "../types/userTypes";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

const DashProfile = () => {
    const { currentUser } = useAppSelector((state : RootStateProps) => state.user);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
    const [imageFileUploadProgress, setimageFileUploadProgress] = useState<null | number>(null);
    const [imageFileUploading, setImageFileUploading] = useState<boolean>(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(null);
    const [updateUserError, setUpdateUserError] = useState<string | null>(null);
    const [imageFileUploadError, setimageFileUploadError] = useState<string | null>(null);
    const [formData, setFormData] = useState<UserProps>({})
    const filePickerRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

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
            setImageFileUploading(true)
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
                    setImageFileUploading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL : string) => {
                        setImageFileUrl(downloadURL);
                        setFormData({...formData, profilePicture: downloadURL });
                        setImageFileUploading(false);
                    })
                }
            )
        }
    };

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdateUserError(null)
        setUpdateUserSuccess(null)

        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes made")
            return;
        }
        if(imageFileUploading){
            return;
        }

        try {
            dispatch(updateStart());

            const res = await fetch(`/api/user/update/${currentUser?._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if(!res.ok){
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message)
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated succesfully")
            }
        } catch (error) {
            dispatch(updateFailure((error as Error).message))
            setUpdateUserError((error as Error).message)
        }
    }


  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <TextInput onChange={handleChange} type="text" id="username" placeholder="username" defaultValue={currentUser?.username}/>
            <TextInput onChange={handleChange} type="text" id="email" placeholder="email" defaultValue={currentUser?.email}/>
            <TextInput onChange={handleChange} type="password" id="password" placeholder="password"/>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                Update
            </Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span className="cursor-pointer">Delete Account</span>
            <span className="cursor-pointer">Sign Out</span>
        </div>
        {updateUserSuccess && (
           <Alert color="success" className="mt-5">
            {updateUserSuccess}
           </Alert>
        )}
        {updateUserError && (
           <Alert color="failure" className="mt-5">
            {updateUserError}
           </Alert>
        )}
    </div>
  )
}

export default DashProfile
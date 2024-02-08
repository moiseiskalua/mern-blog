import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react";
import { HiAnnotation, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi"
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootStateProps } from "../types/userTypes";

const DashSideBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useAppSelector((state : RootStateProps) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
        const res = await fetch('/api/user/signout', {
            method: 'POST',
        });

        const data = await res.json();

        if(!res.ok) {
            console.log(data.message);
        } else {
            dispatch(signoutSuccess());
        }
    } catch (error) {
        console.log((error as Error).message);
    }
};

  return (
    <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-1">
                <Link to="/dashboard?tab=profile">  
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser?.isAdmin ? "Admin" : "User"} labelColor="dark" as="div">
                        Profile
                    </Sidebar.Item>
                </Link>
                {currentUser?.isAdmin && (
                    <>
                    <Link to="/dashboard?tab=posts">  
                        <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as="div">
                            Posts
                        </Sidebar.Item>
                    </Link>
                        <Link to="/dashboard?tab=users">  
                            <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as="div">
                                Users
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dashboard?tab=comments">  
                            <Sidebar.Item active={tab === 'users'} icon={HiAnnotation} as="div">
                                Comments
                            </Sidebar.Item>
                        </Link>
                    </>
                )}
                <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar
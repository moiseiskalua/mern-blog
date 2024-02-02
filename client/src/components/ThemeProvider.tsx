import { ReactNode } from "react";
import { useAppSelector } from "../hooks/useAppSelector";

type childrenProps = {
    children: ReactNode;
}

const ThemeProvider = ({children} : childrenProps) => {
    const {theme} = useAppSelector(state => state.theme)
  return (
    <div className={theme}>
        <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,43)] min-h-screen">

            {children}
        </div>
    </div>
  )
}

export default ThemeProvider;
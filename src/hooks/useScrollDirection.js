import { useEffect, useState } from "react";
export default function useScrollDirection(){
    const [scrollDirection, setScrollDirection] = useState("up");

    useEffect(() =>{
        let lastScrollY = window.scrollY;

        function handleScroll (){
            const currrentScrollY = window.scrollY;

            if(currrentScrollY > lastScrollY && currrentScrollY > 50){
                setScrollDirection("down")
            }else if(currrentScrollY < lastScrollY){
                setScrollDirection("up")
            }

            lastScrollY = currrentScrollY
        }

        window.addEventListener("scroll", handleScroll)
        
        return () => {
            window.addEventListener("scroll", handleScroll);
        }
    }, [])

    return scrollDirection
}
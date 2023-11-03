import { RefObject, useEffect } from "react";

export let usePhoneSizeChat = (
    ContainerRef: RefObject<HTMLDivElement>,
    isRightBar: boolean
) => {

    useEffect(() => {

        if (ContainerRef.current) {

            //! To avoid turning the Left component into a client component.
            let parent = ContainerRef.current.parentElement;

            if (ContainerRef.current.classList.contains("hide")) {
                parent?.classList.add("hide")
            } else {
                parent?.classList.remove("hide")
            }
        }

    }, [isRightBar])
}
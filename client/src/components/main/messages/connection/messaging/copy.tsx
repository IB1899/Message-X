"use client"
import React, { useEffect, useRef, useState } from 'react'
import { GoCopy } from 'react-icons/go'
import clipboardCopy from 'clipboard-copy';
import { BsClipboardCheck } from 'react-icons/bs';
import { AppDispatch, useAppSelector } from '@/toolkit/store';
import { AiFillBackward } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import {  setIsRightBar } from '@/toolkit/slices/PhoneSizeSlice';

export default function Copy({ username }: { username: string }) {

    let [isCopied, setIsCopied] = useState(false)
    let { isRightBar } = useAppSelector((state => state.PhoneSizeSlice))

    let h3 = useRef<HTMLHeadingElement>(null)
    useEffect(() => {
        if (h3.current) {

            //! To avoid turning the Left component into a client component.
            let parent = h3.current.parentElement;

            let grandParent = parent?.parentElement

            if (h3.current.classList.contains("hide")) {
                grandParent?.classList.add("hide")
            } else {
                grandParent?.classList.remove("hide")
            }
        }
    }, [isRightBar])


    const copyToClipboard = (textToCopy: string) => {
        clipboardCopy(textToCopy)
            .then(() => {
                console.log('Text copied to clipboard:', textToCopy);
                setIsCopied(true)

                setTimeout(() => { setIsCopied(false) }, 2000)
            })
            .catch((err) => {
                console.error('Failed to copy text to clipboard:', err);
                // Handle errors, e.g., by showing an error message to the user.
            });
    };

    let dispatch = useDispatch<AppDispatch>()


    return <>

        <i className='PhoneOnly CloseRightBar' onClick={ ()=> dispatch(setIsRightBar(false))  } > <AiFillBackward /> </i>

        <h3 className={isRightBar ? "h3" : "h3 hide"} ref={h3} onClick={() => copyToClipboard(username)} >
            <span>{username} </span> <i > {isCopied ? <BsClipboardCheck /> : <GoCopy />} </i>
        </h3>
    </>
}

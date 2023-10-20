"use client"
import React, { useState } from 'react'
import { GoCopy } from 'react-icons/go'
import clipboardCopy from 'clipboard-copy';
import { BsClipboardCheck } from 'react-icons/bs';

export default function Copy({ username }: { username: string }) {

    let [isCopied, setIsCopied] = useState(false)

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

    return <h3 className="h3" onClick={() => copyToClipboard(username)} > <span>{username} </span> <i > {isCopied ? <BsClipboardCheck /> : <GoCopy />} </i> </h3>
}

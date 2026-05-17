"use client";

import useCommandPalette from "../search/useCommandPalette";
import CommandPalette from "../search/CommandPalette";

export default function CommandPaletteProvider({ children }) {
    const { isOpen, close } = useCommandPalette();

    return (
        <>
            {children}
            <CommandPalette isOpen={isOpen} onClose={close} />
        </>
    );
}

import React from "react";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageToggle from "../ui/LanguageToggle";
import { SoundToggle } from "../actions/SoundToggle";

const Header = () => {
    return (
        <header className="flex font-display justify-between items-center border-b py-4 px-8 fixed w-full bg-paper z-50 ">
            <div className="font-bold">NoEffortGames</div>
            <div className="flex gap-2  i">
                <SoundToggle />
                <ThemeToggle />
                <LanguageToggle />
            </div>
        </header>
    );
};

export default Header;

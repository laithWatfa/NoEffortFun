import React from "react";
import { WavelengthDial } from "./WavelengthDial";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Hero = () => {
    const t = useTranslations("HomePage.Hero");
    const tCommon = useTranslations("Common.actions");
    return (
        <section className="px-8 pb-4 border-b border-body-text pt-22 min-h-screen flex flex-col lg:flex-row-reverse gap-4 justify-center lg:justify-between items-center">
            <WavelengthDial className="md:w-3/4 lg:w-1/2" />

            <div className="space-y-5">
                <h1 className="whitespace-pre-line font-display text-5xl md:text-5xl lg:text-6xl font-extrabold text-start tracking-tight">
                    {t.rich("title", {
                        room: (chunks) => (
                            <span
                                className="underline"
                                style={{
                                    textDecorationColor: "var(--coral)",
                                }}
                            >
                                {chunks}
                            </span>
                        ),
                    })}
                </h1>
                <p className="text-lg  lg:text-xl max-w-xl  text-start">
                    {t("description")}
                </p>
                <div className="space-x-4">
                    <Link
                        href={"/create"}
                        className="button hover:-translate-y-0.5 bg-coral"
                    >
                        {tCommon("createRoom")}
                    </Link>
                    <Link
                        href={"/join"}
                        className="button text-body-text! border-body-text border"
                    >
                        {tCommon("joinRoom")}
                    </Link>
                </div>
                <span className="font-light text-sm">{t("note")}</span>
            </div>
        </section>
    );
};

export default Hero;

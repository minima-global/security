import React from "react";

type BannerProps = {
    title: string;
    icon?: React.ReactNode;
    description: string;
}

const Banner: React.FC<BannerProps> = ({ icon, title, description }) => {
    return (
        <div className="w-full mx-auto flex justify-center mb-6">
            <div className="text-center flex flex-col items-center gap-2">
                <div>
                    {icon}
                </div>
                <h1 className="text-2xl mb-2">
                    {title}
                </h1>
                <p className="text-sm max-w-xs text-grey80 mb-2">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default Banner;

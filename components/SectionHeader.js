import Button from "@/components/Button";

export default function SectionHeader({title, buttonText, buttonLink}) {
    return (
        <div className={"flex justify-between mb-[42px] max-lg:flex-col max-lg:text-center max-lg:gap-5"}>
            <div>
                <h3 className={"font-freightBig text-[21px] font-semibold"}>{title}</h3>
            </div>
            <div>
                <Button
                    style={"primary"}
                    title={buttonText}
                    type={"link"}
                    onClick={buttonLink}
                />
            </div>
        </div>
    )
}
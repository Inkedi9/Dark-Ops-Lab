import MailBrandIcon from "./MailBrandIcon";

export default function DynamicBrandFavicon({ brand, label }) {
    return (
        <div className="relative">
            <MailBrandIcon brand={brand} label={label} />

            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-black bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
        </div>
    );
}
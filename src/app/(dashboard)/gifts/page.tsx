import { Gift, Plus } from "lucide-react";

const gifts = [
  ["Home Essentials Set", "$120"],
  ["Travel Fund", "$500"],
  ["Kitchen Appliances", "$350"],
  ["Honeymoon Fund", "$1,000"],
];

export default function GiftsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-[#c99a6b]">Registry</p>
          <h1 className="serif mt-1 text-4xl text-[#193c32]">Gift & Wishlist</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white"><Plus size={17} /> Add gift</button>
      </div>
      <div className="mt-7 rounded-3xl border border-[#ebe8e1] bg-white p-6">
        <div className="flex gap-1 rounded-2xl bg-[#f7f5ef] p-1">
          <button className="flex-1 rounded-xl bg-white py-2.5 text-sm font-medium text-[#193c32] shadow-sm">Wishlist</button>
          <button className="flex-1 py-2.5 text-sm text-[#777c78]">Cash Gifts</button>
        </div>
        <p className="mt-7 max-w-xl text-sm leading-6 text-[#777c78]">
          Your presence is the greatest gift, but if you&apos;d like to contribute, here are some things we&apos;d love.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {gifts.map(([name, price]) => (
            <div key={name} className="flex items-center gap-4 rounded-2xl bg-[#faf9f5] p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e2d5] text-[#193c32]"><Gift size={20} /></div>
              <div className="flex-1"><p className="text-sm font-semibold">{name}</p><p className="mt-1 text-sm text-[#777c78]">{price}</p></div>
              <button className="rounded-full border border-[#dedbd4] px-3 py-2 text-xs font-medium">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
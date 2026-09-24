import { CalendarDays, MapPin, Image as ImageIcon } from "lucide-react";

export default function EventPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-[#c99a6b]">My event</p>
        <h1 className="serif mt-1 text-4xl text-[#193c32]">Timi & Lola</h1>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-[#ebe8e1] bg-white">
        <div className="h-72 bg-[url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center" />
        <div className="p-7">
          <div className="flex flex-wrap gap-4 text-sm text-[#666b67]">
            <span className="flex items-center gap-2"><CalendarDays size={17} /> Saturday, November 22, 2026</span>
            <span className="flex items-center gap-2"><MapPin size={17} /> Lagos, Nigeria</span>
          </div>
          <h2 className="serif mt-7 text-3xl text-[#193c32]">Our story</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#777c78]">
            We are excited to celebrate this special day with our favorite people. Festiva will keep every detail of the celebration in one beautiful place.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Ceremony", "2:00 PM", "Lagos"],
              ["Reception", "5:00 PM", "The Garden"],
              ["Gallery", "Coming soon", "Photos"],
            ].map(([title, time, place], i) => (
              <div key={title} className="rounded-2xl bg-[#faf9f5] p-5">
                {i === 2 ? <ImageIcon size={19} className="text-[#193c32]" /> : <CalendarDays size={19} className="text-[#193c32]" />}
                <p className="mt-4 font-semibold text-[#202522]">{title}</p>
                <p className="mt-1 text-sm text-[#777c78]">{time} · {place}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
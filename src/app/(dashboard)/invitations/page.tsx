import { Plus, Send } from "lucide-react";

export default function InvitationsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#c99a6b]">Digital invitations</p>
          <h1 className="serif mt-1 text-4xl text-[#193c32]">Invitations</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white">
          <Plus size={17} /> New invitation
        </button>
      </div>
      <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[1,2,3].map((item) => (
          <div key={item} className="overflow-hidden rounded-3xl border border-[#ebe8e1] bg-white">
            <div className="h-52 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85')] bg-cover bg-center" />
            <div className="p-5">
              <p className="serif text-2xl text-[#193c32]">Timi & Lola</p>
              <p className="mt-1 text-sm text-[#777c78]">Classic Garden · Template {item}</p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#dedbd4] px-4 py-2.5 text-sm text-[#193c32]">
                <Send size={15} /> Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
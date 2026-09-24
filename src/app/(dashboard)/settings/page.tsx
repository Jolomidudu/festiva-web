export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-medium text-[#c99a6b]">Account</p>
      <h1 className="serif mt-1 text-4xl text-[#193c32]">Settings</h1>
      <div className="mt-7 rounded-3xl border border-[#ebe8e1] bg-white p-6">
        <h2 className="font-semibold text-[#193c32]">Profile</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-[#dedbd4] px-4 py-3 outline-none" value="Timi Adeyemi" readOnly />
          <input className="rounded-2xl border border-[#dedbd4] px-4 py-3 outline-none" value="timi@example.com" readOnly />
        </div>
        <button className="mt-5 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white">Save changes</button>
      </div>
    </div>
  );
}
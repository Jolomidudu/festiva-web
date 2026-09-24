export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  description?: string;
};

export type Guest = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: "ATTENDING" | "MAYBE" | "NOT_ATTENDING" | "PENDING";
  plusOne: boolean;
};
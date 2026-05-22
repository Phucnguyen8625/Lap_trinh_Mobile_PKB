import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BookingItem {
  code: string;
  service: string;
  device?: string;
  date: string;
  status: string;
  description?: string;
  createdAt: string;
}

interface BookingContextType {
  bookings: BookingItem[];
  addBooking: (booking: BookingItem) => void;
  getAllCodes: () => string[];
}

const BookingContext = createContext<BookingContextType>({
  bookings: [],
  addBooking: () => {},
  getAllCodes: () => [],
});

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  const addBooking = (booking: BookingItem) => {
    setBookings(prev => [booking, ...prev]);
  };

  const getAllCodes = () => bookings.map(b => b.code);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, getAllCodes }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);

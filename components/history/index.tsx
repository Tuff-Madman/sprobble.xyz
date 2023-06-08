"use client";

import HistoryItem from "@/components/history/item";
import { HistoryLoading } from "@/components/loading/history";
import { Play } from "@/types/Types";
import { LucideCalendarClock } from "lucide-react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { Pagination } from "./pagination";

interface HistoryProps {
  title?: string;
  isLoading: boolean;
  formattedPlays: any;
  paginationProps?: {
    nextPage: () => void;
    prevPage: () => void;
    page: number;
    pageCount: number;
    itemCount: number;
    totalPlays: number;
  };
  dateProps?: {
    setDate: SelectRangeEventHandler;
    date: DateRange | undefined;
  };
}

export function History({
  title,
  isLoading,
  formattedPlays,
  paginationProps,
  dateProps,
}: HistoryProps) {
  return (
    <section>
      {title && (
        <div>
          <h2 className="mb-6 text-xl font-black md:text-3xl">{title}</h2>
        </div>
      )}
      {isLoading ? (
        <HistoryLoading />
      ) : (
        <>
          {dateProps && (
            <DatePickerWithRange
              date={dateProps.date}
              setDate={dateProps.setDate}
            />
          )}
          <ul className="flex flex-col gap-10">
            {formattedPlays.map((play: any) => (
              <div key={play.date}>
                <h3 className="flex items-center pb-4 text-base font-bold text-slate-400">
                  <LucideCalendarClock size={16} className="mr-2" />
                  {new Date(play.date).toLocaleDateString("en-us", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <ul className="ml-1.5 flex flex-col gap-2 border-l pl-4">
                  {play.tracks.map((item: Play) => (
                    <li key={item.$id}>
                      <HistoryItem track={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ul>
          {paginationProps && (
            <Pagination
              next={() => paginationProps.nextPage()}
              previous={() => paginationProps.prevPage()}
              page={paginationProps.page}
              pageCount={paginationProps.pageCount}
              // @ts-ignore
              resultCount={paginationProps.totalPlays}
              itemCount={paginationProps.itemCount}
            />
          )}
        </>
      )}
    </section>
  );
}

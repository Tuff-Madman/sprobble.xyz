"use client";

import { Pagination } from "@/components/history/pagination";
import { Loader } from "@/components/loading/loader";
import { DataTable } from "@/components/ui/data-table";
import { Artist, Track } from "@/types/Types";
import { ColumnDef } from "@tanstack/react-table";
import { Models, Query } from "appwrite";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppwrite, useCollection } from "react-appwrite";

const databaseId = "645c032960cb9f95212b";
const collectionId = "track";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      return (
        <Link
          href={`/global/stats/artist/${props.row.original.id}`}
          className="flex flex-row items-center gap-2 hover:text-blue-600"
        >
          {props.row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "album",
    header: "Album",
    cell(props) {
      return (
        <Link
          href={`/global/stats/album/${props.row.original.album.$id}`}
          className="flex flex-row items-center gap-2 hover:text-blue-600"
        >
          {props.row.original.album.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "artists",
    header: "Artist",
    cell(props) {
      return props.row.original.artists.map((artist: Artist, index: number) => {
        return (
          <Link
            key={artist.$id}
            href={`/global/stats/artist/${artist.$id}`}
            className="flex flex-row items-center gap-2 hover:text-blue-600"
          >
            {artist.name}
            {index < props.row.original.artists.length - 1 && ", "}
          </Link>
        );
      });
    },
  },
  {
    accessorKey: "plays",
    header: "Number of Plays",
  },
];

export default function ArtistPage() {
  const itemCount = 10;
  const query = [Query.limit(itemCount)];

  const { databases } = useAppwrite();

  const [queries, setQueries] = useState<any>(query);
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const { data: plays, isLoading } = useCollection(
    databaseId,
    collectionId,
    queries,
    {
      queryFn: async (): Promise<any> => {
        const response = await databases.listDocuments<any>(
          databaseId,
          collectionId,
          queries
        );

        return response as Models.DocumentList<Models.Document>;
      },
      keepPreviousData: true,
    }
  );

  // @ts-ignore
  const data = plays?.documents.map((track: Track) => ({
    name: track.name,
    id: track.$id,
    url: track.href,
    artists: track.artist,
    album: track.album,
    plays: track.plays.length,
  }));

  const nextPage = () => {
    if (!plays) return;
    if (page == pageCount) return;
    setPage(page + 1);
    setQueries([
      ...query,
      // @ts-ignore
      Query.cursorAfter(plays.documents[plays.documents.length - 1].$id),
    ]);
  };

  const prevPage = () => {
    if (!plays) return;
    if (page == 1) return;
    setPage(page - 1);
    // @ts-ignore
    setQueries([...query, Query.cursorBefore(plays.documents[0].$id)]);
  };

  useEffect(() => {
    if (isLoading) return;
    // @ts-ignore
    setPageCount(Math.ceil(plays.total / itemCount));
  }, [plays]);

  return (
    <>
      <h2 className="text-xl font-black md:text-3xl">Tracks Stats</h2>
      {isLoading ? (
        <Loader className="grid h-48 w-full place-items-center" />
      ) : (
        <>
          <section className="pt-6">
            <DataTable columns={columns} data={data} />
            <Pagination
              next={() => nextPage()}
              previous={() => prevPage()}
              page={page}
              pageCount={pageCount}
              // @ts-ignore
              resultCount={plays?.total}
              itemCount={itemCount}
            />
          </section>
        </>
      )}
    </>
  );
}

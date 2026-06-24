"use client";

import Button from "@/app/components/Button";
import List from "./List";
import Create from "./Create";
import { useEffect, useState } from "react";
import { BandList } from "../types/common";
import { fetchBandsAction } from "../actions/fetchBandsAction";

export default function Manage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [data, setData] = useState<BandList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchBands = async (page: number = 1) => {
    try {
      setData(null);
      setLoading(true);
      const bandList: BandList = await fetchBandsAction(page);
      setData(bandList);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBands(currentPage);
  }, [currentPage]);

  return (
    <section className="overflow-x-auto p-4">
      <header className="flex justify-end mb-4">
        <Button onClick={() => setIsOpen(true)}>Adicionar</Button>
      </header>
      <List
        data={data}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onSuccess={() => fetchBands()}
      ></List>
      {isOpen && (
        <Create
          setIsOpen={setIsOpen}
          onSuccess={() => fetchBands()}
          setCurrentPage={setCurrentPage}
        ></Create>
      )}
    </section>
  );
}

"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Report } from "@/types/report";
import { Button } from "@/components/ui/button";
import {
  FaArrowDown,
  FaArrowUp,
  FaCalendar,
  FaTag,
  FaTimes,
} from "react-icons/fa";
import {
  isImagePath,
  resolveTransactionImageUrl,
} from "../utils/transactionImage";

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Report | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function TransactionDetailModal({
  open,
  onOpenChange,
  transaction,
}: TransactionDetailModalProps) {
  const imageUrl =
    transaction?.bukti_transaksi && isImagePath(transaction.bukti_transaksi)
      ? resolveTransactionImageUrl(transaction.bukti_transaksi)
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
          <DialogDescription>
            Informasi lengkap transaksi keuangan masjid.
          </DialogDescription>
        </DialogHeader>

        {transaction && (
          <div className="space-y-6">
            {imageUrl && (
              <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  fill
                  src={imageUrl}
                  alt={`Bukti transaksi ${transaction.kategori}`}
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaCalendar className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date(transaction.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaTag className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Kategori</p>
                  <p className="text-base font-semibold text-gray-900">
                    {transaction.kategori}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {transaction.type === "income" ? (
                  <FaArrowUp className="h-5 w-5 text-green-600 mt-1" />
                ) : (
                  <FaArrowDown className="h-5 w-5 text-red-600 mt-1" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Tipe</p>
                  <p
                    className={`text-base font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income"
                      ? "Pemasukan"
                      : "Pengeluaran"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    transaction.type === "income"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <FaArrowUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <FaArrowDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jumlah</p>
                  <p
                    className={`text-base font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.jumlah)}
                  </p>
                </div>
              </div>
            </div>

            {transaction.keterangan && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Keterangan
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {transaction.keterangan}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <FaTimes className="mr-2 h-4 w-4" />
                Tutup
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

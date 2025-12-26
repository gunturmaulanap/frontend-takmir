export interface Report {
  id: number;
  type: 'income' | 'expense';
  kategori: string;
  jumlah: number;
  tanggal: string;
  keterangan: string | null;
  bukti_transaksi: string | null;
  profile_masjid_id: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_income: number;
  total_expense: number;
  saldo: number;
  total_transactions: number;
  current_month_income: number;
  current_month_expense: number;
}

export interface ChartData {
  month: string;
  income: number;
  expense: number;
}

export interface MonthlySummary {
  month: string;
  year: number;
  total_income: number;
  total_expense: number;
  saldo: number;
  transaction_count: number;
}

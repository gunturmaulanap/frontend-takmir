# Dokumentasi Perubahan EventItemCard Component

## =Ý Penjelasan Perbedaan

### **Sebelum Perubahan (Error)**
```typescript
export function EventItemCard() {
  const { data: events = [], isLoading, isError } = useEvents();

  // L ERROR: Menggunakan variabel 'event' yang tidak didefinisikan
  return (
    <div>
      {event.nama}  // L Error: 'event' tidak ada
    </div>
  );
}
```

**Masalah:**
- Component fetching array `events` tapi menggunakan variabel `event` (singular) yang tidak ada
- Tidak ada looping atau props untuk mendapatkan individual event
- Menyebabkan TypeScript error: `'event' is deprecated`

### **Setelah Perubahan (Fixed)**
```typescript
//  Component menerima event sebagai props
interface EventItemCardProps {
  event: Event;
}

export function EventItemCard({ event }: EventItemCardProps) {
  //  Event diterima sebagai parameter props
  return (
    <div>
      {event.nama}  //  Valid: event dari props
    </div>
  );
}
```

**Solusi:**
- Component menerima `event` sebagai props parameter
- Tidak perlu fetching data sendiri
- Menjadi reusable card component

## = Dua Pendekatan Component

### **Pendekatan 1: Page Component (seperti TakmirListPage)**
```typescript
export function TakmirListPage() {
  const { data: takmirs = [] } = useTakmirs(); // Fetch data sendiri

  return (
    <div>
      {takmirs.map((takmir) => (  //  Looping array
        <div key={takmir.id}>
          {takmir.nama}  //  Individual item dari loop
        </div>
      ))}
    </div>
  );
}
```

**Karakteristik:**
-  Fetch data sendiri dengan hook
-  Mendapat array data
-  Melakukan looping internally
-  Page-level component

### **Pendekatan 2: Reusable Card Component (EventItemCard sekarang)**
```typescript
interface EventItemCardProps {
  event: Event;
}

export function EventItemCard({ event }: EventItemCardProps) {
  //  Menerima individual event sebagai props

  return (
    <div>
      {event.nama}  //  Menggunakan props langsung
    </div>
  );
}
```

**Karakteristik:**
-  Menerima props dari parent
-  Menampilkan 1 item saja
-  Reusable component
-  Card-level component

## =Ë Implementasi Lengkap EventItemCard (Sekarang)

### **1. Interface Props**
```typescript
interface EventItemCardProps {
  event: Event; // Data event yang akan ditampilkan
}
```

### **2. Component Definition**
```typescript
export function EventItemCard({ event }: EventItemCardProps) {
  //  Event diterima dari props, tidak perlu fetch data
```

### **3. State Management**
```typescript
const [isDeleting, setIsDeleting] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
```

### **4. Debug & Validation**
```typescript
const eventSlug = event.slug;

console.log("= EventCard DEBUG:", {
  eventId: event.id,
  eventName: event.nama,
  eventSlug: eventSlug,
  slugExists: !!eventSlug,
  editUrl: `/events/edit/${eventSlug}`,
});

// Warning jika slug tidak ada
if (!eventSlug) {
  console.error("L MISSING SLUG in EventCard:", {
    eventId: event.id,
    eventName: event.nama,
  });
}
```

### **5. Delete Handler**
```typescript
const handleDelete = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDeleteDialogOpen(true);
};

const confirmDelete = async () => {
  setIsDeleting(true);
  try {
    await deleteEventMutation.mutateAsync(event.id.toString());
    toast.success("Event berhasil dihapus!");
    setDeleteDialogOpen(false);
  } catch (error) {
    toast.error("Gagal menghapus event.");
  } finally {
    setIsDeleting(false);
  }
};
```

### **6. Render Card**
```typescript
return (
  <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden group">

    {/* Action Buttons */}
    <div className="absolute top-3 right-3 z-10 flex gap-2">
      {canEdit(RESOURCES.EVENTS) && (
        <Link href={`/events/edit/${eventSlug}`}>
          <FaEdit />
        </Link>
      )}
      {canDelete(RESOURCES.EVENTS) && (
        <button onClick={handleDelete} disabled={isDeleting}>
          <FaTrash />
        </button>
      )}
    </div>

    {/* Card Content */}
    <Link href={`/events/detail/${eventSlug}`}>
      {/* Image */}
      {event.image ? (
        <Image src={event.image} alt={event.nama} />
      ) : (
        <div className="placeholder-image">
          <FaImage />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3>{event.nama}</h3>

        {/* Category Badge */}
        {event.category && (
          <span>{event.category.nama}</span>
        )}

        {/* Description */}
        <p>{event.deskripsi}</p>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center">
            <FaCalendarAlt />
            <span>{formatDate(event.tanggal_event)}</span>
          </div>
          <div className="flex items-center">
            <FaClock />
            <span>{event.waktu_event} WIB</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt />
            <span>{event.tempat_event}</span>
          </div>
        </div>
      </div>
    </Link>

    {/* WhatsApp Share Button */}
    <a
      href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
      target="_blank"
      className="whatsapp-share-btn"
    >
      Bagikan Event ke WhatsApp
    </a>

    {/* Delete Confirmation Dialog */}
    <DeleteConfirmDialog
      open={deleteDialogOpen}
      onOpenChange={setDeleteDialogOpen}
      onConfirm={confirmDelete}
      title="Hapus Event?"
      description={`Event "${event.nama}" akan dihapus secara permanen.`}
      isLoading={isDeleting}
    />
  </div>
);
```

## <¯ Cara Penggunaan

### **Di Parent Component (EventsPage):**
```typescript
import { EventItemCard } from './components/EventItemCard';
import { useEvents } from '@/hooks/useEvents';

export default function EventsPage() {
  const { data: events = [], isLoading } = useEvents();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventItemCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

##  Keuntungan Approach Ini

1. **Clean Architecture** - Component terpisah dengan tanggung jawab jelas
2. **Reusable** - Card bisa digunakan di tempat lain
3. **Maintainable** - Logic card terpusat di satu tempat
4. **Testable** - Mudah di-testing karena isolated
5. **Performance** - Tidak fetch data berulang kali
6. **Type Safety** - Props interface memastikan data yang benar

## = Kesimpulan

Perubahan dari **Page Component** menjadi **Reusable Card Component** membuat arsitektur lebih baik dengan:

-  Error-free TypeScript
-  Component composition yang clean
-  Separation of concerns
-  Better maintainability
-  Reusable di berbagai tempat
import Header from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="admin-wrapper min-h-screen bg-gray-50">
      <Header/>
      {/* Main Content */}
      {children}
    </div>
  );
}
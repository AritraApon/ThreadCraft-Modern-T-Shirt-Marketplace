
import ManageProductsTable from "@/Components/Dashboard/Manage-Product/ManageProductsTable";

export default function ManageProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">Manage System Products</h1>
        <p className="text-xs text-gray-400 mt-0.5">Edit, inspect parameters, or wipe inventory files securely</p>
      </div>

      {/* Table Layer Component */}
      <ManageProductsTable />
    </div>
  );
}
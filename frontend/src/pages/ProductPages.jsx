import { useEffect, useState } from "react";
import { getProduct } from "../services/productService";
import ProductForm from "../component/ProductForm";
import { useGetProducts } from "../hooks/use-get-products";
import { useDeleteProduct } from "../hooks/use-delete-product";
import ProductEditForm from "../component/ProductEditForm";

export default function ProductPage() {
  const { data, isLoading } = useGetProducts()
  const { mutate, isPending } = useDeleteProduct()
  const [updateData, setUpdateData] = useState(null)
  return (
    <div>
      <div>
        <h1>List Produk</h1>
        {(!isLoading && data != undefined) && data.map((p) => (
          <div key={p.id} className="border flex justify-between p-2">
            <div>
              <p className="text-left">
                {p.id}. {p.name} {p.owner && <span className="text-sm text-gray-500">({p.owner.nama})</span>}
              </p>
              <p className="text-left">{p.description}</p>
              <div className="flex gap-3 justify-center">
                <span>Stok tersedia : {p.stock}</span>
                <span>Harga: {p.price}</span>
              </div>
            </div>
            <div className="flex gap-5">
              {(!updateData || updateData?.id !== p.id) && <button onClick={() => setUpdateData(p)}>Edit</button>}
              {updateData?.id === p.id && <button onClick={() => setUpdateData(null)}>Cancel</button>}
              <button enabled={!isPending} onClick={() => mutate(p.id)}>{isPending ? "Loading..." : "Delete"}</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h1>Add new</h1>
        <ProductForm />

        {updateData && <>
          <h1>Edit Product</h1>
          <ProductEditForm data={updateData} onFinish={() => { console.log("berhasil mengupdate update"); setUpdateData(null) }} />
        </>}
      </div>
    </div>
  );
}

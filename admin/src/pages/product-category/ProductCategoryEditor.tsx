import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Api } from "../../services/ApiService";
import { LuLoader, LuPencil, LuPlus } from "react-icons/lu";

export default function ProductCategoryEditor() {
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState<any>({});
  const { record_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!record_id);

  async function detail() {
    setLoading(true);
    var r: any = await Api("product-category/detail", {
      record_id,
    });
    console.log(r);
    if (r.status == 200) {
      setForm(r.data);
      setLoading(false);
      return;
    }

    alert("Record not found");
    navigate("/product-category");
  }

  async function save() {
    if (!form.name) {
      setError({ name: "please enter category name" });
    } else {
      try {
        let response: any;
        if (!record_id) {
          response = await Api("product-category/create", form);
        } else {
          response = await Api("product-category/update", form);
        }

        if (response.status == 200) {
          alert("Record saved successfully !!");
          navigate("/product-category");
        }
      } catch (error) {
        alert("Unable to save record");
      }
    }
  }
  useEffect(() => {
    setError({});
  }, [form]);

  useEffect(()=>{
    if(!!record_id){
      detail();
    }
  },[record_id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-purple-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full  relative max-w-lg bg-white p-8 rounded-xl shadow-lg overflow-hidden">
        {loading && (
          <div className="absolute top-0 w-full h-full left-0 flex items-center justify-center bg-white">
            <LuLoader className="animate-spin" />
          </div>
        )}
        <h2 className="text-2xl font-bold text-purple-700 mb-6 border-b pb-2 flex items-center gap-2">
          {!!record_id ? <LuPencil /> : <LuPlus />}
          {!!record_id ? "Update Category" : "Create Category"}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              error.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="e.g. Electronics"
          />
          {error.name && (
            <p className="text-red-500 text-sm mt-1">{error.name}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={save}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

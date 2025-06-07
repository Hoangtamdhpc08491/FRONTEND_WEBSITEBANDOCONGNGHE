import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryMain from '../../CaterogyProduct'; // Đảm bảo đường dẫn này chính xác
import { toast } from 'react-toastify';
import { categoryService } from '../../../../services/admin/categoryService'; // Đảm bảo đường dẫn này chính xác
import Loader from "../../../../components/Admin/LoaderVip"; // Đảm bảo đường dẫn này chính xác
import Toastify from '../../../../components/common/Toastify'; // THÊM IMPORT NÀY - Đảm bảo đường dẫn chính xác

const CategoryAddd = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        // Chỉ append nếu value không phải là null hoặc undefined
        // Trường hợp orderIndex là 0 vẫn sẽ được gửi đi
        if (value !== null && value !== undefined) {
          form.append(key, value);
        }
      });

      await categoryService.create(form);

      toast.success("Thêm danh mục thành công");
      navigate("/admin/categories/list");
    } catch (error) {
      const res = error.response;
      if (res?.status === 400 && res.data?.field && res.data?.message) {
        setErrors((prev) => ({ ...prev, [res.data.field]: res.data.message }));
        // Hiển thị toast lỗi cụ thể từ server nếu có
        toast.error(res.data.message || "Dữ liệu không hợp lệ.");
      } else if (res?.status === 409 && res.data?.message) { // Ví dụ xử lý lỗi trùng lặp
        toast.error(res.data.message);
        if (res.data.field) {
            setErrors((prev) => ({ ...prev, [res.data.field]: res.data.message }));
        }
      }
      else {
        toast.error(error.response?.data?.message || error.message || "Lỗi khi thêm danh mục");
        console.error("Lỗi chi tiết:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullscreen />;

  return (
    <>

      <CategoryMain onSubmit={handleSubmit} externalErrors={errors} />
    </>
  );
};

export default CategoryAddd;

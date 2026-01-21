import { MapPin, AlertCircle } from "lucide-react";
import { FormEditData, FormErrors } from "../../lib/types";

type Props = {
  formData: FormEditData;
  errors: FormErrors;
  handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
};

function DormEditFormAddress({ formData, errors, handleChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
        <MapPin className="text-gray-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">ที่อยู่</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            เลขที่ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dorm_number"
            value={formData?.dorm_number}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dorm_number ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="123"
          />
          {errors.addressNumber && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.addressNumber}
            </p>
          )}
        </div>

        <div>
          {errors.street && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.street}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ตำบล/แขวง <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sub_district"
            value={formData?.sub_district}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.sub_district ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="หัวหมาก"
          />
          {errors.sub_district && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.sub_district}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            อำเภอ/เขต <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="district"
            value={formData?.district}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.district ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="บางกะปิ"
          />
          {errors.district && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.district}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            เมือง <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData?.city}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="กรุงเทพมหานคร"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            จังหวัด <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="province"
            value={formData?.province}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.province ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="กรุงเทพมหานคร"
          />
          {errors.province && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.province}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รหัสไปรษณีย์ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData?.postal_code}
            onChange={handleChange}
            maxLength={5}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.postal_code ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="10240"
          />
          {errors.postal_code && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.postal_code}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DormEditFormAddress;
